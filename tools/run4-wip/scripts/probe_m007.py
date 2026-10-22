"""Run 4 finish, pass 14 M-007: replays the check's N25 on iPad (the first time, tips card and all) and, at each picture, lists the page's
elements whose box reaches the bottom-right corner (the dark strip under Snap).
usage: python3 probe_m007.py OUTDIR FILE"""
import asyncio, glob, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
import harness
from harness import Run
import photo4
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
Q = """()=>{const W=innerWidth,H=innerHeight,o=[];for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(r.width<4||r.height<2)continue;
  if(r.right>W-60&&r.bottom>H-8&&r.top<H+2&&r.left<W){const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0)continue;
  let p=e,hid=false;while(p){if(p.hidden){hid=true;break;}p=p.parentElement;}
  o.push((e.id?'#'+e.id:e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().replace(/\\s+/g,'.'):''))+' '+[r.left,r.top,r.right,r.bottom].map(v=>Math.round(v)).join(',')+' bg '+cs.backgroundColor+' bd '+cs.borderTopColor+' '+cs.borderTopWidth+' tr '+cs.transform+(hid?' (in hidden)':''));}}
  return {W,H,at:document.elementsFromPoint(W-30,H-3).map(e=>e.id||e.tagName),list:o.slice(0,30)};}"""
orig = harness.Game.shot
RAY = """()=>{const W=innerWidth,H=innerHeight,o=[];camera.updateMatrixWorld();const rc=new THREE.Raycaster();
  for(const [px,py] of [[1150,817],[1100,818],[1170,814],[1150,800],[1150,790]]){rc.setFromCamera(new THREE.Vector2(px/W*2-1,-(py/H*2-1)),camera);
    const hits=rc.intersectObjects(scene.children,true).filter(h=>h.object.visible).slice(0,4).map(h=>{let n=h.object,path=[];while(n&&path.length<5){path.push((n.name||n.type)+(n.userData&&Object.keys(n.userData).length?JSON.stringify(n.userData).slice(0,40):''));n=n.parent;}
      const m=Array.isArray(h.object.material)?h.object.material[0]:h.object.material;return {d:+h.distance.toFixed(2),p:[h.point.x,h.point.y,h.point.z].map(v=>+v.toFixed(2)),geo:h.object.geometry&&h.object.geometry.type,col:m&&m.color?'#'+m.color.getHexString():null,side:m&&m.side,path:path.join(' < ')};});
    o.push({px,py,hits});}
  const h0=(()=>{rc.setFromCamera(new THREE.Vector2(1150/W*2-1,-(817/H*2-1)),camera);return rc.intersectObjects(scene.children,true).filter(h=>h.object.visible)[0];})();
  let who=null;if(h0){let n=h0.object;const chain=[];while(n&&n!==scene){chain.push(n);n=n.parent;}const top=chain[chain.length-2]||chain[0];const wp=new THREE.Vector3();top.getWorldPosition(wp);
    const names=[];for(const k of Object.keys(window))try{const v=window[k];if(v===top)names.push(k);else if(Array.isArray(v)){const i=v.findIndex(e=>e===top||e&&(e.m===top||e.root===top||e.g===top||e.mesh===top||e.m&&e.m.root===top));if(i>=0)names.push(k+'['+i+']'+(v[i].t?' '+v[i].t:'')+(v[i].kind?' '+v[i].kind:'')+(v[i].nm?' '+v[i].nm:''));}}catch(e){}
    const T=chain[chain.length-1];let tn=[];for(const k of Object.keys(window))try{const v=window[k];if(v===T)tn.push(k);else if(v&&typeof v==='object'&&!Array.isArray(v))for(const kk of Object.keys(v))if(v[kk]===T)tn.push(k+'.'+kk);}catch(e){}
    const kidsAt=top.children.slice(0,12).map(c=>c.type+':'+(c.geometry?c.geometry.type:'')+':'+(c.material&&c.material.color?c.material.color.getHexString():''));
    who={depth:chain.length,topName:tn,kidsAt,top:top.name||top.type,kids:top.children.length,wp:[wp.x,wp.y,wp.z].map(v=>+v.toFixed(2)),names,ud:JSON.stringify(top.userData).slice(0,80)};}
  let box=null,near=[];if(h0){const b=new THREE.Box3().setFromObject(h0.object);box=[b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map(v=>+v.toFixed(2));
    const pt=h0.point;scene.traverse(o=>{if(!o.isMesh||!o.visible||o===h0.object)return;const bb=new THREE.Box3().setFromObject(o);if(bb.distanceToPoint(pt)<.25&&bb.max.x-bb.min.x<6&&bb.max.z-bb.min.z<6){const m=Array.isArray(o.material)?o.material[0]:o.material;near.push({geo:o.geometry.type,par:o.parent&&o.parent.children.length,col:m&&m.color?'#'+m.color.getHexString():null,side:m&&m.side,bb:[bb.min.x,bb.min.y,bb.min.z,bb.max.x,bb.max.y,bb.max.z].map(v=>+v.toFixed(2))});}});}
  let vb=null;if(h0){const g=h0.object.geometry,pa=g.attributes.position,v=new THREE.Vector3(),pt=h0.point;let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9],n=0;
    for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(h0.object.matrixWorld);if(Math.hypot(v.x-pt.x,v.z-pt.z)<.45&&v.y<3){n++;mn=[Math.min(mn[0],v.x),Math.min(mn[1],v.y),Math.min(mn[2],v.z)];mx=[Math.max(mx[0],v.x),Math.max(mx[1],v.y),Math.max(mx[2],v.z)];}}
    const fl=[];for(let i=0;i<pa.count;i+=3){v.fromBufferAttribute(pa,i).applyMatrix4(h0.object.matrixWorld);if(Math.hypot(v.x-pt.x,v.z-pt.z)<.45)fl.push([v.x,v.y,v.z].map(x=>+x.toFixed(2)));}
    vb={pts:fl.filter((_,k)=>k%9===0).slice(0,40),n,min:mn.map(x=>+x.toFixed(2)),max:mx.map(x=>+x.toFixed(2)),face:h0.face?[h0.face.a,h0.face.b,h0.face.c].map(i=>{v.fromBufferAttribute(pa,i).applyMatrix4(h0.object.matrixWorld);return [v.x,v.y,v.z].map(x=>+x.toFixed(2));}):null};}
  return {vb,box,nb:near.slice(0,10),who,cam:[camera.position.x,camera.position.y,camera.position.z].map(v=>+v.toFixed(2)),near:camera.near,fov:camera.fov,P:[P.x,P.z,P.yaw].map(v=>+v.toFixed(2)),rays:o};}"""
async def shot(self, label, both=False):
    r = await self.ev(Q)
    if label.startswith('photo-shoot'): print('RAY', json.dumps(await self.ev(RAY), ensure_ascii=False), flush=True)
    print('SHOT', label, json.dumps(r, ensure_ascii=False), flush=True)
    return await orig(self, label, both)
harness.Game.shot = shot
# the pass-14 check's booking (a wedding at the Duck Pond, the pond behind, for ap2 and nb): ptNew is random, so it is set the same here
FORCE = """()=>{const _pn=ptNew;window.ptNew=function(){const r=_pn();const o=S.pt&&S.pt.o;if(r&&o){o.kind='wedding';o.spot='pond';o.bg='pond';o.who=['ap2','nb'];o.pet=null;S.pt.lk='wedding';S.pt.ls='pond';jobHud(true);}return r;};}"""
_begin = photo4.begin
async def begin(*a, **k):
    g = await _begin(*a, **k); await g.ev(FORCE); return g
photo4.begin = begin
async def main():
    FIX = [(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT, 'fixtures', '*.json')))]
    wb = open(FILE, 'rb').read()
    async with Run('m007', OUT) as run:
        ok, det = await photo4.one(run, wb, FIX, 'ipad-landscape', True)
        print('N25 ipad', ok, det[:400])
asyncio.run(main())
