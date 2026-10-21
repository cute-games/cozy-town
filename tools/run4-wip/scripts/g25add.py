p='glitches5_data.py'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
rep("'p24': 'stage3-dc24'}","'p24': 'stage3-dc24', 'p25': 'stage3-dc25'}")
rep("'p24': 'pass 24'}","'p24': 'pass 24', 'p25': 'pass 25'}")
rep("UPDATES = {\n","UPDATES = {\n    'G4-340': {'check': \"the Flower Corner probe after (`views_f19.py`); pass 25: the whole bubble on the screen on an upright iPhone, light and dark, no mark about it; the kit 40 of 41 (N15 on its own timing, then 2 of 3 alone PASS).\"},\n")
new = r'''
 ('341', ['p25:M-001', 'p25:M-002', 'p25:M-003', 'p25:M-004'], 'decided before', 'iPad', "N8's designer pictures: faint \"Knock knock!\" over the sofa; thin lilac lines across the floor.", 1, 'not a glitch',
  "The designer's reveal starts with the client's knock, the words rising over the room and fading (G4-287); the placing grid shows while you decorate (G4-314).", '—'),
]
'''
s=s.rstrip()[:-1].rstrip('\n')+new
open(p,'w').write(s)
