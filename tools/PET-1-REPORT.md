# Pet update 1, stage 1 (small things): report (29 Oct 2026, stamp 2026102902)

Branch `claude/pensive-cannon-kuuzyq`. Backup before the update: branch `backup-2026-10-29b` (made from `main` after Plan 1 was merged; `backup-2026-10-29` is the one before Plan 1).
Effort asked: Opus 5.5 medium. Not in this stage: the night skip.

## What changed
1. **Long shop hours.** The Market, Flower Shop, Clothes Shop, Toy Store, Ice Cream Shop and Food truck are open 7:00 to 23:00 (`LONG_SHOP`, `LONG_ON`, `LONG_OFF`, `longOpen()`, `opensAt(id)` in `js/03-game.js`). Every other place and all jobs keep 8:00 to 20:00; `isDaytime()` is unchanged (job hours, window lights, day tick).
   - Their door hint "🌙 Closed · opens at 7:00", the door message, the "come back at" line when buying and the closing-time message say 7:00; the others still say 8:00.
   - The closing-time message comes at each shop's own closing time (23:00 for these six, 20:00 for the others): `dayTick` watches both clocks.
   - The "🌙 Closed" door signs: two meshes now, `CLOSED` (Café, Pet Shop, Bakery, Library: 20:00-8:00) and `CLOSED_L` (Market, Flower Shop, Toy Store, Ice Cream Shop, Clothes Shop: 23:00-7:00). One picture, one material, as before.
2. **Interior designer: one room.** `dsNew()` makes one-room orders only (the client's message no longer asks for two rooms; the phone's job page no longer says "Some clients want two rooms"). A 2-room order saved unfinished still plays to the end and pays for both rooms (all the 2-room code stays).
3. **Up to 10 pets, 3 follow.** `PET_MAX=10`, `PET_FOLLOW=3` (`js/04-panels.js`).
   - Adopting a 4th to 10th pet: it waits at home in your front yard (toast says so). An 11th: "You have 10 pets already".
   - A pet at home: `stay` plus a new field `home` (spot in the yard in the old town-yard frame, like every yard spot in a save). It always stands in your yard on Friends Lane (`petFrom()` in `js/03-game.js`), even when you saved somewhere else (before, a pet told to stay in the yard was put by `S.yq`, a flag about where *you* saved). Pets at home wander a little (0.7 m) on their own patch.
   - **🐾 My pets** (from the pet card when you have more than 3 pets, and in ⚙️ Settings next to "Bring my pets to me"): every pet with its picture, where it is, and "🐾 Follow me" / "🏡 Go home". A 4th follower is refused ("Send one home first"); the pet card's "Follow me" is refused the same way.
   - "Bring my pets to me" brings up to 3 (the followers first, then pets waiting somewhere, then pets at home); a pet left waiting somewhere else goes home.
   - Loading a save where more than 3 follow (an old version's "Bring my pets" calls them all) sends the extras home.
   - Online: unchanged. Presence already carried at most 3 following pets, so old and new versions see each other's 3.
4. **Give a pet to Ms. Paws.** In the Pet Shop card: "💔 Give a pet to Ms. Paws" → pick the pet → one card with its name and picture ("Give X to Ms. Paws? She will find X a loving new family. You don't get coins back, and X won't come back.") → "💔 Yes, give X away" / "💗 No, keep X". Yes: the pet is gone for good, no coins, the spot is free.

## Kit lines rewritten (old → new)
- **N8** (the owner's OK in the request). Old: "Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes" (made a new 2-room order with `dsNew(2)`). New: "Designer: new orders are one room; a saved unfinished 2-room order plays to the end and pays; a saved 1-room order still finishes": 41 new orders (`dsNew()` ×40, `dsNew(2)` ×1) are all one room with no two-room message; a new fixture `save-prepet1-designer2.json` (the designer fixture with a 2-room order in the shape the live version writes: room 1 done, room 2 empty) plays to the end (the "All done?" with room 2 empty still refuses) and pays for both rooms; the 1-room part unchanged.
- **N9** (follows from the owner's new truck hours). Old: at 21:00 the Food truck must not sell. New: at 21:00 it must sell, and at 23:30 it must not. Nothing else in N9 changed.
Both in `tools/kit-v7/make_v7.py` (the kit is rebuilt from v6 by that script; only `night3.py` differs from the 29 Oct kit).

## Checks
- Quick kit runs (`--only files,counts,saves,night3,run4`): after changes 1-2 all PASS but N9 (the truck now rightly sells at 21:00 → N9 rewritten, above); after all four changes all PASS (A2 needs the backup, given only in the full check).
- **Full check** (kit v7 `--full`, 29 Oct): **ALL PASS**, 3 not run or not verified as always (C1-WK, F3 until merged, G real devices) — `tools/pet1-wip/final-check-2026-10-29-pet1.txt`. B1: 17 old saves (with the new 2-room fixture) load with 0 differences. D1: old + new versions together.
- Split check (`check_split.py`): S1-S4 PASS.
- Session probes (`tools/pet1-wip/probe_pet1.py`, results `probe-results-2026-10-29.json`), all PASS:
  - hours: at 6:30, 7:12, 7:54, 8:30, 19:54, 20:30, 22:30, 22:57, 23:12 exactly the right shops open, `isDaytime()` unchanged, the right "Closed" signs shown; door hints say 7:00 / 8:00 as they should; closing messages "Mr. Bun … See you at 7:00" at 23:00, "Mr. Mocha … See you at 8:00" at 20:00, none from the Market at 20:00; buying at the Market works at 22:30 and is refused at 23:12 ("Come back at 7:00").
  - pets: 10 adopted (3 follow, 7 go home), the 11th refused; My pets swaps work and a 4th follower is refused (also from the pet card); the 7 home pets stand inside the yard after 10 s of wandering; "Bring my pets" brings 3; saved and loaded: the same; **the live (old) version loads the 10-pet save** with no errors (10 pets, 3 follow).
  - give-away (iPhone, dark): list of 10 → card with the name and a 200 px picture → "No, keep" changes nothing → "Yes": 10 → 9 pets, coins unchanged, the pet gone, adopting possible again.
  - two players: two new players with 10 pets each and one old-version player: each sees the others with their 3 following pets.
- Pictures (only what this stage touched; new feature = two viewers each, Sonnet): 60 pictures (My pets, give list, confirm card, pet card, settings row, adopt-full: iPad, iPhone upright and sideways, PC, light and dark; the yard at noon and evening; the shop doors at 21:30; the truck at 21:30 and 23:30; the Market door at 6:30). Fixed from the marks: the confirm card's name tab cut off at the top (now a normal card header), the give list opening scrolled down (cards open at their top), home pets standing in the flower beds (new yard spots, smaller wander), a smaller picture on a sideways phone. The door/truck pictures were re-aimed. Re-check (30 pictures, two viewers): nothing above grade 1.
- Leftover minor marks (grade 1, not fixed): on a sideways iPhone the give list and the confirm card need a scroll for the Back / Yes-No buttons (the usual ⬇️ hint shows); the yard from the street: some home pets are partly behind the fence and beds, and tags at the screen edge are cut; a lamp post / branch in front of the Ice Cream Shop and Toy Store signs from the test's spot (not new).

## Frame rate, 2 players × 10 pets
Measured in the container (headless Chromium, iPad landscape screen, SwiftShader: the drawing runs on the CPU, so these are for comparing, not a real iPad's frame rate). Two players in the fake room, both with 10 pets, standing on Friends Lane looking into the yard with the 7 home pets:
- Frame rate: 60 fps (the screen's limit) with and without the pets, also with the CPU slowed 4× (59.4 fps new, 56.3 fps live with 2 × 3 pets).
- The game's own work per frame (no drawing): 0.82 ms new vs 0.84 ms live — 10 pets cost nothing measurable.
- Drawing: one pet is about 23-25 pieces. With the home pets in view the draw calls go from 136 to 287 and one SwiftShader frame from 4.5 to 8.6 ms. Only when you look at your yard; elsewhere frustum culling skips them, and the other player's home pets are never sent (only 3 following).
- For the owner on the real iPad (line G): stand in front of your yard with 10 pets and see if it stays smooth. If not, the cheap fix is to draw fewer pets at home (or simpler pets far away).

## Where the tokens went
- Viewers (Sonnet): 4 × first pass (91k, 93k, 102k, 103k) + 2 × re-check (99k, 99k) ≈ 587k.
- Main session (Opus 5.5 medium): reading code by search, edits, kit and probe runs; most of the rest of the session.
- Kit runs: 2 quick (~35 min each) + 1 full (63 min).

## Open for the owner
- The "Pet family" hard challenge grows 3 → 5 → 8 → 12 pets; with 10 pets at most, level IV (12) can never be finished (before this update level II, 5, could not). Not changed (not asked).
- Old versions show a pet at home like a pet told to stay; when that player saved away from the yard, the old version puts it in the Flower Corner (its old rule). The new version always puts it in the yard.
