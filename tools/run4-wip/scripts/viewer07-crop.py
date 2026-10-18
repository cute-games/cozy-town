import sys
from PIL import Image
# usage: crop.py src out x0 y0 x1 y1 scale
src, out = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7])
scale = int(sys.argv[7]) if len(sys.argv) > 7 else 4
im = Image.open(src).convert("RGB")
c = im.crop((x0, y0, x1, y1))
c = c.resize((c.width*scale, c.height*scale), Image.NEAREST)
c.save(out)
print(im.size, c.size)
