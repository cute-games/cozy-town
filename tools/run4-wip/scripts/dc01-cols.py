import sys
from PIL import Image
# for each column x in [x0,x1), report whether any pixel in rows [y0,y1) is "non-background" (differs from white-ish bg)
src, x0, x1, y0, y1 = sys.argv[1], *map(int, sys.argv[2:6])
thr = int(sys.argv[6]) if len(sys.argv) > 6 else 60
im = Image.open(src).convert("RGB")
bg = (255, 255, 255)
line = []
for x in range(x0, x1):
    ink = 0
    for y in range(y0, y1):
        r, g, b = im.getpixel((x, y))
        if abs(r-bg[0]) + abs(g-bg[1]) + abs(b-bg[2]) > thr:
            ink += 1
    line.append((x, ink))
print(" ".join(f"{x}:{i}" for x, i in line))
