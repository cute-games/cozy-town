import sys
from PIL import Image
# for a vertical band x0..x1, list the y rows where some pixel is notably darker than its row neighbours (a thin dark line)
src, x0, x1, y0, y1 = sys.argv[1], *map(int, sys.argv[2:6])
im = Image.open(src).convert("L")
hits = []
for y in range(y0, y1):
    row = [im.getpixel((x, y)) for x in range(x0 - 3, x1 + 3)]
    best = None
    for i in range(3, len(row) - 3):
        nb = (row[i-3] + row[i+3]) / 2
        d = nb - row[i]
        if d > 8 and (best is None or d > best[1]):
            best = (x0 - 3 + i, d)
    hits.append((y, best))
s = ""
for y, b in hits:
    s += ("#" if b else ".")
print(s)
print([ (y,b) for y,b in hits if b][:10])
