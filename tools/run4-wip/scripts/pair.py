"""side by side: before | after for a view name. usage: python3 pair.py DIR NAME OUT [crop x0,y0,x1,y1] [scale]"""
import sys, glob
from PIL import Image
D, N, O = sys.argv[1:4]; cr = tuple(int(v) for v in sys.argv[4].split(',')) if len(sys.argv) > 4 and sys.argv[4] != '-' else None; sc = float(sys.argv[5]) if len(sys.argv) > 5 else 1
ims = []
for t in ('before', 'after'):
    f = sorted(glob.glob(f'{D}/*_{N}-{t}-*.png'))[0]; im = Image.open(f).convert('RGB')
    if cr: im = im.crop(cr)
    if sc != 1: im = im.resize((int(im.width * sc), int(im.height * sc)))
    ims.append(im)
o = Image.new('RGB', (ims[0].width * 2 + 10, ims[0].height), 'white'); o.paste(ims[0], (0, 0)); o.paste(ims[1], (ims[0].width + 10, 0)); o.save(O)
