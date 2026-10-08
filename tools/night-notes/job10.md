# Job 10: Second floor in the big house

Only `index.html` changed (main game script). The web part and everything above `'use strict';` are untouched (same 546 lines).
No new save fields except one small optional marker on furniture placed upstairs (`f:1`). No new online fields.

## Changes
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

## Decisions
- Upstairs uses the same wall paint and floor as downstairs (one choice for the whole house). Simple, and visitors get it for free.
- The stairs are in a small stairwell behind the west wall (outside the old room), so they can never stand inside furniture of an existing big house. Old furniture right in front of the doorway stays where it is (moving it would change old saves); you can still reach the stairs from the side.
- Upstairs is a separate room inside the same "home" place (40 m away, hidden behind walls). That is why old-version friends keep working: for them the host is simply "at home".
- After the climb you stand 2.6 m into the room, facing it, so the stairs button does not pop up right away (in the flats you land on the button).
- A friend who follows you does not repeat "Your house is so cozy!" (and give friendship points again) on every stair climb; that still happens once when you come in through the door.
- Upstairs has windows where the doors are downstairs (no balcony door: it would be a door that does nothing).

## Morning questions
- Should upstairs get its own wall paint and floor (a second paint choice), or is one paint for the whole house fine?
- Would you like a real balcony door upstairs (out onto the balcony you see from the street)? That would be a new small area.
- The stairwell walls are the house paint color; looking down the stairs from upstairs you see a dark stair hole (like the flats). OK?

## Not verified
- Real iPad/iPhone feel: climbing speed, the fade, how the doorway looks on a real screen.
- Real Firebase with two real devices (tested with the pretend server, a new-version visitor and an old-version visitor).
- The Claude version's room size limit with a really full house (the drop-upstairs-first rule was tested directly: with a tight limit the ground floor is kept and upstairs is dropped).
- Sound of the steps (same sound as the flats).

## Glitches not fixed
- Standing right at the stairs doorway on an iPhone held upright, the (now smaller) sign is still partly hidden behind the top-right buttons. That is just the view looking up close; from a few steps away it reads well.
- In the big house the upstairs walls and windows are part of the same drawing as the ground floor, so both floors' walls are always drawn (about 4,000 extra triangles at home, fewer draw calls than before). Cheap even on iPads; only the furniture of the other floor is hidden.
- Old big-house saves whose furniture stands right in front of the new stairs doorway keep it there; the stairs button still shows when you stand next to it, and the climb walks through it.
- While the host climbs, an online visitor sees the host walk into the stairwell at floor height (people have no up/down in this game). Same as the flats.
- A visitor sees the host's upstairs lamps and sofas, but (as downstairs before) only sofas/chairs can be used by visitors.

## Try it for real
- In a big house, walk to the white doorway on the left wall: "⬆️ Go upstairs". Tap it: you climb the stairs and stand in the new room.
- Upstairs, tap 🛋️ and put a sofa and a bed up there. Sit on the sofa. Go back down: your downstairs things are still where they were.
- Quit and open the game again while upstairs: you are still upstairs.
- Tap 🛋️ quickly while you are still climbing: nothing happens; once upstairs tap 🛋️, then ✅ Done, and go down: no purple grid lines on the ground floor.
- With a friend online: let them in, then both go upstairs: you see each other and your upstairs furniture.
- Check the "Dream home" quest: things upstairs count too.

## Tests run
After the review fixes (final file md5 4f4dd98f82da37ced6e42234dc4a0738): syntax check ok; agent-tests/job10-fix1/: f1.py on iPad landscape light and iPhone portrait dark: 12/12 PASS each (tap 🛋️ during the climb is ignored and no grid is left on; decorating upstairs shows only the upstairs grid, downstairs only the ground grid; ✅ Done hides both; put away / move+cancel from upstairs leaves no f:1 in My stuff; 0 console errors); job10 feature test re-run 17/17 PASS; compatibility test re-run 6/6 PASS (old + rich saves 0 differences, home/visit 7 pieces / 2316 triangles on a fresh page). Screenshots of the smaller sign looked at (iPhone portrait dark).
Earlier (before the review fixes):
Final file: index.html md5 111ff63f510315b6b9ea8afcca5e122b (all tests below were run on it). Syntax check (jscheck): ok. Every browser test: 0 console errors, layout audit clean (no cut-off, overlap or small buttons found).
Scripts and outputs: agent-tests/job10/ (t1_feature.py, t2_views.py, t3_visit.py, t4_compat.py).
- Feature, iPad, rich save (17 checks, all PASS): stairs spots exist; stairs button in front of the doorway; real tap climbs upstairs (same place, no camera offset left); no stairs button right after arriving; ground floor furniture not drawn upstairs; decorating upstairs (real taps on 🛋️ and "Put it here"): grid upstairs, item saved with f:1 and standing upstairs, a sofa allowed right above the ground-floor sofa, a piano refused on the stairs landing; "Dream home" counts 7 = both floors; sofa "Sit down" and "Play the piano" work upstairs; presence snapshot 5 items downstairs + 2 upstairs, tight limit drops upstairs first; stairs down bring you back (5 things drawn again); the flats' stairs up to floor 2 and back down still work; a save made upstairs opens upstairs with both upstairs things.
- Two players (10 checks, all PASS): new host with upstairs furniture + new-version guest (iPhone): knock → let in → inside; the guest's house copy has stairs and the 2 upstairs things; guest climbs (real tap) and sees only the upstairs things; host climbs too; both see each other upstairs; guest goes back down. New host + OLD-version guest (pre-night game, PC): gets in, sees the ground floor only (5 things, no stairs), stays inside for 12+ s while the host is upstairs.
- Compatibility (6 checks, all PASS): old save and rich save load in the pre-night game and the new game with 0 differences, same save key; scenery weight on a fresh page identical for every area (home 7 pieces / 2316 triangles, visit 7 / 2316); a new player's opening on iPhone portrait finishes, the small house has no stairs and sends no upstairs list; old save on iPhone: home has no stairs, furniture untouched.
- Screenshots looked at (iPad and iPhone portrait, light and dark): ground floor doorway and stairs, climbing up and down, upstairs room, upstairs doorway with frame and sign, decorating upstairs, guest seeing the host upstairs.
