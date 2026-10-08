# Cozy Town: NIGHT 2 (plan for the night session)

Same system as night 1. Work alone all night. Never ask questions, never stop, never wait for "continue" or "OK".
Important work: Claude Opus 5.5 at max effort, or Claude Fable at medium effort or higher. Keep family names out of this public repo.
Never stop to ask for anything: no "continue", no "OK?", no confirmations. If usage runs low, finish the job in hand, write the report and open the pull request.

## Start
1. Start from main: index.html md5 f2cdd530076cce1ad198bd90d9e0e2a7 (night 1, merged). If it differs, read it and merge; never overwrite.
2. Backup: copy it to tools/prenight2-index.html. "Go back to PRENIGHT 2" = restore that file.
3. Check tools: the cozycheck folder inside cozy-night-kit.zip (run cozycheck/cozy_check2.py). Old saves: tools/check-fixtures, plus a save made with tonight's starting version.
4. Work on a new branch. One job = one commit. Quick check after each job; the full check on the final file.

## Rules
- Something now, polish later: build every job in a simple, working, cozy way. Scuffed bits go on the glitch list; they don't stop the night.
- A half-done job is undone, never shipped. If a job breaks something, undo only that job and carry on.
- Old saves must keep working: coins, house, furniture, garden, pets, clothes, skills, quests. Never skipped.
- Old-version and new-version players must still see each other.
- Make obvious decisions yourself; list them in the report.

## Jobs, in this order (the order is the priority)
1. **The Home Screen app updates itself.** The iPad web app added to the Home Screen keeps an old copy. Add a version check: on start and whenever the app comes back to the front, fetch index.html with no cache and compare a version stamp. Newer on the title screen: reload at once. Newer during play: show "✨ New Cozy Town update! Tap to get it", save first, then reload. Never lose progress.
2. **Bug fixes:**
   - Page zoom must not work while playing (pinch and double-tap).
   - Sprint on iPad: easy to switch on and off, with a clear on/off look.
   - Other players' jumps show.
   - Other players' pets show and follow them (old and new versions stay compatible).
   - Other players lying in bed show lying down, and players who are away show a small 💤 over their head.
   - Classroom doors don't change colour when a class ends.
   - Writing on the ideas board on iPad: the keyboard covers everything. Keep the text box visible above the keyboard.
3. **Glitch hunter, pass 1** (on the game as it is, so it surely happens):
    - An agent plays everywhere: every area, many spots, light and dark, iPad and iPhone sizes, and takes lots of screenshots.
    - An inspector marks everything scuffed: flicker, cut-off text, things poking through each other, floating or sunk things, overlapping name tags, places you get stuck.
    - A fixer fixes all of it. No confirmation needed.
    - List every fix with a before and after picture (tools/pictures-2/).
    - Already known: flickering stripes under the classroom door signs; sign text cut off ("The w..." over the world map, the "y" of "History"); the pyramid poking through its box in the History room; the knight statue's visor on the side of its helmet; name tags overlapping in class. From night 1's report: people pop in at 48 m and cars at 80 m (make them fade in softly); the decorate button shows while you lie in bed; a message can cover the "Still there?" card; buildings show no "Closed" sign at night; the phone's clock shows the old time after a clock jump; clouds jump across the sky.
4. **Small changes:** Pet Show on Saturdays 8:00 to 20:00. For the shared clock, ignore other players more than 30 days ahead.
5. **Walkers notice you:** when you walk towards a walker, they slow down, turn to you and show "Say hi" a bit earlier. They don't stop completely.
6. **Map overhaul:** as easy to read as a big-city game map (GTA 5 style clarity: clear roads, building icons and names, your arrow, move and zoom with fingers, tap a place to set the route), but in Cozy Town style: soft colours, round shapes.
7. **Beach bus** (replaces "a skill at level 10 opens the beach"):
   - Remove the level lock.
   - A cozy, cute, pastel bus comes to a bus stop at the park 3 days a week. The days are picked at random each week, but the same for every player (work them out from the week number).
   - It arrives at a random time between 8:00 and 12:00 on those days. Fare: 10 coins or more, balanced against job pay so it means something.
   - The bus waits about 1 real minute at the stop (park or beach) before it leaves, with a friendly countdown.
   - The bus home leaves the beach at about 21:00, announced in a kid-friendly way (for example at 20:30 and 20:50).
   - Missed the bus: build a campsite on the beach (tent and campfire) and sleep there. It counts as "in bed" for the night skip. The next bus day takes you home.
   - The tennis court stays at the beach.
8. **Coins balance:** make coins mean something. Today the teacher earns 90 to 150 a day, the designer up to 600, and pizza 25 to 210 per pizza (a 5-star kid doing 6 pizzas gets 1260 a day). Even out job pay (teacher up), and set prices (the bus fare, shop items) so saving up feels worth it. Old saves keep their coins.
9. **Football friends** at the field, 14:00 to 19:00: 4 kids, one of them a star player (an original character with his own catchphrase and goal dance, not a real player).
   - Sometimes they play on their own.
   - When you come: "Do you want to take the field, or a 1 vs 1?"
   - "Can I practice?" gets "Sure! We need a juice break!": they sit on the bench across from the scoreboard and drink juice.
   - You can go back and invite them to a 1 vs 1 with the star.
10. **One house per player, on Friends Lane:** the house in the city centre goes away. Your house is your Friends Lane house. The garden moves there. Every player's saved furniture, wall and floor colours, garden plants and pets move along. Add more Friends Lane plots (at least 12, more appear as needed), so every player gets a house. This is the riskiest job: test it with every old save.
11. **Move my game between devices** (coins differ today because each device keeps its own save): "Move my game" in Settings. Device 1 shows a 6-letter code that works for 10 minutes; device 2 types it and gets the same save. Use Firebase at worlds/cozy-town/move/<code>. If the database refuses, keep the button hidden and write the needed rule in the report.
12. **Glitch hunter, pass 2** (time-boxed, last): the same play, inspect and fix on tonight's new work (map, bus, campsite, football friends, Friends Lane house, move my game).

13. **If time allows, the designer's older wishes:** a bridge at the small duck pond; dance music for the TV cat; fireflies in the park at night; a shelf at home that shows your shell collection.

## Not tonight
Balcony door upstairs, a private world, pizza for two players, tennis with a friend, more clothes and shop items, other new places, firefighters, police and doctors.

## Morning report: tools/NIGHT-2-REPORT.md
1. Every change: item, old -> new.
2. Check output per job, exactly as printed, and the final full check.
3. Before and after pictures (map, bus, campsite, football friends, Friends Lane house, glitch fixes).
4. Glitches found and not fixed.
5. Everything NOT VERIFIED (real devices, sound, feel).
6. "Try it for real" tasks.
7. How to go back (tools/prenight2-index.html).
8. Firebase: one complete rules block to paste (the current rules plus anything new), and the morning questions, each already built in a sensible way.
Then open a pull request into main.
