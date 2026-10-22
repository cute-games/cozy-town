# Pass 20: the kit, each kept mark and what was done (run 4 finish, 21 Oct)

Pass 20 is the first under the owner's glitch loop rules of 21 Oct (`CLAUDE.md`): the kit's night3 and run4 lines in full on the f16 file, then
pictures of f16's spots only (26: `views_f16.py` on iPad and sideways iPhone in light and on iPad in dark, `views_f16b.py` on 1 September on iPad
and PC, a real two-phone dance-off `shots4c_f.py`), five viewers (dark mode, iPad touch, shops/people, lighting/objects, text/UI; Sonnet,
medium), `dcfilter20.py`, six first checkers (Sonnet, medium), then each mark decided here with its picture opened.

The kit (`p20kit.sh`, 23 min, alone): 40 of 41 PASS; N25 FAIL on all three screens: "the photo in the phone chat" (a kit line failing, not on
timing: above minor).

The marks are in `merged.json` (verdict KEEP or DROP and the first checker's words). 12 viewer marks (5 viewers: 2, 5, 1, 5, 5); `dcfilter20.py`
kept 12 and set 6 aside, all 6 under a reason that does not fit (4 "a talking townsperson's bubble" and 2 "a card over the dimmed HUD", for a
speech bubble under the clock chip and the top buttons, the spot f16's bubble fix touched): sent on too (`stage3-marks20/README-extra.txt`).
18 marks to 6 first checkers: 17 kept, 1 dropped.

- G4-327 (fixed, grade 2): the kit's N25: right after the thank-you card, the photo in your phone's chat had no size yet at the moment the phone
  opened. Probes (`n25probe`: the check's own steps, with the picture's state read at once and half a second later): the image was there, 320 px,
  a moment later; on the f15 file it had its size at once. Since f16 the card shows the sharp copy, so the phone's small copy was first decoded
  when the phone opened. f17 decodes it at the snap (as when the card showed it). N25 alone on the f17 file, twice: PASS.
- G4-328 (fixed, grade 2): M-013 to M-016 (sideways iPhone: a grandma's bubble by the pond under the clock chip and the top buttons, only
  "ducks is the ... of my day." readable), M-001, M-006, M-007, M-017, M-018 (iPad, light and dark: its corner on the clock chip). f16's
  `bubDodge` kept a bubble clear of the map column and the buttons sideways only; the top row's band was left out. A speech bubble now also stays
  below the top row: it moves down, at most its own height, then slides sideways as before (`views_f17.py`, before and after on both screens:
  under the chip before, the whole bubble below the top row after).
- G4-329 (open, grade 1): M-003, M-005, M-011: a white pill with an "e" behind the "Pose: Mia" label on a sideways phone. A probe listed every
  page element there: only the action label; the pill is the name tag of the group member at the screen's edge. Left as it is (pushed below
  the label a tag would leave its person); in the leftover minor list.
- G4-330 (not a glitch): M-004 (the notepad cream lined paper in the dark theme: by design, its words readable); M-002, M-008, M-009, M-010
  (a shopper big at the right edge of the Toy Store in dark, partly behind "Say hi": its head 150 px across on the iPad, about 1.5 m from the
  camera; someone 1.3 m or more from you is drawn, G4-171, G4-300; a probe at the same spot later in the day had nobody near).

Dropped by the first checkers: M-012 (the dance-off's arrow lane over the floor's lower part on an upright phone, the dancers' feet in view).

f17 (`patch_f17.py`, 4 edits): the two fixes above; on a copy first (`jscheck.py` 0 bad, 55 online-part lines, 1,596,650 bytes), then the real
file (md5 528fe0df).

The filter for pass 21 (`dcfilter21.py`) sets aside pass 20's decisions and its drop, and the bubble rule and the clock chip rule leave a speech
bubble under the clock chip or the top buttons to the first checkers. On pass 20's marks it keeps exactly the 9 that f17 fixed; on passes 17 to
19 it keeps the same as `dcfilter20.py`.

Stop rule (counting from pass 20): pass 20 has fixes above minor (G4-327, G4-328, grade 2), so the count of clean passes starts again at 21.
