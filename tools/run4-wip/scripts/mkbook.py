"""Build the stage-1 What's new book: pictures (4:3 webp, 400x300) from screenshots -> BOOK_IMG, and the new BOOK_PAGES, written into index.html.
usage: python3 mkbook.py PICS.json   where PICS.json = {"key": ["path.png", [x1,y1,x2,y2] or null], ...}"""
import json, sys, base64, io, re
from PIL import Image
pics = json.load(open(sys.argv[1]))
out = {}
for key, (path, box) in pics.items():
    im = Image.open(path).convert('RGB')
    if box: im = im.crop(tuple(box))
    w, h = im.size
    # the biggest 4:3 box inside, centred
    if w / h > 4 / 3: nw = int(h * 4 / 3); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w * 3 / 4); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((400, 300), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=72, method=6); out[key] = base64.b64encode(b.getvalue()).decode()
    print(key, len(b.getvalue()), 'bytes')
js = 'const BOOK_IMG=' + json.dumps({k: 'data:image/webp;base64,' + v for k, v in out.items()}, ensure_ascii=False) + ';'
p = '/home/user/cozy-town/index.html'; s = open(p, encoding='utf-8').read()
i = s.index('const BOOK_IMG='); j = s.index('\n', i)
s = s[:i] + js + s[j:]
open(p, 'w', encoding='utf-8').write(s); print('BOOK_IMG written:', len(js), 'bytes;', len(out), 'pictures')
