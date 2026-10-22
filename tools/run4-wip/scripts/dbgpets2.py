import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/home/user/cozy-town/index.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
JS = """()=>{const tri=o=>{let t=0;o.traverse(m=>{if(!(m.isMesh||m.isInstancedMesh))return;const g=m.geometry;if(!g)return;const n=g.index?g.index.count:(g.attributes.position?g.attributes.position.count:0);t+=(n/3)*(m.isInstancedMesh?m.count:1);});return Math.round(t);};
  const b0=window.bake;window.bake=()=>{};let L;try{L=buildPetShop();}finally{window.bake=b0;}
  const rows=[];L.fls.forEach((F,k)=>{for(const [nm,g] of [['sh',F.sh],['pr',F.pr]]){g.children.forEach((c,i)=>{const col=c.material&&c.material.color?'#'+c.material.color.getHexString():(c.children[0]&&c.children[0].material&&c.children[0].material.color?'grp#'+c.children[0].material.color.getHexString():'');rows.push([k+'/'+nm+'/'+i,c.type,c.children.length,tri(c),col,c.geometry?c.geometry.type:'']);});}});
  rows.sort((a,b)=>b[3]-a[3]);return {total:tri(L.g),f0:tri(L.fls[0].g),f1:tri(L.fls[1].g),sh1:tri(L.fls[1].sh),pr1:tri(L.fls[1].pr),rows:rows.slice(0,30)};}"""
async def main():
    async with Run('dpets2', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dpets2-run') as run:
        g = await begin(run, BUILD, 'pc-1366', 'pets-unbaked', dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-PETS'))
        r = await g.ev(JS); print({k: v for k, v in r.items() if k != 'rows'})
        for row in r['rows']: print('  ', row)
        print('errors', g.errors[:2]); await run.close(g)
asyncio.run(main())
