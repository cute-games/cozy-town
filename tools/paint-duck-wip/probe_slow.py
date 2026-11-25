"""Calm duck / owl walk at slow speeds (25 Nov): the birds wander in your yard at their own slow speed (1.1 m/s), and follow you at a slow walk.
   python3 tools/paint-duck-wip/probe_slow.py <kit>/cozycheck <joined game file> <out folder> <tag>
   Prints, per bird: its speed, the leg swings a second and the biggest change from one frame to the next (60 frames a second). ZZTEST data only."""
import asyncio, json, math, os, sys
KIT, GAME, OUT, TAG = sys.argv[1:5]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
HERE = os.path.dirname(os.path.abspath(__file__))
SAVE = json.load(open(os.path.join(HERE, '..', 'check-fixtures', 'save-prenight3-pets.json')))
pet = lambda i, t, c, n: {'id': 'zzpd' + str(i), 'type': t, 'col': c, 'name': n, 'happy': 60, 'stay': False, 'loc': 'city', 'x': 40 + i * .8, 'z': 6.6, 'sx': 0, 'sz': 0, 'outfit': {}, 'acc': None}
SAVE = dict(SAVE, name='ZZTEST-DUCK', pets=[pet(0, 'duck', '#ffe08a', 'Puddles'), pet(1, 'owl', '#8a5a36', 'Hooty'), pet(2, 'dog', '#e8b765', 'Waffles')])
INSTALL = """()=>{petPlay=(m,n,t,o)=>COZY_MOVES.play(m,n,t,o);const E=new THREE.Euler();
  window.__rec=()=>PET_ACTORS.map(e=>{const R=e.m.__mv,b=e.m.b;E.setFromQuaternion(b.quaternion,'YXZ');return {k:petKind(e.d),x:e.x,z:e.z,mv:e.moving?1:0,leg:R&&R.legs[0]?R.legs[0].g.rotation.x:0,roll:E.z,by:b.position.y};});
  window.__go=(n,key)=>{const out=[],real=renderer.render;renderer.render=()=>{};try{for(let i=0;i<n;i++){IN.keys.KeyW=!!key;window.__t=Math.max(window.__t||0,performance.now())+1000/60;frame(window.__t);out.push({px:P.x,pz:P.z,p:__rec()});}}finally{renderer.render=real;IN.keys.KeyW=false;}return out;};}"""

def stats(frames, kind, label):
    S = [next(p for p in f['p'] if p['k'] == kind) for f in frames]
    # only the stretches where the bird walks
    idx = [i for i in range(1, len(S)) if S[i]['mv'] and S[i - 1]['mv']]
    if len(idx) < 30: return {'what': label, 'pet': kind, 'walking frames': len(idx)}
    d = lambda key: [abs(S[i][key] - S[i - 1][key]) for i in idx]
    sp = [math.hypot(S[i]['x'] - S[i - 1]['x'], S[i]['z'] - S[i - 1]['z']) * 60 for i in idx]
    leg = [S[i]['leg'] for i in idx]; mean = sum(leg) / len(leg)
    cross = sum(1 for a, b in zip(idx, idx[1:]) if b == a + 1 and S[a]['leg'] < mean <= S[b]['leg'])
    return {'what': label, 'pet': kind, 'walking seconds': round(len(idx) / 60, 1), 'speed m/s mean': round(sum(sp) / len(sp), 2), 'leg swings a second': round(cross / (len(idx) / 60), 1),
            'leg change a frame (rad) mean/max': [round(sum(d('leg')) / len(idx), 3), round(max(d('leg')), 3)], 'body roll change a frame (rad) max': round(max(d('roll')), 4),
            'body height change a frame (m) max': round(max(d('by')), 4)}

async def main():
    game = open(GAME, 'rb').read()
    async with Run('pd-slow-' + TAG, os.path.join(OUT, '_run_slow_' + TAG)) as run:
        g = await begin(run, game, 'ipad-landscape', 'pd-slow', SAVE)
        await g.ev(INSTALL)
        # 1. sent home: they wander on their patch of your front yard at 1.1 m/s
        print('at home:', await g.ev("()=>{__goto('city');__setClock(null,12);closePanel();for(const e of PET_ACTORS)petGoHome(e);__run(10);const e=PET_ACTORS[0];P.x=e.x+3;P.z=e.z+3;return PET_ACTORS.map(e=>[petKind(e.d),e.loc,!!e.d.stay,+e.x.toFixed(1),+e.z.toFixed(1)]);}"))
        fr = await g.ev("()=>__go(1800,0)")
        for k in ('duck', 'owl', 'dog'): print(json.dumps(stats(fr, k, 'wandering in your yard (30 s)')))
        # 2. you walk in short steps (a second on, a second off): the birds start and stop behind you
        await g.ev("()=>{for(const e of PET_ACTORS){e.d.stay=false;delete e.d.home;}P.x=44;P.z=6.6;P.yaw=Math.PI/2;P.pitch=0;bringFollowers(true);__run(10);}")
        fr = []
        for i in range(5):
            fr += await g.ev("()=>{P.yaw=Math.PI/2;return __go(40,1);}"); fr += await g.ev("()=>__go(80,0)")
        print('you walked', round(fr[0]['px'] - fr[-1]['px'], 1), 'm in short steps')
        for k in ('duck', 'owl', 'dog'): print(json.dumps(stats(fr, k, 'you walk in short steps (start and stop)')))
        flips = {k: sum(1 for a, b in zip(fr, fr[1:]) if next(p for p in a['p'] if p['k'] == k)['mv'] != next(p for p in b['p'] if p['k'] == k)['mv']) for k in ('duck', 'owl', 'dog')}
        print('walk/stand switches in 10 s:', flips, '| errors:', g.errors[:3])
asyncio.run(main())
