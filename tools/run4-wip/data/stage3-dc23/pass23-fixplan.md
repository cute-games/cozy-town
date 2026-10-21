# Pass 23, the full final pass: each kept mark and what was done (run 4 finish, 21 Oct)

Under the owner's glitch loop rules of 21 Oct (`CLAUDE.md`): after the loop stopped (pass 22), one full picture pass on the f18 file
(`final23.sh`): the photographer's three scripts (456 + 32 + 4 pictures) and the kit's own 144 pictures of pass 22's run (the night3 and run4
lines on the f18 file, 41 of 41 PASS); every picture listed (628; no change-spotter, the earlier passes' pictures are not in this container),
each with the one focus it belongs to, in 18 batches of at most 40 (lighting/objects 214, text/UI 132, dark mode 156, iPad touch 64,
shops/people 62); 18 viewers and 6 first checkers (Sonnet, medium); then each mark decided here with its picture opened.

28 viewer marks; `dcfilter23.py` set 14 aside with their reason, 2 of them under a reason that does not fit (sent on too,
`stage3-marks23/README-extra.txt`); 16 marks to 6 first checkers (one checker's answer written from its reply): 12 kept, 4 dropped.

Above minor, fixed (f19) and re-checked like a pass (pass 24):
- G4-334 (grade 3): M-006: in a two-room designer order, room 2 drew room 1's furniture (`dsRoomSetup` laid out `o.items`, room 1's list,
  whatever the room); after a trip back to room 1, room 2's own pieces were gone from view. Probe (the kit's N8 with what is drawn read out):
  before, room 2 drew sofa + armchair + stove + fridge, and only room 1's after a trip back; after, only room 2's own, both times.
- G4-335 (grade 2): M-008, M-016: on an upright phone a grandma's bubble half under the map and notepad column (the pond; the Flower Corner,
  its speaker off the left edge). A bubble whose speaker is under the column or off the edge now slides fully clear of it, and each HUD part
  counts as left or right by the half of the screen it is in (a speaker off the left edge had counted the whole column on its right).
  Probes (`views_f19.py`, upright iPhone and iPad, dark): under the column before, readable beside it after; a bubble wider than the space
  beside the column runs a few pixels past the right edge (in the leftover list).

Minor (grade 1), not fixed, in the leftover list: G4-336 (the food truck's unlit evening lamp reads as a grey ball), G4-337 (two of the
Christmas tree's night lights read as a flare), G4-338 (a dark box at the right edge of the photographer's close duck view), G4-329 (pass 20:
a group member's tag under "Pose: Mia"), and the flower bubble's last letters at the screen's edge (G4-335's remainder).

Not glitches (G4-339): cattails in front of a grandma on the bench; N22's and N24's own camera spots; someone at the edge of the view 1.3 m or
more away; two people one behind the other.

Dropped by the first checkers: M-009 (a shopper cut by the view's edge in the Toy Store), M-013 and M-014 (N3's friends: faces and names clear;
Rosie close because you talk to her), M-015 (the bag's empty hearts in dark: visible, different from the full ones).

f19 (`patch_f19.py`, 3 edits): on a copy first (`jscheck.py` 0 bad, 55 online-part lines, 1,597,078 bytes), then the real file (md5 16f28ff4).

The filter for pass 24 (`dcfilter24.py`) sets aside pass 23's decisions and drops; the upright-phone rules about the HUD over a sign no longer
take a speech bubble. On pass 23's marks it keeps the 3 that f19 fixed and the PC Pet Shop mark (someone at the edge of the view: left to the
first checkers, since G4-304 fixed a shopper waiting at the camera in that spot); on passes 17 to 22 it keeps the same as `dcfilter23.py`.
