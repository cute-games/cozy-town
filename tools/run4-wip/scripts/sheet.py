"""contact sheet: python3 sheet.py OUT.png COLS FILE... (same-size pictures side by side, COLS per row)"""
import sys
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert('RGB') for f in files]; w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (cols * w + (cols - 1) * 6, rows * h + (rows - 1) * 6), 'red')
for i, im in enumerate(ims):
    sh.paste(im.resize((w, h)), ((i % cols) * (w + 6), (i // cols) * (h + 6)))
sh.save(out); print(out, sh.size)
