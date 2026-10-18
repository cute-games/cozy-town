import sys
from PIL import Image
src, y, x0, x1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src).convert("RGB")
for x in range(x0, x1):
    print(x, im.getpixel((x, y)))
