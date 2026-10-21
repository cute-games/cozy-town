# Pass 11: each kept mark and what was done (run 4 finish, 21 Oct)

The marks are in `merged.json` (verdict KEEP or DROP and the double-checker's words); the entries are the glitch list's (`tools/GLITCH-LIST-4.md`).

- G4-249 (fixed): M-022: a grandma walking by (after G4-231). Her step aside followed the drawn frames, so on a slow screen (the PC pictures) it lagged and she passed 1.5 m from you; it follows the clock now, and keeps 2.4 m, like a passer-by (patch_f8.py).
- G4-250 (fixed): M-015, M-017: the big map. A friend's name was tested against its own dot with the air round it (stage 3), so every side touched the dot and no name was ever drawn; it is tested against the others only. A place's name a friend's dot lies on is drawn again over the dot (patch_f8.py).
- G4-251 (fixed): M-020: the What's new book. The footer is three columns, the dots in the middle one (patch_f8.py).
- G4-252 (fixed): M-024: a message after the clock jumped. It had waited for its turn while the clock jumped (in the game: a night in bed); a waiting message is dropped once the game clock has moved half an hour or a day since (patch_f8.py).
- G4-253 (fixed): M-027: a message over the big map. With a big card open and no free spot beside it, a message goes up in the top row, left of the round buttons (patch_f8.py).
- G4-254 (fixed): M-023: New Year's fireworks. Bigger sparks (up to 16 px), 130 to a burst, in their own colours: added up, sparks lying on each other made a young burst a white blob; they fade in over the first moment and stay bright longer (patch_f8.py).
- G4-255 (fixed): M-034: the photographer's stars. Only the school sign had a point to check whether the background is in the photo; every other background counted as in. Each now has one: 2 m behind where the group stands, 1 m up (patch_f8.py).
- G4-256 (fixed): M-041, M-042: a photo shoot at the Pet Show stage. The judges step out of a photo shoot like anyone else (patch_f8.py).
- G4-257 (open): M-005, M-040: shadows (G4-088 again). The same as G4-088 and G4-244: the sun's shadow map (2048 px over 60 m), written down in stage 3.
- G4-258 (open): M-038, M-039: your pets (G4-205 again). The same as G4-205: not changed, written down for the owner (section 5c).
- G4-259 (not a glitch): M-002, M-008, M-019, M-021, M-025, M-043: decided before. A card over the dimmed HUD (G4-033, G4-060); the photographer's garden spot repaints the house on purpose (G4-223); where the owner put the joystick (commit 0f5939f); your own shadow (G4-146); the HUD stays where it is, and the photographer's New Year row stands left of the middle; the list's scroll hint (G4-034).
- G4-260 (not a glitch): M-029, M-030, M-031, M-032, M-033, M-035, M-036: the check's own staging. N1 photographs from a fixed spot; N10's camera stands 2.7 m behind the grandmas' park stop, where one stood facing the fountain; N11 photographs each new pet by the same lamp post; N21 puts you in one step right behind a tall townsperson under a street tree; N27 looks up after each pick-up (the check counts the litter by code).
