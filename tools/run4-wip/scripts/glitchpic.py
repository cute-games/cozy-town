"""Stage 3: small pictures for the glitch list and the before/after pairs.
usage: python3 glitchpic.py SRC.png DST.webp [x0 y0 x1 y1 (a crop box in source pixels)] [--w 480]
Writes a webp no wider than --w (default 480) px, quality 80."""
import sys
from PIL import Image
a = sys.argv[1:]; w = 480
if '--w' in a: i = a.index('--w'); w = int(a[i + 1]); del a[i:i + 2]
src, dst = a[0], a[1]; im = Image.open(src).convert('RGB')
if len(a) >= 6: im = im.crop(tuple(int(float(v)) for v in a[2:6]))
if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save(dst, 'WEBP', quality=80); print(dst, im.size)
