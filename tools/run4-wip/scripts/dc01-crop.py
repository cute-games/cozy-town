import sys
from PIL import Image
src, out, x0, y0, x1, y1, scale = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:8])
im = Image.open(src).convert("RGB")
print(im.size)
c = im.crop((x0, y0, x1, y1))
c = c.resize((c.width*scale, c.height*scale), Image.LANCZOS)
c.save(out)
