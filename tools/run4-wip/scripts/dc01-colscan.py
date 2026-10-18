import sys
from PIL import Image
src, x, y0, y1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src).convert("RGB")
print(" ".join(f"{y}:{im.getpixel((x,y))}" for y in range(y0, y1)))
