# Job 3: Football

Only `index.html` changed, all inside the game script (`'use strict';` is still on line 547, nothing above it touched). No save changes, the web part is untouched, the multiplayer message for the ball (`bl`, score `sc`) is exactly the same as before.

## Changes
- Ball look: a white ball with 6 little dark bumps sticking out (spiky, 14-sided) -> a smooth round ball (32 sides) painted like a real football: 12 dark pentagons, white hexagons, thin dark seams, with the game's ink outline and a little shadow. The pattern is painted once when the game loads (about 15–30 ms).
- Ball rolling: it used to spin in a slightly wrong way when it changed direction (you could not see it on the old ball) -> it now really rolls the way it moves (you can see the pentagons roll).
- New: kick button. When the ball is in front of you and close (up to 2 m), the round use button shows ⚽ with "Tap: pass · Hold: shoot!" (on PC "E: pass · Hold E: shoot!").
  - Quick tap (up to 0.3 s, or quick E / mouse click on the button) -> soft pass: the ball rolls about 5 m.
  - Hold -> after the tap time the power grows for about 0.8 s more (full power after about 1.1 s; the button fills up with orange like a clock, the label says "Let go to shoot! 💥"); let go -> the kick gets smoothly stronger the longer you hold, from the soft-pass speed (5 m/s) up to 16 m/s at full power (a full shot from the middle reaches the goal). A little "👟" floats up for a pass, "💥" for a shot ("💥 Wow!" at full power), plus a thump-and-whoosh sound for strong shots.
  - The ball goes where you look.
- New: aim arrow. A cream arrow lies on the grass in front of the ball showing where it will go. While you hold, it grows from 1 m to about 4 m and turns from yellow to orange-red (= how strong).
- New: glow. When you can kick, the ball glows softly and a cream ring pulses on the grass around it. No glow when you can't kick (too far, ball behind you, ball just scored).
- New: the view dips a little toward the ball while it is your kick target (only the view; your own looking direction is not changed). Before: when you look straight ahead the ball was below the screen at about 1.6 m, so you did not see the glow. Now the ball, glow, ring and arrow stay on screen from 2 m down to about 1 m (on an upright phone the ball sits higher, above the buttons). When you look somewhere else the view comes back up smoothly. If you drag to look around yourself, the dip simply becomes your own look and the helper waits 1.5 s (it never pulls against your finger).
- While you hold, the label above the ⚽ button keeps its width, so the button no longer slides 15 px sideways under your thumb.
- If the ball rolls away while you hold (more than 3.5 m), a short message says "The ball rolled away! Run after it 🏃" (before: the shot was lost silently). Letting go after that does nothing else (before: it could have tapped whatever the button showed next, for example "Say hi").
- Behind the scenes: the glow/arrow update no longer makes new little objects every frame, and the button's orange fill is only redrawn when it changes.
- Kick area when you run into the ball (dribbling): 0.65 m -> 0.85 m (+31%), so it is easier to hit the ball while running. Dribbling works as before otherwise (same strength).
- New: gentle auto-aim. When a goal is roughly in front of the kick (within 45°), the kick bends a little toward the goal mouth: 20° off becomes about 12° off, 30° off about 23°, 45° or more: no help. Only at the moment of the kick (also for dribble touches), the ball never steers itself afterwards.
- While you hold the kick button, walking into the ball does not push it away (so your shot is not wasted).
- Use button behaviour for everything else (doors, shops, pets, "Start a new match", E key, click) is unchanged.

## Decisions
- "Kick area +25–35%": the only kick area today is running into the ball (0.65 m). That became 0.85 m. The new kick button needs its own reach; I chose 2 m, because the game is first-person: at 1.6 m the ball is already below the screen when you look straight ahead. At 2 m you still see the ball and the arrow at the bottom of the screen.
- The kick direction is where you look (not "from you through the ball"), because that matches the arrow and is easiest to aim for kids.
- Tap = released within 0.3 s (children often press that long). Full power after about 1.1 s of holding. A hold just past 0.3 s gives a kick just a little stronger than a pass (no jump in strength).
- The look-down helper is only for the ball (only while ⚽ shows) and only if you are not already looking up at the sky; it tilts at most about 30° (35° on an upright phone).
- Ball pattern size stays 512×256: a 4× smaller one was tried (half the load time, about 6 ms here) but the ball looked blurrier up close, which is now the normal view.
- The ball is preferred over other things near you (for example your pet) while it glows, so the button reliably kicks.
- Tapping the ball itself in the 3D view does not kick (only the ⚽ button, E key, or clicking the button). A tap on the screen is also used for looking around, and a tap could reach balls 4 m away.
- The little float ("👟"/"💥") on every kick is also what the night check sees as "the button did something".
- The ⚽ button ignores browser gestures while held (so a slightly moving finger does not cancel the shot). If the phone does cancel the touch anyway, the kick still happens.

## Morning questions
- Strength: soft pass rolls about 5 m, a full shot about 16 m (the field is 28 m long). Too strong or too weak for the kids?
- Should tapping the ball itself (in the 3D view) also pass it? Not done for now (see Decisions).
- The view dips a little toward the ball when you can kick. Does it feel nice, or should it dip less / not at all?
- Old-version players still only have the old 0.65 m dribble and no kick button or auto-aim; they see the new ball as their old ball. Everything stays in sync (tested).

## Not verified
- How the look-down helper feels on a real device while running and dribbling (the view goes down and up as the ball comes and goes as your target).
- Real iPad/iPhone touch: holding the button with one thumb while walking with the other (tested with simulated touches only).
- Sounds (the new "shot" sound was not listened to).
- Real Firebase with an old and a new player kicking the ball (tested with the kit's fake server: both see each other's kicks).
- How fast the ball pattern is painted on an older iPad (15–30 ms here on a busy test machine; it happens once while the game loads).

## Glitches not fixed
- Rich test save: the pizza job tutorial ("Pizza job tips!") pops up a moment after you arrive in town; if you are holding a shot at that moment the shot is quietly cancelled (on purpose).
- Setting the clock to late evening in a test jumped the game to the next morning ("Good morning! It's Saturday") — that is the existing night/sleep logic, not this job.

## Try it for real
- Walk to the football field: the ball looks like a real football and rolls with the pattern turning.
- Walk straight at the ball without looking down: when ⚽ shows, the view dips a little and you see the ball glow. Look away: the view comes back up.
- Stand behind the ball and look at it: it glows, a ring pulses, an arrow points where you look, the button shows ⚽.
- Tap the ⚽ button (even a slow tap): a soft pass (rolls a few metres). The ⚽ button does not move under your thumb while you hold it.
- Hold the ⚽ button: it fills up orange and the arrow grows; let go: a strong shot. Try a full shot from the middle into the goal.
- Look a little to the side of the goal and shoot: the ball curves its start a bit toward the goal, but a big miss stays a miss.
- On PC: tap E for a pass, hold E for a shot; clicking the ⚽ button also works.

## Tests run
- Review fix round (agent-tests/job3-fix1, final file md5 a21e8b76b8acd1e3e0b08a9de9774838): syntax ok; nothing above the game script changed (first 546 lines identical).
  - Look-down at normal pitch 0 (iPad, iPhone upright dark, iPhone sideways, PC 1366): walking up, the view dips (0.26–0.62 rad) and the ball is fully on screen at 1.95, 1.6, 1.2 and 0.9 m, above the bottom edge; ring on screen down to about 1.2 m; screenshots looked at (iPad light/dark, iPhone upright dark: ball above the buttons). Dip goes back to 0 when the ball is not the target; dragging the view moves only by the finger (no snap back). PASS.
  - Press length -> ball speed (one frame of rolling already applied): 0.1 s, 0.25 s, 0.3 s -> 4.95 (pass); 0.4 s 6.2, 0.6 s 8.8, 1.2 s 15.2: smooth. PASS.
  - ⚽ button left edge before / during / after a hold: iPad 1001/1001/1001, iPhone 231/231/231. PASS.
  - Ball rolls away during a hold: toast shown, fill and label reset, letting go kicks nothing; "Start a new match"/"Say hi" still work after. PASS.
  - Earlier feature test re-run (iPad touch + PC E key/mouse): all PASS (one step now holds 0.7 s instead of 0.3 s because 0.3 s is a tap now).
  - Flows re-run: new player's opening + kick, old and rich saves 0 differences, E1 within 10%, crawler reaches the ball on iPad + PC, old + new player see each other's kicks: all PASS. Zero console errors in every run.
- Syntax check (jscheck): ok.
- Feature test, iPad (real taps / held touch) and PC 1366 (E key tap/hold, mouse click), rich save: all PASS — glow + arrow + ⚽ button when close, tap = 4.95 m/s pass rolling about 5 m, hold 1 s = 15.2 m/s shot (scored a goal), power fill + label + longer arrow while holding, auto-aim 20° -> 12.3°, -20° -> -12.3°, 60° unchanged, walking into the ball kicks it at about 0.85 m, holding stops the dribble push, "Start a new match" still works with the button / E, no glow when the ball is behind you or 3 m away. Zero console errors.
- Screenshots looked at: iPad (light + dark), iPhone portrait (light + dark), iPhone landscape, ball at 4 m and close, half and full power. Label fits its box on all three (no cut text).
- New player's opening (iPhone portrait): opening finishes, then a tap on ⚽ kicks the ball. Zero errors.
- First version, before the review fixes (md5 87c67b6fd0fb56755e05a2bd579ed4cf): everything PASS. Once on the iPad a townsperson was standing at the scoreboard, so the button showed "Say hi" instead of "Start a new match" — that also worked (she answered); on PC the scoreboard check passed.
- Old saves: very first version save and the rich save load with 0 differences against the pre-night game, same save key; kicking works after loading both. Zero errors.
- Drawing work (E1): town 344 -> 346 pieces, 584,042 -> 585,768 triangles (+0.3%); town scenery unchanged.
- Night-check style crawl of the ball (iPad touch + PC key): the crawler reaches the ball and the use button does something.
- Two players (old version on iPad + new version on PC): the old player sees the new player's strong shot, the new player sees the old player's dribble kick (same kick number, same ball spot). Zero errors on both.
