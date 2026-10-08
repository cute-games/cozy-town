# Job 7: Pizza day

Only `index.html` changed (main game script, about 57 lines; nothing above the game script, no web part, no new drawings, nothing new sent online).

## Changes
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

### How the pay numbers were found
- Teacher: at most 2 classes a day; a class pays 30 + 15 per star (1 to 3 stars) = 45, 60 or 75 🪙. A day: 90 🪙 (worst), 120–150 🪙 (normal).
- Interior designer: at most 3 rooms a day; a room pays 30 / 100 / 150 / 200 🪙 by stars. A good day: 450–600 🪙, best 600 🪙. (While the decorating skill is still going up, each room also gives a level-up bonus; that stops at level 10.)
- Pizza, 3 pizzas a day: 0 ⭐ = 75 🪙, which is less than even the teacher's worst day (90). 5 ⭐ = 630 🪙 = the designer's best day + 5%; with the usual RARE bonus (about 0.6 RARE customers in 3 orders × 50 🪙 = +30) a 5-star day is about 660 🪙 = +10%. In between the steps are even (75, 180, 300, 405, 525, 630 a day).
- With the 3 extra pizzas: up to 6 × the price (at 5 ⭐: 1260 🪙 a day).
- Old pizza day for comparison: 0 ⭐ about 200 🪙 (5 pizzas), 5 ⭐ about 500 🪙 plus RARE money (10 pizzas).

## Decisions
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

## Morning questions
- A brand-new player starts on Monday, day 1, at 8:00, so the pizza job is closed for the first 4 game hours (about 3 real minutes). Is that OK, or should a brand-new player's very first shift start right away?
- Pay goes from 25 🪙 (0 ⭐) to 210 🪙 (5 ⭐) per pizza: a big range, and a 5-star kid who insists on 6 pizzas earns 1260 🪙 a day, twice a designer's best day. Is that what you want for "the 3 extra pizzas are on top"?
- The teacher earns much less than the designer (90–150 vs. up to 600 🪙 a day). Should the teacher's pay go up some day?
- Should fast (2-minute) orders pay a bit more again than "no rush" ones?

## Not verified
- Feel and sound on a real iPad, iPhone and PC (the chef's phone calls, the timing of the 21:00 message).
- Two players doing pizza together (not part of tonight).

## Glitches not fixed
- An order you never pick up or deliver stays until you do, even over night and over the weekend (as before). It then counts for the new day.
- A "no rush" order lasts 30 real minutes, so it can be delivered long after 21:00, even after midnight (allowed as "the pizza in hand"); after midnight there is no "Ciao" message.
- The test "rich" save gets new daily quests and litter when loaded (it was made on day 1 and set to day 12). Same in the version before this job; not related to pizza.

## Try it for real
- On a weekday after 12:00, go to the Pizzeria and deliver 3 pizzas: Chef Blaze calls "Right! That's enough. Chill for today!". Tap "Yay! Chef, bye!": no more orders today and the job box says "😎 Done for today!".
- Another weekday: after 3 pizzas tap "PIZZAS MUST BE DELIVERED": the chef says "You absolute maniac! …"; deliver 3 more; after the 6th he says "That's it, see ya!".
- On a weekday go into the Pizzeria before 12:00 (Chef Blaze: "Too early!") and wait by the counter: at 12:00 he says "Pizza time! Welcome to work!" and an order comes soon.
- Start work at about 20:45 and take an order: at 21:00 you can still deliver it and get paid, then "Today's done, great work! Ciao!".
- On Saturday, Sunday or before 12:00 talk to Chef Blaze: he says it's closed and "Pizza time is 12:00–21:00, Monday to Friday 🍕"; "🛒 Buy food" still works.
- Open 📱 → Job: see pizza time and "… 🪙 for every pizza". Win a star from a fast ⭐ RARE customer and see the price go up.

## Tests run
- Syntax check (jscheck): ok.
- Pizza day test with the rich save on iPad (sideways) and iPhone (upright), 63 checks each, all PASS, 0 console errors, layout audit clean (screenshots light and dark checked): pizza time Friday 11:59 closed, 12:00 open, 20:59 open, 21:00 closed; Saturday and Sunday closed; Monday 15:00 open, 7:30 and 23:30 closed; the chef's closed lines with the exact hours; no orders outside pizza time even with a shift on; going in starts the shift; a full 3 + 3 day with the exact chef texts and button texts (real taps on the buttons), the question card can't be closed by tapping next to it, 📱 header away from the Pizzeria, no order while the question is open, 6 at most, no 7th order, "That's it, see ya!" again later; "Yay! Chef, bye!" path (no more orders, chef's "chill" line); 21:00 with a pizza in hand (paid normally, then "Ciao" once); 21:00 while waiting ("Ciao" once); 3rd pizza after 21:00 ("Ciao", no question); pay table; 5 ⭐ = 210; late = 105; RARE on time at 2 ⭐ = 150 and a new star; RARE late at 3 ⭐ = 68 and a lost star; an old order keeps its old price (45); 📱 Job card; the clock never went back and never jumped (largest step 0.0023 game hours per frame) through all of it.
- Fix after review (waiting in the Pizzeria at 12:00), iPhone upright light and iPad sideways dark, 15 checks each, all PASS, 0 console errors: in the Pizzeria at 11:54 no work; at 12:03 work starts with the chef's welcome card and the job box "Waiting for an order… (0/3)"; an order comes; no second welcome; waiting in town at 12:00 does not start work; going in at 14:00 gives one welcome only; Saturday at 12:00 in the Pizzeria: nothing; a "done for today" day: nothing; with the chef's "Too early!" card still open at 12:00 the welcome waits until it is closed. Screenshots checked. The full pizza day test (63 checks, iPhone and iPad) and the new player opening test were run again after the fix: all PASS, 0 errors.
- Old save (first game version) on iPad: all old fields kept with the same values (0 differences), the job box says pizza time on day 1 at 8:xx, an order and a delivery at 13:00 paid 25 🪙: PASS, 0 errors.
- Rich save on iPhone upright: order and delivery paid by stars: PASS, 0 errors. Load comparison: the same 13 quest/litter differences as the version before this job (from the save itself); the pizza part of the save is unchanged.
- New player opening on iPhone upright: the opening finishes, the pizza job picked in Rosie's chat (real taps), the pizza tips start in town and the last tip shows the hours, the job box on day 1 at 8:10 shows pizza time, at 12:00 "Go to the Pizzeria to start work": PASS, 0 errors. Screenshots checked.
