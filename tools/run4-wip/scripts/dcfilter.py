"""Stage 3: sort the PHOTOVIEWER marks before the DOUBLE-CHECKER. Marks that describe the photographer's own mistakes (the dance
panel left on screen on the phone and PC pictures, a camera put inside a wall, a tree or a passer-by, a picture taken before a
2-second check ran) are set aside with the reason, so the double-checker and the glitch list see only claims about the game.
usage: python3 dcfilter.py MARKDIR  -> MARKDIR/marks-keep.txt, MARKDIR/marks-aside.txt"""
import glob, os, re, sys
D = sys.argv[1]
ASIDE = [
 (r'left.?over dance|dance.?off (HUD|lane|score|panel)|dance HUD|dance panel|stuck over|still on screen|still on the screen|arrow buttons are stuck|score bar.*(left over|still)',
  'PHOTOGRAPHER: the dance panel was left on screen between the phone and PC pictures (shots4.py did not reset it); retaken in pass 2'),
 (r'(right|pressed) against the camera|in front of the camera|camera (is|sits|stands|looks|tilted)|nose-to-wall|inside (or under )?(a|the) (big|brown|near)|head fills|fills the (left|right|whole|bottom-left|middle)|right behind|camera.?s feet|at the camera.?s',
  'PHOTOGRAPHER: the camera spot had a passer-by, a tree, a post or a wall right in front of it; the spot is moved in pass 2'),
 (r'not in (the picture|view)|no own party hat|no balloon|no fireworks|no Easter Bunny|no Bunny|Bunny is missing|no houses on the lane|is cut off at the bottom edge|cut by the left screen edge|chopped by the left edge|signs are not in view',
  'PHOTOGRAPHER: the picture was taken too early (a 2-second check had not run), from the wrong height, or in an empty test room; retaken in pass 2 and checked by the kit (N20, N21, N22)'),
 (r'room behind the dance HUD is empty|no dancers|dancers are not in view|bare pink wall',
  'PHOTOGRAPHER: the dance picture was staged without a partner; pass 2 takes it from a real two-player round'),
 (r'leaf.*drift in the open sky|lone dark ✓',
  'LOOKED AT: a falling leaf or a bird passing; the leaves fall from crowns near you (N30) and birds fly over'),
 (r'ZZTEST|Cozy Kid', 'test name'),
]
keep, aside = [], []
for f in sorted(glob.glob(os.path.join(D, 'batch-*.txt'))):
    for l in open(f, encoding='utf-8'):
        l = l.strip()
        if not l or l.count('|') < 3: continue
        why = next((w for pat, w in ASIDE if re.search(pat, l, re.I)), None)
        (aside if why else keep).append((l, why, os.path.basename(f)))
open(os.path.join(D, 'marks-keep.txt'), 'w', encoding='utf-8').write('\n'.join(l for l, _, _ in keep) + '\n')
open(os.path.join(D, 'marks-aside.txt'), 'w', encoding='utf-8').write('\n'.join(f'{l}  ⟵ {w} [{b}]' for l, w, b in aside) + '\n')
print(len(keep), 'kept for the double-checker;', len(aside), 'set aside')
