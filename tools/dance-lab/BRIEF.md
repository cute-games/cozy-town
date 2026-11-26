# Dance Lab — brief for the builder (25 Nov 2026)

Cozy Town is a three.js toon game for kids (iPad Safari and PC first). It has a two-player **dance-off**: arrows fall down a lane, you press the matching arrow at the right moment. Today it has no music, a fixed arrow rhythm and one simple light effect. The owner wants it to feel COOL.

**Your job: build a standalone test page, the "Dance Lab", in `tools/dance-lab/`.** The owner plays it straight away and guides the look. Nothing in the real game changes in this job.

## Hard rules
- Touch ONLY files inside `tools/dance-lab/`. No other file in the repo changes. Read `CLAUDE.md` for the project's style rules.
- Work on branch `chatgpt/dance-lab` made from this branch (`claude/dance-lab-base`). Open a pull request against `claude/dance-lab-base`, NOT against `main`. Do not merge.
- The page must run by opening `tools/dance-lab/index.html` from any static host: no build step, no server, no network calls, no CDN, no external fonts. Everything it needs sits inside `tools/dance-lab/` with relative paths (it will be published as a self-contained folder). Total size without songs under 600 KB.
- Kids play this: nothing scary. No full-screen flashing faster than 3 times a second. A "calm lights" switch that removes flashes and shake.
- Must run smoothly on an older iPad (aim 60 fps, never below 30): Canvas 2D or light WebGL, no heavy post-processing. If you use three.js, copy the game's own build from `js/` into the folder; do not download another.
- Keep family names out of the repo. No new dependencies.

## The songs (already in `tools/dance-lab/songs/`, all CC0, 30-second previews, mono 64 kbps)
The owner and the game's designer picked these 11 songs. Some have several versions (use them as intensity steps):
- Alley Cat (Tallbeard) — `alley-cat-dumpster-divin.mp3`, `alley-cat-dumpster-party.mp3` (cat meows; the owner's favourite)
- Heart-Shaped (Tallbeard) — `heart-shaped.mp3`, `heart-shaped-2.mp3`
- Crushing It (Tallbeard) — `crushing-it.mp3`, `crushing-it-2.mp3`
- Piecemeal (Tallbeard) — `piecemeal.mp3`, `piecemeal-2.mp3`
- Never Miss (Tallbeard) — `never-miss.mp3`, `never-miss-2.mp3`, `never-miss-3.mp3`
- Cloak of Darkness (Tallbeard) — `cloak-of-darkness.mp3`, `-2`, `-3`
- Penguin Town (Tallbeard, Three Red Hearts) — `penguin-town.mp3`
- Ludum Dare 30 04 (Tallbeard) — `ludum-dare-30-04.mp3`
- Talking Cute (Pro Sensory, chiptune) — `talking-cute.mp3`
- Dance Field (Centurion_of_war, 8-bit) — `dance-field.mp3`
- Hella Bumps (cynicmusic, hip-hop) — `hella-bumps.mp3`

## What to build
1. **Song list**: tap a song (and a version) → the round starts after a 3-2-1. Back button, restart button (and key R).
2. **Arrows on the beat**: analyse every song file offline (write the script, keep it in the folder) to get tempo (BPM), the time of the first beat and where the loud parts are. Save the result in `songs.json` and CHECK it by ear-equivalent means (e.g. onset energy lines up with the beat grid; print the error). Arrow charts are made from a seed + the beat grid, never from `Math.random`, so two players with the same seed get the same chart. Levels 1–5: level 1 = an arrow every 2 beats, level 5 = eighth notes and doubles. Within a round the chart gets denser toward the end ("more and more intense" is the designer's idea).
3. **The lane**: four columns ⬅️ ⬇️ ⬆️ ➡️ in the game's colours `#ff7aa8`, `#7cc8ff`, `#7fdcb5`, `#ffd45c`, a hit line with four receptors, arrows falling at a speed that is easy to read. Arrow keys on a PC; four big touch buttons (at least 64 px, never under 44) on iPad/phone. Works upright and sideways.
4. **Pressing on time**: judge each press as Perfect / Good / Late-but-OK / Miss with clear windows (today's game: hit within 0.28 s, Perfect within 0.10 s: 15 or 10 points). Show it: a burst of particles in the arrow's colour, the receptor glows, the word pops, a combo counter grows, a small camera bump on Perfect. A miss is gentle (a soft grey puff), never punishing.
5. **Timing offset ("a little bit delayed")**: Bluetooth speakers and iPads delay sound. Add an offset slider (−250…+250 ms) and a 10-second "tap to the beat" helper that sets it. Store it in localStorage inside try/catch.
6. **A look for EACH song**: every song gets its own stage that fits its name and mood — background, colours, lights and moving things that pulse with the beat and get wilder in the loud parts. Ideas (make them better): Alley Cat = night alley, neon sign, cat eyes blinking on the beat, cats hopping on bins; Penguin Town = snow, ice floor, sliding penguins; Heart-Shaped = floating hearts, pink spotlights; Cloak of Darkness = purple fog, candles, friendly bats (not scary); Never Miss = archery targets, arrows of light; Crushing It = bright gym/arena, confetti cannons; Piecemeal = jigsaw pieces snapping together on the beat; Talking Cute = chunky pixel-art world; Dance Field = 8-bit meadow, pixel flowers bobbing; Hella Bumps = street block party, bouncing speakers; Ludum Dare 30 04 = space, two planets linked by light. Plus stage lighting on all: spotlights that sweep, a mirror ball, floor tiles that light up, light beams on Perfect streaks.
7. **Two dancers** on the stage: simple toon figures (round head, body, arms, legs, in the game's soft style). They bob on the beat; on a hit the player's dancer does that arrow's move: ⬅️ lean left, ⬇️ crouch, ⬆️ both arms up, ➡️ lean right. The second dancer plays by itself (a seeded bot that hits about 80%). A score bar between them.
8. **Guide panel for the owner** (a gear button): sliders for arrow speed, hit window, effect strength, level 1–5; switches for calm lights, auto-play (the page plays itself so he can just watch the effects), show beat grid. A "copy settings" button that copies the values as text.
9. **Result card** at the end: both scores, best combo, Perfect count, play again.

## Code shape (so it can move into the game later)
- `index.html`, `lab.css`, `lab.js` (page and input), `dance-fx.js` (all drawing of stage, lights, effects: one function per song theme + shared helpers), `chart.js` (seeded chart from beat grid + level; pure functions), `judge.js` (timing windows and scoring; pure functions), `songs.json`, `songs/`, `tools/` (the analysis script).
- `chart.js` and `judge.js` must have a tiny test file you can run with Node that prints PASS/FAIL (same seed → same chart; denser at level 5 than level 1; a press 0.09 s off is Perfect, 0.27 s is a hit, 0.29 s is a miss).

## Check your own work before you finish
- Open the page in a headless browser at 1180×820 (iPad sideways), 820×1180, 390×844 and 1920×1080; play every song on auto-play for its full length; no page errors; take one screenshot per song mid-round and look at each: nothing overlapping, text readable, the theme recognisable.
- Measure frames per second on auto-play for the heaviest theme and report it.
- Say plainly what you could not check (sound, real iPad, touch feel) as NOT VERIFIED.

## Report in the pull request
Short and plain, for a non-coder: what each song's stage shows, the measured BPM table, test output exactly as printed, screenshots, and what is NOT VERIFIED.
