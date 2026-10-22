"""Syntax-check every inline <script> of a game file with node --check. usage: python3 jscheck.py FILE"""
import re, subprocess, sys, tempfile, os
s = open(sys.argv[1], encoding='utf-8').read()
bad = 0
for i, m in enumerate(re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S)):
    js = m.group(1)
    if len(js) < 2000: continue
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f: f.write(js); p = f.name
    r = subprocess.run(['node', '--check', p], capture_output=True, text=True); os.unlink(p)
    if r.returncode: bad += 1; print('script', i, 'FAILS:', r.stderr[:800])
print('scripts checked; bad =', bad)
