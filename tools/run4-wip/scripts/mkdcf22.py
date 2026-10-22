s=open('dcfilter21.py').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a)); s=s.replace(a,b)
rep('"""Stage 3, pass 21 on (run 4 finish: dcfilter20.py plus','"""Stage 3, pass 22 on (run 4 finish: dcfilter21.py plus the decisions of pass 21, G4-332, and the marks its double-checkers dropped. Before that, dcfilter21.py: dcfilter20.py plus')
add = r''' # pass 21 (run 4 finish): its decisions (G4-332) and the marks its double-checkers dropped
 (r'palette (button|badge|icon).{0,120}(px|small|tiny|fingertip)',
  "NOT A GLITCH (G4-332): the palette badge is part of the corner map's picture; the whole map is the one tap target"),
 (r'pond-bubble.*(two|white|yellow) ducks?(?! is).{0,100}(stacked|on top of|overlap|in a pile|piled)',
  'NOT A GLITCH (G4-278, G4-332): the fed ducks keep 80 cm apart; from your spot one can be behind the other'),
 (r'photo-chat.*(townsfolk|people|townspeople).{0,80}(overlap|merged|one in front)',
  'NOT A GLITCH (G4-332): two townsfolk at different distances, one in front of the other'),
 (r'joystick.{0,80}(over|hides|covers).{0,40}(the )?pond',
  'DOUBLE-CHECKED in pass 21 (M-005, dropped): the see-through joystick over the pond\'s edge, the ducks in view'),
 (r'phone (screen|app).{0,100}(light|pastel|white|pink).{0,60}dark',
  'DECIDED (G4-126, section 9c; pass 21 M-007, dropped): a phone\'s screen is lit; the cards around it go dark'),
 (r'^(?!.*(still there|stands right|figure)).*(ZZTEST|Cozy Kid)', 'test name'),
]'''
rep(" (r'^(?!.*(still there|stands right|figure)).*(ZZTEST|Cozy Kid)', 'test name'),\n]", add)
open('dcfilter22.py','w').write(s)
