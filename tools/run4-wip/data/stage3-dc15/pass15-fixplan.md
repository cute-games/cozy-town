# Pass 15: each kept mark and what was done (run 4 finish, 21 Oct)

The marks are in `merged.json` (verdict KEEP or DROP and the double-checker's words); the entries are the glitch list's (`tools/GLITCH-LIST-4.md`).
94 viewer marks; 78 set aside by `dcfilter15.py` (known, by design, the check's own staging, each with its reason); 16 to the double-checkers: 13 KEEP, 3 DROP.

- G4-290 (fixed): M-003, M-010: a quest's steps. A long step wrapped under its ○ and "Ice / Cream Shop" was split over two lines; a step wraps under its own words now and the shop's name keeps together (patch_f12.py).
- G4-291 (fixed): M-007: the photo frame on a touch screen held sideways. Its left edge kept off the joystick (stage 3), its right edge stayed near the screen's edge, so its middle was 70 to 76 px right of the camera's: the family you faced stood left of the frame's middle, in the photo too. It keeps the same space on both sides now (patch_f12.py; `views_f12.py`: the frame's middle and the family's 498 and 422 before, 422 and 422 after, five stars both times).
- G4-292 (fixed): M-015: the clock chip on a cloudy night showed 🌙 while the clouds hid the moon and the stars; it shows ☁️ under a grey night sky now (patch_f12.py).
- G4-293 (fixed): M-009: the path through the Tree Park's gate in town stopped in a straight edge in the grass; its far end is round now (patch_f12.py).
- G4-294 (open): M-001: saw-tooth marks on a Tree Park crown. Traced by script (`views_f12tp.py`): nothing stands between that point and the sun; the steps of the sun's shadow map (2048 pixels over 60 m), as G4-088 and G4-257.
- G4-295 (not a glitch): M-002, M-006, M-013, M-014: the white duck from behind at night; the market's keeper behind the fruit stand from the door on an upright phone; the photographer's Santa view with the tree's star above the screen's top; a firework burst at the screen's edge and an older one fading.
- G4-296 (not a glitch): M-004, M-011, M-016: decided before (the HUD over a sign on an upright phone, section 9c; your own shadow, G4-146 and G4-271; N21 right behind a townsperson, G4-260 and G4-281).

Dropped by the double-checkers (each one's words in `merged.json`): M-005 (a shop's wall beside the Tree Park gate's path, the gate in full view), M-008 (the Toy Store sign's words are centred over the door), M-012 (the Christmas tree's star at the screen's top: normal framing near a tall tree).

The filter for pass 16 (`dcfilter16.py`) sets aside pass 15's decisions and drops; on pass 15's own marks it keeps exactly the 5 that f12 fixed.
