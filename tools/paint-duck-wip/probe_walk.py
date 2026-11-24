"""Calm duck / owl walk (25 Nov): numbers from game state and picture strips, on a test copy (ZZTEST data only; no game change).
   python3 tools/paint-duck-wip/probe_walk.py <kit>/cozycheck <joined game file> <out folder> <tag: before|after>
   Writes <out>/<tag>-walk.json (per-frame state at 60 frames a second) and prints the summary; picture strips <tag>-*.png:
   8 frames 1/30 s apart of the duck and the owl walking behind you (light, and one dark strip), and 4 frames standing still."""
import asyncio, json, math, os, sys
KIT, GAME, OUT, TAG = sys.argv[1:5]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
SAVE = json.load(open(os.path.join(HERE, '..', 'check-fixtures', 'save-prenight3-pets.json')))
pet = lambda i, t, c, n: {'id': 'zzpd' + str(i), 'type': t, 'col': c, 'name': n, 'happy': 60, 'stay': False, 'loc': 'city', 'x': 40 + i * .8, 'z': 6.6, 'sx': 0, 'sz': 0, 'outfit': {}, 'acc': None}
SAVE = dict(SAVE, name='ZZTEST-DUCK', pets=[pet(0, 'duck', '#ffe08a', 'Puddles'), pet(1, 'owl', '#8a5a36', 'Hooty'), pet(2, 'dog', '#e8b765', 'Waffles')])
os.makedirs(OUT, exist_ok=True)

INSTALL = """()=>{const r=window.__realRender||renderer.render;
  window.__realRender=function(s,c){if(window.__pre)try{window.__pre();}catch(e){console.warn('pre',e);}return r.call(renderer,s,c);};renderer.render=window.__realRender;
  petPlay=(m,n,t,o)=>COZY_MOVES.play(m,n,t,o);   /* measure every frame, also when the pet is behind you */
  const E=new THREE.Euler();
  window.__rec=()=>PET_ACTORS.map(e=>{const R=e.m.__mv,b=e.m.b;E.setFromQuaternion(b.quaternion,'YXZ');
    return {k:petKind(e.d),x:e.x,z:e.z,mv:e.moving?1:0,leg:R&&R.legs[0]?R.legs[0].g.rotation.x:0,roll:E.z,pitch:E.x,by:b.position.y,ry:e.g.rotation.y,gy:e.g.position.y,
      tail:e.m.tail?e.m.tail.rotation.z+e.m.tail.rotation.y:0,head:e.m.head?e.m.head.rotation.y:0};});
  /* n frames of 1/60 s; walk = 0 stand, 1 full walking speed, .3 a slow walk (the stick pushed a little). Returns every frame's state */
  window.__walk=(n,walk,render)=>{const out=[],real=window.__realRender;for(let i=0;i<n;i++){IN.joy.id=walk?99:null;IN.joy.x=0;IN.joy.y=-walk;P.yaw=window.__yaw||Math.PI/2;P.pitch=0;
      window.__t=(window.__t||performance.now())+1000/60;   /* exactly 1/60 s of game time a frame, also across the pictures (a screenshot takes real time) */renderer.render=(render&&i===n-1)?real:(()=>{});try{frame(window.__t);}finally{renderer.render=real;}
      out.push({px:P.x,pz:P.z,p:__rec()});}IN.joy.id=null;IN.joy.y=0;return out;};
  /* one bird: from its side (the legs); both: from in front, walking towards the camera (the waddle). The dog (measured, not pictured) is hidden so it cannot stand in the way */
  window.__cam=(ks)=>{window.__pre=()=>{if(PB)PB.root.visible=false;for(const e of PET_ACTORS)if(!ks.includes(petKind(e.d)))e.g.visible=false;const F=PET_ACTORS.filter(e=>ks.includes(petKind(e.d)));
    const cx=F.reduce((a,e)=>a+e.x,0)/F.length,cz=F.reduce((a,e)=>a+e.z,0)/F.length,sp=F.length>1?Math.hypot(F[0].x-F[1].x,F[0].z-F[1].z):0;
    if(F.length>1)camera.position.set(cx-(window.__yaw?-1:1)*Math.max(2.6,sp*1.5),.6,cz+.5);else camera.position.set(cx-.5,.45,cz+1.7);camera.lookAt(cx,.3,cz);};};}"""
START = "()=>{__goto('city');__setClock(null,12);if(typeof wxForce==='function')wxForce('sun');closePanel();$('toast').classList.remove('show');P.x=44;P.z=6.6;P.yaw=Math.PI/2;P.pitch=0;P.cy=0;bringFollowers(true);__run(20);return PET_ACTORS.map(e=>[petKind(e.d),e.loc,+e.x.toFixed(1),+e.z.toFixed(1)]);}"

def stats(frames, kind, label):
    S = [next(p for p in f['p'] if p['k'] == kind) for f in frames]; n = len(S)
    d = lambda key: [abs(S[i][key] - S[i - 1][key]) for i in range(1, n)]
    wrap = lambda a: abs((a + math.pi) % (2 * math.pi) - math.pi)
    sp = [math.hypot(S[i]['x'] - S[i - 1]['x'], S[i]['z'] - S[i - 1]['z']) * 60 for i in range(1, n)]
    leg = [s['leg'] for s in S]; mean = sum(leg) / n
    # leg swings a second: how often the leg angle crosses its mean going forward (at 60 frames a second, more than 30 cannot be told apart)
    cross = sum(1 for i in range(1, n) if leg[i - 1] < mean <= leg[i])
    turn = [wrap(S[i]['ry'] - S[i - 1]['ry']) for i in range(1, n)]
    return {'what': label, 'pet': kind, 'seconds': round(n / 60, 2), 'speed m/s mean': round(sum(sp) / len(sp), 2), 'speed max': round(max(sp), 2),
            'moving share': round(sum(s['mv'] for s in S) / n, 2), 'moving flips': sum(1 for i in range(1, n) if S[i]['mv'] != S[i - 1]['mv']),
            'leg swings a second': round(cross / (n / 60), 1),
            'leg change a frame (rad) mean/max': [round(sum(d('leg')) / (n - 1), 3), round(max(d('leg')), 3)],
            'body roll change a frame (rad) mean/max': [round(sum(d('roll')) / (n - 1), 4), round(max(d('roll')), 4)], 'body roll max': round(max(abs(s['roll']) for s in S), 3),
            'body height change a frame (m) mean/max': [round(sum(abs(a) for a in d('by')) / (n - 1), 4), round(max(d('by')), 4)],
            'tail change a frame (rad) max': round(max(d('tail')), 3), 'head turn a frame (rad) max': round(max(d('head')), 3), 'facing turn a frame (rad) max': round(max(turn), 3)}

async def strip(g, name, kinds, n, gap, walk, theme=None):
    """n pictures gap frames (1/60 s) apart, cut to the middle of the view and put side by side in rows of 4."""
    if theme: await g.page.emulate_media(color_scheme=theme)
    await g.ev(f"()=>__cam({json.dumps(kinds)})"); tiles = []
    for i in range(n):
        await g.ev(f"()=>{{__walk({gap},{walk},true);$('toast').classList.remove('show');}}")
        p = os.path.join(OUT, f'_tmp_{name}_{i}.png'); await g.page.screenshot(path=p, timeout=90000)
        im = Image.open(p); w, h = im.size; tiles.append(im.crop((w // 2 - 330, h // 2 - 190, w // 2 + 330, h // 2 + 250)).copy()); im.close(); os.remove(p)
    cols = 4; rows = (n + cols - 1) // cols; W, H = tiles[0].size; sheet = Image.new('RGB', (cols * W, rows * H), 'white')
    for i, t in enumerate(tiles): sheet.paste(t, ((i % cols) * W, (i // cols) * H))
    sheet.save(os.path.join(OUT, f'{TAG}-{name}.png')); await g.ev("()=>{window.__pre=null;}")
    if theme: await g.page.emulate_media(color_scheme=g.theme)

async def main():
    game = open(GAME, 'rb').read(); res = []
    async with Run('pd-' + TAG, os.path.join(OUT, '_run_' + TAG)) as run:
        g = await begin(run, game, 'ipad-landscape', 'pd-walk', SAVE)
        await g.ev(INSTALL); print('start', await g.ev(START))
        await g.ev("()=>__walk(90,1)")   # get going
        fr = await g.ev("()=>__walk(300,1)"); json.dump(fr, open(os.path.join(OUT, f'{TAG}-walk.json'), 'w'))
        print('you walked', round(fr[0]['px'] - fr[-1]['px'], 1), 'm west in 5 s, z', round(fr[0]['pz'], 2), '->', round(fr[-1]['pz'], 2))
        for k in ('duck', 'owl', 'dog'): res.append(stats(fr, k, 'following you at walking speed'))
        await strip(g, 'walk-duck-owl', ['duck', 'owl'], 8, 2, 1)
        await strip(g, 'walk-duck', ['duck'], 8, 2, 1)
        await strip(g, 'walk-owl', ['owl'], 8, 2, 1)
        await strip(g, 'walk-duck-owl-dark', ['duck', 'owl'], 4, 2, 1, 'dark')
        fr = await g.ev("()=>__walk(240,0)")   # you stop: they come to their spots and stand
        for k in ('duck', 'owl', 'dog'): res.append(stats(fr[120:], k, 'standing still (2 s after you stopped)'))
        await strip(g, 'stand-duck-owl', ['duck', 'owl'], 4, 20, 0)
        print('before the slow walk:', await g.ev("()=>({ui:UI.open,cut:!!CUT,tut:!!TUT,dtut:!!DTUT,freeze:P.freeze,sit:!!P.sit,ride:!!P.ride,note:!$('note').hidden,playing:PLAYING})"))
        await g.ev("()=>{window.__yaw=-Math.PI/2;}"); await g.ev("()=>__walk(150,.3)")   # back east along the same pavement (the way west ends at a fence); fr = await g.ev("()=>__walk(300,.3)")
        print('slow walk:', round(fr[0]['px'] - fr[-1]['px'], 1), 'm in 5 s')
        for k in ('duck', 'owl', 'dog'): res.append(stats(fr, k, 'following you at a slow walk'))
        await strip(g, 'slowwalk-duck-owl', ['duck', 'owl'], 8, 2, .3)
        print('errors:', g.errors[:5])
    json.dump(res, open(os.path.join(OUT, f'{TAG}-walk-summary.json'), 'w'), indent=1)
    for r in res: print(json.dumps(r))
asyncio.run(main())
