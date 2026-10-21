p='glitches5_data.py'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
rep("'p23': 'stage3-dc23'}","'p23': 'stage3-dc23', 'p24': 'stage3-dc24'}")
rep("'p23': 'pass 23 (the full final pass)'}","'p23': 'pass 23 (the full final pass)', 'p24': 'pass 24'}")
rep("F19 = ' (patch_f19.py)'\n","F19 = ' (patch_f19.py)'\nF20 = ' (patch_f20.py)'\n")
rep("UPDATES = {\n","UPDATES = {\n    'G4-334': {'check': \"the kit's N8 with a probe, before and after; pass 24: the kit 41 of 41 PASS, N8's room-2 picture with only room 2's pieces, no mark about it.\"},\n    'G4-335': {'check': \"probes before and after (`views_f19.py`); pass 24: the pond bubble readable; the Flower Corner bubble ran past the right edge: G4-340.\"},\n")
new = r'''
 ('340', ['p24:M-001', 'p24:M-002', 'p24:M-003', 'p24:M-004', 'p24:M-005', 'p24:M-006', 'p24:M-007', 'p24:M-008'], "a grandma's bubble at the Flower Corner", 'iPhone upright, light and dark theme', 'Clear of the map column since f19, her bubble ran past the right edge of the screen ("Such" cut, no right border).', 2, 'fixed',
  "The bubble (253 px) was wider than the space beside the column (234 px). A bubble that slides clear of the column and is wider than the space beside it is now drawn smaller to fit" + F20 + '.', "the Flower Corner probe on an upright iPhone, after (`views_f19.py`): the whole bubble on the screen beside the map; pass 25's re-check."),
]
'''
s=s.rstrip()[:-1].rstrip('\n')+new
open(p,'w').write(s)
