# Pass 13: each kept mark and what was done (run 4 finish, 21 Oct)

The marks are in `merged.json` (verdict KEEP or DROP and the double-checker's words); the entries are the glitch list's (`tools/GLITCH-LIST-4.md`).
83 viewer marks; 51 set aside by `dcfilter13.py` (known, by design, the check's own staging, each with its reason); 32 to the double-checkers: 21 KEEP, 11 DROP.

- G4-273 (fixed): M-015, M-021, M-024: the clock chip's rain. The rain streaks fade in from rain level 0.3 to 1; the chip turned to 🌧️ at 0.3, with nothing falling yet. It turns at 0.55 now (patch_f10.py).
- G4-274 (fixed): M-023: a photo shoot that never ended. Opening the phone or the bag over the result card left the shoot on (the map, the notepad and the job box hidden, only the shoot's own buttons working, until you left town); once its result card is gone the shoot ends as with Bye (patch_f10.py).
- G4-275 (fixed): M-014: quests. No "Eat some flour" or raw eggs for a snack, and no flour or eggs among a spree's treats, on new days (patch_f10.py).
- G4-276 (fixed): M-025: the Pet Shop's owl. It walked the whole pen at its perch's height, in the air; it keeps to the perch now and faces the room when it stops (patch_f10.py).
- G4-277 (fixed): M-001, M-003 (both dropped by the double-checker: from the front the string is behind the back wall): the park's holiday garland ran along the bus shelter's back, through its roof's rim; two pieces now, either side of it (patch_f10.py).
- G4-278 (not a glitch): M-007, M-008, M-011, M-012: two ducks one behind the other from the spot (80 cm apart at the nearest); a bird flying over, edge-on.
- G4-279 (open): M-032: the salon floor softens near the camera on a big screen (256-pixel floor pictures); written down.
- G4-280 (not a glitch): M-005, M-010, M-019: decided before (the photographer's spot; the list's scroll hint G4-034; the salon sign dropped in pass 12).
- G4-281 (not a glitch): M-016, M-020, M-022, M-026, M-027, M-028, M-029: the check's own staging.

Dropped by the double-checkers (each one's words in `merged.json`): M-002 and M-030 (an older chat bubble under the phone's header, as in any chat), M-004 (names at the big map's edges), M-006 (the notepad over the pond's edge), M-009 (the baskets' soft shadows), M-013 (a friend in front of a sign), M-017 and M-018 (N1 forces a holiday on an October day: autumn trees), M-031 (the gate's signs at the screen's edges).

The photographer: the night and rain town views move the cars near a spot along, as the day views do (a car passing 2 m in front of the school spot filled the night picture; `shots8.py`).
