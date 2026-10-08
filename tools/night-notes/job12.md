# Job 12: Tennis court at the beach, with Coach Sunny

Only `index.html` changed (main game script). The web part and everything above `'use strict';` are untouched (same 546 lines; the HUD box and its few style rules are made by the game script).
One new optional save field: `tennis` = {best, d, xp, c} (best rally, day + Sports XP from tennis that day, day the "new best" coins were last given). It only appears after you tap "Let's rally!" once (just talking to the coach does not make it). Nothing new is sent online.

## Changes
- The beach: ended a few steps north of the kiosk -> it now goes on to the north (about 22 m more sand) with a tennis court there. The sea up there is still not walkable; new dunes on the west and north edge and 4 more palm trees.
- Tennis court: did not exist -> a blue court with a mint-green surround, proper white lines (base lines, side lines, service boxes, center line), a net with two posts and a white top band, a wire fence all around with posts and a top rail, an open gate with a yellow frame and a "🎾 Tennis" sign (facing the beach), two benches, a basket full of tennis balls and two lamp posts. From the player's end you look across the court at the coach with the sea behind her.
- Finding the court: nothing pointed to it -> a blue "🎾 Tennis ➡️" signpost at the end of the boardwalk where you arrive, and the beach welcome message now says "🏖️ Welcome to the beach! 🌊 Tennis 🎾 is past the kiosk!".
- Coach Sunny: new character -> stands just inside the gate (yellow cap, white top with yellow sleeves, blue shorts, pink racket, name tag "Coach Sunny"); she turns to look at you and waves when you talk to her.
- Talk to Coach Sunny -> a card: "Hi! I'm Coach Sunny! ☀️ Do you want to play tennis with me? …" with "🎾 Let's rally!" and "Maybe later". The first time it says how to play ("When the ball comes close, tap 🎾!" / on a computer "press E or click"); later it shows "🏆 Your best rally".
- Let's rally -> short fade, you stand on your base line facing the coach, she runs to her end, waits a moment, bounces the ball once and hits it over the net in a soft arc. It bounces a few steps in front of you; tap the 🎾 button (or anywhere on the right side of the screen, or E / Enter / a mouse click) when it is close to swing. A hit sends it back; the coach runs to it and hits it back again. Each return counts.
- Gentle help for little kids: the coach aims at you; if you stand still you slide sideways to the ball and your view turns to follow it; a tap a little early still counts (the swing waits for the ball); the 🎾 button lights up yellow-green when the ball is in reach ("Hit it now!"). Balls slowly get a bit faster and wider as the rally grows.
- Feel: the ball has a white seam, spins, has a soft shadow, squashes a little on each bounce with a "tok" sound; your racket and arm show at the bottom of the screen and swing across; hit sound, swish sound; the coach swings her arm. The rally number pops up big over the ball; the coach cheers ("👏 Nice!", "⭐ Great shot!") and every 5 there is a "🎉 5!" with a happy sound.
- A miss -> a kind message ("Ooh, so close! 🎾", "Almost! You can do it! 💪", or "A rally of 6! Great job! Let's go again! 💪"), a soft "aww" sound, the count goes back to 0 and the coach serves a new ball.
- Box under the coins/time: "🎾 3 · 🏆 7" (this rally, best rally) and a "✋ Stop" button.
- Ending: "✋ Stop" -> "Thanks for playing! Your best rally: 7 🏆"; walking off the court (out of the gate, or more than a step past the side lines; stepping back to the back fence does NOT end it) -> "You walked off the court. Come back and play again soon! 👋"; leaving the beach or going to a friend -> ends quietly. The coach then walks back to her spot by the gate (around the net).
- The game pauses while the bag, phone or any card is open.
- Rewards: +1 Sports XP for every return, +3 more every 5 in a row, at most 40 tennis XP per game day; a new best rally (3 or more) -> "🏆 New best rally: 8! +5 🪙" (coins at most once per game day; the best rally is always saved).

## Decisions
- Messages during a rally are short (about 2 seconds), and the first ball comes a little later (2.2 s instead of 1.6 s), so no message covers the ball when it arrives (review fix).
- On a phone held upright the resting racket sits lower and further right, so the ball coming at you stays clear; the swing itself is the same.
- The court is part of the beach (no new place to load), at the north end, next to the sea, as job 11 asked. It opens together with the beach (level 10 in any skill).
- Kid-sized court (18 m long, about 3/4 of a real one) and soft "floaty" balls (lower gravity), so 5-year-olds can follow the ball.
- The coach never misses: the rally only ends when you miss, so long rallies are possible.
- Small fixed rewards with a daily XP limit and once-a-day coins, so it can't be farmed but always feels rewarding.
- Tennis is just for you (not shared online): a friend at the beach sees you walk on the court but not the ball. No new online fields.
- Tennis is not used in daily quests (old saves must keep getting the same quests).

## Morning questions
- Should two friends be able to play tennis with each other (a shared ball online)? That would be a bigger job.
- Is the speed right? It starts slow (about 2 seconds per ball) and gets a little faster up to rally 16.
- Should the coach sometimes miss on purpose at high rallies, so kids "win" points?
- Should tennis add a daily quest ("Rally 5 times with Coach Sunny")? (Kept out now so old saves keep the same quests.)

## Not verified
- Real iPad/iPhone feel: timing of the tap, how fast the ball feels, the sounds (made with simple tones: bounce, hit, swish, aww).
- The court at night in this test setup (the test copy keeps the day running; the lamps use the same glowing lamps as the boardwalk).
- Real Firebase / two real devices (nothing new is sent online).
- Weight on a real iPad: the beach grew from 85 to 112 pieces and from about 44,800 to 57,900 triangles (the court is baked; the town is unchanged).

## Glitches not fixed
- On a phone held upright the resting racket still covers a bit of the lower right of the view (moved lower/right in the review fix; the ball now stays clear of it in the tests).
- The "🎾" emoji on the sign shows as the device's emoji font (on the test computer it looks like a racket with a ball).
- Pets that follow you can wander onto the court while you play (they don't stop the ball).

## Try it for real
- Arrive at the beach: do you see the "🎾 Tennis ➡️" sign and the welcome message about tennis?
- First ball of a game: is the "Here comes the ball!" message gone before the ball reaches you?
- During a rally, walk backwards to the back fence: the game should go on.
- At the beach, walk north past the kiosk: find the court and the "🎾 Tennis" gate. Talk to Coach Sunny and tap "🎾 Let's rally!".
- Tap 🎾 when the ball has bounced in front of you. Can you get a rally of 5 ("🎉 5!") and a new best (+5 🪙)?
- Stand still while the ball comes: do you slide to the ball nicely? Try moving with the joystick too.
- Miss on purpose: is the message kind, and does the coach serve again?
- Tap "✋ Stop", and another time just walk out of the gate: the game ends and the coach walks back.
- Play in the evening: is the court still nice to look at?

## Tests run
Review fix (final file md5 22d10440f5256714f9459f14e538935a), scripts in agent-tests/job12-fix1/: jscheck ok, no ZZTEST, the 546 lines above the game script unchanged.
- f1.py (review findings) on iPhone portrait light + dark and iPad landscape light: 12/12 PASS each (welcome text mentions tennis; talking to the coach does not create the save field; first ball reaches you with no message over it (0 covered frames, ball on screen projected each frame in real time); holding back 1.5 s reaches the back fence (u=-12.1) and the game goes on; walking out of the gate still ends it; real taps give a rally of 3; the 🎾 button lights up when in reach; Stop works; 0 console errors). Screenshots: signpost from the boardwalk, first ball (racket clear of the ball on iPhone).
- t1_feature (copied from job12) on iPhone portrait dark: 17/17 PASS. t2_compat: 9/9 PASS (old + rich saves 0 differences vs before-job and pre-night; town weight within limits; beach now 112 pieces).
Earlier runs (before the review fix):
Final file md5 717e9c53e4e0293fc4fc85692141331f. Scripts and outputs: agent-tests/job12/ (t1_feature.py, t2_compat.py, shots/). Syntax check (jscheck): ok. No ZZTEST in the file. Lines above the game script unchanged (checked by the edit script).
- t1_feature, iPad landscape light + rich save (run just before the last tiny change: the resting racket moved a bit lower and to the right): 17/17 PASS (coach target and card with real taps; rally starts on the base line with the HUD; 4 returns with real taps on the 🎾 button; Sports XP up and +5 coins for the first new best; a miss gives the kind message and resets the count; the coach serves again; play on; the ball waits while the bag is open; real tap on Stop ends it; the coach walks back to the gate; walking off the court ends it; leaving the beach ends it quietly; can't walk into the sea up north; the west fence blocks; best rally saved; 0 console errors).
- t1_feature again on iPhone portrait dark: 17/17 PASS.
- t2_compat: 9/9 PASS (old + rich saves load with 0 differences in the game before this job and in the pre-night game, same save key; town scenery weight not grown (34 pieces, ~102,400 triangles both); old save on iPhone: no tennis field, 0 errors, no layout issues; a new player's opening on iPhone portrait dark finishes; rich save on iPhone landscape: rally HUD, Stop button tappable, layout audit clean, 0 errors).
- Screenshots looked at: court from the beach, the gate, coach card (iPhone dark), rally start, ball coming, swing (iPad), rally on iPhone portrait and iPhone landscape.
