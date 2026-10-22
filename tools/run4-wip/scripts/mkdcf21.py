s=open('dcfilter20.py').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a)); s=s.replace(a,b)
rep('"""Stage 3, pass 20 on (run 4 finish: dcfilter19.py plus','"""Stage 3, pass 21 on (run 4 finish: dcfilter20.py plus the decisions of pass 20, G4-329 and G4-330, and the mark its double-checkers dropped; the bubble rule and the clock chip rule leave a speech bubble under the clock chip or the top buttons to the double-checkers (fixed in f17). Before that, dcfilter20.py: dcfilter19.py plus')
rep(" (r'(covers?|clips?|sits over|sits on top of) (the )?(rounded right end"," (r'^(?!.*speech bubble)(.*)(covers?|clips?|sits over|sits on top of) (the )?(rounded right end")
rep("corner map|notepad|block|in the air)).*(speech bubble","corner map|notepad|block|in the air|clock chip|time chip|top.{0,12}(bar|buttons|row))).*(speech bubble")
add = r''' # pass 20 (run 4 finish): its decisions (G4-329, G4-330) and the mark its double-checkers dropped
 (r'notepad.{0,100}(white|cream|light|bright|paper).{0,100}dark|dark (theme|mode).{0,100}notepad.{0,80}(white|cream|light|bright)',
  'NOT A GLITCH (G4-330): the notepad is a sheet of lined paper by design, its words readable in both themes'),
 (r'photo-side.*(Pose: \w+).{0,80}(pill|tag).{0,80}(behind|peek|hidden)|photo-side.*(pill|tag).{0,80}(behind|peek|hidden).{0,40}(Pose: \w+)',
  "KNOWN, open (G4-329): the name tag of a group member at the screen's edge, under the action label"),
 (r'toys-shopper.*right edge.{0,200}Say hi',
  'DECIDED (G4-171, G4-300, G4-330): a shopper about 1.5 m from you at the right edge of the view, drawn'),
 (r'dance-two-portrait.*(arrow )?lane.{0,100}(floor|feet|mat)',
  "DOUBLE-CHECKED in pass 20 (M-012, dropped): on an upright phone the arrow lane lies over the floor's lower part, the dancers' feet in view"),
 (r'^(?!.*(still there|stands right|figure)).*(ZZTEST|Cozy Kid)', 'test name'),
]'''
rep(" (r'^(?!.*(still there|stands right|figure)).*(ZZTEST|Cozy Kid)', 'test name'),\n]", add)
open('dcfilter21.py','w').write(s)
