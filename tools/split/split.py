"""Cozy Town: split the one-file game into a small index.html + separate files, and join them back.

  python3 tools/split/split.py split  BUNDLE.html  SITE_DIR   -> SITE_DIR/index.html, SITE_DIR/css/*.css, SITE_DIR/js/*.js
  python3 tools/split/split.py join   SITE_DIR     BUNDLE.html -> one file again (what the check kit tests)
  python3 tools/split/split.py join   SITE_DIR     BUNDLE.html --edited -> the same after editing css/js files (their ?v= hashes are old);
      then split BUNDLE.html back into SITE_DIR after the check, which writes the new hashes
  python3 tools/split/split.py verify BUNDLE.html               -> split + join in a temp folder; STOP unless byte for byte equal

Code is MOVED, never changed. Each game file after the first gets one added first line ('use strict';) that join removes again.
Each <script src> / <link> carries ?v=<hash of that file>, so a phone never mixes old and new files.
The version stamp (const COZY_BUILD=...) stays inline in index.html: old Home Screen copies look for it there to find updates.
"""
import hashlib, os, re, sys, tempfile

GAME_CUTS = [  # (file name, banner the file starts with). The first file starts right after the inline stamp script.
    ('core', '/* ================= core ================= */'),
    ('models', '/* ================= models ================= */'),
    ('world', '/* ================= world ================= */'),
    ('game', '/* ================= game ================= */'),
    ('panels', '/* ================= panels ================= */'),
    ('map', '/* ===================== 🗺️ the map'),
    ('jobs', '/* ================= jobs: Rosie helps you pick one'),
    ('designer', '/* ================= 🎨 INTERIOR DESIGNER JOB'),
    ('hud', '/* ================= HUD ================= */'),
    ('mainloop', '/* ================= main loop ================= */'),
]
STRICT = "'use strict';\n"
FILES_LINE = '/* files: {} (written by tools/split/split.py) */\n'
H = lambda b: hashlib.sha256(b.encode('utf-8')).hexdigest()[:10]

def added_strict(path):  # game files after the first get 'use strict' added (the first keeps the bundle's own)
    return bool(re.match(r'js/\d\d-', path)) and not path.startswith('js/00-')

def blocks(html):
    """Every inline <style>/<script> (no src) with its position."""
    return [m for m in re.finditer(r'<(style|script)>(.*?)</\1>', html, re.S)]

def split(src, out):
    html = open(src, encoding='utf-8', newline='').read()
    files = {}  # path -> text
    bl = blocks(html)
    stamp = [m for m in bl if m.group(1) == 'script' and re.match(r"\n'use strict';\nconst COZY_BUILD=\d+;[^\n]*\n$", m.group(2))]
    game = [m for m in bl if m.group(1) == 'script' and m.group(2).startswith("\n'use strict';\n/* ================= core ================= */")]
    if len(stamp) != 1 or len(game) != 1: sys.exit(f'STOP: stamp script {len(stamp)}, game script {len(game)} (need 1 and 1)')
    plan = []  # (match, [(path, text)])
    # 1) styles -> css/style-N.css ; big library scripts -> js/lib-N.js ; the game script -> js/<section>.js
    ns = nl = 0
    for m in bl:
        kind, body = m.group(1), m.group(2)
        if m is stamp[0]: continue
        if kind == 'style':
            ns += 1; plan.append((m, [(f'css/style-{ns}.css', body)]))
        elif m is game[0]:
            parts, pos = [], 0
            starts = []
            for name, banner in GAME_CUTS:
                k = body.find('\n' + banner)
                if k < 0 or body.count('\n' + banner) != 1: sys.exit(f'STOP: banner for {name} found {body.count(chr(10) + banner)} times')
                starts.append((name, k + 1))
            if starts[0][1] != len("\n'use strict';\n"): sys.exit('STOP: game script does not start with the core banner')
            if [s for _, s in starts] != sorted(s for _, s in starts): sys.exit('STOP: banners out of order')
            for i, (name, s) in enumerate(starts):
                e = starts[i + 1][1] if i + 1 < len(starts) else len(body)
                txt = body[s:e]
                if i == 0: txt = body[:e]  # keeps the leading newline of the block
                parts.append((f'js/{i:02d}-{name}.js', txt))
            plan.append((m, parts))
        elif len(body) > 20000:
            nl += 1; plan.append((m, [(f'js/lib-{nl}.js', body)]))
        # small inline scripts (the web/Firebase glue, 3 KB) stay inline: the check kit strips them by line
    # 2) write index.html with tags in place of the moved blocks
    outhtml, last = [], 0
    for m, parts in plan:
        outhtml.append(html[last:m.start()])
        tags = []
        for path, txt in parts:
            body = STRICT + txt if added_strict(path) else txt
            files[path] = body
            if path.startswith('css/'): tags.append(f'<link rel="stylesheet" href="{path}?v={H(body)}" data-cozy="{path}">')
            else: tags.append(f'<script src="{path}?v={H(body)}" data-cozy="{path}"></script>')
        outhtml.append('\n'.join(tags))
        last = m.end()
    outhtml.append(html[last:])
    idx = ''.join(outhtml)
    # the stamp script also names every file's hash: a changed file with a forgotten stamp bump still counts as an update
    allh = H(''.join(f'{p}:{H(t)};' for p, t in sorted(files.items())))
    sb = stamp[0].group(2)
    if idx.count('<script>' + sb + '</script>') != 1: sys.exit('STOP: stamp script not found once in index.html')
    idx = idx.replace('<script>' + sb + '</script>', '<script>' + sb + FILES_LINE.format(allh) + '</script>')
    files['index.html'] = idx
    for path, txt in files.items():
        p = os.path.join(out, path); os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, 'w', encoding='utf-8', newline='').write(txt)
    return files

TAG = r'(?:<link rel="stylesheet" href="[^"]+" data-cozy="[^"]+">|<script src="[^"]+" data-cozy="[^"]+"></script>)'

def join(site, dst, edited=False):
    html = open(os.path.join(site, 'index.html'), encoding='utf-8', newline='').read()
    html, n = re.subn(re.escape(FILES_LINE).replace(r'\{\}', '[0-9a-f]{10}'), '', html)
    if n != 1: sys.exit(f'STOP: files line found {n} times in index.html')
    def group(m):  # one run of tags written for one moved block (tags joined by "\n")
        out, kind = [], None
        for t in re.finditer(r'<(link) rel="stylesheet" href="([^"?]+)\?v=([0-9a-f]+)"|<(script) src="([^"?]+)\?v=([0-9a-f]+)"', m.group(0)):
            k, path, v = (t.group(1), t.group(2), t.group(3)) if t.group(1) else (t.group(4), t.group(5), t.group(6))
            if kind and k != kind: sys.exit('STOP: mixed style and script tags in one group')
            kind = k
            txt = open(os.path.join(site, path), encoding='utf-8', newline='').read()
            if not edited and H(txt) != v: sys.exit(f'STOP: {path} does not match its ?v= hash in index.html')
            if added_strict(path):
                if not txt.startswith(STRICT): sys.exit(f'STOP: {path} lost its first line')
                txt = txt[len(STRICT):]
            out.append(txt)
        tag = 'style' if kind == 'link' else 'script'
        return f'<{tag}>' + ''.join(out) + f'</{tag}>'
    # game files form one group (consecutive js/NN- tags); every other tag is its own group
    out = re.sub(r'(?:<script src="js/\d\d-[^"]+" data-cozy="[^"]+"></script>\n)*<script src="js/\d\d-[^"]+" data-cozy="[^"]+"></script>|' + TAG, group, html)
    open(dst, 'w', encoding='utf-8', newline='').write(out)

def verify(src):
    with tempfile.TemporaryDirectory() as d:
        files = split(src, os.path.join(d, 'site'))
        join(os.path.join(d, 'site'), os.path.join(d, 'back.html'))
        a = open(src, 'rb').read(); b = open(os.path.join(d, 'back.html'), 'rb').read()
        print(f'files: {len(files)}; index.html {len(files["index.html"])} chars; bundle {len(a)} bytes; joined back {len(b)} bytes')
        for p in sorted(files): print(f'  {p}: {len(files[p].encode("utf-8"))} bytes')
        if a != b:
            k = next(i for i in range(min(len(a), len(b))) if a[i] != b[i]) if a[:min(len(a),len(b))] != b[:min(len(a),len(b))] else min(len(a), len(b))
            sys.exit(f'STOP: joined file differs at byte {k}: {a[k-60:k+60]!r} vs {b[k-60:k+60]!r}')
        print('VERIFY PASS: split + join = the same file, byte for byte')

if __name__ == '__main__':
    c = sys.argv[1]
    if c == 'split': split(sys.argv[2], sys.argv[3])
    elif c == 'join': join(sys.argv[2], sys.argv[3], sys.argv[4:] == ['--edited'])
    elif c == 'verify': verify(sys.argv[2])
    else: sys.exit(__doc__)
