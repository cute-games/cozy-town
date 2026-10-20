"""Reproduce the live check's two crawl findings on a game Saturday afternoon: "Talk to Lady Fluffington" unreachable, and Zoomy Zac's
football buttons found under "Talk to Sir Barkley". Uses the kit's own Crawler (the same approach and use button as the crawl).
usage: python3 probe_judges.py GAMEFILE OUTDIR [HOUR]"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR, Crawler
from checks import start_from_save
S = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad'
GAME, OUT = sys.argv[1], sys.argv[2]; HOUR = float(sys.argv[3]) if len(sys.argv) > 3 else 16.1
fresh = json.load(open(f'{S}/runs/live20/out/stages/saves.json'))['extra']['fresh']
async def main():
    os.makedirs(OUT, exist_ok=True)
    async with Run('pj', OUT) as run:
        g = await run.open(open(GAME, 'rb').read(), 'web', 'ipad-landscape', 'light', 'judges', save=dict(fresh, name='ZZTEST-TOWN')); await start_from_save(g); await g.ev(INSTR)
        sat = await g.ev("()=>{let d=S.day;while(wdIdx(d)!==5)d++;return d;}")
        await g.ev("([d,h])=>__setClock(d,h)", [sat, HOUR]); await g.step(10)
        print('day', sat, await g.ev("()=>({wd:wdName(),t:clockStr(S.time),show:isShowDay(),left:psLeft(),judgesVisible:PSX.judges.map(j=>j.p.root.visible)})"))
        cr = Crawler(g, depth=1, per_label=1, budget_s=300, recurse=False)
        ts = await cr.targets()
        near = await g.ev("()=>window.__T.map((t,i)=>({i,l:String(typeof t.label==='function'?t.label():t.label||''),x:+(t.x||0).toFixed(2),z:+(t.z||0).toFixed(2),r:t.r})).filter(t=>t.x<-25&&t.x>-40&&t.z>15&&t.z<30)")
        print('targets by the stage:', json.dumps(near, ensure_ascii=False))
        for who in ('Lady Fluffington', 'Sir Barkley', 'Granny Daisy'):
            ts = await cr.targets(); t = next((t for t in ts if t['label'] == 'Talk to ' + who), None)
            if not t: print(who, 'no target'); continue
            for k in range(6):
                ok = await g.ev(r"""([i,k])=>{const t=window.__T[i];let tx=t.x,tz=t.z;const a=[0,Math.PI/2,-Math.PI/2,Math.PI,Math.PI/4,-Math.PI/4][k];let dx=P.x-tx,dz=P.z-tz;const d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;
                  const c=Math.cos(a),s=Math.sin(a);const ux=dx*c-dz*s,uz=dx*s+dz*c;const want=Math.max(0.55,Math.min(1.1,(t.r||1.5)*0.5));P.x=tx+ux*want;P.z=tz+uz*want;P.yaw=Math.atan2(-(tx-P.x),-(tz-P.z));P.pitch=-0.15;window.__want=t;
                  return [+P.x.toFixed(2),+P.z.toFixed(2)];}""", [t['i'], k])
                await g.step(2)
                st = await g.ev("()=>({P:[+P.x.toFixed(2),+P.z.toFixed(2)],T:TARGET?String(typeof TARGET.label==='function'?TARGET.label():TARGET.label):null,want:TARGET===window.__want,act:!$('actWrap').hidden})")
                print(f'  {who} try {k}: placed {ok} -> {st}')
            await cr.recover('city')
        # the crawl tapped "🏆 Enter the Pet Show!" before the judges: do the same, end the show the crawl's way, then list the targets again
        before = await g.ev("()=>targets().map(t=>String(typeof t.label==='function'?t.label():t.label||''))")
        ts = await cr.targets(); ps = next((t for t in ts if t['label'].startswith('🏆 Enter the Pet Show')), None)
        if ps and await cr.approach(ps['i']) == 'ok':
            await cr.use_action(); await cr.settle(6, 700); print('entered the show: cut', await g.ev("()=>!!CUT"))
            await cr.recover('city'); print('after the show: showDone', await g.ev("()=>showDone()"), 'judges visible', await g.ev("()=>PSX.judges.map(j=>j.p.root.visible)"))
        after = await g.ev("()=>targets().map(t=>String(typeof t.label==='function'?t.label():t.label||''))")
        print('targets before', len(before), 'after', len(after), '; gone:', [x for x in before if x not in after], '; new:', [x for x in after if x not in before])
        i_b = [i for i, x in enumerate(before) if x == 'Talk to Sir Barkley']
        if i_b: print('the old index of Sir Barkley', i_b[0], 'now points at', after[i_b[0]] if i_b[0] < len(after) else 'nothing')
        i_f = [i for i, x in enumerate(before) if x == 'Talk to Lady Fluffington']
        if i_f: print('the old index of Lady Fluffington', i_f[0], 'now points at', after[i_f[0]] if i_f[0] < len(after) else 'nothing')
        i_d = [i for i, x in enumerate(before) if x == 'Talk to Granny Daisy']
        if i_d: print('the old index of Granny Daisy', i_d[0], 'now points at', after[i_d[0]] if i_d[0] < len(after) else 'nothing')
        # Sir Barkley through the crawl's own approach and use button, as the crawl did it
        ts = await cr.targets(); t = next((t for t in ts if t['label'] == 'Talk to Sir Barkley'), None)
        if t:
            ap = await cr.approach(t['i']); print('Sir Barkley approach:', ap, await g.ev("()=>({P:[+P.x.toFixed(2),+P.z.toFixed(2)],T:TARGET&&String(typeof TARGET.label==='function'?TARGET.label():TARGET.label)})"))
            if ap == 'ok':
                used = await cr.use_action(); await cr.settle(6, 700)
                print('used', used, await g.ev("()=>({ui:UI.open,card:UI.open?$('card').innerText.slice(0,160):'',btns:[...document.querySelectorAll('#card [data-a]')].map(b=>b.dataset.a),toast:window.__lastToast})"))
                await g.shot('after-sir-barkley', both=False)
        print('page errors:', g.errors[:3])
        await run.close(g)
asyncio.run(main())
