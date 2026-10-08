# Job 13: Nicer buildings

Changed: `index.html` (only the building code inside the game script: `windowAt()`, `building()`, and one new option `boxes:true` on the three apartment blocks). Added 34 pictures in `tools/pictures/` (before-*.png and after-*.png, 17 of each).
Nothing above the game script changed, so `'use strict';` is still on line 547. No save fields changed. Doors, collisions, signs, "tap here" spots and DOORS are where they were before. No new materials, so there are no extra draw calls.

## Changes
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

## Decisions
- I put every change in the shared builders (`building()` and `windowAt()`). That way every building, including Friends Lane houses, gets them automatically, and the merge with job 9 stays simple. I did not touch cars, walkers, night lights or lamp glows.
- No new materials: every new part uses plain colours that get merged into the same pieces when the town is baked. The window glass on the new side windows uses the existing window material, so it should light up at night like the other windows.
- Shutters use the house's roof colour, so each house keeps its own colour pair. Lintels, bands and corner posts use the building's own trim colour.
- I did not add or move any collisions, so walking and doors behave exactly as before. Houses leave only 0.1 m between the wall and where you stop; the new flower boxes stick out about 0.2 m, the same as the window sills that were already there, and the shutters and trims less.
- For the pictures, the street trees right in front of the camera are left out, so they don't hide the buildings. The picture is drawn twice: once normally, then everything past a few metres on top. So the ground under the camera stays (no blue band), and the distance is chosen per building so no tree is cut in half (no dark blobs). The before and after pictures have exactly the same view.
- I stopped at +6.1% on update A (about +7.2% with a full Friends Lane) to leave room for job 9, which is being merged at the same time. To save triangles, the small lintels have no ink outline.
- The game is seen through your own eyes, so you never see your own body squashed against a wall. The flower boxes were still made slimmer, so they stay out of the camera when you stand right at a wall and look down, and other players' kids don't poke into them.

## Morning questions
- Do you like the shutters in the roof colour (for example pink shutters on your lilac house)? White or a darker wall colour would be the other options. It is one word in `building()` (`sh:o.roof`).
- Should the offices (the tall blue building behind the market) get flower boxes too? Right now only the three apartment blocks have them.

## Not verified
- Real iPad/iPhone speed with the extra triangles. The town has the same number of pieces, so draw calls are unchanged. The triangle count went up by about 30,000.
- How the new side windows look at night once job 9's night look is merged.
- The full night check (the orchestrator runs it).
- In the iPhone portrait test pictures, the rich save's own "Pizza job tips" card covered the middle of the screen, so I could only see the buildings around it.
- Friends Lane with several real players. Only your own lot was seen, but every lot uses the same builder.

## Glitches not fixed
- In my test, calling `enter('market')` / `enter('toys')` from a script left you in town after 30 frames. This is probably the fade transition, which needs real time. Doors were not changed, and I did not check this on the version from before this job.

## Try it for real
- Walk to your house: pink shutters, flower boxes under the front windows and a little pink roof over the green door. Walk right up to a front window: the flower box should not cut into your view.
- Look at the market and the café: bright flowers in light wooden boxes on the shop-window sills, and darker posts at the shop corners.
- Look at an apartment block: flower boxes on every other upstairs window, trim lines between the floors, and a blue canopy over the door.
- Walk around the neighbour's mint house: it now has a chimney, and there is a small window high up on each side wall.
- Visit Friends Lane: your lot's house has the same new look.
- Stand at night in front of a house: the small side windows should glow like the others.

## Tests run
- `jscheck.py`: syntax ok.
- Drawing work (checks.STATIC_JS, rich save, midday): city 390 pieces / 622,402 triangles (update A 387 / 586,650; before this job 390 / 591,966); outside 34 / 94,458. OK, under +10%.
- Before/after pictures (same camera views, iPad 1180x820, cropped to 900x640): 17 buildings each, 0 console errors on both versions. I looked at all of them in contact sheets and at the market, apartments and Friends Lane full size.
- A new player's opening (iPad, played through the intro): ends in town and playing, 0 errors.
- Old save (`fixture('old')`, the very first version): loads in town, coins 120, name kept, 0 errors.
- Rich save (`fixture('rich')`) on iPhone portrait: street views of home, pet shop, toy store and Friends Lane; back to town; 3 pets and the big house are kept; 0 errors.
- Rich save on iPad: street views of the school, fire station and ice cream shop, 0 errors.
- Test scripts and shots: `agent-tests/job13/` (pics.py, t13.py, t13b.py, contact-*.png).
- Review fixes (agent-tests/job13-fix1/): `jscheck.py` syntax ok. f1.py (rich save, iPad light + iPhone landscape dark): neighbour, big house, café and market looked at, 0 errors; city 390 pieces / 622,306 triangles. f2.py: standing pressed against the neighbour's window (x -32.75, stops at z -11.1) before and after the fix, 0 errors. pics2.py: all 34 pictures taken again (update A and now), 0 errors on both, checked in a contact sheet (final-sheet.png): no bands, no blobs, no test names.
- Review tests run again (rev/): old and rich saves load the same in update A and now (save_diff empty), nothing removed, every area within +10% after the opening (city 385/586,110 -> 388/621,406), 0 errors. Two players OLD+NEW both ways: see each other, walking, chat, 2 lane houses each, knock -> let in -> visit, 0 errors. (The rich save's quest/litter day refresh and "lines above 'use strict'" differences already exist before this job; the script's last lane-weight step stops on a test helper `__goto('lane')`, same as in the review run.)
