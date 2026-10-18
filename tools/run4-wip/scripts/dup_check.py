"""Which objects near the food truck have coincident same-facing faces? A test copy that does not bake, so every object keeps its name."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from look4 import TRUCK_JS
src = open('/home/user/cozy-town/index.html', encoding='utf-8').read()
assert src.count('function bake(root,shadow=true,chunk=0){') == 1
src = src.replace('function bake(root,shadow=true,chunk=0){', 'function bake(root,shadow=true,chunk=0){if(window.NOBAKE)return;', 1)
src = src.replace('<script>', '<script>window.NOBAKE=1;</script><script>', 1)
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS2 = TRUCK_JS.replace("tris.push({a,b,c,n:nrm,o:nrm.dot(a),col:mt.color?'#'+mt.color.getHexString():'?',id:m.id});", "tris.push({a,b,c,n:nrm,o:nrm.dot(a),col:mt.color?'#'+mt.color.getHexString():'?',id:m.id,who:m.geometry.type+'@'+m.position.toArray().map(v=>+v.toFixed(2)).join(',')+(m.parent&&m.parent!==L.g?' in '+(m.parent.type+'@'+m.parent.position.toArray().map(v=>+v.toFixed(2)).join(',')):'')});") \
  .replace("bad.push({gap:+(B.o-A.o).toFixed(4),overlap:+ov.toFixed(4),at:[+A.a.x.toFixed(2),+A.a.y.toFixed(2),+A.a.z.toFixed(2)],n:k,cols:[A.col,B.col]});", "bad.push({gap:+(B.o-A.o).toFixed(4),overlap:+ov.toFixed(4),at:[+A.a.x.toFixed(2),+A.a.y.toFixed(2),+A.a.z.toFixed(2)],n:k,cols:[A.col,B.col],A:A.who,B:B.who,same:A.id===B.id});") \
  .replace("slice(0,10)", "slice(0,40)")
async def main():
    async with Run('dup', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dup-run') as run:
        g = await run.open(src.encode(), 'web', 'ipad-landscape', 'light', 'dup', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev(JS2, [-32.5, 11.8]); print('tris', r['tris'], 'bad', r['badCount'])
        seen = set()
        for b in r['bad']:
            k = (b['A'], b['B'])
            if k in seen: continue
            seen.add(k); print(json.dumps(b))
        print('errors', g.errors[:2]); await run.close(g)
asyncio.run(main())
