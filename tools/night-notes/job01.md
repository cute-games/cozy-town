# Job 1: Pets keep a gap

Only `index.html` changed (main game script, about 60 lines; nothing above the game script). No save changes, no new drawings, web part untouched.
(Updated after the review: all 3 big and 8 small review points fixed, some were reported by both reviewers; see "Going through a door", "Bring my pets to me", "A pet that can't reach you" and the end of "Changes".)

## Changes
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

## Decisions
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

## Morning questions
- Is a 2–2.35 m gap right, or should pets wait a bit closer so "Play with ..." shows without a step?
- Should waiting pets sit down? Now they stand, look at you, wag and look around (no sit pose exists yet).
- In a lesson and in the Pet Show your pets and friends now wait out of sight. Fine, or should they sit and watch somewhere?
- After a door your pets and friends now wait beside you, just out of view (like before, when they stood behind you). OK, or would you rather see them in front of you?

## Not verified
- How it feels on a real iPad and iPhone (smoothness, whether the gap feels right, how fast they run, the little step aside).
- Real online play with real Firebase (tested only with the test copy and its pretend server; pets are not shared online anyway).
- Every furniture spot in every room and every fence in town: pets walk in straight lines plus your footsteps, so odd corners can still trap them for a while.

## Glitches not fixed
- No real path finding: if a pet can't walk straight to any of your last footsteps (for example it went round the end of a fence on the other side), it walks on the spot while you keep walking and pops over when you are 14 m away; when you stop it waits. (Before: the same, but it walked on the spot all the time.)
- In crowded rooms (the market) a pet whose spot is inside a counter waits about 3.3 m away until you walk on.
- After the Pet Show the show pet is put back at a fixed spot by the stage, about 1.1 m from you (old Pet Show code, not changed); the others now shuffle apart if it lands next to them.
- Adopting: the new pet appears 1 m from you in a fixed direction, so it can be behind you. (Old code, not changed.)
- On a narrow iPhone held upright, after "Bring my pets to me" a long pet name tag (for example "Marshmallow") can touch the screen edge for a moment; the pets themselves are fully in view.
- Night check, E1 "outside (town scenery)" triangles: the town scenery count changes on every page load, even for the unchanged live file (seen 88,682 to 115,864, same 34 meshes), so that line can fail by chance. Not caused by this job (no drawings changed); it passed in 2 of my 3 final runs.

## Try it for real
- Walk with your pets, stop, and turn all the way round: your pets stay where they are and look at you (no running round you).
- Take one or two small steps: they keep waiting. Walk on a bit more: they trot after you, side by side. Walk straight into one: it steps aside.
- Go into a shop with your pets: the view is clear; turn your head: they wait beside you; turn round: the door button shows.
- From your house walk out through the garden gate: your pets come through the gate after you.
- Settings, "Bring my pets to me": they appear in front of you, all three in view.
- At home, decorate and put a sofa where a pet stands: the pet hops out of the way.

## Tests run
Final file: index.html md5 007e1673b0c4d5cb7a0f7d8f345d839a. Syntax check (jscheck): ok. Every browser test below: 0 console errors.
Scripts and outputs: agent-tests/job1-fix1/ (run_all.sh runs them all; results in final/res-*.txt). The reviewers' scripts were re-run as r_t*.py (review A) and rb_r*.py (review B).
- Stuck pet, then you go back to it and walk away (review tests): follows again at 3.4 m (before the fix: only at 6.6 m on the pier and 10.7 m behind the cafe). "Stay here" -> "Follow me" and the 14 m pop-over clear it too.
- Sofa put on a waiting pet at home: no pet inside furniture after 1 frame and after 100 frames (before: Waffles stayed inside the sofa).
- What you see (iPad, iPhone upright, iPhone sideways), Rosie + 3 pets through 10 doors in and out: 0 followers in view, cut off or behind a wall/fence (before the fix: 41 such cases on the iPad, and Rosie took the house door button). "Bring my pets to me": all 3 pets fully in view on all 3 screens. Door buttons after every door are the same as in the old game.
- All doors incl. the flats: followers 2 m beside you (1.4 m when tight); in the narrow flats corridor one waits 2.6 m in front, fully in view.
- Walking into a row of 3 waiting pets (walking and running): 0–2 frames pushed, they step aside with walking legs (before: pushed along like a puck). Rosie after "Hang out" steps aside, then follows.
- Road: crossed and stopped at the curb, 20 s: 0 frames of a car waiting for a pet (before: 334 of 400, longest 16.7 s).
- Pet Show on a Saturday with 3 pets: plays to the end; no other pet of yours in the show shots; pets wait and follow afterwards.
- Slow walking 10 s at 10/25/50/100 % joystick: 0–1 walk/stand flips per pet (before: up to 140).
- Two friends + 3 pets in the cafe and in town: 0–1 frames of anyone standing inside another (before: 156 frames).
- Garden gate from the start spot: all 3 pets come through after you (old game: 2 of 3; before this fix: 0 of 3). Leaving home, pets behind the long fence: they come round to you within 6 s. Lake pier: all 3 pets come onto the pier and back.
- 14 shop/home doors, walk in and stop: pets wait 1.9–2.4 m away (the market 3.3 m, their spot is inside the counter).
- 3 random town routes (14 walks and stops each): all pets with you after every stop (42/42 each), 0 pop-overs, walking on the spot 0–350 pet-frames (old game 0–977).
- Feature walk-through (stand, turn, small steps, walk, play with a pet, petting panel, run, cafe, stay/follow), friend Rosie, Pet Show, mirror, "Take me home", new player opening + adopting, teacher lesson (followers hidden, scolding works, back after class), 2-player visit (new player with 3 pets visiting an old-version player), old and rich saves (nothing lost, saved pet fields unchanged), stuck test: all as expected.
- Cost: all followers together 0.06–0.12 ms per frame (old game 0.04–0.09 ms); the footstep search at most 0.5 ms and at most every 0.5 s per blocked pet. The fast "free way" check agrees with the plain collision check on 23,997 of 24,000 random lines in 8 areas (the 3 others: points squeezed between two touching colliders, where it is more careful).
- Night check stages on the final file (runs/job1fix1): A1, A3 (667 of 667 things), F1, F3a, F5, B1 (6 saves, 0 differences), B2, D1, D2, D3, C7, K1 all PASS; town crawl 85 taps, 0 dead / unreachable / stuck / covered, walking works, 0 errors; teacher play-through on iPad: 3 classes, 34 of 34 goofing taps stopped, 0 errors; layout audit: the same 56 + 24 items as the accepted run before the review (all on the job text box, not from this job). Web part round trip: identical. A2 "backup" FAIL only because a partial run gives no backup. E1 failed once on "outside (town scenery)" (93,206 -> 104,518 triangles) and passed in 2 re-runs of the same file: the live file itself measures 93,206 to 115,864 on different loads (same 34 meshes), so that line is load noise; this job adds no drawings.
