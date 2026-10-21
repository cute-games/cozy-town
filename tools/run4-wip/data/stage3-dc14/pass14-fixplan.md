# Pass 14: each kept mark and what was done (run 4 finish, 21 Oct)

The marks are in `merged.json` (verdict KEEP or DROP and the double-checker's words); the entries are the glitch list's (`tools/GLITCH-LIST-4.md`).
75 viewer marks; 58 set aside by `dcfilter14.py` (known, by design, the check's own staging, each with its reason); 17 to the double-checkers: 14 KEEP, 3 DROP.

- G4-282 (fixed): M-004, M-006: the salon card. The customer's words wrapped so the last emoji and the closing quote stood alone on a line ("💕”", "✨”"); the last word keeps to the word before it now (patch_f11.py).
- G4-283 (fixed): M-005: the job box. "· 86 m" started the second line; the distance keeps to the place before it in all five job boxes (patch_f11.py).
- G4-284 (not a glitch): M-007: the dark strip at the iPad's bottom-right corner in the photo shoot at the Duck Pond, in all three pictures of that shoot. Replaying the check's shoot with its booking (`probe_m007.py`): no page element there; the pixels are the outline of a bush 1 m from the camera, whose top is just below the screen's edge (the outline is 2 cm bigger than the bush).
- G4-285 (open): M-003: the phone's job list on a sideways iPhone shows its first row; the second starts right at the screen's foot (the foot fades while there is more below, G4-263; the list scrolls). Written down for the owner (section 5c).
- G4-286 (not a glitch): M-001, M-002: your friends in a shop, at the view's edge or at the counter in front of the menu.
- G4-287 (not a glitch): M-011, M-012: the designer's reveal starts with the client's knock, "Knock knock! 🚪" rising and fading.
- G4-288 (not a glitch): M-014, M-015: decided before (the hair card on a sideways phone, G4-194; your pets at your heels, G4-205).
- G4-289 (not a glitch): M-010, M-013, M-016: the check's own staging (N6's camera right behind the grandmas; N9 tries the truck at 21:00 and its toast is still up at noon; N25's straight-on spot at the hedge with a pavement tree at the frame's left).

Dropped by the double-checkers (each one's words in `merged.json`): M-008 (the Tree Park's chip cloudy while its sky was still blue: the weather changing as you went in), M-009 (the guide star over the next deck, by design), M-017 (the photo with the tree at its left: the people clear and centred, five stars fair).

The filter for pass 15 (`dcfilter15.py`) sets aside pass 14's decisions and drops; on pass 14's own marks it keeps exactly the 3 that f11 fixed.
