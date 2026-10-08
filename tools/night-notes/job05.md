# Job 5: Sleeping together

Only `index.html` changed (main game script, about 40 lines, plus a few CSS rules added to the end of an existing CSS line, so no lines were added above the game script). No save changes, no new drawings, web part untouched.

## Changes
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

## Decisions
- "Active player" = every player who is online and playing. It is one small function (isActivePeer), so job 6 can leave out players who are "away".
- Players with the OLD version count as awake players (they can't use the new bed). So the night does not skip while one of them is online, until they leave (or the night runs out at 7:00). Ringing them sends the ring but their old game does not show it (no harm).
- When alone, you lie in bed for about 1 second before the fade, so you see that you lie down (you can still get up).
- Before the night skips, the game waits about 1 second after the last player lies down, so every friend's game sees "everyone in bed" and they fade together.
- You get up at the spot where you stood before lying down (never stuck between bed and wall).
- When you wake up, your tummy is filled up to at least 40% (like before), so nobody wakes up starving.
- The bed card sits at the bottom of the screen (fits iPhone upright and sideways, iPad, PC; it never covers the top buttons, map, job box or notepad).

## Morning questions
- Old-version players count as awake, so they block the night skip until they update or leave (as planned). OK?
- Without the +40 🪙 pocket money, kids earn coins only from jobs, quests and the Pet Show. OK?
- A friend who is visiting your house at night is counted too: you can only skip the night when they are in their own bed (beds work only in your own house). OK, or should a visitor not count?
- The ring limit is 1 minute per friend. Is 1 minute right?

## Not verified
- Real Firebase: whether the real database rules accept the two new small online fields (zz, rg). The tests use a pretend server. If the rules allow only a fixed list of fields, playing together may break: please check once with two real devices.
- Sound of the ring and the feel of lying in bed on real devices. Phones that can't buzz (iPhone Safari) just don't buzz.
- The Claude version's real room (only the test room was used).

## Glitches not fixed
- When you visit a friend who is in bed, you see your friend standing in their bed (other players never sit or lie down in your view; same as sitting on a sofa before).
- If the only friend still up has the OLD version, ringing says "🔔 Ring ring! Your friends' phones are ringing 📱" to the caller, but the old game shows nothing (see the morning question about old versions).
- The 🛋️ decorate button still shows while you lie in bed. Tapping it gets you out of bed (no "Get up" message) and you stand next to the bed.

## Try it for real
- Tap your bed at noon: "Not sleepy yet, beds work from 21:00 🌙".
- Alone at 22:00: tap your bed: you lie down, then it fades and it is 7:00 next morning, coins unchanged.
- Two devices online at 22:00: one goes to bed: the card says "😴 1 of 2 in bed". Tap "🔔 Ring the others": the other device's 📱 wiggles and rings and says "Friends want to skip the night, waiting on you!".
- Tap "🔔 Ring the others" again right away: "Friend is busy doing something. We can't sleep! 😢 Let's stay up ALL NIGHT! 🤪".
- The second device goes to bed too: both fade and wake at 7:00 on the same day.
- In bed with the card showing, tap "🧍 Get up": you stand next to your bed and the card is gone.
- Lie in bed and close the game (or put the iPad away), then open it again: you stand next to your bed, not stuck behind it.

## Tests run
- Syntax check (jscheck): ok.
- One player (iPad, rich save; real taps on the action button): bed at 15:30, 20:59, 7:00 and 12:00 says "Not sleepy yet…"; 21:00 you lie down (camera low, button "Get up"); alone -> next day 7:00, coins unchanged, standing where you were, newDay once, "Good morning! It's Saturday, day 13 ☀️"; 3:00 -> same day 7:00, quests kept, no extra new day; 23:59 -> next day 7:00 with one new day; "Get up" button and walking (W key) get you out and the night is not skipped; 6:59 in bed -> good morning at 7:00; bunk bed and big-house bed work the same: all PASS, layout audit clean, 0 errors. Screenshots checked.
- Two new-version players (iPad + iPhone upright), GitHub version (pretend Firebase) and Claude version (pretend room): card "😴 1 of 2 in bed", the other player sees "in bed", no skip while one is up; ring: caller told, receiver gets the exact message once, 📱 wiggles; second tap: exact busy message, nothing sent; a new ring within a minute is ignored by the receiver; "Get up" on iPad and iPhone; both in bed: "2 of 2", then both wake at 7:00 on the same new day (new day once each, no "Same time" message); friend goes offline while you wait -> the night skips: all PASS in both versions, 0 errors. Screenshots checked (light and dark).
- Old-version player (live game) + new-version player (iPhone sideways): new one in bed shows "1 of 2", no skip; ringing the old one: no errors; when the old one leaves, the night skips: PASS, 0 errors.
- Brand-new player's opening (iPad + iPhone upright): PASS; the new player's bed at 23:00 -> day 2, 7:00, coins unchanged: PASS, 0 errors.
- Old saves (kit's B1: 5 saves incl. the very first version and the rich save): 0 differences, same save key: PASS.
- Kit's D1–D3 (old + new player: see each other, walk, chat, Friends Lane, knock -> let in -> inside): PASS, 0 errors (with saves whose pizza tips were already seen, like the night check's fresh save; with the unseen tips the tips cover the chat button in both versions).
- Bed card layout with a job box (pizza, designer, teacher) on iPhone sideways, iPhone upright and PC, light + dark: layout audit clean, 0 errors.
- Night check stages on the final file (runcheck job5-check): F1, F3a, F5, web part round trip identical, A3 (667 things before and after), E1 (drawing work unchanged), B1 (6 old saves, 0 differences), B2, D1–D3 (old + new player), C7 (Claude version), K1 (PC keys): all PASS. HUD crawl on iPad: 145 taps, nothing dead, stuck or covered, 0 errors, layout clean. Home + shops crawl (inA) on iPad: 201 taps, the bed says "Not sleepy yet, beds work from 21:00 🌙" in the morning, 0 errors, layout clean; it once listed the walking market shopper's "Say hi" as unreachable (the shopper walked off). A direct check in the job 4 file and the new file (18 tries each, the crawler's way) reached the shopper every time. Shoppers were not changed. (A2 "backup" is only given in the full night check.)
- After the review (agent-tests/job5-fix1): syntax ok. f1.py (iPad, rich save): in bed -> tap 🛋️: out of bed at the spot you stood (not inside the bed), decorate on/off, night not skipped; save while in bed -> the save has the spot beside the bed; reload -> beside the bed, not inside anything; alone skip -> day 13, 7:00: all PASS, 0 errors. Re-ran t1_bed (one player, iPad): all PASS, 0 errors. Re-ran t2_together for the GitHub version and the Claude version (two players, ring, busy message, 2 of 2 skip, friend leaves): all PASS, 0 errors. Lines above the game script unchanged.
