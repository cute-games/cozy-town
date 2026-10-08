# Job 8: Daytime activities

## Changes
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

## Decisions
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

## Morning questions
- Pet Show 9:00–18:00 is about 6½ real minutes every Saturday, and a Saturday comes every 1¾ hours of play. Is that too short for kids? (Easy to widen, for example 8:00–20:00 like the shops.)
- Should the beach kiosk (🍧 cold treats) also close at 20:00? I left it open.
- Brand-new player who joins friends at night: the "Buy food at the market" task has to wait until 8:00. OK?

## Not verified
- Real iPad/iPhone feel and sounds (only test browsers).
- How it merges with job 7 (pizza hours) and job 6 (away/offline): I kept my changes out of the pizza code.
- Real Firebase / two real devices (nothing online was changed).

## Glitches not fixed
- The buildings themselves show nothing at night (the windows stay lit, no "closed" sign on the door); only the button by the door says "Closed" and turns 🌙. A 3D sign would add drawing work to the town.
- Old: when you load a game, today's litter and quests refresh (the same as before this job).

## Try it for real
- Walk to the Market after 20:00: the button shows 🌙 and says "Closed · opens at 8:00"; tap it and you stay outside.
- In the Toy Store after 20:00 open the claw machine: it says closed, and tapping Play costs nothing.
- Be inside the Bakery at 19:58 and wait: Mrs. Crumb says it's closing time; buying stops, the door still lets you out.
- Take the designer job in the evening: the job box says "🌙 Work starts at 8:00 ☀️"; a client messages after 8:00.
- On a Saturday at 8:30 go to the Pet Show stage: "starts at 9:00", no judges yet. Come back after 9:00 and enter.
- Open 📅 Calendar: it says the Pet Show is Saturday, 9:00 to 18:00.

## Tests run
- After the reviews (fix round): syntax check ok; agent-tests/job8-fix1/t_fix.py on iPhone upright (dark) and iPad sideways (light), rich save: 18 of 18 PASS on both, 0 console errors (night door words "🌙 Closed · opens at 8:00" and you stay outside, the door is still found by its old name; by day the words are "Go into the Market" and you go in; claw machine at night shows the closed note and Play/Play again take no coins; by day Play costs 5 🪙; Ms. Page closed/day lines; Pet Show panel opened at 17:58 keeps the stage after 18:00, closing it removes the stage, picking a pet after 18:00 starts and finishes the show). Night check crawler (depth 2) in the Toy Store, Library and town from 19:36 to 23:43: 115 taps, 0 dead, 0 unreachable, 0 stuck, 0 covered, 0 errors. Everything above the game script is unchanged.
- Syntax check (jscheck): ok.
- Feature test on iPad and iPhone upright (rich save, real taps on doors): Market, Library, Clothes Shop go in at 15:30 and stay closed at 21:00 with the 🌙 icon and the message; all 9 shop doors know their hours; school, fire station and Pizzeria still open at 23:00; night shop list shows "Closed now", buying food, "New in!", clothes, hats, adopting and library books all say closed and cost nothing; by day buying and books work; closing time inside the Bakery (shopkeeper message, panel stays, buying stops, you can walk out); designer and teacher get no new work at 21:00/22:00, the job box/phone/Mrs. Maple say "Work starts at 8:00", work comes right after 8:00, an order started by day still shows at night; Pet Show Saturday at 8:30 / 9:00 / 17:54 / 18:00 (label, message, judges on stage, day label), Calendar hours, a running show keeps its judges after 18:00: all PASS, 0 console errors on both devices.
- The night check's own crawler (depth 2) in the Pet Shop, Clothes Shop, Library and Market from 19:36 to 00:32, so closing time happened in the middle: 177 taps, 0 dead, 0 unreachable, 0 stuck, 0 covered, 0 errors.
- New player's opening on iPhone upright: finishes at 8:00 on day 1, the Market door goes in by day, 0 errors.
- Old save (first version) and rich save load, 0 errors; fields that change on load are the same as without this job (old: messages; rich: litter, quests). This job adds no save fields.
- Screenshots looked at: night door button (iPad), closed Market list (iPhone upright), closing time in the Bakery (iPad), night job box and designer card (iPhone upright, light and dark).
