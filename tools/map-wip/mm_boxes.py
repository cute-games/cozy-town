"""Corner map: do the map button and its zoom buttons (− +) overlap, and are they all on the screen?  (25 Nov 2026; no game change; ZZTEST test data only)
   python3 tools/map-wip/mm_boxes.py <kit>/cozycheck <joined game file> <out folder> [tag]
   On each screen, light and dark, in town with no job: the boxes of #mmBtn, #mmOut, #mmIn (and #jobTxt, #pad, #joy when shown).
   PASS only when no two boxes intersect, all are inside the view and each zoom button is at least 44 px. Pictures: <out>/<tag>_<screen>_<light|dark>_map.png
   Then a job's first-time tutorial (hairstylist, photographer, delivery), every step, light and dark: the card's Skip and Next buttons against what can be
   tapped in the left column and under it (#jobTxt, #mmBtn, #mmOut, #mmIn, #joy), by the kit's C4 rule (shown, and more than 2 px over each other both ways)."""
import asyncio, json, os, shutil, sys
KIT, NEW, OUT = sys.argv[1:4]; TAG = sys.argv[4] if len(sys.argv) > 4 else 'x'; sys.path.insert(0, KIT)
import harness
from harness import Run
from night3 import begin
HERE = os.path.dirname(os.path.abspath(__file__))
harness.PROFILES['ipad-1024'] = dict(w=1024, h=768, touch=True, mobile=False, group='iPad')
SCREENS = os.environ.get('SCREENS', '').split(',') if os.environ.get('SCREENS') else ['ipad-landscape', 'ipad-1024', 'ipad-portrait', 'iphone-portrait', 'iphone-landscape', 'pc-1920']
SAVE = json.load(open(os.path.join(HERE, '..', 'check-fixtures', 'save-prenight3-pets.json')))
BOX = """()=>{const o={W:innerWidth,H:innerHeight,b:{}};for(const id of['mmBtn','mmOut','mmIn','jobTxt','pad','joy']){const el=document.getElementById(id);if(!el)continue;let e=el,vis=true;
  while(e&&e!==document.documentElement){const cs=getComputedStyle(e);if(cs.display==='none'||e.hidden)vis=false;e=e.parentElement;}if(getComputedStyle(el).visibility==='hidden')vis=false;
  const r=el.getBoundingClientRect();if(vis&&r.width>=1&&r.height>=1)o.b[id]=[r.left,r.top,r.right,r.bottom].map(v=>Math.round(v*10)/10);}
  const z=document.getElementById('mmOut'),r=z.getBoundingClientRect(),t=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);o.hit=t?t.id:'';return o;}"""

def judge(o, job):
    b = o['b']; bad = []
    for k in ('mmBtn', 'mmOut', 'mmIn'):
        if k not in b: bad.append(f'{k} not shown')
    ks = list(b)
    for i, a in enumerate(ks):
        A = b[a]
        if A[0] < 0 or A[1] < 0 or A[2] > o['W'] or A[3] > o['H']: bad.append(f'{a} off the screen {A}')
        for c in ks[i + 1:]:
            B = b[c]; x = min(A[2], B[2]) - max(A[0], B[0]); y = min(A[3], B[3]) - max(A[1], B[1])
            if x > 0 and y > 0: bad.append(f'{a} + {c} overlap {round(x)}x{round(y)} px')
    for k in ('mmOut', 'mmIn'):
        if k in b and (b[k][2] - b[k][0] < 44 or b[k][3] - b[k][1] < 44): bad.append(f'{k} smaller than 44 px')
    if 'mmOut' in b and o['hit'] != 'mmOut': bad.append(f"a tap on − lands on '{o['hit']}'")
    return bad

TBOX = """()=>{const o={W:innerWidth,H:innerHeight,b:{},i:TUT?TUT.i:-1};for(const id of['tutSkip','tutNext','jobTxt','mmBtn','mmOut','mmIn','joy']){const el=document.getElementById(id);let e=el,vis=true;
  while(e&&e!==document.documentElement){const cs=getComputedStyle(e);if(cs.display==='none'||+cs.opacity<0.05||e.hidden)vis=false;e=e.parentElement;}if(getComputedStyle(el).visibility==='hidden')vis=false;   /* visibility is read on the piece itself: a shown child of a hidden box counts */
  const r=el.getBoundingClientRect();if(vis&&r.width>=1&&r.height>=1)o.b[id]=[r.left,r.top,r.right,r.bottom].map(v=>Math.round(v*10)/10);}return o;}"""
TUTS = [('hair', 'hsTutStart', 'hsTut'), ('photo', 'ptTutStart', 'ptTut'), ('delivery', 'tutStart', 'tutDone')]
def tjudge(o):
    b = o['b']; bad = []
    for a in ('tutSkip', 'tutNext'):
        if a not in b: bad.append(f'{a} not shown'); continue
        A = b[a]
        if A[0] < 0 or A[1] < 0 or A[2] > o['W'] or A[3] > o['H']: bad.append(f'{a} off the screen {A}')
        for c in ('jobTxt', 'mmBtn', 'mmOut', 'mmIn', 'joy'):
            if c not in b: continue
            B = b[c]; x = min(A[2], B[2]) - max(A[0], B[0]); y = min(A[3], B[3]) - max(A[1], B[1])
            if x > 2 and y > 2: bad.append(f'{a} + {c} overlap {round(x)}x{round(y)} px')
    return bad

async def tutorials(g, s):
    ok = True; P = harness.PROFILES[s]
    for job, start, flag in TUTS:
        for theme in ('light', 'dark'):
            await g.page.emulate_media(color_scheme=theme)
            n = await g.ev("([j,st,fl])=>{if(TUT)tutEnd();__goto('city');__setClock(null,12);closePanel();$('toast').classList.remove('show');S.job=j;S[fl]=0;jobHud(true);leftFit();__run(3);jobHud(true);leftFit();TUT=null;window[st]();return TUT?(TUT.steps||TUT_STEPS).length:0;}", [job, start, flag])
            bad = [] if n else ['the tutorial did not start']; first = None
            for i in range(n):
                await g.step(2, True); await g.wait(120); o = await g.ev(TBOX); first = first or o
                for x in tjudge(o):
                    if f'step {i + 1}: {x}' not in bad: bad.append(f'step {i + 1}: {x}')
                if i == 0 or (bad and not os.path.exists(os.path.join(OUT, f'{TAG}_{s}_{theme}_tut-{job}-bad.png'))):
                    await g.page.screenshot(path=os.path.join(OUT, f'{TAG}_{s}_{theme}_tut-{job}' + ('-bad' if bad and i else '') + '.png'))
                if o['b'].get('mmBtn') and i: await g.page.screenshot(path=os.path.join(OUT, f'{TAG}_{s}_{theme}_tut-{job}-step{i + 1}.png'))   # a step that points at the map
                if i < n - 1: await g.ev("()=>{TUT.i++;tutShow();}")
            await g.ev("([fl])=>{if(TUT)tutEnd();S[fl]=1;}", [flag]); ok = ok and not bad
            print(f"{'PASS' if not bad else 'FAIL'}  {s} {P['w']}x{P['h']} {theme} tutorial-{job} ({n} steps), step 1: " + (' '.join(f'{k}{[round(v) for v in first["b"][k]]}' for k in first['b']) if first else '') + ('  -> ' + '; '.join(bad) if bad else ''))
    await g.page.emulate_media(color_scheme='light')
    return ok

async def main():
    os.makedirs(OUT, exist_ok=True); new = open(NEW, 'rb').read(); allok = True
    async with Run('mm', os.path.join(OUT, 'run-' + TAG)) as run:
        for s in SCREENS:
            g = await begin(run, new, s, 'mm', dict(SAVE, name='ZZTEST-MM'))
            for job in (None, 'delivery'):
                await g.ev("(j)=>{__goto('city');__setClock(null,12);S.job=j;closePanel();$('toast').classList.remove('show');jobHud(true);leftFit();}", job); await g.step(6)
                for theme in ('light', 'dark'):
                    await g.page.emulate_media(color_scheme=theme); await g.step(1, True)
                    o = await g.ev(BOX); bad = judge(o, job); allok = allok and not bad
                    what = 'job-' + job if job else 'nojob'
                    await g.page.screenshot(path=os.path.join(OUT, f'{TAG}_{s}_{theme}_map-{what}.png'))
                    P = harness.PROFILES[s]
                    print(f"{'PASS' if not bad else 'FAIL'}  {s} {P['w']}x{P['h']} {theme} {what}: " + ' '.join(f'{k}{[round(v) for v in o["b"][k]]}' for k in o['b']) + ('  -> ' + '; '.join(bad) if bad else ''))
            allok = await tutorials(g, s) and allok
            await g.ev("()=>{S.job=null;}"); await run.close(g)
    print('RESULT:', 'PASS' if allok else 'FAIL'); sys.exit(0 if allok else 1)
asyncio.run(main())
