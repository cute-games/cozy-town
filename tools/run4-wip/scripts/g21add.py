p='glitches5_data.py'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
rep("'p20': 'stage3-dc20'}","'p20': 'stage3-dc20', 'p21': 'stage3-dc21'}")
rep("'p20': 'pass 20'}","'p20': 'pass 20', 'p21': 'pass 21'}")
rep("F17 = ' (patch_f17.py)'\n","F17 = ' (patch_f17.py)'\nF18 = ' (patch_f18.py)'\n")
rep("UPDATES = {\n","UPDATES = {\n    'G4-327': {'check': \"N25 alone on the f17 file, twice: PASS; pass 21's kit (41 of 41 PASS) and its picture of the phone's chat: the photo shows.\"},\n    'G4-328': {'check': \"the pond probe before and after (`views_f17.py`); pass 21: the bubble below the top row on a sideways iPhone and an iPad, light and dark, no mark about it.\"},\n")
new = r'''
 ('331', ['p21:M-004', 'p21:M-006'], "the photographer: your phone's chat", 'iPhone sideways', "The chat opened at the foot of the thank-you message, so the top of its photo lay under the Photos header.", 1, 'fixed',
  "A chat opens at its newest message; when that one is taller than the screen (a photo on a short sideways phone) it now opens at the message's top, the fade at the foot showing there is more" + F18 + '.', "the chat probe before and after (`views_f18.py`): the photo's top 56 px under the header before, 42 px below it after; pass 22's re-check."),
 ('332', ['p21:M-001', 'p21:M-002', 'p21:M-003'], 'not a glitch, decided before', 'iPhone sideways; iPad, dark theme', "A palette badge on the corner map about 28 px across; the two ducks one on the other by the pond; two townsfolk at the right edge one in front of the other.", 1, 'not a glitch',
  "The palette badge is drawn in the map's own picture (a probe found no page element there): the whole map is the one tap target; the fed ducks keep 80 cm apart and from your spot one can be behind the other (G4-278); two townsfolk at different distances, one in front of the other, as anyone in a crowd.", '—'),
]
'''
s=s.rstrip()[:-1].rstrip('\n')+new
open(p,'w').write(s)
