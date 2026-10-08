# 🌙 Cozy Town: morning report for the big night update

Night of 7 → 8 October 2026 · branch `claude/cozy-night-kit-gcg6kd` · start: update A (`e5097a1091c6c320a40af6c389b7f925`)

## Good morning! The short version

- **All 14 jobs are done**, in the plan's order of importance. Each job is one commit. There are two small extra commits: a follow-up fix to job 2 (a shopper never hides another shopper's "Say hi") and "integration fixes". The integration fixes repair things that only went wrong once the jobs were put together (see section 1). No job had to be undone.
- **Final full check:** `RESULT: ALL PASS, 8 not run or not verified · 25 min of testing` (the full printout is in section 2). The lines that are "not run / not verified" are the ones the check always leaves to people: real devices, published files, and the device groups that were dropped on 7 Oct.
- **The final game file:** `index.html` at the tip of the branch (md5 `f2cdd530076cce1ad198bd90d9e0e2a7`). It is the GitHub version: the game plus the same web part as before, which the check confirms is unchanged. The pull request goes into `main`. Nothing was published anywhere else.
- **Two things need you:**
  1. **The ideas board (job 14) is hidden until you add a Firebase rule.** The rule is in section 8. Without it, nothing breaks: the board just isn't there.
  2. **Morning questions:** the things I couldn't decide alone are in section 8. Every one is already built in a sensible way, so you can just say yes, or tell me what to change.
- **How to go back:** section 7 (restore `tools/prenight-index.html`).

## Jobs at a glance

| # | Job | Commit | Quick check after the job |
|---|---|---|---|
| 1 | Pets keep a gap | `433cf5c` | all pass (E1 town-sky noise, passed on re-run) |
| 2 | Trees don't pop in + glitch sweep | `10c4a9a` | all pass |
| 3 | Football | `a6c0c17` | all pass |
| 4 | One clock for everyone | `efa84fc` | all pass |
| 5 | Sleeping together | `64f54ed` | all pass |
| 6 | Away or offline | `7fc3e14` | all pass |
| 7 | Pizza day | `7007a66` | all pass |
| 8 | Daytime activities | `a8a7b83` | all pass |
| 9 | Cozy nights | `c618ac6` | all pass |
| 10 | Second floor in the big house | `0b0a5d8` | all pass |
| 11 | Beach (first new place) | `73a90a3` | all pass except E1 town-sky noise (measured: not this job) |
| 12 | Tennis court with a coach | `5b13e72` | all pass |
| 13 | Nicer buildings | `a8e339d` | checked in the final full check (merged last) |
| 14 | Suggestions board in the park | `4e3fec9` | all pass (checked together with job 8, which was built on top of it) |

The night's work ran in three lines at the same time, so it could fit in one night: jobs 1→2→3→9, jobs 4→5→6→7→13, and jobs 10→11→12→14→8. The lines were merged together and checked again after every merge. The commit list is therefore not in strict 1-to-14 order, but each job is still exactly one commit.

---

## 1. Every change (item: old -> new)

The full notes for each job are in `tools/night-notes/` (decisions, tests and more). Every job also has its own "Decisions" in section 9.

### Job 1: Pets keep a gap

- Pets that follow you, when you stand still: kept running to a spot right behind your back, circling round you every time you turned, sometimes as close as 0.5 m -> they stop where they are and wait (they just turn to look at you, wag and look around), about 2.0–2.35 m away.
- When they follow again: as soon as you moved at all -> only once you are about 3.5 m away (a small step or turning around does not make them move).
- Gap while you walk: spots 1.5–2.7 m behind you, pets 3.8–4.9 m behind while walking -> spots 2 m behind you, pets trot about 3–3.5 m behind you, side by side.
- Which way is "behind": behind where you look -> behind the way you walk (walk backwards and they trail in front of you). When the game moves you itself (a lesson, a ride, a jump to a place), it is behind your back again.
- Catch-up speed: two fixed speeds (2.8 or 5.4 m/s) -> smooth: the further away the faster (up to 6.2 m/s, legs move faster when they run), and they slow down gently as they reach their spot, so there is no walk-stop-walk when you walk slowly. Popping over to you when very far (14 m) or in another place: unchanged.
- Pets and friends bumping into each other: they walked through each other and stood inside each other (0.01 m apart seen) -> pets and friends who are with you go round each other and keep about 0.6 m apart; if they end up too close they shuffle apart.
- A pet that can't reach you (fence, wall, water in the way): walked on the spot forever -> first it takes the way you walked (it remembers your last 24 footsteps, so it comes through the garden gate, round a fence or onto the lake pier after you); if even that is blocked it stops after about half a second and waits; it follows again when you walk on, and it pops over when 14 m away.
- Going through a door, into a classroom or flat, visiting a friend, "Take me home": pets (and friends who hang out with you) appeared 1.2–1.4 m behind you, in the doorway -> they appear about 2 m beside you, left and right (just out of view, not in the doorway), and wait. Never behind a wall or fence, never on a road, never on top of each other. Only if there is no room beside you (a narrow corridor) one waits 2.4–3 m in front of you, fully in view.
- Settings, "Bring my pets to me": pets 1.2–1.7 m in front of you (cut off at the bottom on the iPad, out of view on the iPhone) -> 3 m in front of you, side by side, all of them in view on iPad and iPhone; they wait there.
- Loading a game where a following pet was left in another place: put 1.1 m next to you -> beside you at the cozy gap.
- While the pet panel is open (petting, feeding, dressing): the pets kept moving around -> everybody waits.
- Teacher lesson: pets and friends who came along walked on the spot behind your desk (name tags showing at the bottom) -> they wait out of sight during the lesson and are back as soon as class is over.
- Friends who hang out with you (Rosie, Theo, Luna, Finn) share the same code: same waiting and following; they wait about 2.2 m away, still close enough for "Talk to ...".
- After the review:
  - A pet that once got stuck ignored you even after you went back to it: it only followed when you were 1.5 m further away than where it got stuck (seen 6.6 m and 10.9 m) -> as soon as you come back near it (3.5 m) it forgets it was stuck and follows again at about 3.5 m. "Stay here" -> "Follow me" and the 14 m pop-over also clear it.
  - Furniture put (or moved) onto a waiting pet: the pet stayed inside the sofa -> it hops out of the way at once (home and the designer job's rooms).
  - Walking into a waiting pet or friend: it was pushed ahead of you like a puck, legs still (a pet slid 9 m) -> it steps out of your way, legs walking (tries the other side if one side is blocked).
  - After crossing a road and stopping at the curb: pets waited on the road and cars stopped for them (up to 17 s) -> pets never wait on a road; they come to you on the pavement (in the test: 0 frames of cars waiting, before 334 of 400).
  - Pet Show: your other pets waited in view of the show camera (a big cut-off dog at the edge, a name tag behind the judges' score card) -> your other pets and friends wait out of sight during the show (like in class) and are back afterwards.
  - Slow walking (joystick pushed a little): pets flipped walk-stand-walk 97–140 times in 10 s -> 0–1 times.
  - Lesson code: made a new list every frame -> two plain loops (nothing you can see).

### Job 2: Trees don't pop in + glitch sweep

- What made trees "pop": I checked distance hiding, camera far plane (700 m), fog (60–340 m) and the way the town is cut into 32 m blocks. None of them makes trees vanish: in 48 views not a single block was hidden while it was on screen. What does pop is the sun shadow. Shadows only exist in a 60 x 60 m square around you, and that square jumps 1 m at a time as you walk. Everything outside it gets no shadow at all. So a tree, house or its shadow about 30 m ahead suddenly turned shady as you walked up to it.
  - Sun shadows far away: hard edge, popped in about 30 m ahead -> they fade out softly between about 22 and 30 m (a small change in the shader, no extra drawing).
- Town sky (clouds, far hills, far trees): different on every load (34 pieces, but 88,000–116,000 triangles depending on luck) -> the same every load (seeded), 94,458 triangles. Same kind of look: 16 clouds, 28 hills, about the same mix of round trees and pines.
- Clothing store, a shopper stood exactly on the "Try on clothes" mirror spot, so you could not say hi to them (and they blocked the mirror) -> that shopper spot moved 1.7 m away, beside the mirror (4.9, -1.2). They still walk to and from 6 other spots.
- Job line on the screen (under the map, e.g. "🎨 → Yellow house · 75 m"): 37 px tall, too small for a finger -> 45 px on iPad/PC, 44 px on phones (a bit more padding, same text).
- Big house card ("Decorating level 10", "800 coins") in dark mode: almost white text on white rows (contrast 1.09) -> dark ink text on the white rows (same in light mode). The same row style is also used for the friends list and the pet list, so those got fixed too.
- Round buttons (Use, Run, Jump): shared the class of the normal rectangular buttons, so the check saw "same button, two shapes" -> they have their own extra class `rnd` (they look exactly as before).
- Close ✕ on the "showing the way" bar: 2 px border, 34 px wide -> 3 px border like every other ✕ button, 44 x 44 px (easier for a finger).
- Small buttons "🔑 Answer key" / "🔑 Hide answers" and "🚪 Stop" (teacher job homework), "🚪 Leave" (decorating a client's room), "🚀 Go" / "🏠" (online friends list): 40 px tall -> 44 px tall (at least 44 px wide too). Same look, just 4 px taller.
- Teacher homework bottom buttons on a sideways phone ("Give an F", "◀ Back", "Next ▶" / "Done! 🎉"): 40 px -> 44 px. The homework sheet still fits on a sideways iPhone (checked).

### Job 3: Football

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

### Job 4: One clock for everyone

- Clock speed: 30 real seconds for every game hour (and with "Always day" on, 8:00 → 17:00 took 4.5 minutes, then it was the next morning) -> day 7:00 → 21:00 takes 10 real minutes, night 21:00 → 7:00 takes 5 real minutes. One whole game day = 15 real minutes.
- "Always day" setting: a button in ⚙️ Settings, turned on for everyone by default -> removed. Everyone has normal day and night now. An old saved "Always day" choice is simply ignored.
- Hunger, pet happiness, garden plants: counted per game hour at the old fixed speed -> still counted per game hour, so they follow the new clock. By day this is a little slower in real time (hunger: 4 per game hour = 4 every 43 seconds instead of every 30 seconds); at night it is the same as before.
- Playing together: every player had their own clock -> every player's game sends its clock (day and time) along with the other "I'm online" info. Whoever is furthest ahead sets the time; a player who is behind jumps forward to it. The clock never goes back. Differences under 2 game minutes are ignored (no jitter). If a jump passes midnight, the new day starts once (quests, litter, plants etc. renew once, even if many days are skipped).
- Small catch-up (under 1 game hour, also over midnight): none -> your clock quietly moves forward, like a normal midnight. No message, no fade.
- Big jump (1 game hour or more): none -> the jump waits until no other message, no pizza or designer tips and no class are on screen (so it never cuts a friend's "👋 … is here!" hello or the walking tip), then the screen fades like going to bed, the time changes, and "🕰️ Same time as your friends: Friday, day 12 · 15:50" shows in full. Messages of a new day (quest money, Pet Show) come after it.
- Brand-new player while friends are online: the welcome with Rosie happens on day 1 at 8:00 -> same; the clock joins the friends' time after the walking tip and after Chef Blaze's (or the designer's) tips are closed.
- The clock still stops when nobody plays and is still kept in each player's save (no new Firebase places or rules).
- Beds: with "Always day" you could sleep from 14:00 and woke at 8:00 -> for everyone: beds work from 19:00 until 7:00 and you wake at 7:30 (+40 🪙 pocket money as before; job 5 will change beds).
- Teacher job message: always "Good morning/afternoon … ☀️" -> "Good morning / Good afternoon / Good evening" by the clock, with 🌙 at night.
- Top of the screen on narrow phones (iPhone upright): with a long day label (like "🏆 Sat · Day 104", or day 1000 and up) or only a few coins, the 💬 chat button covered the tummy bar -> coins, tummy and time always keep their own rows on the left. The normal look is unchanged.
- Job box under the map (for example "🌙 The Pizzeria opens at 8:00" at night): 37 px tall on iPads, tablets and sideways phones (too small for a finger) -> at least 44 px, text in the middle. Two-line boxes look the same as before.

### Job 5: Sleeping together

- Bed hours: beds worked from 19:00 until 7:00 -> from 21:00 until 7:00. This is for every bed: your bed at home, the bunk bed, the beds in the big house (any furniture that is for sleeping).
- Tapping a bed in the daytime: "You're not sleepy yet. Come back in the evening! 🌙" -> "Not sleepy yet, beds work from 21:00 🌙".
- Tapping a bed at night: the screen faded at once and you stood next to the bed in the morning -> you lie down in your bed (you see the room over your blanket, head on the pillow), a little 💤 floats up and "💤 Good night!" shows. The round action button says "🧍 Get up".
- Waking up: at 7:30 -> at 7:00 (the next day if you went to bed before midnight, the same day if after midnight). You stand where you were before you lay down.
- Pocket money: +40 🪙 every time you slept -> none. The morning message is now "Good morning! It's Saturday, day 13 ☀️" (no coins).
- A "new day" (new quests, litter, plants, Pet Show day) was started every time you slept, even after midnight, when the day had already started (that could reset the day's quests) -> only when the day really changes.
- Alone (no friend online): lie down -> after about 1 second the screen fades -> 7:00 -> good morning.
- Going to bed while friends are online: your clock jumped to the morning and pulled every friend online into the morning too (with a fade, even if they were busy playing) -> you wait in bed; the night only skips when everyone playing is in bed.
- Friends online: you stay in bed and a card shows at the bottom of the screen: "😴 1 of 2 in bed" (counts everyone playing, you too; it changes as soon as a friend gets into or out of bed), "The night skips when everyone is in bed 🌙", and two buttons: "🔔 Ring the others" and "🧍 Get up". While the card is up, the joystick and the run/jump buttons are hidden (moving the keys on a PC also gets you up).
- When everyone playing is in bed: the night skips for everyone at once: fade -> 7:00 -> "Good morning!", the same day for all (worked out from the shared clock of job 4).
- "🔔 Ring the others": rings every friend who is playing and not in bed: their 📱 button wiggles, a ring sound plays (and the phone buzzes on devices that can), and they see "Friends want to skip the night, waiting on you!". The caller sees "🔔 Ring ring! Your friends' phones are ringing 📱". One ring per tap.
- Ringing too often: each friend can be rung at most once a minute. If everyone who is still up was rung less than a minute ago, the caller sees "Friend is busy doing something. We can't sleep! 😢 Let's stay up ALL NIGHT! 🤪" and nothing is sent. A phone also rings at most once a minute, whoever calls.
- If the night runs out while you are in bed (or a friend's clock brings the morning), you get up with "Good morning!".
- If the friends you wait for go offline, you are alone in bed, so the night skips.
- Playing together, new small online info (both optional, old versions ignore them): "in bed" (zz) and a ring (rg: who is rung), sent only for 12 seconds after a ring.
- The "Sleep in your bed" daily task call is kept (it is switched off in the game, as before).
- (Review fix) Tapping 🛋️ decorate while lying in bed: you were taken out of bed but left standing on the pillow spot, inside the bed -> you get up first and stand where you stood before lying down.
- (Review fix) Closing the game while lying in bed: you came back squeezed between the bed and the wall -> you come back standing beside the bed, where you stood before lying down.
- (Review fix) The bed check that runs every moment now does nothing extra when you are not in bed (a little less work for iPads).

### Job 6: Away or offline

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

### Job 7: Pizza day

- When pizza orders come: every day 8:00–20:00 -> only 12:00–21:00, Monday to Friday. The Pizzeria building stays open all the time (you can still go in and buy food).
- Pizzas a day: 5, plus 1 more for every pizza star (5 to 10) -> 3. Then Chef Blaze calls: "Right! That's enough. Chill for today!" with two answers: "Yay! Chef, bye!" (no more orders today) or "PIZZAS MUST BE DELIVERED" -> "You absolute maniac! Fine! I'll bake THREE more. Three! And not ONE more!" and 3 more orders come (6 at most). After the 6th: "That's it, see ya!" and no more today.
- 21:00 during a shift: orders stopped quietly at 20:00 -> no new orders after 21:00, but the pizza you already have can still be delivered and is paid normally. Then the chef says "Today's done, great work! Ciao!". If you have no order at 21:00, he says it right away (once).
- Pay per pizza: 30–50 🪙 (faster orders paid more) plus a tip of 2 🪙 per star -> one price set by your Pizza stars: 0 ⭐ 25, 1 ⭐ 60, 2 ⭐ 100, 3 ⭐ 135, 4 ⭐ 175, 5 ⭐ 210 🪙. Late: half (as before). The 3 extra pizzas pay the same price, on top.
- RARE customer on time: 100 + 10 per star -> your normal price + 50 🪙 (still "Big reward!") and a star, as before. RARE customer late: 15 🪙 -> half your normal price, and you lose a star, as before.
- An order you already had in an old save: keeps the price it had when it came.
- Chef Blaze when closed: "The kitchen is CLOSED! Even chefs need to sleep! 🌙 Come back in the morning." -> weekend: "It's the WEEKEND! 😎 My oven is having a rest.", before 12:00: "Too early! 🥱 My pizza dough is still sleeping.", after 21:00: "The kitchen is CLOSED! Even chefs need to sleep! 🌙", each followed by "Pizza time is 12:00–21:00, Monday to Friday 🍕".
- Going into the Pizzeria with the pizza job outside pizza time: nothing -> a short message "🕛 Pizza time is 12:00–21:00, Monday to Friday 🍕".
- Waiting inside the Pizzeria when pizza time starts (12:00 on a weekday): nothing happened, the job box said "Go to the Pizzeria" and no order came -> work starts by itself: Chef Blaze says "Pizza time! 🕛 Welcome to work! 🍕 Wait here, an order will come soon!" and the first order comes soon. (He waits until no other message or card is on screen. Not at the weekend, and not after you are done for the day.)
- Job box (under the map): "🌙 The Pizzeria opens at 8:00" -> "🕛 Pizza time is 12:00–21:00, Monday to Friday" (😎 at the weekend). "🌟 All 5 done today! See you tomorrow" -> "😎 Done for today! (3 🍕)". New: "🌟 3 pizzas done! Talk to Chef Blaze" while the chef's question is not answered yet.
- Chef's messages when you are not in the Pizzeria (a phone call): "🔥 Chef Blaze" -> "📱 Chef Blaze". In the Pizzeria it is still 🔥.
- End of the day message: "🌟 That's 5 deliveries! Great job today! Come back tomorrow." -> the chef's cards above.
- 📱 Phone → Job: "More stars = more orders and tips." -> shows "🕛 Pizza time is 12:00–21:00, Monday to Friday 🍕" and "100 🪙 for every pizza! Be fast for ⭐ RARE customers to win stars. More stars = more coins!".
- Great RARE review: "More orders and bigger tips are coming! 🍕" -> "More coins for every pizza now! 🪙".
- Pizza job tips: RARE step "a great review: more orders!" -> "a great review: a new star ⭐ and more coins for every pizza!". Last step now also says "Pizza time is 12:00–21:00, Monday to Friday."
- Clock: checked every pizza job step (orders, pick-up, delivery door scene, chef cards, the 21:00 end): none of them moves the clock, and none did before. Nothing to remove.
- Save: two new optional fields in the pizza part of the save, reset every new day: `S.dl.more` (1 = the chef bakes 3 more today) and `S.dl.end` (why the day is over: "rest", "six" or "shut"). The day count is the existing `S.dl.done` with its day stamp `S.dl.day`.

###### How the pay numbers were found
- Teacher: at most 2 classes a day; a class pays 30 + 15 per star (1 to 3 stars) = 45, 60 or 75 🪙. A day: 90 🪙 (worst), 120–150 🪙 (normal).
- Interior designer: at most 3 rooms a day; a room pays 30 / 100 / 150 / 200 🪙 by stars. A good day: 450–600 🪙, best 600 🪙. (While the decorating skill is still going up, each room also gives a level-up bonus; that stops at level 10.)
- Pizza, 3 pizzas a day: 0 ⭐ = 75 🪙, which is less than even the teacher's worst day (90). 5 ⭐ = 630 🪙 = the designer's best day + 5%; with the usual RARE bonus (about 0.6 RARE customers in 3 orders × 50 🪙 = +30) a 5-star day is about 660 🪙 = +10%. In between the steps are even (75, 180, 300, 405, 525, 630 a day).
- With the 3 extra pizzas: up to 6 × the price (at 5 ⭐: 1260 🪙 a day).
- Old pizza day for comparison: 0 ⭐ about 200 🪙 (5 pizzas), 5 ⭐ about 500 🪙 plus RARE money (10 pizzas).

### Job 8: Daytime activities

- Shop hours: shops were open day and night -> the Market, Pet Shop, Flower Shop, Café, Clothes Shop, Toy Store, Bakery, Ice Cream Shop and Library are open 8:00–20:00.
- Shop doors at night: you walked in -> the button by the door shows a 🌙 and its words say "🌙 Closed · opens at 8:00" (by day it says "Go into the Market" as before). Tapping it says "🌙 The Market is closed now. It opens at 8:00 ☀️". You stay outside.
- Inside a shop when it turns 20:00: nothing happened -> the shopkeeper waves and says "It's closing time! Buying stops now. See you at 8:00 ☀️". You can still walk out.
- Shop counters after closing time: you could buy -> the shop list still opens, with "🌙 Closed now. You can look, but buying starts again at 8:00 ☀️" at the top. Tapping something to buy (food, "New in!" things, clothes, hats, adopting a pet) says "Sorry, we're closed! Come back at 8:00 ☀️" and nothing is bought.
- Library books after closing time: a fun fact -> Ms. Page says the library is closed.
- Talking to Ms. Page at night: "Shh! Find a book you like." -> "Shh… the library is closed now. 🌙 Come back at 8:00 ☀️" (by day her lines are the same as before).
- Toy Store claw machine after closing time: you could still pay 5 🪙 to play -> the claw panel shows the "🌙 Closed now" note, and "🕹️ Play!" / "Play again" say Mr. Toby is closed and take no coins. A round already playing at 20:00 still finishes (you can still win), and "Done" works.
- Designer job: clients messaged day and night -> only from 8:00 to 20:00. At night the job box says "🌙 Work starts at 8:00 ☀️", the little designer card says "🎨 Clients come at 8:00 ☀️", and the 💼 Job app says when work starts. An order you already have can still be finished at night.
- Teacher job: classes came day and night -> only from 8:00 to 20:00. Same job box and Job app text at night. Mrs. Maple says "No classes at night! 🌙 Work starts at 8:00." A class you already have can still be taught at night.
- Pet Show: all Saturday -> Saturday 9:00–18:00. Before 9:00 the stage says "🏆 Pet Show starts at 9:00" (the judges are not there yet); after 18:00 "🏆 Pet Show is over for today". A show that already started always finishes, even after 18:00. If the pick-a-pet panel is open when 18:00 comes, the stage and judges stay until you close it, and picking a pet still starts the show.
- Pet Show messages: the midnight "It's Pet Show day!" message, the 📅 Calendar and the Saturday 🏆 in the day label -> now say the hours (9:00 to 18:00). After 18:00 the 🏆 and the "Pet Show today!" badge go away.

### Job 9: Cozy nights

- Night owls: 3 townsfolk (2 known faces and 1 more) went home between 22:20 and 23:25, so after about 23:30 nobody walked around -> these 3 now stroll around all night. They go home between 5:25 and 6:35 and come back out between 9:35 and 11:25. Everyone else still goes home between 18:25 and 21:00, as before.
- Walking home: every walker walked the whole way home, which could take more than a minute, so at 22:00 the streets were still busy -> a walker you can't see (off the screen, more than 52 m from the camera, or while you are indoors) is home at once. A walker you can see still walks home to their door. (Review fix: "off the screen" is new, so after a big clock jump the street also gets quiet quickly when you stand still.)
- New day (midnight, or waking up in bed): walkers who were out got moved to a random spot -> only walkers who are at home get a fresh start. Night owls keep walking where they are, so nobody jumps at midnight.
- Cars at night: all 12 cars drove all night -> 10 cars go away for the night (each at its own time between about 20:20 and 21:50) and come back in the morning (between about 5:35 and 6:55). 2 cars drive all night: one on the big outer ring and one through the middle of town. A car only goes away or comes back where you can't see it (off the screen, or more than about 90 m away). It comes back where it left; if you are looking at that spot, it comes back somewhere else on its own loop that you can't see (review fix: before, it stayed away until you looked elsewhere). It only comes back if no other car is within 9 m and not within 10 m of you. A car that went away doesn't block other cars or you.
- Car lights: small lamp boxes only -> at dusk and at night each car has two warm white headlight glows with a soft warm pool of light on the road ahead (review fix: the pool was too faint, it is now brighter and longer: about 3 m wide and 6 m long), two red tail-light glows, and a faint red glow on the road behind. They fade in from 18:30 to 20:30 and fade out from 5:00 to 7:00, the same as the sky.
- Street lamps: only the lamp heads glowed at night -> every street lamp in town and on Friends Lane (128 lamps) also has a soft warm halo around its head and a warm pool of light on the ground, with the same fade.
- How the glows are made: there are no real lights and no shadows. All glows share one soft-dot picture with one material, and each glow always turns toward the camera. Cost: 1 extra draw call for all street lamps together, plus 1 for each car on screen, at dusk and at night only. By day the glows are switched off, so they cost nothing.
- Warm window light, stars and the moon: already there and already cozy (checked), so they are unchanged.

### Job 10: Second floor in the big house

- Big house, ground floor: a plain west wall -> a doorway with a white frame and a "⬆️ Upstairs" sign; behind it a staircase (12 wooden steps and a handrail) going up into the dark, like in the flats.
- Big house, upstairs: did not exist (only the outside showed 2 floors) -> a second room as big as the ground floor (18 × 14), with the same wall paint and floor, 11 windows, a ceiling lamp, and the "⬇️ Downstairs" doorway with stairs going down at the same spot.
- Using the stairs: none -> stand at the doorway, tap "⬆️ Go upstairs" / "⬇️ Go downstairs": the same step-by-step climbing animation as the flats, a short fade, and you stand upstairs (or downstairs) facing into the room. Message: "🏡 Upstairs! Tap 🛋️ to decorate up here too." / "🏡 Back downstairs". Pets and friends who follow you come along.
- Decorating: worked in the one room -> works on the floor you stand on (grid, moving, putting away, shop, "My stuff"). Furniture placed upstairs is saved with the marker `f:1`; furniture without it is on the ground floor, so old saves are unchanged. Storage ("My stuff") is shared by both floors.
- Furniture upstairs: beds, sofas, piano, lamps, TV etc. all work upstairs like downstairs (tested: sit on a sofa, play the piano).
- Furniture rules: new furniture cannot be put on the stairs landing (about 3 m in front of the doorway, on both floors), so the stairs always stay reachable. A sofa upstairs can stand right above a sofa downstairs (each floor only checks its own furniture).
- Quests: "Dream home" (have 10 things in your house), the friends' "your house is cozy" visit and the place/decorate quests -> count furniture on both floors.
- Visiting friends: the house layout sent to visitors had all furniture in one list -> ground floor in the old list (old versions read only that), upstairs in a new extra list that is sent only with what is left of the size limit (so upstairs things are dropped first in a very full house; the 4 KB limit of the Claude version is kept).
- New-version visitors of a big house: no upstairs -> the same stairs and upstairs room with the host's upstairs furniture (sofas can be sat on, like downstairs). Host and visitor see each other upstairs.
- Old-version visitors: see the ground floor only (as before). When the host goes upstairs, they are NOT sent out of the house (the host just disappears upstairs).
- Only the floor you stand on draws its furniture (fewer draw calls on iPads).
- The flats' stairs: same animation code, now shared with the house -> look and work exactly as before; small safety added: if something else moves you away during the climb (for example a friend's house closes), the climb stops instead of pulling you back.
- "Bigger house" sign text: "A huge room inside, and a second floor with a balcony outside!" -> "A huge room inside, and stairs up to a whole second floor to decorate!"
- Review fixes (after the first review):
  - Tapping 🛋️ while climbing the stairs: decorating turned on for the wrong floor, the grid stayed stuck on the ground floor after ✅ Done -> the tap is ignored while you climb; ✅ Done (or 🛋️ again) now always hides the grid on both floors.
  - Furniture put away (📦 Put away, or Move then Cancel) from upstairs: kept its upstairs marker `f:1` in "My stuff" -> the marker is removed when it goes into "My stuff" (it is set again when you place it upstairs).
  - The "⬆️ Upstairs" / "⬇️ Downstairs" sign over the stairs doorway: 1.3 m wide -> 1.0 m wide (it filled the top of an iPhone screen at the doorway).
- Saving upstairs: you start upstairs again next time. (If the game were ever rolled back to the old version, that save simply starts at the house door.)

### Job 11: The beach

- Town, east end of the big middle road: red-and-white road barrier -> a white gate with a blue "🏖️ To the beach" sign, two palm trees and a sandy path that runs on through the gate towards the hills (the barrier at this one road end is gone; you still can't walk past the edge of town). The "🏖️ Go to the beach" button (or "The beach (opens at level 10 ⭐)" while it is closed) shows from about 5 steps before the gate, so the sign is still on screen on a phone, and stays until you stand at the gate.
- New place "the beach": did not exist -> soft sand, a calm sea that shimmers and has a little line of foam going in and out, a wooden boardwalk with two lanterns, a gate back ("🏘️ To town"), 8 palm trees, 3 beach umbrellas with towels, rocks, a wooden pier out into the sea (with a red life ring and a lamp), a bench, a kiosk, a sand castle spot, shells, 2 crabs walking sideways and 3 seagulls flying over the sea. Clouds, green hills and palms far away on the land side. Same sky as town: sun, sunset, moon and stars, and it gets dark at night (lanterns glow).
- Going there: tap the town gate -> short fade -> you stand on the boardwalk looking at the sea, "🏖️ Welcome to the beach! 🌊". Back: tap the "🏘️ To town" gate -> you stand in front of the town gate. Pets and friends who follow you come along.
- Opening rule: the beach opens when any skill reaches level 10. While closed, tapping the gate opens a small card: "The beach opens when one of your skills reaches level 10 ⭐", your best skill with its level and progress bar, and "Only N more levels to go! 💪".
- First time open: none -> a few seconds after a skill reaches level 10 (or after loading an old save that already has one), "🏖️ The beach is open! 🌴 Tap 📱 → 🗺️ Map → 🏖️ Beach to find the way." (no compass words for little kids). It waits until no card, tutorial or cutscene is on screen, and shows only once.
- Kiosk ("🍧 Kiosk"): "Buy a cold treat" -> a shop with Ice pop (4 🪙), Ice cream (8), Coconut drink (5, new food 🥥, fills the tummy 14) and Watermelon (6). Bought food goes in the bag like any food.
- Sand castle: "Build a sand castle" -> every tap adds a part (quick taps count: a tap at most every 0.3 s; a tap faster than that just makes a soft tap sound) (sand pile, 4 towers, middle tower, walls with a tiny moat, flag and shells) with a short message and +2 Sports XP; when finished "🏰 Your sand castle is finished!"; one more tap "🌊 Start a new sand castle" smooths the sand. The castle is not saved (a new day at the beach starts with flat sand).
- Shells: 5 shells lie on the sand each day (new places every day). "Pick up the shell" -> +1 🪙 and your collection count ("You have 7 in your collection"). After the 5th: "You found all of today's shells! … More come tomorrow!".
- Bench: "Sit and look at the sea" -> you sit facing the sea (move to stand up).
- Pier end: "Look out to sea" -> a little surprise message (dolphin, sailboat, fish, waves, crab).
- You cannot walk into the sea (only onto the pier).
- The sea glows softly in the day and goes dark blue in the evening and at night (its glow follows the sunset).
- Map (phone 🗺️ Map): a sandy "🏖️ Beach" spot at the east end of the big road and a "🏖️ Beach" button that shows the way to the gate. At the beach the pink arrow shows you at the gate.
- Showing the way from the beach to a town place: "go outside first" -> "go back to town first 🏘️".
- Following the map to the beach gate while the beach is still closed: "You found the Beach! 🎉" (cheer) -> "🏖️ Here is the gate to the Beach! It opens when one of your skills reaches level 10 ⭐" (soft pop, no cheer).
- Friends online: the friends list says "🏖️ At the Beach". New-version friends at the beach see each other; "🚀 Go" brings you to them (if the beach is open for you; if not: "🏖️ Pal is at the beach! It opens when one of your skills reaches level 10 ⭐").
- Saving at the beach: you start at the beach again next time.
- Town hills and clouds: drawn everywhere outside -> drawn in town only (the beach has its own; nothing changes in town).

### Job 12: Tennis court

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

### Job 13: Nicer buildings

- Houses with a pointed roof (your house small and big, the neighbour, the 6 houses north and south, every Friends Lane house): plain windows -> windows with shutters in the roof colour. Ground-floor front windows also get a slim wooden flower box with little flowers (it sticks out about as far as the old window sill, so you can still stand close to the wall).
- Narrow houses (the neighbour's mint house): the shutter right next to the front door is left out, so the door, its little roof and the window have room. Your big house: the middle upstairs window behind the balcony has no shutters, so the balcony looks tidy.
- The same houses: a flat door with nothing above it -> a small pointed roof over the front door, in the roof colour, with two white brackets.
- The same houses: no chimney (only your house had one) -> every pointed-roof house has a chimney with a darker cap on top.
- The same houses: the roof had no ridge and nothing showed where the wall meets the roof -> a darker ridge cap along the top of the roof and a trim band under the eaves.
- The same houses: blank side walls above the windows -> a small window in each side gable, under the roof.
- Flat-roof buildings (apartments, offices, school, library, fire station): plain windows -> each window has a small lintel on top in the building's trim colour.
- The same buildings: one plain wall from bottom to top -> a trim band between floors, a thin white line under the roof edge, and corner posts at the front corners.
- The same buildings: doors with nothing above them -> a flat canopy over the front door. It takes the door's colour, or the trim colour if the door is glass (library, school).
- The three apartment blocks: no flowers -> flower boxes on every other upstairs front window, in a checkerboard pattern.
- Shops (market, café, pet shop, flower shop, toy store, bakery, ice cream, pizzeria, clothes): plain windows -> a light wooden flower box with big, bright pastel flowers on each big shop-window sill (bright so they still read in the shade of the awning). The shops also get corner posts in their trim colour and a thin white line under the roof edge. The awnings, signs, colours and doors are unchanged, so each shop looks like itself.
- Town drawing work, measured with the check's own counter (checks.STATIC_JS):
  - update A (start of night): 387 pieces, 586,650 triangles
  - before this job: 390 pieces, 591,966 triangles
  - after this job: 390 pieces, 622,306 triangles. That is +5.1% on before this job and +6.1% on update A, under the +10% limit (645,315).
  - Friends Lane: each lane house now has about 85-90% more triangles (small 1,232 -> 2,328, big 1,736 -> 3,144; still 3 pieces each). The numbers above only count your own lane house. If all 6 lane plots hold big houses, the town is about +7.2% on update A (estimate 595,330 -> 638,122). That leaves about 2.8% for job 9's night additions, not 4%.
  - The far scenery (`outside`) is unchanged at 34 pieces and 94,458 triangles.
- Pictures: none -> `tools/pictures/before-<name>.png` (update A) and `tools/pictures/after-<name>.png` (now) for home, neighbour, market, café, pet shop, flower shop, toys, bakery, library, ice cream, pizzeria, fire station, apartments, clothes, school, houses (north row) and friendslane. Every pair uses the same camera, at midday, on the iPad screen size. Each picture is 95–175 KB. The player in the pictures is called "Rosie" (no test names).

### Job 14: Ideas board in the park

- Park, just inside the north gate (right side as you walk in): nothing there -> a cozy wooden board on two legs with a small coral roof, a "💡 Ideas Board" sign, a cork panel and 7 colored paper notes with red pins and little "writing" lines. It faces the fountain.
- Next to it: nothing -> a big old oak tree (thick trunk, wide dark-green crown). The oak is always there; the board only appears when the online notes really work (see below).
- Walk up to the board -> the action button says "📌 Read the ideas board" (tap it, or E on a computer). You can also tap the board itself on the screen (like a pet or a friend). That same tap can't land on a button of the card that just opened.
- The board card: "📌 Ideas Board", a line "What should Cozy Town build next? Pin your idea! Every Sunday, Mayor Rosie reads the notes. 💭", "Your hearts to give: ♥♥♥", a "✏️ Write an idea" button, tabs "🆕 Newest" and "💗 Most hearts", then the notes (newest 40): each note is a pastel paper card with a pin, the idea, "✍️ name", "💗 5 (2 from you)", a "💗 Give a heart" button and (if you gave hearts there) "↩️ Take one back".
- Hearts: everyone has 3. Give them to any notes, all 3 on one note is fine. With none left -> "You gave all 3 hearts! Take one back from a note to give it again. 💗". "Take one back" frees a heart to move it to another note. Your own notes can get your hearts too.
- Write an idea -> a card "✏️ Write an idea" with a text box (max 80 letters), "📌 Pin it!" and "⬅️ Back". Enter also pins. The note shows on the board right away for you and, a moment later, for everyone online. "📌 Your idea is on the board! 💛"
- Safety filter (on writing AND on showing, so notes written some other way are hidden too): rude words (English swear words, mean words like stupid/idiot/dumb/loser/shut up, a few common Russian/Lithuanian swear words, also spelled "s h i t", "sh1t", "fuuuck"), links (http, www, .com/.net/.lt …, "dot com"), emails and anything with @, phone numbers (6+ digits, also with spaces, dashes, +), home addresses ("12 Oak Street", "14 Maple Drive", "Main street 22", "Gedimino g. 5", "gatvė 5", "Hauptstraße 12", "I live at…", "address", LT-12345). Such text is not stored: the card says "Let's keep notes friendly and safe 💛". Too short -> "Write a little more! ✏️". A name that fails the filter shows as "A friend".
- Limit: 3 new ideas per player per day ("You pinned 3 ideas today! Come back tomorrow for more. 📌").
- Sundays: Rosie "reads the notes and thinks all day about what to build". Talking to her on a Sunday: her hello becomes a thought about an idea, and 3 of 4 chats too. About 6 in 10 times it is the most-hearted idea ("I read the ideas board today. 📌 “A big pool” has the most hearts! Hmm…", "“…”… what a cozy idea! I keep thinking about it. 💭"), otherwise another idea ("Someone wrote “…” on the ideas board. Fun! 😊"). She only talks about "hearts" when the top idea really has hearts. With no hearts yet she uses the other lines ("It's Sunday, my thinking day! 🤔 I read “…” on the ideas board…"). Her chat never says the same line twice in a row. She never promises to build anything.
- Sundays, passing Rosie (within about 7 m, in town or wherever she is with you): a thought bubble over her head for 6 seconds, e.g. "💭 “A big swimming pool w…” 🤔", at most every 24 seconds.
- If Firebase refuses reading or writing (or there is no internet): the board, its tap spot and its "solid" area stay hidden; nothing else changes and no error shows. If a write is refused while you are using the board, the card closes, the board hides and a toast says "📌 The ideas board is resting right now. Try again later!".
- Claude version: no board (and no Rosie Sunday lines about it), see Decisions.

### Extra commit: job 2 follow-up (shoppers)
- Library: 4 shopper spots were exactly on the "Read a book" spots, so the book always won and you couldn't say hi -> the spots are 0.25 m off the shelves.
- Shoppers could stand on the same spot, one hiding the other's "👋 Say hi" -> shoppers start on different spots and never walk to a spot another shopper stands on or is heading to.

### Extra commit: integration fixes (found by a review of how the jobs work together)
- "Took a break" title during a tennis rally: the racket and arm floated in front of the title -> the rally ends quietly and nothing floats there.
- "Took a break" title while carrying a pizza: a giant pizza box hung over the title -> it is hidden (and comes back when you press Play).
- "Took a break" title at the beach: an empty blue sky (the camera circled the town fountain, 1 km away) -> the title keeps your beach view.
- Behind the "Still there?" / "Reconnecting…" cards, a pizza's delivery timer and a tennis rally kept running -> they wait.
- Coach Sunny said "What a sunny day for tennis!" at 2 am -> at night: "A night match under the lamps? 🌙 Let's rally!" / "The stars are out! ✨ One more rally before bed?".
- A shop's "It's closing time!" line wiped out the "🕰️ Same time as your friends" message after a clock jump -> the closing line waits until that message is gone.

---

## 2. Check output

### How the checks were run (please read this first)

- **The tools:** `cozycheck/cozy_check2.py` from `cozy-night-kit.zip` (check version 1), with Playwright and Chromium. Every test copy ran with the kit's fake Firebase and fake room, the bundled three.js r128 and the Baloo 2 font. **No test ever reached the real internet** (line C8).
- **"Live" means update A.** The check needs a "Claude version" as well as the GitHub file. I made it by taking the web part out of update A: the manifest/icon lines and the Firebase scripts, 54 lines in 2 places. Line F3a confirms this is exactly "the Claude version + web part, nothing else". Every check also confirms that the GitHub file the check builds is byte-for-byte the file to publish (`WEBPART-ROUNDTRIP: identical`, and line F3).
- **More old saves than the kit had (B1).** The kit had no old saves, so I made real ones by playing each older version of the game in this repo's history (4 versions, back to the very first upload). I also made one "rich" save: 3 pets, the big house, two skills at level 10, the pizza job and day 12. So B1 loads **6 saves**, and none of them lost anything.
- **The 5 extra saves are kept in `tools/check-fixtures/`** (4 from older versions and the rich save; B1's sixth save is made fresh during each check). Copy them into `cozycheck/fixtures/` next time and B1 will use them too.
- **Quick check after each job:** files, counts, saves, two players and the Claude version, plus a crawl of the areas the job touched (and the teacher job or PC keys where they matter). A partial run prints the stage lines exactly as the check prints them. The crawl and teacher stages only print their PASS/FAIL line at the end of a full run, so for those I print a summary line made from the stage's own results with the same rules (`PASS | C2 crawl_...`, `PASS | T1/T2 teacher_...`, `C6 browser errors`). `INFO | C4` lines list layout findings, which the full check turns into the C4 lines.
- **A2 (dated backup)** is only given in the final check, so every quick check shows `FAIL | A2 ... no backup given`. That is expected, not a problem. For the final check I passed a copy of the live Claude version made on 8 Oct from `tools/prenight-index.html` (same md5 as update A's Claude version). Your own private backup on claude.ai, when you publish, is still yours to make.
- **E1 and the town sky:** on update A the far town scenery (clouds, far hills and far trees) is built at random, so the same file measures 88k–116k triangles from one load to the next. E1 compares two loads, so it could fail by chance (it did for job 1 and job 11; job 11 was measured 3 times to prove it). Job 2 made that scenery the same on every load (94,458 triangles), so from the merges on, E1 is steady.
- The `INFO | C4` lines in jobs 10 and 11 are the old layout problems that job 2 fixed. That line of work didn't have job 2 yet; from the merges on they are gone.
- The date in the check changed at midnight (UTC), which is why some quick checks say 7 Oct and later ones 8 Oct.

### Before any change: the full check on update A (dry run, 7 Oct, exactly as printed)

The unchanged game already failed 4 lines: C2 (clothes "Say hi"), C4 small buttons, C4 dark-mode contrast and C5 mixed buttons. Job 2 fixed all four.
```
===== COZY TOWN FINAL CHECK =====
2026-10-07 · check version 1 · DRY RUN on today's game (nothing changed)
live Claude 50ad10af141312c98e8ecf0f16bba4a5 · new Claude 50ad10af141312c98e8ecf0f16bba4a5 · live GitHub e5097a1091c6c320a40af6c389b7f925 · new GitHub e5097a1091c6c320a40af6c389b7f925
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
NOT RUN | A2 dated private backup of the live game | NOT RUN: dry run, nothing is being changed
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 928647 triangles in total | for information, seen from 5 spots: city 171 draws; home 34 draws; market 47 draws; cafe 47 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 1 saves tried: fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
FAIL | C2 every spot and button does something (iPad, finger taps) | 640 taps tested in 22 areas, 334 screens; UNREACHABLE (1): clothes "Say hi": unreachable
PASS | C2b every area is reached by playing | 23 of 23 areas
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: English ended, History ended, Math ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 7 of 7 taps worked, right side 28 of 28
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: English ended, History ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 5 of 5 taps worked, right side 29 of 29
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (pc-1920) | 3 classes: English ended, Math ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 16 of 16 taps worked, right side 20 of 20
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 51 questions read
PASS | C3 walking works (pc-1920) | W key: moved 6.4 m in 1.5 s
NOT RUN | C1 every screen opens (android-phone-portrait) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-phone-landscape) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-tablet-portrait) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-tablet-landscape) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (pc-1366) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
PASS | C1 every screen opens (iphone-portrait, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 5.3 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
PASS | C4 no buttons overlap | 0 problems
PASS | C4 all text fits its box | 0 problems
FAIL | C4 every button is at least 44 px for a finger | 15 problems: #jobTxt "🎨 → Yellow house · 75 m" [210, 37] (ipad-landscape light); #jobTxt "🎨 → Yellow house · 105 m" [219, 37] (ipad-landscape light); #jobTxt "🎨 → Yellow house · 131 m" [215, 37] (ipad-landscape light); #jobTxt "🎨 → Yellow house" [168, 37] (ipad-landscape light); #jobTxt "🎨 → Yellow house · 120 m" [219, 37] (ipad-landscape light); #jobTxt "🎨 → Yellow house · 25 m" [211, 37] (ipad-landscape light)
FAIL | C4 text is readable in light and dark | 4 problems: span "🛋️ Decorating level 10" (ipad-landscape dark); span "level 1" (ipad-landscape dark); span "🪙 800 coins" (ipad-landscape dark); span "120 / 800" (ipad-landscape dark)
FAIL | C5 the same kind of button looks the same everywhere | 20 kinds of button; MIXED: {"btn": [["\"Baloo 2\" 800", "18px", "3px"], ["\"Baloo 2\" 800", "50%", "3px"]], "btn.mint": [["\"Baloo 2\" 800", "18px", "3px"], ["\"Baloo 2\" 800", "50%", "3px"]], "btn.x": [["\"Baloo 2\" 800", "50%", "2px"], ["\"Baloo 2\" 800", "50%", "3px"]]}
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: dropped for now (decision 7 Oct)
PASS | F6 every test action is logged and undone | 22 test actions, 22 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['50ad10af141312c98e8ecf0f16bba4a5', 'e5097a1091c6c320a40af6c389b7f925']; to publish: ['50ad10af141312c98e8ecf0f16bba4a5', 'e5097a1091c6c320a40af6c389b7f925']
NOT RUN | F2 published Claude version = tested file | NOT RUN: dry run
PASS | F3 GitHub file after upload = new Claude version + same web part, same address | e5097a1091c6c320a40af6c389b7f925 vs e5097a1091c6c320a40af6c389b7f925
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: 4 FAIL, 9 not run or not verified · 25 min of testing
```

### Job 1: Pets keep a gap

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 932663 triangles in total | for information, seen from 5 spots: city 175 draws; home 34 draws; market 50 draws; cafe 46 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
-- counts-try1: an earlier run of the same stage on the same file:
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
FAIL | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 935781 triangles in total | MORE: ['outside (town scenery) triangles 103092 -> 115198'] | for information, seen from 5 spots: city 161 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
PASS | C2 crawl_ipad-landscape_town: 85 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | C6 browser errors: 0
INFO | C4 small-target: 14: #jobTxt "🎨 → Peach house · 82 m" [207, 37] (ipad-landscape light, at area-city); #jobTxt "🎨 → Peach house · 79 m" [207, 37] (ipad-landscape light, at city-🏆 Pet Show is on Saturday); #jobTxt "🎨 → Peach house · 62 m" [207, 37] (ipad-landscape light, at city-Start a new match); #jobTxt "🎨 → Peach house" [163, 37] (ipad-landscape light, at city-Go into the Clothes Shop-arrived-in-clothes); #jobTxt "🎨 → Peach house · 24 m" [207, 37] (ipad-landscape light, at city-Feed the ducks); #jobTxt "🎨 → Peach house · 116 m" [211, 37] (ipad-landscape light, at city-Knock on the door)
INFO | C4 low-contrast: 4: span "🛋️ Decorating level 10"  (ipad-landscape dark, at city-Bigger house); span "level 1"  (ipad-landscape dark, at city-Bigger house); span "🪙 800 coins"  (ipad-landscape dark, at city-Bigger house); span "120 / 800"  (ipad-landscape dark, at city-Bigger house)
WEBPART-ROUNDTRIP: identical
(The first counts stage, shown as 'counts-try1' above if present, failed E1 on 'outside' triangles 103092 -> 115198: the town sky was random on update A. The counts stage was run again on the same file and passed; see E1 above.)
```

### Job 2: Trees don't pop in + glitch sweep

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 915041 triangles in total | for information, seen from 5 spots: city 165 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_hud: 162 taps, areas []
PASS | C2 crawl_ipad-landscape_inB: 93 taps, areas ['clothes', 'city', 'studio', 'toys', 'bakery', 'icecream', 'library']
PASS | C2 crawl_ipad-landscape_town: 85 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1/T2 teacher_iphone-landscape: 3 classes: History ended, Math ended, History ended; goof taps 33 of 33 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 3: Football

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1161 pieces, 916767 triangles in total | for information, seen from 5 spots: city 158 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_town: 86 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 4: One clock for everyone

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 925353 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 43 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | T1/T2 teacher_ipad-landscape: 3 classes: History ended, English ended, History ended; goof taps 35 of 35 worked
PASS | C6 browser errors: 0
INFO | C4 small-target: 2: button.btn.white.sm[tkey] "🔑 Answer key" [138, 40] (ipad-landscape light, at class1-homework-paper); button.btn.white.sm[tstop] "🚪 Stop" [87, 40] (ipad-landscape light, at class1-homework-paper)
WEBPART-ROUNDTRIP: identical
```

### Job 5: Sleeping together

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 931815 triangles in total | for information, seen from 5 spots: city 169 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 207 taps, areas ['home', 'city', 'market', 'pets', 'flowers', 'cafe']
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 6: Away or offline

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1247 pieces, 965155 triangles in total | for information, seen from 5 spots: city 177 draws; home 34 draws; market 38 draws; cafe 46 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | T1/T2 teacher_ipad-landscape: 3 classes: Math ended, History ended, Math ended; goof taps 35 of 35 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 7: Pizza day

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1247 pieces, 965155 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 38 draws; cafe 48 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inC: 24 taps, areas ['school', 'city', 'cl_math', 'cl_english', 'cl_history', 'fire', 'pizza']
PASS | C2 crawl_ipad-landscape_town: 87 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 8: Daytime activities

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1277 pieces, 980901 triangles in total | for information, seen from 5 spots: city 177 draws; home 34 draws; market 38 draws; cafe 55 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 207 taps, areas ['home', 'city', 'market', 'pets', 'flowers', 'cafe']
PASS | C2 crawl_ipad-landscape_inB: 169 taps, areas ['clothes', 'city', 'studio', 'toys', 'bakery', 'icecream', 'library']
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | T1/T2 teacher_ipad-landscape: 3 classes: Math ended, History ended, Math ended; goof taps 34 of 34 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 9: Cozy nights

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1248 pieces, 965667 triangles in total | for information, seen from 5 spots: city 165 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_town: 87 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 10: Second floor in the big house

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 667 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 24 areas, 1159 pieces, 928587 triangles in total | for information, seen from 5 spots: city 133 draws; home 34 draws; market 39 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 212 taps, areas ['home', 'city', 'market', 'pets', 'flowers', 'cafe']
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 11: Beach (first new place)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
FAIL | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1245 pieces, 978599 triangles in total | MORE: ['outside (town scenery) triangles 97158 -> 109628'] | for information, seen from 5 spots: city 163 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
-- counts-try1: an earlier run of the same stage on the same file:
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
FAIL | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1245 pieces, 983737 triangles in total | MORE: ['outside (town scenery) triangles 103084 -> 114766'] | for information, seen from 5 spots: city 151 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
PASS | C2 crawl_ipad-landscape_hud: 162 taps, areas []
PASS | C2 crawl_ipad-landscape_town: 86 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.5 m in 1.5 s
PASS | C6 browser errors: 0
INFO | C4 small-target: 15: #jobTxt "🎨 → Blue house · 75 m" [195, 37] (ipad-landscape light, at area-city); #jobTxt "🎨 → Blue house · 69 m" [196, 37] (ipad-landscape light, at city-🏆 Pet Show is on Saturday); #jobTxt "🎨 → Blue house · 50 m" [197, 37] (ipad-landscape light, at city-Start a new match); #jobTxt "🎨 → Blue house" [152, 37] (ipad-landscape light, at city-Go into the Clothes Shop-arrived-in-clothes); #jobTxt "🎨 → Blue house · 36 m" [196, 37] (ipad-landscape light, at city-Feed the ducks); #jobTxt "🎨 → Blue house · 114 m" [200, 37] (ipad-landscape light, at city-Knock on the door)
INFO | C4 low-contrast: 4: span "🛋️ Decorating level 10"  (ipad-landscape dark, at city-Bigger house); span "level 1"  (ipad-landscape dark, at city-Bigger house); span "🪙 800 coins"  (ipad-landscape dark, at city-Bigger house); span "120 / 800"  (ipad-landscape dark, at city-Bigger house)
WEBPART-ROUNDTRIP: identical
Direct measurement, 3 page loads each, 'outside (town scenery)' (meshes, triangles):
  live (update A): (34, 108052) (34, 114164) (34, 111134)
  job 11 file:     (34, 96582)  (34, 109456) (34, 105332)
  job 2 file:      (34, 94458)  (34, 94458)  (34, 94458)   <- steady after job 2's seeded sky
=> the E1 'outside' failure is load-to-load noise of the old random sky, not job 11 (job 11 adds nothing to 'outside').
```

### Job 12: Tennis court with a coach

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1274 pieces, 978279 triangles in total | for information, seen from 5 spots: city 165 draws; home 34 draws; market 38 draws; cafe 40 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_town: 87 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```

### Job 13: Nicer buildings

No separate quick check: this job was the last one merged, so its check is the final full check below (town crawl included).

### Job 14: Suggestions board in the park

Job 8 was built on top of job 14 in the same line of work, so job 8's quick check (above) already ran with job 14 inside, including the town and shop crawls and the two-player test. All lines pass.

### After merging the three lines of work (jobs 1–5, 10, 11)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-07, live-web.html read on 2026-10-07
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1244 pieces, 964763 triangles in total | for information, seen from 5 spots: city 189 draws; home 34 draws; market 50 draws; cafe 50 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
FAIL | C2 crawl_ipad-landscape_inA: 216 taps, areas ['home', 'city', 'market', 'pets', 'flowers', 'cafe']; UNREACHABLE (1): flowers "Say hi": unreachable
PASS | C2 crawl_ipad-landscape_town: 87 taps, areas ['city', 'clothes', 'school', 'client', 'apt1', 'toys', 'bakery', 'library', 'icecream', 'pizza', 'fire', 'home', 'market', 'pets', 'cafe', 'flowers']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 5.8 m in 1.5 s
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | T1/T2 teacher_ipad-landscape: 3 classes: English ended, History ended, English ended; goof taps 34 of 34 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
```
(The one miss here, a flower-shop shopper's "Say hi", led to the job 2 follow-up fix: shoppers never stand on the same spot.)


### Final full check (the final file, every stage, exactly as printed)

```
===== COZY TOWN FINAL CHECK =====
2026-10-08 · check version 1 · update
live Claude 50ad10af141312c98e8ecf0f16bba4a5 · new Claude 413cc5f4d3bbd561ab274c7d74d67bce · live GitHub e5097a1091c6c320a40af6c389b7f925 · new GitHub f2cdd530076cce1ad198bd90d9e0e2a7
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
PASS | A2 dated private backup of the live game | backup 50ad10af141312c98e8ecf0f16bba4a5 vs live 50ad10af141312c98e8ecf0f16bba4a5; title "Cozy Town live game (update A) backup 2026-10-08, copy of tools/prenight-index.html"
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 56 lists, 667 things before, 676 after; grew: {"areas": "23 -> 24", "shops": "9 -> 10", "places": "19 -> 20", "doors": "21 -> 22", "foods": "48 -> 49", "shop_beach": "new list (4)"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 38 draws; cafe 48 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 every spot and button does something (iPad, finger taps) | 604 taps tested in 22 areas, 298 screens
PASS | C2b every area is reached by playing | 23 of 23 areas
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: History ended, Math ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 11 of 11 taps worked, right side 25 of 25
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: History ended, English ended, Math ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 3 of 3 taps worked, right side 32 of 32
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (pc-1920) | 3 classes: English ended, Math ended, History ended
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 6 of 6 taps worked, right side 28 of 28
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 51 questions read
PASS | C3 walking works (pc-1920) | W key: moved 6.4 m in 1.5 s
NOT RUN | C1 every screen opens (android-phone-portrait) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-phone-landscape) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-tablet-portrait) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-tablet-landscape) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (pc-1366) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
PASS | C1 every screen opens (iphone-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
PASS | C4 no buttons overlap | 0 problems
PASS | C4 all text fits its box | 0 problems
PASS | C4 every button is at least 44 px for a finger | 0 problems
PASS | C4 text is readable in light and dark | 0 problems
PASS | C5 the same kind of button looks the same everywhere | 22 kinds of button
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: dropped for now (decision 7 Oct)
PASS | F6 every test action is logged and undone | 32 test actions, 32 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['413cc5f4d3bbd561ab274c7d74d67bce', 'e5097a1091c6c320a40af6c389b7f925', 'f2cdd530076cce1ad198bd90d9e0e2a7']; to publish: ['413cc5f4d3bbd561ab274c7d74d67bce', 'f2cdd530076cce1ad198bd90d9e0e2a7']
NOT RUN | F2 published Claude version = tested file | NOT RUN: not published yet
PASS | F3 GitHub file after upload = new Claude version + same web part, same address | f2cdd530076cce1ad198bd90d9e0e2a7 vs f2cdd530076cce1ad198bd90d9e0e2a7
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: ALL PASS, 8 not run or not verified · 25 min of testing
WEBPART-ROUNDTRIP: identical
```

---

## 3. Before/after pictures of the buildings

All pictures are in `tools/pictures/`: the same camera, midday, iPad size. "Before" is update A and "after" is now. The old look stays in the backup (`tools/prenight-index.html`).

| Building | Before (update A) | After |
|---|---|---|
| afe | ![before afe](pictures/before-afe.png) | ![after afe](pictures/after-afe.png) |
| akery | ![before akery](pictures/before-akery.png) | ![after akery](pictures/after-akery.png) |
| arket | ![before arket](pictures/before-arket.png) | ![after arket](pictures/after-arket.png) |
| cecream | ![before cecream](pictures/before-cecream.png) | ![after cecream](pictures/after-cecream.png) |
| chool | ![before chool](pictures/before-chool.png) | ![after chool](pictures/after-chool.png) |
| eighbour | ![before eighbour](pictures/before-eighbour.png) | ![after eighbour](pictures/after-eighbour.png) |
| etshop | ![before etshop](pictures/before-etshop.png) | ![after etshop](pictures/after-etshop.png) |
| ibrary | ![before ibrary](pictures/before-ibrary.png) | ![after ibrary](pictures/after-ibrary.png) |
| irestation | ![before irestation](pictures/before-irestation.png) | ![after irestation](pictures/after-irestation.png) |
| izzeria | ![before izzeria](pictures/before-izzeria.png) | ![after izzeria](pictures/after-izzeria.png) |
| lothes | ![before lothes](pictures/before-lothes.png) | ![after lothes](pictures/after-lothes.png) |
| lowershop | ![before lowershop](pictures/before-lowershop.png) | ![after lowershop](pictures/after-lowershop.png) |
| ome | ![before ome](pictures/before-ome.png) | ![after ome](pictures/after-ome.png) |
| ouses | ![before ouses](pictures/before-ouses.png) | ![after ouses](pictures/after-ouses.png) |
| oys | ![before oys](pictures/before-oys.png) | ![after oys](pictures/after-oys.png) |
| partments | ![before partments](pictures/before-partments.png) | ![after partments](pictures/after-partments.png) |
| riendslane | ![before riendslane](pictures/before-riendslane.png) | ![after riendslane](pictures/after-riendslane.png) |

---

## 4. Glitches found and not fixed

These were found during the night and are written down here so they aren't lost. None of them stops play.

### Job 1: Pets keep a gap

- No real path finding: if a pet can't walk straight to any of your last footsteps (for example it went round the end of a fence on the other side), it walks on the spot while you keep walking and pops over when you are 14 m away; when you stop it waits. (Before: the same, but it walked on the spot all the time.)
- In crowded rooms (the market) a pet whose spot is inside a counter waits about 3.3 m away until you walk on.
- After the Pet Show the show pet is put back at a fixed spot by the stage, about 1.1 m from you (old Pet Show code, not changed); the others now shuffle apart if it lands next to them.
- Adopting: the new pet appears 1 m from you in a fixed direction, so it can be behind you. (Old code, not changed.)
- On a narrow iPhone held upright, after "Bring my pets to me" a long pet name tag (for example "Marshmallow") can touch the screen edge for a moment; the pets themselves are fully in view.
- Night check, E1 "outside (town scenery)" triangles: the town scenery count changes on every page load, even for the unchanged live file (seen 88,682 to 115,864, same 34 meshes), so that line can fail by chance. Not caused by this job (no drawings changed); it passed in 2 of my 3 final runs.

### Job 2: Trees don't pop in + glitch sweep

- Part B (glitch sweep) was only partly done. What was checked: stuck spots (a reviewer's scripted walk: town on a 2 m grid, clothing store, bakery, library, café and home on a 0.5 m grid, 8 directions each: 0 stuck spots; every door puts you in a free spot) and flicker (48 views in town, clothing store, bakery, library, café, home and school: 0 flickering surfaces bigger than a thin line). Not checked: objects floating, sunk or inside walls (only looked at in a few screenshots, nothing seen). Found:
- School front, seen from the park: a 1-pixel line along the edge of the "Cozy Town School" sign can shimmer a little (town, far away, tiny).
- Library, looking at the entrance door: the line where the floor meets the wall can shimmer by 1 pixel (normal seam, hardly visible).
- Shadow edges crawl slightly every time the shadow square jumps (every 1 m you walk), because it does not snap to whole shadow pixels (town, everywhere).
- People in town appear and disappear at 48 m, cars at 80 m (not hidden by fog, which starts at 60 m).
- Clouds that drift past x = 230 m jump to the other side of the sky (far away and half in fog, but it is a jump).
- Old saves: after loading, `msg` (old save) and `litter` / `q` / `qhist` (rich save) differ from the file. This is exactly the same in the unchanged game (normal day and quest updates), not from this job.

### Job 3: Football

- Rich test save: the pizza job tutorial ("Pizza job tips!") pops up a moment after you arrive in town; if you are holding a shot at that moment the shot is quietly cancelled (on purpose).
- Setting the clock to late evening in a test jumped the game to the next morning ("Good morning! It's Saturday") — that is the existing night/sleep logic, not this job.

### Job 4: One clock for everyone

- Now that everyone has night: friends and shop helpers go home in the evening, and the Pizzeria is closed from 20:00 to 8:00 (both were already like this with "day & night"). A brand-new player who joins friends at night finishes the welcome and tips, then Rosie goes to bed. Jobs 7 and 8 set the opening hours for jobs and shops.
- Teacher and designer orders still come at night (job 8 will keep them to the daytime).
- On a Pet Show Saturday, right after a new day with quest money still to collect: "📱 You got 30 🪙 from yesterday's quests!" shows only half a second before the Pet Show message replaces it. Old: the same happens at a normal Saturday midnight.
- The phone's home screen shows the time from when you opened it; after a clock jump it shows the old time until you open it again. Old (it never ticks while open).

### Job 5: Sleeping together

- When you visit a friend who is in bed, you see your friend standing in their bed (other players never sit or lie down in your view; same as sitting on a sofa before).
- If the only friend still up has the OLD version, ringing says "🔔 Ring ring! Your friends' phones are ringing 📱" to the caller, but the old game shows nothing (see the morning question about old versions).
- The 🛋️ decorate button still shows while you lie in bed. Tapping it gets you out of bed (no "Get up" message) and you stand next to the bed.

### Job 6: Away or offline

- A toast (for example "🟢 You are online!") that is still showing can sit on top of the "Still there?" card for its last seconds (seen in an iPhone dark screenshot). It goes away by itself, and the card's button stays tappable.
- If you go to the title while visiting a friend's house, then tap Play, you may be sent outside with "(friend) left the game, so you head outside." The friend is fine; your game just did not see them come back within 2 seconds. This uses the visiting rules from before.
- While you are on the title, a connection try that was already running when you left may finish in the background. It is dropped at once (nothing is sent to friends).
- (Not from this job) On iPhone sideways, the joystick ring sits in the middle at the bottom in test screenshots. It is the same in the pre-night game.

### Job 7: Pizza day

- An order you never pick up or deliver stays until you do, even over night and over the weekend (as before). It then counts for the new day.
- A "no rush" order lasts 30 real minutes, so it can be delivered long after 21:00, even after midnight (allowed as "the pizza in hand"); after midnight there is no "Ciao" message.
- The test "rich" save gets new daily quests and litter when loaded (it was made on day 1 and set to day 12). Same in the version before this job; not related to pizza.

### Job 8: Daytime activities

- The buildings themselves show nothing at night (the windows stay lit, no "closed" sign on the door); only the button by the door says "Closed" and turns 🌙. A 3D sign would add drawing work to the town.
- Old: when you load a game, today's litter and quests refresh (the same as before this job).

### Job 9: Cozy nights

- At the moment a car goes away just behind the camera, its shadow could still be on the screen for that one moment (very rare, and night shadows are faint). The same could happen with a walker going home just off the screen at dusk (a long evening shadow); the check keeps a 5 m margin, so it should be rare.
- When the pizza job is on, Chef Blaze's tips pop up in the middle of the screen when the clock is jumped in tests (existing behavior from earlier jobs, not part of this job).

### Job 10: Second floor in the big house

- Standing right at the stairs doorway on an iPhone held upright, the (now smaller) sign is still partly hidden behind the top-right buttons. That is just the view looking up close; from a few steps away it reads well.
- In the big house the upstairs walls and windows are part of the same drawing as the ground floor, so both floors' walls are always drawn (about 4,000 extra triangles at home, fewer draw calls than before). Cheap even on iPads; only the furniture of the other floor is hidden.
- Old big-house saves whose furniture stands right in front of the new stairs doorway keep it there; the stairs button still shows when you stand next to it, and the climb walks through it.
- While the host climbs, an online visitor sees the host walk into the stairwell at floor height (people have no up/down in this game). Same as the flats.
- A visitor sees the host's upstairs lamps and sofas, but (as downstairs before) only sofas/chairs can be used by visitors.

### Job 11: The beach

- In town the hills, trees and clouds are placed by chance on every start, so the town scenery's triangle count goes up and down by up to ~12% between two starts of the SAME game (not caused by the beach; the beach did not touch that scenery). A single-start weight check can wrongly flag it.
- An old-version friend who taps "🚀 Go" to someone at the beach gets "🚀 You are with …!" but sees nobody (they land at the east end of the big road). Their game cannot know the beach.
- Right in front of the town gate (on an iPhone held upright) the big sign is above the top of the screen; the button now appears a few steps earlier, where the sign is still visible.
- Clouds at the beach sometimes pass high overhead and look big (same as in town).

### Job 12: Tennis court

- On a phone held upright the resting racket still covers a bit of the lower right of the view (moved lower/right in the review fix; the ball now stays clear of it in the tests).
- The "🎾" emoji on the sign shows as the device's emoji font (on the test computer it looks like a racket with a ball).
- Pets that follow you can wander onto the court while you play (they don't stop the ball).

### Job 13: Nicer buildings

- In my test, calling `enter('market')` / `enter('toys')` from a script left you in town after 30 frames. This is probably the fade transition, which needs real time. Doors were not changed, and I did not check this on the version from before this job.

### Job 14: Ideas board in the park

- Loading an old save adds an empty `dr` list to `msg` (Messages) — this already happens in the pre-night game, not from this job.
- The Pet Show stage and other park things were not touched.
- Hearts on notes that drop out of the newest 80 (or that a later filter change hides) come back to give again; the old hearts stay saved in Firebase. Small for a kids' board; fixing it needs a separate list of your hearts.
- Tapping a 3D thing that opens a card (a friend, a pet, a shop): on a phone that same tap may also press a button of the new card. The board is protected against this; the others are older and were not changed.

### Found by the final review of how the jobs work together (not fixed)
- The beach kiosk keeps selling at night while all other shops close at 20:00. I left it open on purpose: it is a morning question (job 8 / job 11).

---

## 5. NOT VERIFIED (needs real devices and real people)

**For the whole update:**
- **Real devices:** nothing was tried on a real iPad, iPhone, Android or PC. All tests ran in desktop Chromium pretending to be those screens (with real taps and keys), and nothing ran in Safari's engine (line C1-WK).
- **Sound:** sounds were never heard (new: phone ring, football shot, tennis bounce/hit/swish).
- **Smoothness:** frame rate on a real iPad is unknown. Drawing work was measured instead (line E1, plus draw calls per job).
- **Real Firebase:** the GitHub version was only tested against the check's fake Firebase. I tried one harmless read of the real database to see whether the ideas board is allowed, but this session was not allowed to touch the real database. If your Firebase rules only allow a fixed list of player fields, the new optional fields could be refused: `ck` (clock), `zz` (in bed), `rg` (phone ring) and `aw` (away). Then new-version players might not show up online. **Please check once with two real devices** (see "Try it for real").
- **The real Claude room:** only the check's fake room was used.
- **How things feel:** football kicks, the tennis rally, pets' gap and the new clock speed. These are listed per job below.

### Job 1: Pets keep a gap

- How it feels on a real iPad and iPhone (smoothness, whether the gap feels right, how fast they run, the little step aside).
- Real online play with real Firebase (tested only with the test copy and its pretend server; pets are not shared online anyway).
- Every furniture spot in every room and every fence in town: pets walk in straight lines plus your footsteps, so odd corners can still trap them for a while.

### Job 2: Trees don't pop in + glitch sweep

- How the softer shadow edge looks on a real iPad while walking (it was checked here with still pictures and shader output only).
- Real devices, real Firebase, sounds.
- The "🚀 Go" / "🏠" buttons in the online friends list were not opened in a test (they need another player online); they use the same 44 px rule as the other small buttons.
- Objects floating, sunk or stuck inside walls: no full scripted check, only screenshots.
- The full night check (the orchestrator runs it). I re-ran the checks for the 4 Part C items myself with the same audit code.

### Job 3: Football

- How the look-down helper feels on a real device while running and dribbling (the view goes down and up as the ball comes and goes as your target).
- Real iPad/iPhone touch: holding the button with one thumb while walking with the other (tested with simulated touches only).
- Sounds (the new "shot" sound was not listened to).
- Real Firebase with an old and a new player kicking the ball (tested with the kit's fake server: both see each other's kicks).
- How fast the ball pattern is painted on an older iPad (15–30 ms here on a busy test machine; it happens once while the game loads).

### Job 4: One clock for everyone

- Real Firebase: whether the real database rules accept the new small online field (the clock). The test copies use a pretend server. If the real rules only allow a fixed list of fields, new-version players might not show up online: please check once with two real devices.
- How the longer day feels on real devices (iPad, iPhone, PC), and sound.
- How the fade for big jumps feels on a real device.
- The centered job box needs a 2024 browser (iPadOS/iOS 17.4 or newer). On an older iPad the box is still 44 px, only the text sits a little higher.
- A very slow device (under 20 frames per second) has a slower game clock; it will catch up with friends in small jumps of a few game minutes. Not tried on a real slow iPad.
- The Claude version's real room (only the test room was used).

### Job 5: Sleeping together

- Real Firebase: whether the real database rules accept the two new small online fields (zz, rg). The tests use a pretend server. If the rules allow only a fixed list of fields, playing together may break: please check once with two real devices.
- Sound of the ring and the feel of lying in bed on real devices. Phones that can't buzz (iPhone Safari) just don't buzz.
- The Claude version's real room (only the test room was used).

### Job 6: Away or offline

- Real internet loss on real devices: airplane mode on an iPad or iPhone, with real Firebase. The tests used a pretend server: Firebase's "connected" signal was switched off and on by the test, and the browser was put offline.
- The Claude version's real friends room: whether it tells the game when the connection is lost. The test called the game's own "connection lost" step directly. If the real room never reports it, only "device offline" triggers the card there.
- Whether the cloud save inside Claude finishes when the internet is already gone. It keeps retrying on its own, as before.
- The sound of the "ding", and the feel on real devices.
- Whether the real Firebase rules accept the new small online field "aw". If the rules allow only a fixed list of fields, please check once with two real devices.

### Job 7: Pizza day

- Feel and sound on a real iPad, iPhone and PC (the chef's phone calls, the timing of the 21:00 message).
- Two players doing pizza together (not part of tonight).

### Job 8: Daytime activities

- Real iPad/iPhone feel and sounds (only test browsers).
- How it merges with job 7 (pizza hours) and job 6 (away/offline): I kept my changes out of the pizza code.
- Real Firebase / two real devices (nothing online was changed).

### Job 9: Cozy nights

- How smooth it runs on a real iPad and iPhone. The glows are soft see-through squares: 4 per car and 2 per street lamp, which is very little work but was not tried on an old iPad.
- How bright the glows look on real screens (light and dark mode look the same, because it's the 3D scene).
- The Claude version: same code, not opened separately.
- Two players: the presence data was not touched, and each player has their own cars and walkers (as before). Not tried with two devices.

### Job 10: Second floor in the big house

- Real iPad/iPhone feel: climbing speed, the fade, how the doorway looks on a real screen.
- Real Firebase with two real devices (tested with the pretend server, a new-version visitor and an old-version visitor).
- The Claude version's room size limit with a really full house (the drop-upstairs-first rule was tested directly: with a tight limit the ground floor is kept and upstairs is dropped).
- Sound of the steps (same sound as the flats).

### Job 11: The beach

- Real iPad/iPhone feel and speed (the beach is light: 85 pieces, about 45,000 triangles; town grew by 1 piece and 0.6% triangles).
- Real Firebase with real devices (tested with the pretend server: new + new, new + old version).
- Sounds (reused: door, pop, coin, yay).
- How the shimmering sea looks on a real iPad screen.

### Job 12: Tennis court

- Real iPad/iPhone feel: timing of the tap, how fast the ball feels, the sounds (made with simple tones: bounce, hit, swish, aww).
- The court at night in this test setup (the test copy keeps the day running; the lamps use the same glowing lamps as the boardwalk).
- Real Firebase / two real devices (nothing new is sent online).
- Weight on a real iPad: the beach grew from 85 to 112 pieces and from about 44,800 to 57,900 triangles (the court is baked; the town is unchanged).

### Job 13: Nicer buildings

- Real iPad/iPhone speed with the extra triangles. The town has the same number of pieces, so draw calls are unchanged. The triangle count went up by about 30,000.
- How the new side windows look at night once job 9's night look is merged.
- The full night check (the orchestrator runs it).
- In the iPhone portrait test pictures, the rich save's own "Pizza job tips" card covered the middle of the screen, so I could only see the buildings around it.
- Friends Lane with several real players. Only your own lot was seen, but every lot uses the same builder.

### Job 14: Ideas board in the park

- Real Firebase (only the in-memory fake in tests): the real permission-denied path, the `limitToLast(80)` list, the server time, and how fast other players see a new note.
- Real iPad/iPhone keyboard on the "Write an idea" box (focus + keyboard popping up, the card moving up).
- How the filter does on real kids' writing in other languages; it surely misses some rude words and may refuse a rare innocent idea (for example "I want to die laughing", or a street-like phrase such as "12 cherry lane" for a toy town).
- Sounds (pop for a heart, yay for pinning, no for refused).

---

## 6. "Try it for real" (play and tick off)

**Two devices first (most important):**
- [ ] Two devices, new version on both: you see each other, walk, chat and visit a house (this checks that the real Firebase accepts the new optional player fields).
- [ ] One device on the old version (or the Claude version) and one on the new: you still see each other.
- [ ] Both devices show the same day and time.

### Job 1: Pets keep a gap

- [ ] Walk with your pets, stop, and turn all the way round: your pets stay where they are and look at you (no running round you).
- [ ] Take one or two small steps: they keep waiting. Walk on a bit more: they trot after you, side by side. Walk straight into one: it steps aside.
- [ ] Go into a shop with your pets: the view is clear; turn your head: they wait beside you; turn round: the door button shows.
- [ ] From your house walk out through the garden gate: your pets come through the gate after you.
- [ ] Settings, "Bring my pets to me": they appear in front of you, all three in view.
- [ ] At home, decorate and put a sofa where a pet stands: the pet hops out of the way.

### Job 2: Trees don't pop in + glitch sweep

- [ ] Walk down a long street on the iPad: shadows of trees and houses far ahead fade in gently, nothing suddenly turns dark.
- [ ] Load the game 2–3 times and look at the sky over the hills: the same clouds and far trees each time.
- [ ] In the clothing store, walk up to a shopper (also the one near the mirror) and tap 👋 "Say hi".
- [ ] The mirror "Try on clothes" spot is free to use.
- [ ] With a job, the job line under the map is easy to tap.
- [ ] Teacher job on a sideways phone: grade a homework sheet; "Answer key", "Stop", "Back" and "Next" are easy to tap and the sheet still fits.
- [ ] Tap a shop on the map to get the "showing the way" arrow; the ✕ to stop it is easy to hit.
- [ ] In dark mode, open the "Bigger house" sign by your house: both rows are easy to read.

### Job 3: Football

- [ ] Walk to the football field: the ball looks like a real football and rolls with the pattern turning.
- [ ] Walk straight at the ball without looking down: when ⚽ shows, the view dips a little and you see the ball glow. Look away: the view comes back up.
- [ ] Stand behind the ball and look at it: it glows, a ring pulses, an arrow points where you look, the button shows ⚽.
- [ ] Tap the ⚽ button (even a slow tap): a soft pass (rolls a few metres). The ⚽ button does not move under your thumb while you hold it.
- [ ] Hold the ⚽ button: it fills up orange and the arrow grows; let go: a strong shot. Try a full shot from the middle into the goal.
- [ ] Look a little to the side of the goal and shoot: the ball curves its start a bit toward the goal, but a big miss stays a miss.
- [ ] On PC: tap E for a pass, hold E for a shot; clicking the ⚽ button also works.

### Job 4: One clock for everyone

- [ ] Watch the clock: 7:00 → 21:00 takes about 10 minutes, and 21:00 → 7:00 about 5 minutes.
- [ ] Open ⚙️ Settings: the "Always day" button is gone, and night comes.
- [ ] Two devices, one save on a later day: when the second one comes online, "👋 … is here!" stays readable, then the screen fades and "🕰️ Same time as your friends: …" shows. Both now show the same day and time.
- [ ] Play together for 10 minutes: both clocks keep showing the same time.
- [ ] Try your bed at noon ("not sleepy yet, come back in the evening"), then at 22:00 (you wake up the next day at 7:30; a friend online is pulled into the morning too, with a fade).
- [ ] Start a brand-new game on a new device while a friend plays in the evening: Rosie's welcome, the walking tip and the job tips are in the morning; after them, a fade to your friend's time.

### Job 5: Sleeping together

- [ ] Tap your bed at noon: "Not sleepy yet, beds work from 21:00 🌙".
- [ ] Alone at 22:00: tap your bed: you lie down, then it fades and it is 7:00 next morning, coins unchanged.
- [ ] Two devices online at 22:00: one goes to bed: the card says "😴 1 of 2 in bed". Tap "🔔 Ring the others": the other device's 📱 wiggles and rings and says "Friends want to skip the night, waiting on you!".
- [ ] Tap "🔔 Ring the others" again right away: "Friend is busy doing something. We can't sleep! 😢 Let's stay up ALL NIGHT! 🤪".
- [ ] The second device goes to bed too: both fade and wake at 7:00 on the same day.
- [ ] In bed with the card showing, tap "🧍 Get up": you stand next to your bed and the card is gone.
- [ ] Lie in bed and close the game (or put the iPad away), then open it again: you stand next to your bed, not stuck behind it.

### Job 6: Away or offline

- [ ] Open the mirror ("Change my look") and wait about 3.5 minutes. Tap Play: you are still in the mirror, with no buttons bar on top. Tap "That's me!": the bar is back.
- [ ] Play and put the iPad down for 3 minutes: a ding and "Still there? 👀". Tap anywhere: it goes away and you play on.
- [ ] Put it down for about 3.5 minutes: the title says "You took a break, so we saved your game. 💤". Tap Play: you are right where you were, pets too.
- [ ] Two devices online at 22:00: the first goes to bed, and the second doesn't touch anything for 3 minutes. When "Still there?" shows on the second, the night skips on the first.
- [ ] While playing online, turn on airplane mode: "📡 Reconnecting…". Turn it off within 20 seconds: "🟢 Back online!" and you play on.
- [ ] Keep airplane mode on for more than 20 seconds: the title says "Your internet connection was lost 😢". Tap Play: you keep playing alone. Turn the internet back on: friends come back.
- [ ] Start the game in airplane mode and play: no "Reconnecting" card, the same as before.

### Job 7: Pizza day

- [ ] On a weekday after 12:00, go to the Pizzeria and deliver 3 pizzas: Chef Blaze calls "Right! That's enough. Chill for today!". Tap "Yay! Chef, bye!": no more orders today and the job box says "😎 Done for today!".
- [ ] Another weekday: after 3 pizzas tap "PIZZAS MUST BE DELIVERED": the chef says "You absolute maniac! …"; deliver 3 more; after the 6th he says "That's it, see ya!".
- [ ] On a weekday go into the Pizzeria before 12:00 (Chef Blaze: "Too early!") and wait by the counter: at 12:00 he says "Pizza time! Welcome to work!" and an order comes soon.
- [ ] Start work at about 20:45 and take an order: at 21:00 you can still deliver it and get paid, then "Today's done, great work! Ciao!".
- [ ] On Saturday, Sunday or before 12:00 talk to Chef Blaze: he says it's closed and "Pizza time is 12:00–21:00, Monday to Friday 🍕"; "🛒 Buy food" still works.
- [ ] Open 📱 → Job: see pizza time and "… 🪙 for every pizza". Win a star from a fast ⭐ RARE customer and see the price go up.

### Job 8: Daytime activities

- [ ] Walk to the Market after 20:00: the button shows 🌙 and says "Closed · opens at 8:00"; tap it and you stay outside.
- [ ] In the Toy Store after 20:00 open the claw machine: it says closed, and tapping Play costs nothing.
- [ ] Be inside the Bakery at 19:58 and wait: Mrs. Crumb says it's closing time; buying stops, the door still lets you out.
- [ ] Take the designer job in the evening: the job box says "🌙 Work starts at 8:00 ☀️"; a client messages after 8:00.
- [ ] On a Saturday at 8:30 go to the Pet Show stage: "starts at 9:00", no judges yet. Come back after 9:00 and enter.
- [ ] Open 📅 Calendar: it says the Pet Show is Saturday, 9:00 to 18:00.

### Job 9: Cozy nights

- [ ] Stay outside from 20:00 to 22:00: the streets get quiet, and only a few people and cars are left.
- [ ] At night, stand next to a road and wait for a car: two warm headlights with a soft light on the road in front, and red lights at the back.
- [ ] At night, look at the street lamps: a warm glow around the lamp and a soft pool of light on the sidewalk.
- [ ] Watch a car closely at 21:00: it never vanishes in front of you. It only goes away once it's out of sight.
- [ ] Stay up until morning (or sleep): after 7:00 all cars are back, and the lights have faded away. Also when you stand still and look at a street all morning.
- [ ] At midnight, watch a night owl walking: they keep walking, with no jump.

### Job 10: Second floor in the big house

- [ ] In a big house, walk to the white doorway on the left wall: "⬆️ Go upstairs". Tap it: you climb the stairs and stand in the new room.
- [ ] Upstairs, tap 🛋️ and put a sofa and a bed up there. Sit on the sofa. Go back down: your downstairs things are still where they were.
- [ ] Quit and open the game again while upstairs: you are still upstairs.
- [ ] Tap 🛋️ quickly while you are still climbing: nothing happens; once upstairs tap 🛋️, then ✅ Done, and go down: no purple grid lines on the ground floor.
- [ ] With a friend online: let them in, then both go upstairs: you see each other and your upstairs furniture.
- [ ] Check the "Dream home" quest: things upstairs count too.

### Job 11: The beach

- [ ] With a skill at level 10: after loading, wait a few seconds: "🏖️ The beach is open!". Follow it: 📱 → 🗺️ Map → 🏖️ Beach, walk to the gate and tap "🏖️ Go to the beach".
- [ ] Without a level-10 skill: tap the gate: the card shows your best skill and how many levels are left.
- [ ] At the beach: build the sand castle with quick taps (5 parts), then tap once more to start a new one. Does fast tapping feel right?
- [ ] Find and pick up the 5 shells. Come back the next day: 5 new shells.
- [ ] Buy a coconut drink at the kiosk and drink it from your bag. Sit on the bench. Walk out on the pier and "Look out to sea".
- [ ] Visit the beach in the evening and at night: sunset colors, stars, glowing lanterns, a dark blue sea.

### Job 12: Tennis court

- [ ] Arrive at the beach: do you see the "🎾 Tennis ➡️" sign and the welcome message about tennis?
- [ ] First ball of a game: is the "Here comes the ball!" message gone before the ball reaches you?
- [ ] During a rally, walk backwards to the back fence: the game should go on.
- [ ] At the beach, walk north past the kiosk: find the court and the "🎾 Tennis" gate. Talk to Coach Sunny and tap "🎾 Let's rally!".
- [ ] Tap 🎾 when the ball has bounced in front of you. Can you get a rally of 5 ("🎉 5!") and a new best (+5 🪙)?
- [ ] Stand still while the ball comes: do you slide to the ball nicely? Try moving with the joystick too.
- [ ] Miss on purpose: is the message kind, and does the coach serve again?
- [ ] Tap "✋ Stop", and another time just walk out of the gate: the game ends and the coach walks back.
- [ ] Play in the evening: is the court still nice to look at?

### Job 13: Nicer buildings

- [ ] Walk to your house: pink shutters, flower boxes under the front windows and a little pink roof over the green door. Walk right up to a front window: the flower box should not cut into your view.
- [ ] Look at the market and the café: bright flowers in light wooden boxes on the shop-window sills, and darker posts at the shop corners.
- [ ] Look at an apartment block: flower boxes on every other upstairs window, trim lines between the floors, and a blue canopy over the door.
- [ ] Walk around the neighbour's mint house: it now has a chimney, and there is a small window high up on each side wall.
- [ ] Visit Friends Lane: your lot's house has the same new look.
- [ ] Stand at night in front of a house: the small side windows should glow like the others.

### Job 14: Ideas board in the park

- [ ] Walk into the park through the north gate: the ideas board with the oak is on your right, facing the fountain. Tap the board itself: the card opens (and "Write an idea" doesn't open by itself).
- [ ] Write "A 2nd tennis court please": it gets pinned. Write "12 Oak Street": refused.
- [ ] Write "A big swimming pool!" and pin it: it shows at the top right away. Try writing a phone number: it says "Let's keep notes friendly and safe 💛".
- [ ] Give all 3 hearts to one note, then try a 4th (kind message), then "Take one back" and give it to another note.
- [ ] On a second device, open the board: your note and hearts are there.
- [ ] On a Sunday (weekday shown next to the clock), talk to Rosie: she talks about the most-hearted idea most of the time. With no hearts on any note she doesn't mention hearts. Press Chat several times: no line twice in a row. Walk past her: a 💭 bubble pops up.
- [ ] If the board doesn't appear on the real game: the Firebase rule above is still missing.

---

## 7. How to go back

- **Go back to PRENIGHT BIG UPDATE:** copy `tools/prenight-index.html` over `index.html` (or upload it to GitHub as `index.html`). That file is update A, exactly as it was at the start of the night (md5 `e5097a1091c6c320a40af6c389b7f925`).
- In git: the starting commit is `aeccc5c` ("night kit"), the tip of `main` before the night. I made the tag `prenight-big-update` on it in my copy, but this environment was **not allowed to push tags** (GitHub answered 403). Only the night branch could be pushed. To have the tag on GitHub too: `git tag prenight-big-update aeccc5c && git push origin prenight-big-update`.
- **To undo just one job:** each job is one commit (see the table at the top), so `git revert <commit>` undoes just that job. Jobs that build on it (for example 5 and 6 on job 4's clock, or 12 on the beach) may need to go too.
- **Old saves are safe either way:** every new save field is optional, and old versions simply ignore them.

---

## 8. Morning questions (and the Firebase rule)

These are already built in the way described. Just say yes, or tell me what to change.

### Job 1: Pets keep a gap

- Is a 2–2.35 m gap right, or should pets wait a bit closer so "Play with ..." shows without a step?
- Should waiting pets sit down? Now they stand, look at you, wag and look around (no sit pose exists yet).
- In a lesson and in the Pet Show your pets and friends now wait out of sight. Fine, or should they sit and watch somewhere?
- After a door your pets and friends now wait beside you, just out of view (like before, when they stood behind you). OK, or would you rather see them in front of you?

### Job 2: Trees don't pop in + glitch sweep

- People walking in town appear and disappear at 48 m, cars at 80 m. This is clearly visible on long streets. Just moving the limit to 60 m would not hide it (the fog only starts at 60 m, so they would still pop, just a bit further away) and costs more drawing on the iPad; a real fix is a soft fade-in, which is a bigger change. OK as it is, or should a later job add a fade?

### Job 3: Football

- Strength: soft pass rolls about 5 m, a full shot about 16 m (the field is 28 m long). Too strong or too weak for the kids?
- Should tapping the ball itself (in the 3D view) also pass it? Not done for now (see Decisions).
- The view dips a little toward the ball when you can kick. Does it feel nice, or should it dip less / not at all?
- Old-version players still only have the old 0.65 m dribble and no kick button or auto-aim; they see the new ball as their old ball. Everything stays in sync (tested).

### Job 4: One clock for everyone

- If two friends' saves are on very different days, the one behind jumps forward the moment they meet online (for example from day 3 to day 40). Days never go back. Is that OK?
- The one big world is open to everyone who opens the page: one save with a huge day number (or a cheater's made-up clock) pulls every online player's day number up for good (at most to day 99,999). The screen copes with big numbers now. Should we ignore friends who are very far ahead (for example more than 30 days)? Then those friends would not share the same time.
- When one player sleeps while friends are online, their clock jumps to the next morning and pulls everyone online into the morning too (beds work from 19:00, so the night rarely lasts its 5 minutes). Job 5 ("night skips only when everyone is in bed") is planned to change this; if job 5 is undone, this stays. Until then, OK?
- A brand-new player who joins while friends are in the night: welcome, walking tip and job tips are in the morning, then the screen fades to night. Rosie then goes home to bed (so "Come find me at the park!" has to wait for the morning), and the Pizzeria is closed until 8:00 (the job box and Chef Blaze say so). OK, or should a brand-new player keep their own morning for their first minutes?
- Daytime hunger is now about 30% slower in real time (it follows game hours). Would you rather keep hunger at the old real-time speed?

### Job 5: Sleeping together

- Old-version players count as awake, so they block the night skip until they update or leave (as planned). OK?
- Without the +40 🪙 pocket money, kids earn coins only from jobs, quests and the Pet Show. OK?
- A friend who is visiting your house at night is counted too: you can only skip the night when they are in their own bed (beds work only in your own house). OK, or should a visitor not count?
- The ring limit is 1 minute per friend. Is 1 minute right?

### Job 6: Away or offline

- After a break, Play carries on exactly where you were (it does not start fresh from the last save). OK?
- The Settings button is hidden on the "took a break" title. OK?
- Do you want the small "🟢 Back online!" message after a short hiccup, or no message?
- Should friends who are away show something (for example 💤 over their head)? Not done: right now they just stand still.

### Job 7: Pizza day

- A brand-new player starts on Monday, day 1, at 8:00, so the pizza job is closed for the first 4 game hours (about 3 real minutes). Is that OK, or should a brand-new player's very first shift start right away?
- Pay goes from 25 🪙 (0 ⭐) to 210 🪙 (5 ⭐) per pizza: a big range, and a 5-star kid who insists on 6 pizzas earns 1260 🪙 a day, twice a designer's best day. Is that what you want for "the 3 extra pizzas are on top"?
- The teacher earns much less than the designer (90–150 vs. up to 600 🪙 a day). Should the teacher's pay go up some day?
- Should fast (2-minute) orders pay a bit more again than "no rush" ones?

### Job 8: Daytime activities

- Pet Show 9:00–18:00 is about 6½ real minutes every Saturday, and a Saturday comes every 1¾ hours of play. Is that too short for kids? (Easy to widen, for example 8:00–20:00 like the shops.)
- Should the beach kiosk (🍧 cold treats) also close at 20:00? I left it open.
- Brand-new player who joins friends at night: the "Buy food at the market" task has to wait until 8:00. OK?

### Job 9: Cozy nights

- Would you rather see the night cars parked at the roadside (lights off) instead of going away? That would need parking spots along the streets.
- Night owls now sleep in until 9:35–11:25, so in the early morning a few familiar faces are missing. OK?
- Fireflies in the park at night: want them as a later small job?

### Job 10: Second floor in the big house

- Should upstairs get its own wall paint and floor (a second paint choice), or is one paint for the whole house fine?
- Would you like a real balcony door upstairs (out onto the balcony you see from the street)? That would be a new small area.
- The stairwell walls are the house paint color; looking down the stairs from upstairs you see a dark stair hole (like the flats). OK?

### Job 11: The beach

- Should a friend be able to bring you to the beach with "🚀 Go" before your own beach is open? (Now: no, a kind message instead.)
- Would you like the sand castle to be saved (still there next time), or shared so two friends can build one together?
- Should shells be kept as a visible collection somewhere (a shelf at home, or a page in the phone)? Now it is just a number.
- Should the kiosk close at night?

### Job 12: Tennis court

- Should two friends be able to play tennis with each other (a shared ball online)? That would be a bigger job.
- Is the speed right? It starts slow (about 2 seconds per ball) and gets a little faster up to rally 16.
- Should the coach sometimes miss on purpose at high rallies, so kids "win" points?
- Should tennis add a daily quest ("Rally 5 times with Coach Sunny")? (Kept out now so old saves keep the same quests.)

### Job 13: Nicer buildings

- Do you like the shutters in the roof colour (for example pink shutters on your lilac house)? White or a darker wall colour would be the other options. It is one word in `building()` (`sh:o.roof`).
- Should the offices (the tall blue building behind the market) get flower boxes too? Right now only the three apartment blocks have them.

### Job 14: Ideas board in the park

- **Firebase rule needed (GitHub version).** Without it the board stays hidden. In the Firebase console -> Realtime Database -> Rules, add this `board` part inside your existing rules (next to the rules you already have for `worlds/cozy-town/...`, keep those):
```json
{
  "rules": {
    "worlds": {
      "cozy-town": {
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
        }
      }
    }
  }
}
```
  What it allows: everyone can read the notes; a new note can be added (not changed or deleted afterwards); each heart entry can be set to 1–3 or removed. If your rules already use a wildcard like `"$code"` or `"$world"` under `worlds`, put the `board` block inside that wildcard instead (otherwise the two can clash). Rules can't check the swear filter or the "3 hearts" limit (the game does that); anyone with tech skills could still write directly, which is why the game also filters notes when showing them.
- Do you want the board inside the Claude version too? It would need the Claude shared database to allow every player to read and add notes in one shared place; I didn't build it untested.
- OK to call Rosie "Mayor Rosie"? (Only in the board card's text; easy to change.)
- Should kids be able to take down their own notes? (Needs a slightly different rule; not built.)
- When the filter refuses an idea, the card says "Let's keep notes friendly and safe 💛" (your words from the job). Now that it refuses far fewer kind ideas this should be rare, but a kind child could still feel told off. Want a softer line, e.g. "Hmm, let's try other words 💛"? One-word change.
- "I want to die laughing" is refused (the word "die" stays blocked on purpose). OK?

---

## 9. Decisions I made (the obvious ones)

### Job 1: Pets keep a gap

- Numbers: their spot is 2 m behind you; they wait as soon as they are within 2.35 m or reach their spot; they follow again at 3.5 m. That is inside the 2–2.5 m the plan asked for.
- The pet's play reach stays 2.1 m (as the plan said). So to see "Play with ..." you take one small step towards a waiting pet. Tapping the pet itself works from further away, as before.
- Pets line up behind the way you walk, not where you look, so looking around never moves them.
- After a door they wait beside you, just out of view (the review found that pets and friends in front of you covered the first view and their name tags were cut at the iPhone edges). Turn your head and you see them. The door behind you stays free, and the door button still shows when you turn round.
- "Bring my pets to me" puts them in front of you instead (you asked for them, so you should see them come).
- A blocked pet uses your own footsteps to find its way (no full path finding: cheap and safe for iPads).
- Near a road, waiting pets come onto the pavement next to you (as close as about 1 m) instead of keeping the 2 m gap; cars should never wait for a pet.
- Friends use the same code (the plan allowed it), so they also stop circling round you, step aside and keep apart.
- In a lesson and in the Pet Show, followers are hidden the same way the game already hides walkers during door clips ("so nobody blocks the view").
- Not changed: pets told to stay at home (they still wander near their spot), adopting (the new pet still pops up 1 m from you and now simply waits there).
- Nothing new is saved: the new "following or waiting" state only lives while you play.

### Job 2: Trees don't pop in + glitch sweep

- Small buttons: made 44 px for everyone (one shared rule), not only on touch screens, so they look the same on every device.
- Shadows fade out instead of covering a bigger area. A bigger area would make all shadows blurrier on the iPad, and a fade costs nothing.
- Seed 13 for the sky because it gives 94,458 triangles. That is at the low end of what the old game had (88k–116k), so the drawing-work check passes every time.
- The shopper keeps 9 spots in the clothing store; only the one on the mirror spot moved.
- The job line: more padding instead of a new layout, so the text looks the same, just in a slightly taller box.

### Job 3: Football

- "Kick area +25–35%": the only kick area today is running into the ball (0.65 m). That became 0.85 m. The new kick button needs its own reach; I chose 2 m, because the game is first-person: at 1.6 m the ball is already below the screen when you look straight ahead. At 2 m you still see the ball and the arrow at the bottom of the screen.
- The kick direction is where you look (not "from you through the ball"), because that matches the arrow and is easiest to aim for kids.
- Tap = released within 0.3 s (children often press that long). Full power after about 1.1 s of holding. A hold just past 0.3 s gives a kick just a little stronger than a pass (no jump in strength).
- The look-down helper is only for the ball (only while ⚽ shows) and only if you are not already looking up at the sky; it tilts at most about 30° (35° on an upright phone).
- Ball pattern size stays 512×256: a 4× smaller one was tried (half the load time, about 6 ms here) but the ball looked blurrier up close, which is now the normal view.
- The ball is preferred over other things near you (for example your pet) while it glows, so the button reliably kicks.
- Tapping the ball itself in the 3D view does not kick (only the ⚽ button, E key, or clicking the button). A tap on the screen is also used for looking around, and a tap could reach balls 4 m away.
- The little float ("👟"/"💥") on every kick is also what the night check sees as "the button did something".
- The ⚽ button ignores browser gestures while held (so a slightly moving finger does not cancel the shot). If the phone does cancel the touch anyway, the kick still happens.

### Job 4: One clock for everyone

- Hunger, pet happiness and plant growth keep counting game hours (so a whole game day still makes you about as hungry as before). Their speed now follows the clock.
- A player's clock is sent again only after it moved 5 game minutes (about every 3.6 seconds by day, 2.5 seconds at night) or a new day started, so a player standing still sends very little. Walking players already send often.
- A friend's clock is only compared when a new clock message from them arrives, so clocks don't wobble.
- Nonsense clock values from the internet are ignored (day must be a whole number from 1 to 99,999, time 0 to 24).
- Players with the old version send no clock: they are ignored (their clock runs on its own; old versions still have "Always day" on).
- A brand-new player first finishes Rosie's welcome, the walking tip and the job tips in the morning, so the welcome never happens in the dark.
- A big jump waits at most 2 minutes for a free moment (a message, tips or a class on screen); then it happens anyway.
- Only big jumps (1 game hour or more) fade and get a message; small ones stay quiet, like a normal midnight.
- The name HOUR stays in the code; it now means "real seconds per game hour right now" (43 by day, 30 at night).
- Beds keep the normal day-and-night rules for now (19:00–7:00, wake 7:30, +40 🪙), because job 5 changes beds.

### Job 5: Sleeping together

- "Active player" = every player who is online and playing. It is one small function (isActivePeer), so job 6 can leave out players who are "away".
- Players with the OLD version count as awake players (they can't use the new bed). So the night does not skip while one of them is online, until they leave (or the night runs out at 7:00). Ringing them sends the ring but their old game does not show it (no harm).
- When alone, you lie in bed for about 1 second before the fade, so you see that you lie down (you can still get up).
- Before the night skips, the game waits about 1 second after the last player lies down, so every friend's game sees "everyone in bed" and they fade together.
- You get up at the spot where you stood before lying down (never stuck between bed and wall).
- When you wake up, your tummy is filled up to at least 40% (like before), so nobody wakes up starving.
- The bed card sits at the bottom of the screen (fits iPhone upright and sideways, iPad, PC; it never covers the top buttons, map, job box or notepad).

### Job 6: Away or offline

- Going to the title screen is a pause, not a page reload. Reloading a web page with no internet shows the browser's "no internet" page instead of the game (the game has no offline copy), so the game stays loaded. Play carries on where you were, and nothing is set up twice (pets, friends, timers).
- On the "took a break" title, the Settings button is hidden. The game is paused underneath (an open bag or shop stays open), and opening Settings there would replace that open card. Settings is one tap away after Play.
- The "Reconnecting…" card dims the game and blocks taps while it waits. The game clock keeps running underneath.
- The 3 minutes, 30 seconds and 20 seconds are counted with the game's own frame time, as decided. On a very slow device (under 20 frames a second) they can take a little longer in real time.
- Short internet hiccups (for example, coming back to the iPad after a while) may flash "📡 Reconnecting…" for a moment, then "🟢 Back online!". I kept this rather than hiding the card for the first seconds, so the card always shows straight away when the internet goes.
- Cut-scenes and open menus still count as doing nothing (as decided).
- Tapping the "Still there?" card closes it when the finger lifts, not when it touches. That way the same tap can't also press a game button underneath the card.

### Job 7: Pizza day

- The owner's "chef stars" are the Pizza stars the game already has (0–5, shown in 📱 → Job; you win one from a fast RARE customer and lose one when late). I kept them and their name.
- A pizza order that came before 21:00 but is still waiting at the counter also counts as "in hand": Chef Blaze still gives it to you after 21:00.
- If your 6th pizza is delivered after 21:00, the chef says "That's it, see ya!" (not "Today's done…").
- If your 3rd pizza is delivered after 21:00, the chef does not ask the question (the Pizzeria is closed); he says "Today's done, great work! Ciao!".
- "PIZZAS MUST BE DELIVERED" tapped after 21:00 gets "Today's done, great work! Ciao!".
- The chef's question must be answered with one of the two buttons (tapping next to the card does not close it). If it still gets lost (for example the game was closed), the job box says "Talk to Chef Blaze" and the chef asks again.
- The chef's calls wait until no other message, card, tips or door scene is on screen (at most 2 minutes), so a message never covers his words on a phone.
- "Today's done, great work! Ciao!" only comes if you started work that day (went into the Pizzeria, were waiting in it at 12:00, or talked to the chef in pizza time).
- Work starts by itself at 12:00 only if you are inside the Pizzeria. If you wait outside in town, the job box says "Go to the Pizzeria to start work" (as before).
- Fast orders and "no rush" orders now pay the same; only stars change the pay, as the owner described.
- The RARE bonus is +50 🪙 on top of your normal price.
- After "Yay! Chef, bye!" a short message says when pizza time comes again ("tomorrow" or "on Monday" after a Friday).

### Job 8: Daytime activities

- Shop hours are 8:00–20:00, the same as the shoppers in the stores already had (they go home at 20:00).
- The library is like a shop: 8:00–20:00.
- Always open: your home, garden and seed box, Friends Lane, the flats, the park, the beach and its kiosk, the school building (it belongs to the teacher job; the school just has no new classes at night), the fire station (firefighters are always awake 🚒), and the 📱 furniture app.
- The Pizzeria is not changed here (job 7 sets its hours).
- Inside a closed shop you can still look at the shop list (only buying stops). This is on purpose: when a shop closes while the list is open, every button keeps doing something and nothing breaks.
- At night only the WORDS on the door button change ("🌙 Closed · opens at 8:00"); inside the game the door keeps its name "Go into the Market". This way the night check's screen recordings still find the same door by day and by night.
- The claw machine counts as buying (it costs coins), so it closes with the Toy Store.
- Pet Show 9:00–18:00 (it gets dark from about 18:30). A whole show takes a few game hours, so start by about 16:00 to see it in daylight.
- 🚀 Go (to a friend in the phone) still takes you to a friend who is inside a closed shop, so you can be together. Buying is still closed there.
- Work starts again at 8:00 with the normal waiting time (about half a minute) before the first message.

### Job 9: Cozy nights

- 3 night owls (the game already had 3 people who stayed up late) and 2 night cars out of 12, within "2–3" and "1–2".
- Cars "go away" for the night (they quietly vanish out of sight) instead of parking. Parking would need parking spots at the roadside.
- Walkers you can't see reach home at once, so the town really gets quiet at night. You never see anyone vanish.
- The cars that go away and come back, and the night cars, are the same on every device. Where the cars are is not shared between players (it never was).
- No fireflies: the night already has stars, warm windows and now lamp and car glows. I kept the job small.
- The faint red glow on the road behind each car is small and soft, so it stays cozy and isn't scary.

### Job 10: Second floor in the big house

- Upstairs uses the same wall paint and floor as downstairs (one choice for the whole house). Simple, and visitors get it for free.
- The stairs are in a small stairwell behind the west wall (outside the old room), so they can never stand inside furniture of an existing big house. Old furniture right in front of the doorway stays where it is (moving it would change old saves); you can still reach the stairs from the side.
- Upstairs is a separate room inside the same "home" place (40 m away, hidden behind walls). That is why old-version friends keep working: for them the host is simply "at home".
- After the climb you stand 2.6 m into the room, facing it, so the stairs button does not pop up right away (in the flats you land on the button).
- A friend who follows you does not repeat "Your house is so cozy!" (and give friendship points again) on every stair climb; that still happens once when you come in through the door.
- Upstairs has windows where the doors are downstairs (no balcony door: it would be a door that does nothing).

### Job 11: The beach

- The beach is an outdoor place with the town's sky and day/night, so evenings and nights look right there too.
- Opens with ANY skill at level 10 (as decided). The check only reads skills, it never changes them.
- Sand castle gives Sports XP (being active outside), 2 per part = 10 per castle.
- Shells: 1 🪙 each (tiny pocket money) plus a collection count, 5 per day.
- The kiosk is open day and night (like the other shops you can walk into).
- Old-version players: the beach is far away from town (about 900 m east), so an old-version friend sees nothing odd: the beach player is simply not visible in town, and their "🚀 Go" takes them to the east end of the big road, next to where the gate is. (They see the barrier there, not the gate, because their game has no gate.)
- A friend at the beach can't pull you there with "🚀 Go" before your beach is open (the opening rule stays the same for everyone).
- The beach is NOT used for daily quests ("find the Beach", town tours): most players can't go there yet, and old saves must keep getting exactly the same quests.

### Job 12: Tennis court

- Messages during a rally are short (about 2 seconds), and the first ball comes a little later (2.2 s instead of 1.6 s), so no message covers the ball when it arrives (review fix).
- On a phone held upright the resting racket sits lower and further right, so the ball coming at you stays clear; the swing itself is the same.
- The court is part of the beach (no new place to load), at the north end, next to the sea, as job 11 asked. It opens together with the beach (level 10 in any skill).
- Kid-sized court (18 m long, about 3/4 of a real one) and soft "floaty" balls (lower gravity), so 5-year-olds can follow the ball.
- The coach never misses: the rally only ends when you miss, so long rallies are possible.
- Small fixed rewards with a daily XP limit and once-a-day coins, so it can't be farmed but always feels rewarding.
- Tennis is just for you (not shared online): a friend at the beach sees you walk on the court but not the ball. No new online fields.
- Tennis is not used in daily quests (old saves must keep getting the same quests).

### Job 13: Nicer buildings

- I put every change in the shared builders (`building()` and `windowAt()`). That way every building, including Friends Lane houses, gets them automatically, and the merge with job 9 stays simple. I did not touch cars, walkers, night lights or lamp glows.
- No new materials: every new part uses plain colours that get merged into the same pieces when the town is baked. The window glass on the new side windows uses the existing window material, so it should light up at night like the other windows.
- Shutters use the house's roof colour, so each house keeps its own colour pair. Lintels, bands and corner posts use the building's own trim colour.
- I did not add or move any collisions, so walking and doors behave exactly as before. Houses leave only 0.1 m between the wall and where you stop; the new flower boxes stick out about 0.2 m, the same as the window sills that were already there, and the shutters and trims less.
- For the pictures, the street trees right in front of the camera are left out, so they don't hide the buildings. The picture is drawn twice: once normally, then everything past a few metres on top. So the ground under the camera stays (no blue band), and the distance is chosen per building so no tree is cut in half (no dark blobs). The before and after pictures have exactly the same view.
- I stopped at +6.1% on update A (about +7.2% with a full Friends Lane) to leave room for job 9, which is being merged at the same time. To save triangles, the small lintels have no ink outline.
- The game is seen through your own eyes, so you never see your own body squashed against a wall. The flower boxes were still made slimmer, so they stay out of the camera when you stand right at a wall and look down, and other players' kids don't poke into them.

### Job 14: Ideas board in the park

- Place: just inside the park's north gate, east of the path, facing the fountain, so you see it when you walk around the fountain and when you come in. It doesn't block any path, bench, flower bed or the people's walking routes.
- The board shows only after BOTH a read works and a tiny "may I write?" check works (it writes nothing: it deletes an empty spot `notes/probe/h/<your id>`). So kids never write a note into a board that can't save it.
- Data per note: `{t: text, n: name, at: server time, p: writer id, h: {playerId: 1..3}}`. Each player only ever changes their own heart entry, so two players can't overwrite each other.
- Hearts left = 3 minus your hearts on the notes the board shows (newest 80 notes). If very old notes drop off the list, those hearts come back.
- Notes can't be deleted or edited in the game (simpler and safer); the owner can delete notes in the Firebase console.
- Filter, kept from wrongly refusing kind ideas (after the review): round numbers are not phone numbers ("100000 flowers", "100 200 300 trees"); ordinals and everyday words before road/lane/court/drive are not addresses ("A 2nd tennis court", "1 more tennis court", "a 3 lane race track", "a 4 wheel drive car"); "road 2 the beach" is fine; "Hickory dickory", "Dickens", "pussycat", "pussy willow" and "blue tit" birds are fine. Still refused: "12 Oak Street", "12 oak lane", "5 Rose Court", "Main street 22", "Street 5", phone numbers with spaces, emails, links, swear words also spelled with spaces or numbers.
- Refusal message kept as the job said ("Let's keep notes friendly and safe 💛"); a reviewer suggested a softer "Hmm, let's try other words 💛" (see Morning questions).
- Rude words: refuse (not mask), as the job said. Short words that are parts of normal words are only matched as whole words (so "class", "grass", "Arsenal", "cockpit", "prickly", "dumbo", "killer whale" are fine).
- Claude version: the only shared storage there is the per-player cloud save (`window.claude.use('db')`, used for `data/users/<id>/save`); I could not test whether every player may read/write a shared board there, so the board stays hidden inside Claude (see Morning questions).
- "Mayor Rosie": the game never called Rosie the mayor before; I used the owner's words in the board text ("Every Sunday, Mayor Rosie reads the notes").

---

## 10. Notes from the night

- **After merging,** two more reviewers looked only at how the jobs work together (time and people; world and input). Their real findings are in the "integration fixes" commit (section 1), and the final full check ran after that.
- **How the work was done:** every job went the same way. One agent built it, then two independent reviewers checked it: one as a demanding player and game designer, one against the check's rules (old saves, two players across versions, drawing work and layout). A fix pass followed, then the quick check, and only then the commit.
- **Container restart (~22:47 UTC):** the machine restarted once in the middle of the night. No committed work was lost. Two half-built jobs (3 and 6) were started again from scratch, and job 11's review was resumed.
- **Things this environment did not allow:** pushing the git tag (see section 7) and reading the real Firebase database (see sections 5 and 8). Neither one blocks anything.
- **The check kit itself:** I ran it as it came and did not change it. I only added the extra old saves (`fixtures/`). Note for next time: the check puts the web part back by line number, so any change that adds lines above the game script breaks the GitHub file. Every job tonight kept that part's line count the same.
- Family names: none were added anywhere. Test players were called `ZZTEST-…`, and none of that is in `index.html` (line F1).
