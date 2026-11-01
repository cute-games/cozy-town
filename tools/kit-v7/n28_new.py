async def n28(run, new_wb, FIX):
    # N28 rewritten 1 Nov 2026 (Pets and Farm Update stage 4b; the owner's approved model-petshop-new): the Pet Shop is ONE room with 3 open floors and a cozy
    # spot per kind instead of 7 fenced areas upstairs. Old: 2 floors, 7 areas upstairs, each kind in its own area, shelves downstairs, the stairs, adopting a pug.
    # New: 3 floors in one room (stairs walked, not a fade), each of the 7 kinds at its own spot (big pets on floor 3 too), no two spots overlap, nobody leaves
    # its spot in 60 s, snacks and toys on a shelf and the clothes rack on floor 1, buying still works, adopting a pug still works.
    probs = []; det = []
    if b'function psSupport' not in new_wb: return False, 'the new Pet Shop is not built yet (stage 4b)'
    save = fx(FIX, 'save-prenight3-pets.json'); save = dict(save, name='ZZTEST-PETSHOP', pets=[]); save['coins'] = 900
    g = await begin(run, new_wb, 'ipad-landscape', 'n28-petshop', save)
    await g.ev("()=>{__goto('pets');__setClock(null,12);}"); await g.step(6)
    s = await g.ev("""()=>{const L=LOC.pets;return {floors:PSH.F.length,one:!L.fls,pens:L.pens.map((p,i)=>({i,type:p.type,kinds:p.kinds,x0:p.x0,x1:p.x1,z0:p.z0,z1:p.z1,fl:p.fl|0})),n:PEN.length};}""")
    kinds = sorted(set(p['type'] for p in s['pens']))
    det.append(f"{s['floors']} floors in one room {s['one']}; {len(s['pens'])} spots for {kinds}; {s['n']} animals")
    if s['floors'] != 3 or not s['one'] or not set(FAMILY) <= set(kinds): probs.append(f"not 3 floors in one room with a spot for every kind: {kinds}")
    mixed = [p for p in s['pens'] if p['type'] in FAMILY and not set(p['kinds']) <= FAMILY[p['type']]]
    if mixed: probs.append(f"a kind at another's spot: {mixed}")
    ov = [(a['type'], b['type']) for a in s['pens'] for b in s['pens'] if a['i'] < b['i'] and a['fl'] == b['fl'] and a['x0'] - .45 < b['x1'] + .45 and b['x0'] - .45 < a['x1'] + .45 and a['z0'] - .45 < b['z1'] + .45 and b['z0'] - .45 < a['z1'] + .45]
    if ov: probs.append(f'spots overlap: {ov}')
    out = await g.ev("""()=>{const L=LOC.pets;let bad=0,n=0;for(let f=0;f<1200;f++){__run(1);for(const a of PEN){n++;const q=a.pen;if(a.x<L.ox+q.x0-.45||a.x>L.ox+q.x1+.45||a.z<L.oz+q.z0-.45||a.z>L.oz+q.z1+.45)bad++;}}
      return {bad,n,byPen:L.pens.map(p=>PEN.filter(a=>a.pen===p).map(a=>a.t))};}""")
    det.append(f"60 s of wandering: {out['bad']} of {out['n']} animal-frames off their own spot; who lives where: {out['byPen']}")
    if out['bad']: probs.append(f"animals off their spot: {out['bad']} frames")
    down = await g.ev("""()=>{const L=LOC.pets;const lab=t=>typeof t.label==='function'?t.label():t.label;const labels=L.inter.map(lab);
      const c0=S.coins,b0=S.bag.treat|0;openShop('pets');const btn=document.querySelector('#card [data-a="buy:treat"]');if(btn)btn.click();const bought=(S.bag.treat|0)-b0,paid=c0-S.coins;const hasClothes=!!document.querySelector('#card [data-a="buy:bow"]');closePanel();
      const racks=L.cols.filter(c=>c.fl===0&&c.x1!==undefined&&((c.x1-L.ox>5.9&&c.z2-c.z1>2)||(c.z1-L.oz>3.9&&c.x2-c.x1>2))).length;   /* the snack shelf on the right wall, the clothes rack by the door */
      return {labels:labels.filter(l=>/clothes|Buy|outside|Big pets/.test(l)),bought,paid,hasClothes,racks};}""")
    det.append(f"floor 1: spots {down['labels']}; snack shelf and clothes rack standing {down['racks']}; buying a treat: +{down['bought']} for {down['paid']} coins, the shop lists pet clothes {down['hasClothes']}")
    if down['bought'] != 1 or down['paid'] <= 0 or not down['hasClothes'] or down['racks'] < 2 or not any('clothes' in l.lower() for l in down['labels']): probs.append(f'floor 1: {down}')
    await g.ev("()=>{P.x=LOC.pets.ox+1.5;P.z=LOC.pets.oz+3.6;P.yaw=Math.PI*.02;P.pitch=.04;}"); await g.step(4); await g.shot('petshop-floor1', both=False)
    st = await g.ev("""()=>{const L=LOC.pets;const go=(x,z,n)=>{const sx=P.x,sz=P.z;for(let i=1;i<=n;i++){P.x=sx+(L.ox+x-sx)*i/n;P.z=sz+(L.oz+z-sz)*i/n;__run(1);}return +(P.cy||0).toFixed(2);};
      P.x=L.ox;P.z=L.oz+3.7;P.cy=0;__run(2);const up=[go(-4.6,4.5,40),go(-5.95,4.5,20),go(-5.95,-.3,80)];const dn=[go(-5.95,4.6,80),go(-4.6,4.5,20)];return {up,dn};}""")
    det.append(f"the stairs: up to {st['up'][-1]} m (floor 2), down to {st['dn'][-1]} m")
    if abs(st['up'][-1] - 3.34) > .01 or st['dn'][-1] != 0: probs.append(f'the stairs: {st}')
    await g.ev("()=>{const L=LOC.pets;P.x=L.ox-2;P.z=L.oz+3;P.yaw=Math.PI;P.pitch=.02;}"); await g.step(4); await g.shot('petshop-floors', both=False)
    ad = await g.ev("""()=>{const a=PEN.find(q=>q.t==='pug');P.x=a.x+1.2;P.z=a.z+1.2;P.cy=0;const n0=S.pets.length;a.target.act();const open=UI.open;const b=document.querySelector('#card [data-a="adopt"]');if(b)b.click();
      return {open,adopted:S.pets.length-n0,kind:S.pets.length?S.pets[S.pets.length-1].kind||S.pets[S.pets.length-1].type:null};}""")
    det.append(f"adopting a pug: card opens {ad['open']}, pets +{ad['adopted']} ({ad['kind']})")
    if not ad['open'] or ad['adopted'] != 1 or ad['kind'] != 'pug': probs.append(f'adopting: {ad}')
    errs = g.errors[:3]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')
