s=open('dcfilter23.py').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a)); s=s.replace(a,b)
rep('"""Stage 3, pass 23 on, the full final pass (run 4 finish: dcfilter22.py plus','"""Stage 3, pass 25 on (run 4 finish: dcfilter24.py, and the townsperson bubble rule leaves f19\'s and f20\'s probe bubbles to the first checkers. dcfilter24.py: dcfilter23.py plus the decisions of pass 23, G4-336 to G4-339, and the marks its double-checkers dropped. Before that, dcfilter23.py: dcfilter22.py plus')
rep("clock chip|time chip|top.{0,12}(bar|buttons|row))).*(speech bubble","clock chip|time chip|top.{0,12}(bar|buttons|row)|(flower|pond)-bubble)).*(speech bubble")
add = r''' # pass 23, the full final pass (run 4 finish): its decisions (G4-336 to G4-339) and the marks its double-checkers dropped
 (r'(food.truck|truck).{0,120}(grey|gray) (round )?ball',
  "KNOWN, minor, left as it is (G4-336): the food truck's unlit evening lamp under the awning's end"),
 (r'christmas.*(glare|glow|bloom|flare)',
  "KNOWN, minor, left as it is (G4-337): two of the tree's night lights read as a flare"),
 (r'ducks-close.*(dark|purple).{0,40}(box|shape)',
  "KNOWN, minor, left as it is (G4-338): something by the blue house's corner at the photographer's close duck view"),
 (r'(cattails?|reeds?).{0,80}(grandma|through her)',
  'NOT A GLITCH (G4-339): the cattails stand between you and the bench'),
 (r'^kit\d+-n22-.*(slab|close to some object|camera very close)',
  "KIT STAGING (G4-339): N22's own camera spot"),
 (r'^kit\d+-n24-.*grandmas?.{0,80}(overlap|merge|inside the other|blob)',
  "KIT STAGING (G4-289, G4-339): N24 looks at the grandmas' bench from behind them"),
 (r'inside-flowers.*(two )?(people|shoppers).{0,80}(overlap|merge|blob)',
  'NOT A GLITCH (G4-332, G4-339): two people at different distances, one in front of the other'),
 (r'inside-toys.*shopper.{0,80}cut off by the screen edge',
  'DOUBLE-CHECKED in pass 23 (M-009, dropped): a shopper cut by the edge of the view'),
 (r'^kit\d+-n3-friends.*(partly hidden behind|very close to the camera)',
  "DOUBLE-CHECKED in pass 23 (M-013, M-014, dropped): N3's friends, faces and names clear; one close because you talk to her"),
 (r'bag.*empty hearts?.{0,80}(dull|hard to (read|tell))',
  "DOUBLE-CHECKED in pass 23 (M-015, dropped): the bag's empty hearts in the dark theme, visible and different from the full ones"),
 (r'^(?!.*(still there|stands right|figure)).*(ZZTEST|Cozy Kid)', 'test name'),
]'''
rep(" (r'^(?!.*(still there|stands right|figure)).*(ZZTEST|Cozy Kid)', 'test name'),\n]", add)
n=s.count("(r'^s3_iphone-portrait.*"); s=s.replace("(r'^s3_iphone-portrait.*","(r'^(?!.*bubble)s3_iphone-portrait.*"); print('upright-phone rules narrowed:', n)
open('dcfilter25.py','w').write(s)
