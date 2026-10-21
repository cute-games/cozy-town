p='glitches5_data.py'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
rep("'p21': 'stage3-dc21'}","'p21': 'stage3-dc21', 'p22': 'stage3-dc22'}")
rep("'p21': 'pass 21'}","'p21': 'pass 21', 'p22': 'pass 22'}")
rep("UPDATES = {\n","UPDATES = {\n    'G4-331': {'check': \"the chat probe before and after (`views_f18.py`); pass 22: the chat opens at the thank-you message's top on a sideways iPhone (a mark about the fade at its foot dropped by the first checker); the kit 41 of 41 PASS.\"},\n")
new = r'''
 ('333', ['p22:M-001'], 'not a glitch', 'iPad, dark theme', "Two townsfolk at the right edge of the park, one squeezed in front of the other.", 1, 'not a glitch',
  "Two townsfolk at different distances, one in front of the other from the shoot's spot, as G4-332 (the kit's N4 keeps walkers apart: closest 0.64 m).", '—'),
]
'''
s=s.rstrip()[:-1].rstrip('\n')+new
open(p,'w').write(s)
