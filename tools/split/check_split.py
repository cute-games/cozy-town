"""Split-game check (owner's OK 29 Oct 2026): the extra lines for a game served as several files.
Every line starts as FAIL. Run from anywhere:
  python3 tools/split/check_split.py --site SITE_DIR --tested TESTED_ONE_FILE.html --live LIVE_ONE_FILE_OR_SITE_INDEX.html --three THREE_R128.js
S1  the site joins back, byte for byte, into the one file the kit tested
S2  every file named in index.html exists and matches its ?v= hash; no game file is left unnamed
S3  the site starts in a browser: same version stamp as the tested file, sees its own index.html as itself (no reload loop), title shows, no page errors
S4  a copy of the live game (the version on players' iPads) sees the site's index.html as a newer update
"""
import argparse, json, os, re, subprocess, sys, tempfile, threading, http.server, functools
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import split as SP
ap = argparse.ArgumentParser(); ap.add_argument('--site', required=True); ap.add_argument('--tested', required=True)
ap.add_argument('--live', required=True); ap.add_argument('--three', required=True); A = ap.parse_args()
R = {k: ['FAIL', 'not run'] for k in ['S1', 'S2', 'S3', 'S4']}
NAMES = {'S1': 'the site joins back, byte for byte, into the one file the kit tested',
         'S2': 'every file in index.html exists and matches its ?v= hash; none left unnamed',
         'S3': 'the site starts: same stamp as the tested file, no reload loop, title, no page errors',
         'S4': 'the live game on players\' devices sees this index.html as a newer update'}
try:
    with tempfile.TemporaryDirectory() as d:
        SP.join(A.site, os.path.join(d, 'back.html'))
        a, b = open(A.tested, 'rb').read(), open(os.path.join(d, 'back.html'), 'rb').read()
        R['S1'] = ['PASS', f'{len(b)} bytes, identical'] if a == b else ['FAIL', f'differs ({len(a)} vs {len(b)} bytes)']
except SystemExit as e: R['S1'] = ['FAIL', str(e)]
idx = open(os.path.join(A.site, 'index.html'), encoding='utf-8').read()
named = re.findall(r'(?:href|src)="((?:js|css)/[^"?]+)\?v=([0-9a-f]+)"', idx)
bad = [p for p, v in named if not os.path.exists(os.path.join(A.site, p)) or SP.H(open(os.path.join(A.site, p), encoding='utf-8', newline='').read()) != v]
ondisk = sorted(os.path.join(r, f)[len(A.site) + 1:].replace(os.sep, '/') for r, _, fs in os.walk(A.site) for f in fs if f.endswith(('.js', '.css')))
unnamed = sorted(set(ondisk) - {p for p, _ in named})
R['S2'] = ['PASS', f'{len(named)} files, all hashes match'] if named and not bad and not unnamed else ['FAIL', f'wrong or missing: {bad}; not named: {unnamed}']
JS = r"""
const {chromium}=require('playwright');const [site,one,live,three]=process.argv.slice(2);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const out={};
const page=async()=>{const p=await b.newPage({viewport:{width:1280,height:800}});await p.route('**/three.min.js',r=>r.fulfill({path:three,contentType:'application/javascript'}));
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.fulfill({body:'',contentType:'text/css'}));await p.route(/firebase(io|database)\.|googleapis\.com\/identitytoolkit/,r=>r.abort());const e=[];p.on('pageerror',x=>e.push(x.message.slice(0,160)));return [p,e];};
for(const [k,u] of [['site',site],['one',one]]){const [p,e]=await page();await p.goto(u,{waitUntil:'load'});await p.waitForTimeout(6000);
 out[k]=await p.evaluate(async()=>{const f=updRead(await (await fetch(location.pathname,{cache:'no-store'})).text());return{build:COZY_BUILD,id:updMine(),own:f&&f.id,title:!document.getElementById('title').hidden};});out[k].errors=e;await p.close();}
{const [p,e]=await page();await p.goto(live,{waitUntil:'load'});await p.waitForTimeout(5000);
 out.live=await p.evaluate(async u=>{const t=await (await fetch(u,{cache:'no-store'})).text();const f=updRead(t);return{old:COZY_BUILD,found:f,newer:!!f&&f.n>COZY_BUILD};},site);out.live.errors=e;await p.close();}
console.log(JSON.stringify(out));await b.close();})();
"""
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = None
try:
    with tempfile.TemporaryDirectory() as d:
        root = os.path.join(d, 'www'); os.makedirs(root)
        os.symlink(os.path.abspath(A.site), os.path.join(root, 'site'))
        os.makedirs(os.path.join(root, 'one')); os.symlink(os.path.abspath(A.tested), os.path.join(root, 'one', 'index.html'))
        os.makedirs(os.path.join(root, 'live')); os.symlink(os.path.abspath(A.live), os.path.join(root, 'live', 'index.html'))
        srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=root))
        threading.Thread(target=srv.serve_forever, daemon=True).start(); base = f'http://127.0.0.1:{srv.server_port}'
        js = os.path.join(d, 't.js'); open(js, 'w').write(JS)
        r = subprocess.run(['node', js, base + '/site/index.html', base + '/one/index.html', base + '/live/index.html', os.path.abspath(A.three)], capture_output=True, text=True, timeout=180, cwd=d,
                           env={**os.environ, 'NODE_PATH': subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()})
        o = json.loads(r.stdout.strip().splitlines()[-1])
        s, one = o['site'], o['one']
        # the site must see its own index.html as itself (else it would reload forever); same stamp as the tested file
        ok = s['build'] == one['build'] and s['id'] == s['own'] and s['title'] and not s['errors'] and not one['errors']
        R['S3'] = ['PASS' if ok else 'FAIL', f"stamp {s['build']} (tested file {one['build']}), update id {s['id']} = its own index.html {s['own']}: {s['id'] == s['own']}, title {'shows' if s['title'] else 'MISSING'}, page errors {len(s['errors'])}{': ' + '; '.join(s['errors'][:3]) if s['errors'] else ''}"]
        L = o['live']; R['S4'] = ['PASS' if L['newer'] else 'FAIL', f"live stamp {L['old']} sees {L['found']['n'] if L['found'] else 'NOTHING'} -> {'update' if L['newer'] else 'NO update'}"]
except Exception as e:
    for k in ('S3', 'S4'):
        if R[k][1] == 'not run': R[k] = ['FAIL', f'error: {str(e)[:200]}']
finally:
    if srv: srv.shutdown()
print('===== COZY TOWN SPLIT CHECK =====')
for k in R: print(f'    {R[k][0]} | {k} {NAMES[k]} | {R[k][1]}')
print('RESULT:', 'PASS' if all(v[0] == 'PASS' for v in R.values()) else 'FAIL')
