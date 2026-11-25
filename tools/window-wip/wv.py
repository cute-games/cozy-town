"""Window views helper: list every interior window and what its view shows; take pictures.
usage: wv.py KIT GAME OUT MODE [TAG]   MODE: list | shots | petshop"""
import asyncio, json, os, sys
KIT, NEW, OUT, MODE = sys.argv[1:5]; TAG = sys.argv[5] if len(sys.argv) > 5 else 'after'
sys.path.insert(0, KIT)
import harness
from harness import Run
from night3 import begin
SAVE = json.load(open(os.path.join(KIT, 'fixtures', 'save-pfu6-stage6.json')))
HOOK = r"""()=>{window.__pv=[];if(typeof paneLook!=='function')return 'old';const f=paneView;window.__pvms=0;
  paneView=function(x,ci,lv,vx,vz,ox,oz,rx,rz,W,own){__pv.push({ci,lv,vx,vz,ox,oz,W,own});return f.apply(this,arguments);};
  const pl=paneLook;paneLook=function(){const t=performance.now();pl();window.__pvms=performance.now()-t;};
  window.__names=(W)=>W.B.map(b=>{const p=PLACES.find(q=>q.x===b[0]&&q.z===b[1]&&!q.flat);if(p)return p.n;const fb=FARMD.p.find(q=>q[1]===b[0]&&q[2]===b[1]);if(fb)return fb[0]==='farm.barn'?'Farm barn':'Farm stables';
    const C=LOC.city,lp=(C.lane||[]).find(l=>l.hx===b[0]&&l.hz===b[1]);if(lp)return 'Lane house of '+LANE.own[lp.j].nm;
    let best=null,bd=9;for(const h of HOUSES){const d=Math.hypot(h.x-b[0],h.z-b[1]);if(d<bd){bd=d;best=h;}}return best?best.n:'building at '+b[0]+','+b[1];});
  window.__desc=(c)=>{const {vx,vz,ox,oz,W,own}=c,rx=-oz,rz=ox,N=__names(W),pr=(x,z)=>[(x-vx)*rx+(z-vz)*rz,(x-vx)*ox+(z-vz)*oz],out=[];
    const bl=[];W.B.forEach((b,i)=>{if(b===own)return;const [l,dc]=pr(b[0],b[1]),eo=(Math.abs(ox)*b[2]+Math.abs(oz)*b[3])/2,er=(Math.abs(rx)*b[2]+Math.abs(rz)*b[3])/2;if(dc<1.5||dc-eo>150)return;const d=Math.max(dc-eo,1.5),s=183/d,x0=256+(l-er)*s,w=2*er*s;
      if(x0>512||x0+w<0)return;bl.push([d,N[i]+' '+Math.round(d)+' m'+(x0+w<170?' (left)':x0>342?' (right)':'')]);});bl.sort((a,b)=>a[0]-b[0]);
    const cone=(x,z,far)=>{const [l,d]=pr(x,z);return d>2&&d<far&&Math.abs(l/d)<1.2?Math.round(d):0;};
    let d;if(d=cone(-24,24,90))out.push('Cozy Park '+d+' m');if(d=cone(-25,68.5,90))out.push('Football field '+d+' m');if(d=cone(69,69,110))out.push('Lake '+d+' m');if(d=cone(36.2,-36.2,60))out.push('Duck pond '+d+' m');
    let rd=1e9;for(const c0 of[-50,0,50]){if(oz){const k=(c0-vz)*oz;if(k>2&&vx>-84&&vx<84)rd=Math.min(rd,k);}if(ox){const k=(c0-vx)*ox;if(k>2)rd=Math.min(rd,k);}}if(rd<120)out.push('road '+Math.round(rd)+' m');
    const tr=W.T.filter(t=>{const [l,d0]=pr(t[0],t[1]);return d0>=7&&d0<=150&&Math.abs(183*l/d0)<256;}).length,mt=W.M.filter(m=>{const [l,d0]=pr(m[0],m[1]);return d0>=30&&Math.abs(183*l/d0)<256+30;}).length;
    return {b:bl.slice(0,6).map(q=>q[1]),more:Math.max(0,bl.length-6),g:out,trees:tr,mtn:mt};};
  window.__cells=()=>{const L=CUR,n={};for(const g of[L.g,...(L.fls||[]).map(f=>f.g)])g.traverse(o=>{if(o.material===PANE){const u=o.geometry.attributes.uv,per=o.geometry.index?24:36;for(let i=0;i<u.count;i+=per){const k=(u.getX(i)*4|0)+4*(3-(u.getY(i)*4|0));(n[k]=n[k]||new Set()).add(o.uuid+':'+i);}}});
    const r={};for(const k in n)r[k]=n[k].size;return r;};
  window.__case=(id,pre)=>{__pv.length=0;if(pre)pre();setLoc('city');__pv.length=0;setLoc(id);const cnt=__cells(),A=mapMe();
    return {id,door:[Math.round(A.x*10)/10,Math.round(A.z*10)/10],ms:Math.round(__pvms*10)/10,own:__pv[0]&&__pv[0].own?__names(__pv[0].W)[__pv[0].W.B.indexOf(__pv[0].own)]:null,
      cells:__pv.map(c=>({ci:c.ci,lv:c.lv,n:cnt[c.ci+4*c.lv]||0,v:[Math.round(c.vx*10)/10,Math.round(c.vz*10)/10],dir:c.oz<0?'north':c.oz>0?'south':c.ox>0?'east':'west',d:__desc(c)}))};};
  return 'ok';}"""
CASES = [('salon', 'Hair Salon', None), ('home', 'My House (Friends Lane, your lot)', None), ('market', 'Market', None), ('flowers', 'Flower Shop', None), ('cafe', 'Café', None), ('clothes', 'Clothes Shop', None),
         ('pets', 'Pet Shop', None), ('vet', 'Vet Station', None)]
CASES += [('cl_' + s, 'School classroom (%s)' % s, None) for s in ('@SUBJ',)]
for b, nm in (('ap1', 'Big apartments by the flowers'), ('of', 'Tall building behind the Market'), ('ap2', 'Apartments behind the Pet Shop'), ('ap3', 'Apartments by the park')):
    for f in (1, 2, 3): CASES.append(('apt%d' % f, '%s, floor %d' % (nm, f), "()=>{APT.b='%s';}" % b))
for h, nm in (('n1', 'Pink house'), ('n2', 'Green house'), ('n3', 'Yellow house'), ('s1', 'Purple house'), ('s2', 'Blue house'), ('s3', 'Peach house'), ('nb', 'House by the flowers')):
    CASES.append(('client', "Decorating job room in the %s" % nm, "()=>{CLRET={loc:'city',h:'%s'};}" % h))

async def list_mode(g):
    hk = await g.ev(HOOK); print('hook', hk)
    subj = await g.ev("()=>Object.keys(SUBJ)")
    lines = []; total = 0; views = 0; mss = []; rows = []
    cases = []
    for c in CASES:
        if c[0] == 'cl_@SUBJ': cases += [('cl_' + s, 'School classroom (%s)' % s, None) for s in subj]
        else: cases.append(c)
    allin = await g.ev("()=>Object.keys(LOC).filter(k=>LOC[k].type==='in')")
    for cid, name, pre in cases:
        r = await g.ev("([id,pre])=>__case(id,pre?eval(pre):null)", [cid, pre])
        rows.append((name, r)); mss.append(r['ms'])
        lines.append(f"== {name}  [room '{cid}', real door at x {r['door'][0]} z {r['door'][1]}, real building: {r['own']}; painted in {r['ms']} ms]")
        for c in sorted(r['cells'], key=lambda c: (c['lv'], c['ci'])):
            total += c['n']; views += 1; d = c['d']
            what = '; '.join(d['b']) + (f" (+{d['more']} more behind)" if d['more'] else '')
            lines.append(f"   floor {c['lv']}  faces {c['dir']:5}  {c['n']} window(s)  seen from x {c['v'][0]} z {c['v'][1]}:  buildings: {what or 'none'} | ground: {', '.join(d['g']) or 'grass'} | trees {d['trees']}, mountains {d['mtn']}")
    covered = set(c[0] for c in cases)
    other = []
    for k in allin:
        if k in covered: continue
        n = await g.ev("(id)=>{setLoc(id);const c=__cells();let n=0;for(const k in c)n+=c[k];return n;}", k); other.append((k, n))
    lines.append('')
    lines.append('Other inside places and their painted windows (0 = the room has none): ' + ', '.join(f'{k} {n}' for k, n in other))
    lines.append(f'TOTAL: {total} windows in {views} wall views over {len(cases)} cases; paint time per place: min {min(mss)} ms, max {max(mss)} ms, mean {sum(mss)/len(mss):.1f} ms (headless Chromium, this machine)')
    open(os.path.join(OUT, 'windows.txt'), 'w').write('\n'.join(lines) + '\n'); print('\n'.join(lines))

LOOKS = {  # name: (room id, pre js, [(tag, px, pz, yaw, pitch, cy-walk)])
    'house':   ('home', None, [('back-north', 0, 2.5, 0, .02), ('east', 2, 0, -1.5708, .02), ('west', -2, 0, 1.5708, .02)]),
    'vet':     ('vet', None, [('front', 0, -2.5, 3.14159, .02), ('east', 1.5, 0, -1.5708, .02)]),
    'school':  ('cl_@0', None, [('east', 2, 0, -1.5708, .02)]),
    'flowers': ('flowers', None, [('west', -2, .5, 1.5708, .02), ('east', 2, -1.6, -1.5708, .02)]),
    'salon':   ('salon', None, [('east', 2, -.5, -1.5708, .02), ('west', -2, 2.4, 1.5708, .02)]),
    'market':  ('market', None, [('west', -3, 2.5, 1.5708, .02)]),
    'cafe':    ('cafe', None, [('east', 2, -.2, -1.5708, .02), ('west', -2, 1.4, 1.5708, .02)]),
    'clothes': ('clothes', None, [('west', -2, 0, 1.5708, .02)]),
    'apt-park-f3': ('apt3', "()=>{APT.b='ap3';}", [('end-a', 5.5, 0, -1.5708, .02), ('end-b', -5.5, 0, 1.5708, .02)]),
    'client-n3': ('client', "()=>{CLRET={loc:'city',h:'n3'};}", [('back', 0, 1.5, 0, .02), ('east', 1, 0, -1.5708, .02)]),
}
PETUP = """()=>{const L=LOC.pets;const go=(x,z,n)=>{const sx=P.x,sz=P.z;for(let i=1;i<=n;i++){P.x=sx+(L.ox+x-sx)*i/n;P.z=sz+(L.oz+z-sz)*i/n;__run(1);}};
  P.x=L.ox;P.z=L.oz+3.7;P.cy=0;__run(3);for(const q of [[-4.6,4.5,40],[-5.95,4.5,20],[-5.95,2.2,40],[-5.95,-.3,40],[-4.2,-.5,30],[-4.0,-2.2,30],[-2.9,-2.25,30]])go(...q);const mid=P.cy;
  for(const q of [[3.0,-2.3,60],[4.4,-1.2,30],[4.4,4.6,60],[5.95,4.6,20],[5.95,-.3,80],[4.0,-1.0,30]])go(...q);__run(30);return {mid,cy:P.cy};}"""
CLEAN = "()=>{closePanel();$('toast').classList.remove('show');}"
async def snap(g, name):
    await g.ev(CLEAN); await g.step(4, True); await g.page.screenshot(path=os.path.join(OUT, 'pics', name + '.png')); print('  pic', name)
async def look(g, x, z, yaw, pitch, name):
    await g.ev("([x,z,y,p])=>{const L=CUR;P.x=L.ox+x;P.z=L.oz+z;P.yaw=y;P.pitch=p;P.sit=null;}", [x, z, yaw, pitch]); await snap(g, name)
async def petshop(g, tag):
    for hour, dn in ((12, 'day'), (23, 'night')):
        await g.ev("(h)=>{__goto('pets');__setClock(null,h);}", hour); await g.step(4)
        await look(g, 0, 1.5, 0, .05, f'{tag}_petshop-f0_back-north_{dn}'); await look(g, -1, -1.4, -1.5708, .05, f'{tag}_petshop-f0_east_{dn}')
        r = await g.ev(PETUP); print('  pet shop climb', r)
        await g.ev("()=>{P.yaw=0;P.pitch=.12;}"); await snap(g, f'{tag}_petshop-top_back-north_{dn}')
        await g.ev("()=>{const L=LOC.pets;P.x=L.ox+1;P.z=L.oz-1.2;P.yaw=Math.PI;P.pitch=.12;}"); await snap(g, f'{tag}_petshop-top_front-south_{dn}')
        await g.ev("()=>{const L=LOC.pets;P.x=L.ox+0;P.z=L.oz+1.5;P.yaw=0;P.pitch=.1;}"); await snap(g, f'{tag}_petshop-top_back-north-wide_{dn}')
async def outside(g, name, vx, vz, ox, oz, ey):
    import math
    await g.ev("()=>{__goto('city');__setClock(null,12);}"); await g.step(4)
    await g.ev("([x,z,y])=>{P.x=x;P.z=z;P.yaw=y;P.pitch=0;}", [vx + ox * (3 if ey else 1.2), vz + oz * (3 if ey else 1.2), math.atan2(-ox, -oz)]); await g.ev(CLEAN); await g.step(6, True)
    if ey: await g.ev("(y)=>{camera.position.y=y;camera.updateMatrixWorld(true);renderer.render(scene,camera);}", ey)
    await g.page.screenshot(path=os.path.join(OUT, 'pics', name + '.png')); print('  pic', name)
async def shots(g):
    await g.ev(HOOK); subj = await g.ev("()=>Object.keys(SUBJ)")
    info = {}
    for nm, (cid, pre, views) in LOOKS.items():
        cid = cid.replace('@0', subj[0])
        if os.environ.get('ONLY') and nm not in os.environ['ONLY'].split(','): continue
        for hour, dn in ((12, 'day'), (23, 'night')):
            r = await g.ev("([id,pre,h])=>{const r=__case(id,pre?eval(pre):null);__goto(id);if(pre)eval(pre)();setLoc(id);__setClock(null,h);return r;}", [cid, pre, hour]); await g.step(4); info[nm] = r
            for tag, x, z, yaw, pitch in views: await look(g, x, z, yaw, pitch, f'{TAG}_{nm}_{tag}_{dn}')
    if not os.environ.get('ONLY') or 'pets' in os.environ['ONLY']: await petshop(g, TAG)
    # outside pictures, from the real wall, looking the same way
    r = await g.ev("()=>__case('pets')"); pv = {(c['ci'], c['lv']): c for c in r['cells']}
    for (ci, lv), c in pv.items():
        if lv == 2:
            ox, oz = {'north': (0, -1), 'south': (0, 1), 'east': (1, 0), 'west': (-1, 0)}[c['dir']]
            await outside(g, f'{TAG}_OUTSIDE_petshop-top_{c["dir"]}', c['v'][0], c['v'][1], ox, oz, 8)
    for cid, nm, want in (('vet', 'vet', None), ('flowers', 'flowers', None), ('home', 'house', None)):
        r = await g.ev("(id)=>__case(id)", cid)
        for c in r['cells']:
            if c['lv']: continue
            ox, oz = {'north': (0, -1), 'south': (0, 1), 'east': (1, 0), 'west': (-1, 0)}[c['dir']]
            await outside(g, f'{TAG}_OUTSIDE_{nm}_{c["dir"]}', c['v'][0], c['v'][1], ox, oz, 0)
    json.dump(info, open(os.path.join(OUT, 'shots-info.json'), 'w'), indent=1)
async def main():
    os.makedirs(os.path.join(OUT, 'pics'), exist_ok=True)
    async with Run('wv', os.path.join(OUT, 'run-wv-' + MODE + '-' + TAG)) as run:
        g = await begin(run, open(NEW, 'rb').read(), 'ipad-landscape', 'wv', dict(SAVE, name='ZZTEST-WV'))
        errs = []; g.page.on('pageerror', lambda e: errs.append(str(e)[:300]))
        if MODE == 'list': await list_mode(g)
        elif MODE == 'shots': await shots(g)
        elif MODE == 'petshop': await g.ev("()=>{window.__goto&&0;}"); await petshop(g, TAG)
        elif MODE == 'measure':
            await g.ev(HOOK)
            r = await g.ev("""()=>{const out={};for(const id of['pets','home','market']){__goto(id);__run(3);renderer.info.autoReset=true;renderer.render(scene,camera);out[id]={calls:renderer.info.render.calls,tris:renderer.info.render.triangles,tex:renderer.info.memory.textures,ms:window.__pvms};}return out;}""")
            print('MEASURE', TAG, json.dumps(r))
        print('page errors:', errs)
        await run.close(g)
asyncio.run(main())
