# Job 11: The beach (first new place)

Only `index.html` changed (main game script). The web part and everything above `'use strict';` are untouched (same 546 lines).
One new optional save field: `beach` = {seen, d, got, n} (first-time message shown, today's shells, shells collected). It only appears once the beach is open or visited. Nothing new is sent online (the place name "beach" goes in the existing `loc` field).

## Changes
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

## Decisions
- The beach is an outdoor place with the town's sky and day/night, so evenings and nights look right there too.
- Opens with ANY skill at level 10 (as decided). The check only reads skills, it never changes them.
- Sand castle gives Sports XP (being active outside), 2 per part = 10 per castle.
- Shells: 1 🪙 each (tiny pocket money) plus a collection count, 5 per day.
- The kiosk is open day and night (like the other shops you can walk into).
- Old-version players: the beach is far away from town (about 900 m east), so an old-version friend sees nothing odd: the beach player is simply not visible in town, and their "🚀 Go" takes them to the east end of the big road, next to where the gate is. (They see the barrier there, not the gate, because their game has no gate.)
- A friend at the beach can't pull you there with "🚀 Go" before your beach is open (the opening rule stays the same for everyone).
- The beach is NOT used for daily quests ("find the Beach", town tours): most players can't go there yet, and old saves must keep getting exactly the same quests.

## Morning questions
- Should a friend be able to bring you to the beach with "🚀 Go" before your own beach is open? (Now: no, a kind message instead.)
- Would you like the sand castle to be saved (still there next time), or shared so two friends can build one together?
- Should shells be kept as a visible collection somewhere (a shelf at home, or a page in the phone)? Now it is just a number.
- Should the kiosk close at night?

## Not verified
- Real iPad/iPhone feel and speed (the beach is light: 85 pieces, about 45,000 triangles; town grew by 1 piece and 0.6% triangles).
- Real Firebase with real devices (tested with the pretend server: new + new, new + old version).
- Sounds (reused: door, pop, coin, yay).
- How the shimmering sea looks on a real iPad screen.

## Glitches not fixed
- In town the hills, trees and clouds are placed by chance on every start, so the town scenery's triangle count goes up and down by up to ~12% between two starts of the SAME game (not caused by the beach; the beach did not touch that scenery). A single-start weight check can wrongly flag it.
- An old-version friend who taps "🚀 Go" to someone at the beach gets "🚀 You are with …!" but sees nobody (they land at the east end of the big road). Their game cannot know the beach.
- Right in front of the town gate (on an iPhone held upright) the big sign is above the top of the screen; the button now appears a few steps earlier, where the sign is still visible.
- Clouds at the beach sometimes pass high overhead and look big (same as in town).

## Try it for real
- With a skill at level 10: after loading, wait a few seconds: "🏖️ The beach is open!". Follow it: 📱 → 🗺️ Map → 🏖️ Beach, walk to the gate and tap "🏖️ Go to the beach".
- Without a level-10 skill: tap the gate: the card shows your best skill and how many levels are left.
- At the beach: build the sand castle with quick taps (5 parts), then tap once more to start a new one. Does fast tapping feel right?
- Find and pick up the 5 shells. Come back the next day: 5 new shells.
- Buy a coconut drink at the kiosk and drink it from your bag. Sit on the bench. Walk out on the pier and "Look out to sea".
- Visit the beach in the evening and at night: sunset colors, stars, glowing lanterns, a dark blue sea.

## Tests run
Review fix round (agent-tests/job11-fix1, final file md5 ce39e58dbec5e1ad4441860ab41f1bdd, syntax ok, no ZZTEST, lines above the game script unchanged): t1_fix.py 18/18 PASS (iPhone portrait dark rich save + iPad old save: new open toast; gate button shows ~5 m away and stays up to the gate, not 6.4 m away; nav at the beach says "go back to town first"; closed-beach nav gives the soft message, no cheer; quick castle taps 0.3 s apart all count; sea glow .28 by day -> .056 at night; can't walk past the town edge with the barrier gone; 0 console errors). t2_weight.py: town 386 pieces / 589,700 triangles (pre-night 385 / 586,110: +0.6%), beach 85 / 44,798. Re-runs of the first round's tests on the final file: t1_feature 22/22 PASS, t2_compat 10/10 PASS. Screenshots looked at: gate from 5 m (iPhone portrait), sand path through the gate, beach at night.
First round:
Final file md5 20b99715befeb9fc5cf91fa6d89f85cb (t1, t3 and t4 ran on it; t2 ran just before the last tiny fix: dark text on the closed-gate card, checked again by t4). Syntax check (jscheck): ok. No ZZTEST in the file. Scripts and outputs: agent-tests/job11/ (t1_feature.py, t2_compat.py, t3_two.py, t4_dark.py). 0 console errors in every test.
- Review fix during testing: the closed-gate card's skill box had light-pink text on white in dark mode -> dark text on both themes (t4: iPhone portrait dark screenshot looked at, layout audit clean).
- t1 feature, iPad + rich save, 22/22 PASS: first-time "beach is open" toast; town gate target; real tap -> beach (town hills hidden, sky on); castle grows 1-5 and resets, Sports XP goes up; pick a shell (+1 🪙, count 1); all 5 shells -> "tomorrow" message; next day 5 new shells; kiosk real taps: buy a coconut drink (-5 🪙), eat it; bench sit facing the sea; walk out on the pier; pier end message; can't walk into the sea; save made at the beach remembers it; real tap on "To town" -> back at the town gate; map lists the Beach and shows the way; reload of the beach save on iPhone portrait dark starts at the beach.
- t2 compatibility, 10/10 PASS: old + rich saves load in the pre-job game and the new game with 0 differences, same save key (the first run found that adding the beach to the map changed the daily quests of a reloaded rich save; fixed by keeping the beach out of quests); scenery weight: no area over the limit (town 344 -> 345 pieces, 584,042 -> 587,702 triangles); old save on iPhone: beach closed, no new save field, locked gate label and card (real taps), "Go" to a friend at the beach gives the kind message; a new player's opening on iPhone portrait finishes, beach closed, no save field.
- t3 two players, 8/8 PASS: new player at the beach + OLD-version player (pre-night game, PC): the old game shows the beach player far away (not near town) and its "Go" lands at the east end of the big road; new player in town: friend listed "At the Beach" and not drawn in town; "Go" takes them to the beach and both see each other.
- Screenshots looked at: town gate, beach arrival, beach view (day), castle finished, kiosk card (iPad light, iPhone dark), bench, pier end, beach at night, closed-gate card (iPhone light + dark), two players at the beach (iPhone dark), old-version player after "Go".
