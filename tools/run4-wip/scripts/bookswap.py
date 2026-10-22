"""Run 4 finish: put new pictures into the What's new book for some of its keys only (the others stay byte for byte).
Same making as mkbook.py: the biggest centred 4:3 box, 400x300, webp quality 72.
usage: python3 bookswap.py KEY=path.png [KEY=path.png ...]"""
import base64, io, json, sys
from PIL import Image
P = '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
i = s.index('const BOOK_IMG='); j = s.index('\n', i)
line = s[i:j]; assert line.endswith(';')
imgs = json.loads(line[len('const BOOK_IMG='):-1])
for arg in sys.argv[1:]:
    key, path = arg.split('=', 1)
    if key not in imgs: sys.exit(f'no book picture called {key!r} (there are {sorted(imgs)})')
    im = Image.open(path).convert('RGB'); w, h = im.size
    if w / h > 4 / 3: nw = int(h * 4 / 3); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w * 3 / 4); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((400, 300), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=72, method=6)
    old = len(imgs[key]); imgs[key] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    print(key, 'from', path, ':', old, '->', len(imgs[key]), 'characters')
js = 'const BOOK_IMG=' + json.dumps(imgs, ensure_ascii=False) + ';'
s = s[:i] + js + s[j:]
open(P, 'w', encoding='utf-8').write(s); print('BOOK_IMG written:', len(js), 'characters;', len(imgs), 'pictures')
