s=open('dcfilter22.py').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a)); s=s.replace(a,b)
rep('"""Stage 3, pass 22 on (run 4 finish: dcfilter21.py plus','"""Stage 3, pass 23 on, the full final pass (run 4 finish: dcfilter22.py plus the decision of pass 22, G4-333, and the mark its double-checker dropped. Before that, dcfilter22.py: dcfilter21.py plus')
rep("(r'photo-chat.*(townsfolk|people|townspeople).{0,80}(overlap|merged|one in front)',","(r'photo-(chat|shoot).*(townsfolk|people|townspeople|figures).{0,120}(overlap|merged|squeezed|one in front)',")
rep("'NOT A GLITCH (G4-332): two townsfolk at different distances, one in front of the other'),","'NOT A GLITCH (G4-332, G4-333): two townsfolk at different distances, one in front of the other'),\n (r'photo-chat.*fade.{0,40}(foot|bottom)',\n  \"DOUBLE-CHECKED in pass 22 (M-002, dropped): on a sideways phone the chat opens at the thank-you message's top; the fade at the foot shows there is more\"),")
open('dcfilter23.py','w').write(s)
