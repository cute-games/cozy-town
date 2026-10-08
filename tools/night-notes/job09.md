# Job 9: Cozy nights

## Changes
- Night owls: 3 townsfolk (2 known faces and 1 more) went home between 22:20 and 23:25, so after about 23:30 nobody walked around -> these 3 now stroll around all night. They go home between 5:25 and 6:35 and come back out between 9:35 and 11:25. Everyone else still goes home between 18:25 and 21:00, as before.
- Walking home: every walker walked the whole way home, which could take more than a minute, so at 22:00 the streets were still busy -> a walker you can't see (off the screen, more than 52 m from the camera, or while you are indoors) is home at once. A walker you can see still walks home to their door. (Review fix: "off the screen" is new, so after a big clock jump the street also gets quiet quickly when you stand still.)
- New day (midnight, or waking up in bed): walkers who were out got moved to a random spot -> only walkers who are at home get a fresh start. Night owls keep walking where they are, so nobody jumps at midnight.
- Cars at night: all 12 cars drove all night -> 10 cars go away for the night (each at its own time between about 20:20 and 21:50) and come back in the morning (between about 5:35 and 6:55). 2 cars drive all night: one on the big outer ring and one through the middle of town. A car only goes away or comes back where you can't see it (off the screen, or more than about 90 m away). It comes back where it left; if you are looking at that spot, it comes back somewhere else on its own loop that you can't see (review fix: before, it stayed away until you looked elsewhere). It only comes back if no other car is within 9 m and not within 10 m of you. A car that went away doesn't block other cars or you.
- Car lights: small lamp boxes only -> at dusk and at night each car has two warm white headlight glows with a soft warm pool of light on the road ahead (review fix: the pool was too faint, it is now brighter and longer: about 3 m wide and 6 m long), two red tail-light glows, and a faint red glow on the road behind. They fade in from 18:30 to 20:30 and fade out from 5:00 to 7:00, the same as the sky.
- Street lamps: only the lamp heads glowed at night -> every street lamp in town and on Friends Lane (128 lamps) also has a soft warm halo around its head and a warm pool of light on the ground, with the same fade.
- How the glows are made: there are no real lights and no shadows. All glows share one soft-dot picture with one material, and each glow always turns toward the camera. Cost: 1 extra draw call for all street lamps together, plus 1 for each car on screen, at dusk and at night only. By day the glows are switched off, so they cost nothing.
- Warm window light, stars and the moon: already there and already cozy (checked), so they are unchanged.

## Decisions
- 3 night owls (the game already had 3 people who stayed up late) and 2 night cars out of 12, within "2–3" and "1–2".
- Cars "go away" for the night (they quietly vanish out of sight) instead of parking. Parking would need parking spots at the roadside.
- Walkers you can't see reach home at once, so the town really gets quiet at night. You never see anyone vanish.
- The cars that go away and come back, and the night cars, are the same on every device. Where the cars are is not shared between players (it never was).
- No fireflies: the night already has stars, warm windows and now lamp and car glows. I kept the job small.
- The faint red glow on the road behind each car is small and soft, so it stays cozy and isn't scary.

## Morning questions
- Would you rather see the night cars parked at the roadside (lights off) instead of going away? That would need parking spots along the streets.
- Night owls now sleep in until 9:35–11:25, so in the early morning a few familiar faces are missing. OK?
- Fireflies in the park at night: want them as a later small job?

## Not verified
- How smooth it runs on a real iPad and iPhone. The glows are soft see-through squares: 4 per car and 2 per street lamp, which is very little work but was not tried on an old iPad.
- How bright the glows look on real screens (light and dark mode look the same, because it's the 3D scene).
- The Claude version: same code, not opened separately.
- Two players: the presence data was not touched, and each player has their own cars and walkers (as before). Not tried with two devices.

## Glitches not fixed
- At the moment a car goes away just behind the camera, its shadow could still be on the screen for that one moment (very rare, and night shadows are faint). The same could happen with a walker going home just off the screen at dusk (a long evening shadow); the check keeps a 5 m margin, so it should be rare.
- When the pizza job is on, Chef Blaze's tips pop up in the middle of the screen when the clock is jumped in tests (existing behavior from earlier jobs, not part of this job).

## Try it for real
- Stay outside from 20:00 to 22:00: the streets get quiet, and only a few people and cars are left.
- At night, stand next to a road and wait for a car: two warm headlights with a soft light on the road in front, and red lights at the back.
- At night, look at the street lamps: a warm glow around the lamp and a soft pool of light on the sidewalk.
- Watch a car closely at 21:00: it never vanishes in front of you. It only goes away once it's out of sight.
- Stay up until morning (or sleep): after 7:00 all cars are back, and the lights have faded away. Also when you stand still and look at a street all morning.
- At midnight, watch a night owl walking: they keep walking, with no jump.

## Tests run
- Syntax check (jscheck): ok. 'use strict' is still on line 547, so no lines were added above the game. No ZZTEST.
- Feature (iPad, rich save, camera turning all the time): evening 20:36 → 21:56: 9 cars went away and 0 of them while on screen. Walkers who went home at once: 0 while on screen. At 0:17: 2 cars and 3 walkers (the night owls). Morning 5:24 → 7:03: all 12 cars back, 0 of them appeared on screen, glows off. At 12:14: 24 walkers out and 12 cars. 0 console errors.
- Draw calls at night (23:30, everything settled, iPad, same spots, before → after): your house 106 → 127 (the 3 night owls happened to be in view there), town centre 147 → 143, shop street 420 → 420, park corner 52 → 51, east side 143 → 138, Friends Lane 31 → 33. So the night costs about the same as before, and much less than the day.
- Draw calls by day (12:00, before → after): 150 → 150, 244 → 230, 482 → 473, 49 → 53, 142 → 146, 31 → 31. The glows are off by day; the small differences come from walkers and cars being in other places.
- Town size (E1): the city group gets +1 piece and +512 triangles (2 glow squares for each of the 128 lamps). This is far below 10%. The town scenery group "outside" is unchanged. Each car gets 1 small glow piece (12 triangles), and the cars are not part of the measured groups.
- Old save (first version) on iPhone portrait at 22:50: loads, 3 cars driving (1 was still in view), 0 console errors.
- New player's opening on iPhone portrait: finishes (name, town, 8:10, 12 cars), 0 console errors.
- Rich save on iPad: 0 console errors in every run.
- Screenshots looked at: iPhone portrait night street (car with two warm headlights and a soft pool on the road, lamp halos, warm windows), iPad night streets (lamp halos and pools, warm windows, stars) and iPad dusk at 19:30 (soft lamp glow starting).
- Review fixes (agent-tests/job9-fix1): syntax ok, 'use strict' still on line 547, no ZZTEST.
  - Headlight pool: iPad light 0:00 at 9 m in front of the night car and from the side: a clear soft warm pool on the road, cozy, not glaring. iPhone dark: visible too.
  - Cars coming back: rich save, 23:30, standing where 3 away cars had left in view (cars 2, 3, 9), then 6:57: within 10 frames all 12 cars were back; those 3 came back elsewhere on their loops, 0 on screen, 0 within 10 m of you. Old save on iPhone, standing still from 6:18 to 9:18: all 12 back, 0 on screen.
  - Walkers after a clock jump: standing still in the street, 19:36 -> 23:24: after 15 seconds only the 3 night owls were out (before the fix 6-7 were still walking home). 0 walkers vanished on screen in all runs (evening 20:36 -> 21:56 with the camera turning, too).
  - Evening/night/morning/day counts with the camera turning: same as before (night: 3 owls, 2-3 cars; morning 7:03: 12 cars, glows off; 12:00: 24 walkers, 12 cars). 0 cars appeared or vanished on screen.
  - New player's opening (iPhone): finishes, 12 cars. 0 console errors in every run.
