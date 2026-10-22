"""Stage 3, pass 4 on: sort the PHOTOVIEWER marks before the DOUBLE-CHECKER. Marks about the photographer's own staging, about a card
over the dimmed HUD (G4-033, G4-060: not a glitch), or about test names are set aside with the reason; the rest go to the double-checker.
usage: python3 dcfilter4.py MARKDIR...  -> FIRST_MARKDIR/marks-keep.txt, marks-aside.txt"""
import glob, os, re, sys
ASIDE = [
 (r'^s3_.*(pets? (crowd|bunch|fill|are piled)|pressed against the lens|right at the lens|right under the camera|piled right in front)',
  'PHOTOGRAPHER: the player\'s pets came along on the town spots and stood where the camera then turned or stepped back; from pass 5 the town spots leave the pets at home'),
 (r'^s3.*(camera (is )?(pressed|jammed|squeezed)|stands right against|pressed up to the bell|right beside the camera|camera stands right|lamp post (stands )?right (at|beside)|stands right in front of the bus shelter|lamp post stands in the middle)',
  'PHOTOGRAPHER: the camera spot stands against a post, a wall, a board or a bell; a child walking there sees it from any step around it'),
 (r'(covers?|clips?|sits over|sits on top of) (the )?(rounded right end of the )?("?\d+:\d+ \w+"? )?(time|clock) (chip|pill)|time chip.*(clipped|covered)|corner map (and the notepad )?(stick|peek|show)s? out|strip of the (small )?corner map|corner map.s .*(peeks|shows)|book.s left edge lies over the corner map|left edge sits on top of the corner map|left border (sits|lies) on|top-left corner is jammed against the notepad',
  'KNOWN, not a glitch (G4-033, G4-060): a card over the dimmed HUD; the HUD under an open card is dimmed and the card takes the taps'),
 (r'ZZTEST|Cozy Kid', 'test name'),
]
D = sys.argv[1]; keep, aside = [], []
for d in sys.argv[1:]:
    for f in sorted(glob.glob(os.path.join(d, 'batch-*.txt'))):
        for l in open(f, encoding='utf-8'):
            l = l.strip()
            if not l or l.count('|') < 3: continue
            why = None if re.search(r'Finish', l) else next((w for pat, w in ASIDE if re.search(pat, l, re.I)), None)
            (aside if why else keep).append((l, why, os.path.basename(os.path.dirname(f)) + '/' + os.path.basename(f)))
open(os.path.join(D, 'marks-keep.txt'), 'w', encoding='utf-8').write('\n'.join(l for l, _, _ in keep) + '\n')
open(os.path.join(D, 'marks-aside.txt'), 'w', encoding='utf-8').write('\n'.join(f'{l}  ⟵ {w} [{b}]' for l, w, b in aside) + '\n')
print(len(keep), 'kept for the double-checker;', len(aside), 'set aside')
