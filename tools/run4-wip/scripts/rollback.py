"""Stage 3 end: tools/prerun4-rollback.html = the starting file (tools/prerun4-index.html, night 3, stamp 2026101701) with a version
stamp bigger than any stamp this run ships (the last stamp + 49), so putting it live makes every run-4 player's game go back by itself.
usage: python3 rollback.py LAST_STAMP"""
import hashlib, re, sys
REPO = '/home/user/cozy-town'; last = int(sys.argv[1])
src = open(f'{REPO}/tools/prerun4-index.html', 'rb').read()
assert hashlib.md5(src).hexdigest() == '709bf763d51be0160c118e2f9249f9f6', 'the starting copy is not the file the plan names'
s = src.decode('utf-8'); m = re.findall(r'COZY_BUILD=(\d+)', s); assert len(m) == 1 and m[0] == '2026101701', m
stamp = last + 49; out = s.replace('COZY_BUILD=2026101701', f'COZY_BUILD={stamp}', 1)
open(f'{REPO}/tools/prerun4-rollback.html', 'w', encoding='utf-8').write(out)
print('rollback copy written: stamp', stamp, '(last shipped', last, '); bytes', len(out.encode('utf-8')), 'md5', hashlib.md5(out.encode('utf-8')).hexdigest())
