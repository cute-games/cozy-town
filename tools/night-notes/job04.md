# Job 4: One clock for everyone

## Changes
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

## Decisions
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

## Morning questions
- If two friends' saves are on very different days, the one behind jumps forward the moment they meet online (for example from day 3 to day 40). Days never go back. Is that OK?
- The one big world is open to everyone who opens the page: one save with a huge day number (or a cheater's made-up clock) pulls every online player's day number up for good (at most to day 99,999). The screen copes with big numbers now. Should we ignore friends who are very far ahead (for example more than 30 days)? Then those friends would not share the same time.
- When one player sleeps while friends are online, their clock jumps to the next morning and pulls everyone online into the morning too (beds work from 19:00, so the night rarely lasts its 5 minutes). Job 5 ("night skips only when everyone is in bed") is planned to change this; if job 5 is undone, this stays. Until then, OK?
- A brand-new player who joins while friends are in the night: welcome, walking tip and job tips are in the morning, then the screen fades to night. Rosie then goes home to bed (so "Come find me at the park!" has to wait for the morning), and the Pizzeria is closed until 8:00 (the job box and Chef Blaze say so). OK, or should a brand-new player keep their own morning for their first minutes?
- Daytime hunger is now about 30% slower in real time (it follows game hours). Would you rather keep hunger at the old real-time speed?

## Not verified
- Real Firebase: whether the real database rules accept the new small online field (the clock). The test copies use a pretend server. If the real rules only allow a fixed list of fields, new-version players might not show up online: please check once with two real devices.
- How the longer day feels on real devices (iPad, iPhone, PC), and sound.
- How the fade for big jumps feels on a real device.
- The centered job box needs a 2024 browser (iPadOS/iOS 17.4 or newer). On an older iPad the box is still 44 px, only the text sits a little higher.
- A very slow device (under 20 frames per second) has a slower game clock; it will catch up with friends in small jumps of a few game minutes. Not tried on a real slow iPad.
- The Claude version's real room (only the test room was used).

## Glitches not fixed
- Now that everyone has night: friends and shop helpers go home in the evening, and the Pizzeria is closed from 20:00 to 8:00 (both were already like this with "day & night"). A brand-new player who joins friends at night finishes the welcome and tips, then Rosie goes to bed. Jobs 7 and 8 set the opening hours for jobs and shops.
- Teacher and designer orders still come at night (job 8 will keep them to the daytime).
- On a Pet Show Saturday, right after a new day with quest money still to collect: "📱 You got 30 🪙 from yesterday's quests!" shows only half a second before the Pet Show message replaces it. Old: the same happens at a normal Saturday midnight.
- The phone's home screen shows the time from when you opened it; after a clock jump it shows the old time until you open it again. Old (it never ticks while open).

## Try it for real
- Watch the clock: 7:00 → 21:00 takes about 10 minutes, and 21:00 → 7:00 about 5 minutes.
- Open ⚙️ Settings: the "Always day" button is gone, and night comes.
- Two devices, one save on a later day: when the second one comes online, "👋 … is here!" stays readable, then the screen fades and "🕰️ Same time as your friends: …" shows. Both now show the same day and time.
- Play together for 10 minutes: both clocks keep showing the same time.
- Try your bed at noon ("not sleepy yet, come back in the evening"), then at 22:00 (you wake up the next day at 7:30; a friend online is pulled into the morning too, with a fade).
- Start a brand-new game on a new device while a friend plays in the evening: Rosie's welcome, the walking tip and the job tips are in the morning; after them, a fade to your friend's time.

## Tests run
- Syntax check (jscheck): ok.
- One player (rich save, iPad): no "Always day" button (real tap on ⚙️), an old stored "Always day" is ignored, day speed 10 s = 0.233 game hours, night speed 10 s = 0.333 game hours, a full day 7:00→21:00 = 600.05 s, a full night 21:00→7:00 = 300.05 s with one new day, midnight gives a new day and new quests, hunger/pet happiness/tomato growth per game hour, bed at noon / 22:00 / 3:00, teacher greeting at 9, 14, 19:42 and 23:00, night HUD 🌙: all PASS, 0 errors. iPhone upright settings: PASS, 0 errors. Screenshots checked (settings light/dark, town at 23:00).
- Two new-version players, GitHub version (pretend Firebase) and Claude version (pretend room), after the review fixes: day-1 save jumps to day 12 (new day once, one fade, one message), 30-minute lead followed quietly, 1-minute difference ignored, 10-minute difference followed at once, small jump over midnight (new day once, quiet), jump of 7 days (new day once, one fade, one message), never backwards, the other catches up at the next clock message, 14 kinds of bad clock values ignored, standing still sends 3 messages per 10 s, a friend's bed at 22:00 pulls the other to 7:30 next day with one fade and one message: all PASS in both versions, 0 errors.
- Messages around a jump (both versions): a returning kid coming online a day behind sees "online" (3 s), then the clock message in full (3.4 s), then quest money and Pet Show; the clock message cut nothing; a friend's "👋 … is here!" stays its full 3.4 s and the fade comes after it; a 3-hour jump with the phone open fades and shows one message: all PASS, 0 errors.
- Brand-new player joins a friend on day 12 (iPhone upright at 10:00 and with the pizza job at 23:00, PC at 10:00): the walking tip stays its full 6 s, the pizza tips open in the morning and the clock waits until they are closed, then one fade, one message (full 3.4 s), new day once, day 12: all PASS, 0 errors. Screenshots checked.
- iPhone upright top row, live vs new, days 1, 12, 104 (Pet Show Saturday), 999, 1000, 9999, 99,999 with 50 and 3900 coins: live puts the 💬 button over the tummy bar on a Pet Show Saturday from day 100, and on other days with big day numbers (from day 999 with 50 coins, day 9999 with 3900 coins); new never, nothing off screen, normal look identical: PASS, 0 errors.
- Job box by day and at 22:30 on iPhone sideways, iPad, Android tablet, iPhone upright and PC, live (Day & night) vs new: night box 37 px -> 44 px with the text centered (iPhone upright stays 50 px), daytime boxes identical (270×58, 145×69), layout audit clean: PASS, 0 errors.
- Night check stages on this file (first round): B1 (6 old saves, 0 differences), B2, D1–D3 (old + new player), C7 (Claude version), K1 (PC keys), HUD crawl on iPad (145 taps, nothing dead, nothing stuck or covered, 0 errors), teacher job on iPad (3 classes, 34 goof taps, 0 missed), iPhone sideways (3 classes, 35 taps, 0 missed) and PC (3 classes, 34 taps, 0 missed), F1, F3a, F5, web part round trip identical: all PASS, 0 console errors.
- Night check stages on the final file (after the review fixes): F1, F5, web part round trip identical, B1 (6 old saves, 0 differences), B2, D1–D3 (old + new player: see each other, walk, chat, Friends Lane, knock → let in → inside), C7 (Claude version opening + online), K1 (PC keys), HUD crawl on iPad (145 taps, nothing dead, stuck or covered), teacher job on iPad (3 classes, 37 goof taps, 0 missed, 14 papers) and iPhone sideways (3 classes, 35 taps, 0 missed, 14 papers), iPhone upright and sideways tours (9 of 9 screens each): all PASS, 0 console errors. Layout: no cut-off, overlap, text overflow or contrast problems; the only small buttons are the teacher paper's "🔑 Answer key" / "🚪 Stop" (40 px) and the mixed round/square button looks, exactly as in the live game's baseline run. The live baseline also flagged the job box (37 px) for designer orders; that is gone now.
