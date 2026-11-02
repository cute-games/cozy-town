"""Put the output of export-pack.js at the end of js/01-models.js (replacing the old PACKM). Usage: python3 tools/pfu-wip/put-packm.py /tmp/packm.js"""
import sys
p = 'js/01-models.js'; s = open(p, encoding='utf-8').read(); m = open(sys.argv[1], encoding='utf-8').read()
a = s.find("/* 🐾 the book's picked pack models as data")
if a >= 0: s = s[:a]
open(p, 'w', encoding='utf-8').write(s.rstrip('\n') + '\n' + m)
