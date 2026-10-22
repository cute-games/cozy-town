p='glitches5_data.py'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
rep("'p19': 'stage3-dc19'}","'p19': 'stage3-dc19', 'p20': 'stage3-dc20'}")
rep("'p19': 'pass 19'}","'p19': 'pass 19', 'p20': 'pass 20'}")
rep("F16 = ' (patch_f16.py)'\n","F16 = ' (patch_f16.py)'\nF17 = ' (patch_f17.py)'\n")
rep("FOUND_BY = {}","FOUND_BY = {'327': 'the kit (N25, pass 20)'}")
rep("UPDATES = {\n","UPDATES = {\n    'G4-318': {'check': \"pictures of the card, before and after (`views_f16.py`); pass 20: the card sharp, but the kit's N25 failed on the phone's copy: G4-327.\"},\n    'G4-322': {'check': \"a probe by the pond, before and after (`views_f16.py`); pass 20: on a sideways phone the bubble ran under the clock chip and the top buttons: G4-328.\"},\n")
new = r'''
 ('327', [], "the photographer: the photo in your phone's chat", 'iPad, iPhone sideways, PC', "The kit's N25 failed on the f16 file: right after the thank-you card, the photo in the phone's chat had no size yet when the phone opened (it showed a moment later).", 2, 'fixed',
  "Since f16 the card shows the sharp copy, so the phone's small copy was first decoded when the phone opened; it is decoded at the snap now, as when the card showed it" + F17 + '.', "N25 alone on the f17 file, twice: PASS (the photo in the chat on all three screens); pass 21's kit."),
 ('328', ['p20:M-013', 'p20:M-014', 'p20:M-015', 'p20:M-016', 'p20:M-001', 'p20:M-006', 'p20:M-007', 'p20:M-017', 'p20:M-018'], "a grandma's bubble at the duck pond", 'iPhone sideways; iPad, light and dark theme', 'On a sideways phone her bubble ran under the clock chip and the top buttons: only "ducks is the ... of my day." could be read; on the iPad its corner lay on the clock chip.', 2, 'fixed',
  "A speech bubble also stays below the top row (the coin, food and clock chips and the top buttons): it moves down, at most its own height, then slides sideways as before (f16 kept it clear of the map column and the buttons only)" + F17 + '.', "the pond probe on a sideways iPhone and an iPad, before and after (`views_f17.py`): under the chip before, the whole bubble below the top row after; pass 21's re-check."),
 ('329', ['p20:M-003', 'p20:M-005', 'p20:M-011'], 'a photo shoot from the side', 'iPhone sideways', 'A white pill peeked out behind the "Pose: Mia" label at the right edge (only an "e" showed).', 1, 'open',
  "Found with a probe: no page element lies there; it is the name tag of the group member standing at the screen's edge, under the action label. Small, left as it is (a tag pushed below the label would leave its person).", ''),
 ('330', ['p20:M-004', 'p20:M-002', 'p20:M-008', 'p20:M-009', 'p20:M-010'], 'not a glitch, decided before', 'iPad, dark theme', "The notepad a cream lined paper in the dark theme; a shopper big at the right edge of the Toy Store, partly behind \"Say hi\".", 1, 'not a glitch',
  "The notepad is a sheet of lined paper by design, its words readable in both themes; the shopper stands about 1.5 m from the camera (its head 150 px across), and someone 1.3 m or more from you is drawn (G4-171, G4-300).", '—'),
]
'''
assert s.rstrip().endswith(']')
s=s.rstrip()[:-1].rstrip('\n')+new
open(p,'w').write(s)
