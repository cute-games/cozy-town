# Job 8: Coins balance

Only `index.html` changed (the main game script; the web part and lines 1-498 are untouched). Nobody's coins change:
old saves keep every coin, everything already bought stays, and new prices only count for new buys.
Save: one new optional field inside a pizza order, `S.dl.o.x` (1 = one of the 3 extra pizzas, paid half); old versions
ignore it. Nothing new is sent online.

## Changes (item: old -> new)

### A day of work (the owner's main wish: even job pay, teacher up)
| Job | weak day | good day | best day |
|---|---|---|---|
| 📚 Teacher (2 classes) | 90 -> 150 | 120 -> 270 | 150 -> 390 |
| 🎨 Designer (3 rooms) | 300 -> 150 | 450 -> 270 | 600 -> 390 |
| 🍕 Pizza, 3 pizzas | 0 ⭐: 75 -> 120 | 3 ⭐: 405 -> 285 | 5 ⭐: 630 -> 390 + RARE bonus (about 415) |
| 🍕 Pizza, 6 pizzas ("maniac" day) | 0 ⭐: 150 -> 180 | 3 ⭐: 810 -> 429 | 5 ⭐: 1260 -> 585 + RARE bonus |

### Ways to GET coins
- 📚 Teacher, one class: 1 ⭐ 45 -> 75; 2 ⭐ 60 -> 135; 3 ⭐ 75 -> 195 (2 classes a day, as before).
- 🎨 Designer, one room: no ⭐ 30 -> 20; ½-1 ⭐ 100 -> 50; 1½-2 ⭐ 150 -> 90; 2½-3 ⭐ 200 -> 130 (3 rooms a day, as before).
- 🎨 Designer, the Decorating level-up you get with every room: +10 × the new level in coins, hidden (540 coins over the
  first 9 rooms) -> no coins (the level still goes up and "Decorating is now level 5! ⭐" still shows).
- 🍕 Pizza, one pizza by Pizza stars: 0 ⭐ 25 -> 40; 1 ⭐ 60 -> 60; 2 ⭐ 100 -> 75; 3 ⭐ 135 -> 95; 4 ⭐ 175 -> 110;
  5 ⭐ 210 -> 130. Late: half (as before).
- 🍕 The 3 extra pizzas (after "PIZZAS MUST BE DELIVERED"): the same price -> half the price (rounded up, e.g. 65 at 5 ⭐).
- 🍕 RARE customer on time: price + 50 -> price + 40 (extra pizzas: half price + 40). RARE late: half (as before; an
  extra one: half of the half).
- ✅ Daily quests: unchanged (5 a day, 8-50 🪙 each, about 130 a day if you do all of them). Two kinds are worked out
  from prices, so they got a cap: "Buy a … at the …" 8 + price/3 -> the same but at most 22 (a teddy would have paid 25
  now; food is 9-14 as before); "Put a … in your house" half the price + 10 -> 10 + price/20, at most 40 (a fish tank
  would have paid 510).
- 🔥 Hard challenges: unchanged (40-500).
- 📬 Mail: unchanged (10, 15 or 20 once a day). 🧹 Litter: unchanged (3 each, 10 a day). 🐚 Shells: unchanged (1 each,
  5 a day). 🎾 Tennis best rally: unchanged (5, once a day). ⚽ Football first win: unchanged (10, once a day, job 9).
- 🏆 Pet Show: 🥇 200 + 🐾 Pets +2 levels (unchanged); 🥈 60 -> 80; 🥉 25 -> 40; 4th place 10 -> 15. The pick-a-pet card
  says "🥈 80 🪙 · 🥉 40 🪙".
- ⭐ Skill level-ups: unchanged (+10 × the new level), except the designer room above.
- 🕹️ Claw machine coin capsules: 10-25 -> 20-50; when every skill is MAX: gold capsule 50 -> 100, level capsule 20 -> 40.
- 🌱 Garden harvest: food or flowers, no coins (unchanged). New players still start with 120 🪙.

### Ways to SPEND coins
- 🚌 Beach bus: 15 -> 20 a ride (the Welcome Bus on day 1 is still free; the ride home is still free when you have less
  than the fare). All bus texts use the fare ("Get on the bus (20 🪙)", "A ride is 20 🪙…").
- 🐶 Adopting a pet: 100 -> 200.
- 🏡 Bigger house: 800 -> 2500 (still needs Decorating level 10). The card shows "🪙 2500 coins" and "1234 / 2500".
- 🕹️ Claw machine: 5 -> 10 a try (the sign on the machine "10 🪙 a go!", its button "Play the claw machine · 10 🪙").
- ✨ Make a wish at the fountain: 1 (unchanged). Golden treasures (claw only, never sold): unchanged.
- ✨ "New in!" shelves: the new colours of sweaters 10 -> 40, pants 8 -> 35, shoes 6 -> 30; furniture and hats cost the
  same as in the shop. A "New in!" thing that was already on the shelf in an old save keeps its old number in the save,
  but now shows and costs today's price (no "Mint bed 40" next to "Bed 200").
- Home shop furniture (🛍️ Decorate): 🛏️ Bed 40 -> 200; 🛏️ Bunk bed 70 -> 450; 🛋️ Sofa 45 -> 250; 💺 Armchair 28 -> 150; 💺 Beanbag 20 -> 100; 🪑 Chair 12 -> 60; 🍽️ Table 25 -> 120; ✏️ Desk 30 -> 150; 💻 Computer desk 50 -> 450; 📚 Bookshelf 30 -> 150; 🗄️ Dresser 30 -> 150; 👗 Wardrobe 35 -> 200; 🪞 Mirror 25 -> 120; 📺 TV 50 -> 350; 🎮 Game console 55 -> 600; 💡 Lamp 15 -> 70; 🕰️ Big clock 35 -> 200; 🖼️ Painting 20 -> 100; 🔥 Fireplace 55 -> 500; ⭕ Round rug 15 -> 80; 🟪 Big rug 15 -> 100; 🧊 Fridge 40 -> 250; 🍳 Stove 35 -> 100; 🚰 Sink 25 -> 150; 🧺 Washing machine 40 -> 250; 🛁 Bathtub 45 -> 300; 🎹 Piano 60 -> 500; 🎄 Holiday tree 45 -> 300; 🧸 Teddy bear 10 -> 50; 🎁 Toy box 15 -> 80; 🐾 Pet bed 15 -> 80; 🐠 Fish tank 40 -> 1000.
- Flower shop: 💐 Flowers 8 -> 30; 🌷 Tulip pot 12 -> 45; 🌹 Rose bush 14 -> 60; 🌻 Sunflower 12 -> 50; 💜 Lavender 14 -> 60; 🌿 Fern 12 -> 45; 🌳 Bonsai tree 18 -> 90; 🪴 Plant 10 -> 40; 🌵 Cactus 9 -> 35.
- Toy store: 🧸 Teddy bear 10 -> 50; 🦄 Unicorn plush 20 -> 90; 🎁 Toy box 15 -> 80; 🐴 Rocking horse 30 -> 150; 🏡 Dollhouse 40 -> 200; 🏰 Toy castle 35 -> 160; 🏎️ Race car toy 22 -> 100; 🤖 Toy robot 25 -> 110.
- Pet shop furniture: 🐾 Pet bed 15 -> 80; 🥣 Food bowl 6 -> 30; 🐈 Cat tree 30 -> 150; 🏠 Dog house 35 -> 180.
- Food (Market, Café, Bakery, Ice cream shop, Pizzeria, beach kiosk): 🍎 Apple 3 -> 5; 🍌 Banana 3 -> 5; 🍞 Bread 5 -> 8; 🥛 Milk 4 -> 6; 🧀 Cheese 6 -> 9; 🍕 Pizza 12 -> 18; 🍕 Pizza slice 5 -> 8; 🥖 Garlic bread 4 -> 6; 🍰 Cake 10 -> 15; 🍦 Ice cream 8 -> 12; ☕ Hot cocoa 4 -> 6; 🍪 Cookie 2 -> 3; 🧁 Muffin 5 -> 8; 🍩 Donut 5 -> 8; 🍇 Grapes 3 -> 5; 🍉 Watermelon 6 -> 9; 🍒 Cherries 4 -> 6; 🍊 Orange 3 -> 5; 🌽 Corn 3 -> 5; 🍯 Honey 5 -> 8; 🍿 Popcorn 4 -> 6; 🍬 Candy 2 -> 3; 🍵 Tea 3 -> 5; 🧇 Waffle 6 -> 9; 🥯 Bagel 4 -> 6; 🥨 Pretzel 4 -> 6; 🍰 Ice cream cake 12 -> 18; 🌾 Flour 3 -> 5; 🥚 Eggs 4 -> 6; 🍫 Chocolate 4 -> 6; 🍋 Lemon 3 -> 5; 🥐 Croissant 4 -> 6; 🥧 Apple pie 9 -> 14; 🍨 Sundae 9 -> 14; 🍧 Ice pop 4 -> 6; 🥤 Strawberry milkshake 7 -> 11; 🥥 Coconut drink 5 -> 8.
- Seeds (seed box): 🥕 Carrot seeds 3 -> 5; 🍅 Tomato seeds 4 -> 6; 🍓 Strawberry seeds 5 -> 8; 🎃 Pumpkin seeds 8 -> 12; 🌻 Sunflower seeds 5 -> 8; 🌷 Tulip seeds 4 -> 6.
- Pet shop: food and toys: 🦴 Pet food 4 -> 6; 🐟 Cat food 4 -> 6; 🥕 Bunny & hamster food 4 -> 6; 🍖 Pet treats 3 -> 5; 🎾 Ball 6 -> 10; 🧶 Yarn ball 5 -> 8; 🐤 Squeaky toy 5 -> 8; 🥏 Frisbee 6 -> 10; 🐭 Toy mouse 5 -> 8.
- Pet shop: outfits: 🎀 Pink bow 8 -> 30; 🥳 Party hat 10 -> 35; 🔔 Bell collar 6 -> 25; 🧣 Cozy scarf 8 -> 30; 👑 Pet crown 12 -> 50; 🕶️ Pet sunglasses 9 -> 35; 🎩 Tiny top hat 14 -> 55; 🌸 Flower crown 12 -> 45; 🌺 Big flower 9 -> 35; 🤵 Fancy bow tie 10 -> 40; 💖 Heart glasses 11 -> 40; 🧐 Fancy monocle 13 -> 50; 🦸 Super cape 16 -> 60; 🧚 Fairy wings 18 -> 70; 🎒 Tiny backpack 12 -> 45.
- Clothing store: 👗 Dresses 25 -> 120; 👚 6 new sweater colors 20 -> 100; 👖 6 new pants colors 15 -> 80; 👟 5 new shoe colors 12 -> 60; 🧢 Cap 15 -> 60; ⛄ Beanie 15 -> 60; 🎀 Big bow 12 -> 50; 🌸 Flower crown 18 -> 80; 🐰 Bunny ears 16 -> 70; 🐱 Cat ears 16 -> 70; 🤠 Cowboy hat 20 -> 90; 🧙 Witch hat 20 -> 90; 🎧 Headphones 25 -> 120; 💎 Tiara 35 -> 180; 🌺 Hair flower 14 -> 60; 😇 Angel halo 22 -> 100; 🦄 Unicorn headband 24 -> 110; 🎨 Beret 16 -> 70; 👑 Crown 60 -> 400; 👓 Glasses 15 -> 60; 🕶️ Sunglasses 18 -> 80; 💖 Heart glasses 16 -> 70.

### Texts
- 📱 Job (pizza): "95 🪙 for every pizza! Be fast for ⭐ RARE customers…" -> "95 🪙 for every pizza! Extra pizzas: 48 🪙.
  Be fast for ⭐ RARE customers…".
- 📱 Job (teacher): new line under "Today: 0 / 2 classes taught": "💰 75–195 🪙 a class: more ⭐ = more coins!".
- 📱 Job (designer): new line under "Today: 0 / 3 rooms decorated": "💰 20–130 🪙 a room: more ⭐ = more coins!".
- Pizza delivery card for one of the 3 extra pizzas: "You got 135 🪙 with your 3 ⭐!" -> "You got 48 🪙 for an extra
  pizza!" (normal pizzas: "You got 95 🪙 with your 3 ⭐!", same words).
- Not enough coins: "Not enough coins. Pick up litter or check your mail! 🪙" (shops), "You need 100 🪙. Pick up litter or
  check your mail to get more!" (adopting) and "Not enough coins yet. Pick up litter or check your mail! 🪙" (claw) ->
  "Not enough coins yet! 🪙 Go to work and do your 📱 quests to earn more! 💼", "You need 200 🪙. Go to work and do your
  📱 quests to earn more! 💼", "Not enough coins yet. Go to work and do your 📱 quests to earn more! 💼". Without a job:
  "Get a job from Rosie to earn coins! 💼". (Litter and mail now give only about 45 a day; the job is where coins come
  from.)
- Class card ("You earned 135 🪙!"), designer review card ("You got 90 🪙!"), Mrs. Maple's and the clients' messages,
  the Pet Show prize card: same words, new numbers. Chef Blaze's lines are unchanged.

## Decisions I made
- One target for every job: a weak day about 150, a good day about 270, the best day about 390 (the brief: good day
  250-350, weak ~150, best at most ~450). Teacher and designer now have exactly the same three numbers.
- Pizza keeps its shape (stars set the price, late = half, RARE = bonus + a star), with the owner's night-1 rule: 0 ⭐ earns
  less than every other job's weak day (120 < 150) and 5 ⭐ a little more than all of them (390 + the RARE bonus, about
  415 on an average day, vs 390).
- The 3 extra pizzas pay half. That is the only way to keep "5 ⭐ a little more than the others" AND a maniac day close
  to the others (585 instead of 1260; with the same price it would be 780). Chef Blaze's words stay exactly the owner's;
  the half pay shows in 📱 Job and on the delivery card.
- RARE bonus 50 -> 40, so a normal 5 ⭐ day stays "a little more" and not much more.
- The designer's hidden level-up coins (540 over the first 3 days) are gone for rooms: with them a new designer earned
  up to 660 on day 3, far above everyone else. Every other level-up (furniture at home, Pet Show, claw…) still pays.
- Prices, kept kind: everyday things a little more (food and seeds ×1.5: a snack 3-18, a whole pizza 18, the bus 20),
  nice things a few days of work (furniture 60-600, clothes 50-180, pet outfits 25-70, toys 50-200), big dreams a week
  or more (big house 2500, the fish tank 1000 as the "rare furniture ~1000+", the crown 400).
- Useful furniture stays reachable: the 🍳 stove (cooking and its many quests) is 100, so a new player can buy it with the
  120 they start with; the 🎹 piano (the only way to play Music) is 500, not 1000.
- Flower-shop plants 30-90 are small decorations; growing 🌻/🌷 from seeds (8 / 6) is the cheap way to get them, a nice
  reward for gardening.
- A pet costs 200: a new player (120) can't adopt on the first morning, but after a good first class (2 ⭐) or room
  (2 ⭐), or two pizzas, they can (quests and mail help too). New players still start with 120 🪙.
- Claw machine 10 a try, coin capsules doubled (20-50), so a coin prize still feels like a win. Toys from the claw are
  worth much more than a try now; you still can't sell anything, so nothing can be "farmed".
- A day's money (good day): job ~270 + quests ~130 + litter/mail/shells ~50 = about 450; weak day about 250. Food and
  the bus cost about 40-80 a day. So: a pet is half a day, a sofa less than a day, the fish tank 2-3 days, the big house
  about a week (two weeks on weak days).
- Daily quests, hard challenges, mail, litter, shells, tennis and football money stay as they were (small extras next to
  the new job pay). Pet Show: the winner keeps 200 + 2 levels, the others get a bit more so joining still feels good.
- Old saves: never touched `S.coins`; a pizza order that came before the update keeps its old pay (as before).

## Glitches found and not fixed
- "Put a … in your house" daily quests for furniture you don't have now cost more than they pay (e.g. a sofa 250 for
  23 🪙). You can still do them by moving one you already have. Before: 45 for 33.
- "Buy a … at the Toy store" daily quests: a toy costs 50-200 and pays 22 (before: 10-40 for 11-21).
- The coins from level-ups at the Pet Show (+2 levels) and from claw level capsules are not shown in their messages
  (as before).
- A yesterday's quest that was "ready" but not collected is paid with today's reward (only "Buy…"/"Put…" quests differ).

## NOT VERIFIED (real devices, sound, feel)
- Feel: is 2500 for the big house a fun wait, or too long for a 6-year-old? Is a weak day (150) enough fun?
- Does a 6-year-old notice/understand "Extra pizzas: 48 🪙" and "for an extra pizza!"?
- Real iPad/iPhone (tested in the test browser: iPad landscape and iPhone portrait, light and dark).

## Try it for real (tick-box tasks)
- [ ] Teacher: teach 2 classes; check "You earned 75 / 135 / 195 🪙" and 📱 Job "💰 75–195 🪙 a class".
- [ ] Designer: decorate a room; check "You got 50 / 90 / 130 🪙" and that the coins go up only by that number.
- [ ] Pizza: deliver 3 pizzas, tap "PIZZAS MUST BE DELIVERED", deliver a 4th: "You got … for an extra pizza!" (half).
- [ ] 📱 Job (pizza) shows "… for every pizza! Extra pizzas: …".
- [ ] New game: Pet shop → adopt: "You need 200 🪙. Go to work…"; buy a stove (100) and cook a sandwich.
- [ ] Shops: prices look right (Market apple 5, Home shop bed 200, fish tank 1000, crown 400); "New in!" prices match.
- [ ] Ride the bus (20), play the claw (10, sign says "10 🪙 a go!").
- [ ] Old save with lots of coins: same coins after loading; things you own are all still there.
- [ ] Bigger house card: "🪙 2500 coins".

## Morning questions (each already built in a sensible way)
- The 3 extra pizzas: built as half pay (a 5 ⭐ maniac day = 585); or the same price as the first 3 (780)?
- Big house: built as 2500 (about a week of good days); or 2000 / 3000?
- Pet: built as 200 (new players need to work a little first); or keep 100 / start new players with more coins?
- Fish tank 1000 as the one big furniture dream; or more "dream" furniture (game console, piano) at 1000+?
- Designer rooms no longer give the hidden level-up coins; OK?
- Daily quests (about 130 a day) stayed as they were; or smaller now that jobs pay more?

## Quick check
`SRC=/home/user/wt/job08/index.html quick.sh job08-2 files,counts,saves,players,claude,crawl_ipad-landscape_inA,crawl_ipad-landscape_inB,teacher_ipad-landscape`

```
new claude 99571c8c328f3b27afc3c9579a767c5a · new web 63f5543ba0b4c0ddeef7cce872e19485 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
Task exception was never retrieved
future: <Task finished name='Task-42' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
Traceback (most recent call last):
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.TargetClosedError: Channel.send: Target page, context or browser has been closed
[stage counts: done in 97 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 241 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzqxlas43zl6" -> "umuzqxtqsztece"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 47 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 39 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 283 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 166 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 90 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/job08-2`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 fails as expected in a quick check (no backup given); B1 is the known false fail (old saves without `pid` get a new
random player id; nothing else differs). The crawl stages print no verdict lines in a quick check; their stage files say:
home/market/pets/flowers/café (inA) and clothes/toys/bakery/ice cream/library (inB): 0 browser errors, 0 layout issues,
0 dead, unreachable, stuck or covered buttons; teacher (iPad landscape): 0 errors, 0 layout issues, classes taught.
The "Task exception was never retrieved … TargetClosedError" lines come from the check tool closing a test page during
the counts stage (the stage passed); my first run of the same stages (job08-1, before the last 3 price tweaks: stove,
piano, fish tank) did not show them and had the same results.
