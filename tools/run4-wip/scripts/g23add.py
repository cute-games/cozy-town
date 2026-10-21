p='glitches5_data.py'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
rep("'p22': 'stage3-dc22'}","'p22': 'stage3-dc22', 'p23': 'stage3-dc23'}")
rep("'p22': 'pass 22'}","'p22': 'pass 22', 'p23': 'pass 23 (the full final pass)'}")
rep("F18 = ' (patch_f18.py)'\n","F18 = ' (patch_f18.py)'\nF19 = ' (patch_f19.py)'\n")
new = r'''
 ('334', ['p23:M-006'], 'the designer job: a two-room order', 'iPad', "In room 2 (a forest living room) a white fridge stood inside a pink armchair.", 3, 'fixed',
  "Room 2 drew room 1's furniture: setting a room up always laid out room 1's list (`o.items`), so room 1's fridge stood where N8 put room 2's armchair, and after a trip back to room 1 your pieces in room 2 were gone from view (the order's lists themselves were right). Each room now shows its own list" + F19 + '.', "the kit's N8 with a probe, before and after: in room 2 drawn sofa, armchair, stove, fridge (room 1's and room 2's) and after a trip back only room 1's before; only room 2's own, both times, after; pass 24's re-check."),
 ('335', ['p23:M-008', 'p23:M-016'], "a grandma's bubble on an upright phone", 'iPhone upright, dark theme', 'At the duck pond and the Flower Corner her bubble lay half under the corner map and the notepad ("...s the ...ay."; "...! Such a pretty garden.").', 2, 'fixed',
  "On an upright phone the map and notepad column is a third of the width: a bubble held over its speaker (who stood under the column or off the left edge) could not clear it, and a speaker off the edge had the whole column counted on its right. Such a bubble now slides fully clear of the column, and a HUD part counts as left or right by the half of the screen it is in" + F19 + '.', "probes on an upright iPhone and an iPad, dark, before and after (`views_f19.py`): under the column before, readable beside it after (a bubble wider than the space beside the column runs a few pixels past the right edge); pass 24's re-check."),
 ('336', ['p23:M-004', 'p23:M-007'], 'the food truck', 'iPad', "A small grey ball on the truck's side by the awning's end.", 1, 'open',
  "It is the truck's little evening lamp under the awning's end (unlit by day, with no bracket). Small: left as it is, in the leftover list.", ''),
 ('337', ['p23:M-003'], 'the Christmas tree at night', 'iPad, dark theme', "Two big white glows at the sides of the tree's middle washed out its edge.", 1, 'open',
  "The tree's lights glow at night; two of them read as a flare. Small: left as it is, in the leftover list.", ''),
 ('338', ['p23:M-001'], "the photographer's close view of the ducks", 'iPad', "A big dark purple box at the right edge of the view, by the blue house.", 1, 'open',
  "Something by the blue house's corner stands right at that camera spot (the photographer's fixed view). Small: left as it is, in the leftover list.", ''),
 ('339', ['p23:M-002', 'p23:M-005', 'p23:M-010', 'p23:M-011', 'p23:M-012'], 'not a glitch', 'iPad, iPhone upright, PC', "Cattails in front of a grandma on the pond bench; a brown slab at the corner of N22's school view; someone at the left edge in the Pet Shop; two shoppers one behind the other in the flower shop; N24's two grandmas one behind the other on their bench.", 1, 'not a glitch',
  "The cattails stand between you and the bench; N22's and N24's pictures come from the check's own camera spots (as N6's, G4-289); someone 1.3 m or more from you is drawn (G4-171, G4-300); two people at different distances, one in front of the other (G4-332).", '—'),
]
'''
s=s.rstrip()[:-1].rstrip('\n')+new
open(p,'w').write(s)
