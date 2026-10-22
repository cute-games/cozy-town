# Pass 16: each kept mark and what was done (run 4 finish, 21 Oct)

The marks are in `merged.json` (verdict KEEP or DROP and the double-checker's words); the entries are the glitch list's (`tools/GLITCH-LIST-4.md`).
65 viewer marks; 56 set aside by `dcfilter16.py` (known, by design, the check's own staging, each with its reason); 9 to the double-checkers: 8 KEEP, 1 DROP.

- G4-297 (fixed): M-005: the white duck sat on a lily pad, the pad's flower through its chest. The little pond's ducks keep 34 cm from each lily flower; and a duck pushed aside by the other (80 cm apart) swam on straight at its old goal across a flower: a step into water it may not use ends that swim now (patch_f13.py; `views_f13.py`: within 34 cm of a flower in 368 duck-frames before, none after; `views_f13b.py`: the ducks still swim and come when fed).
- G4-298 (fixed): M-007: the white duck's far eye showed as a white ring past its head's outline. The eyes sit a little deeper and their shine on their top, inside the head's outline (patch_f13.py; `eyegeo2.py`: a shine past the outline from 1148 of 1440 view directions before, none after; `eyegeo3.py` to `eyegeo5.py`: the other places tried; `views_f13face.py`: both ducks from the front, the side and behind).
- G4-299 (not a glitch): M-001, M-006, M-009: Luna, on her own walk in town, behind the lamp post beside the photographer's bus-stop spot (her place is not the friends' fan: the photographer sends following friends away); two ducks one behind the other from the pond's spot (G4-278); N39's picture caught the invitation card's 0.2 s pop-in (it shows once per invitation; the line measures the card).
- G4-300 (not a glitch): M-002, M-003, M-004: decided before (a grandma walks round you at 2.1 m, G4-231: on an upright phone she fills the narrow view as she passes; the pose card over the photo frame while it is open, G4-033 and G4-060).

Dropped by the double-checker (its words in `merged.json`): M-008 (N19's camera at the gate: its signs at the screen's edges and under the HUD).

Set aside under a wrong reason: the dark-theme picture of a townsperson at the camera inside the Pet Shop (iPhone sideways) got the pets' reason ("Pet Shop" read as a pet); its light-theme twin was set aside as the photographer's spot. `dcfilter17.py` no longer reads "Pet Shop" as a pet, so such a mark goes to the double-checkers.

The filter for pass 17 (`dcfilter17.py`) sets aside pass 16's decisions and drops; on pass 16's own marks it keeps the 2 that f13 fixed and the mark above.
