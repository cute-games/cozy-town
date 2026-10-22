"""Run 4 finish: what is the white ring in the designer's room (kit N8 pictures), and where does the +20 pop sit? Replays N8 up to designer-room-1.
usage: python3 probe_n8.py OUTDIR"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin, fx, REV_LOOP
NEW = open(os.environ.get('GAME', '/home/user/cozy-town/index.html'), 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
RAY = """()=>{const rc=new THREE.Raycaster(),out=[];for(const [px,py] of [[633,430],[600,431],[666,431],[633,402],[633,458]]){const v={x:px/innerWidth*2-1,y:1-py/innerHeight*2};rc.setFromCamera(v,camera);
  const hs=rc.intersectObjects(scene.children,true).filter(i=>i.object.visible).slice(0,3);out.push({px,py,hits:hs.map(h=>{let p=h.object,path=[];while(p&&path.length<6){path.push((p.type||'')+(p.name?':'+p.name:'')+(p.userData&&Object.keys(p.userData).length?'{'+Object.keys(p.userData).join(',')+'}':''));p=p.parent;}
    const g=h.object.geometry;return {d:+h.distance.toFixed(2),geo:g.type,par:g.parameters?JSON.stringify(g.parameters).slice(0,120):'',col:h.object.material&&h.object.material.color?'#'+h.object.material.color.getHexString():'',side:h.object.material&&h.object.material.side,path:path.join('<'),wp:h.point.toArray().map(x=>+x.toFixed(2))};})});}
  const pops=[...document.querySelectorAll('.pop')].map(e=>({t:e.textContent.slice(0,30),c:e.className,r:(r=>[r.left,r.top,r.width,r.height].map(Math.round))(e.getBoundingClientRect())}));
  return {out,pops,cam:camera.position.toArray().map(x=>+x.toFixed(2)),yaw:+P.yaw.toFixed(2),pitch:+P.pitch.toFixed(2),pb:PB?PB.root.visible:null};}"""
async def main():
    async with Run('pn8', OUT) as run:
        g = await begin(run, NEW, 'ipad-landscape', 'pn8', json.load(open(os.path.join(FIX, 'save-prenight3-designer.json'))))
        await g.ev("()=>{__goto('city');__setClock(null,11);enterClient();}")
        for _ in range(6):
            await g.step(6); await g.wait(150)
            if await g.ev("()=>CUR.id==='client'&&!fading"): break
        await g.ev("()=>{dsFinishAsk();}"); await g.tap('#card [data-a="dsgo"]'); await g.step(2)
        print('review', await g.ev(REV_LOOP))
        for _ in range(8):
            await g.step(6); await g.wait(150)
            if await g.ev("()=>CUR.id==='city'&&!fading&&!CUT"): break
        await g.ev("()=>{__setClock(null,11);ds().done=0;ds().o=null;dsNew(2);enterClient();}")
        for _ in range(8):
            await g.step(6); await g.wait(150)
            if await g.ev("()=>CUR.id==='client'&&!fading"): break
        p = await g.shot('room-1', both=False); print(p)
        r = await g.ev(RAY); [print(o["px"], o["py"], [(h["d"], h["geo"], h["par"][:60], h["col"], h["path"][:60], h["wp"]) for h in o["hits"]]) for o in r["out"]]; print(r["pops"], r["cam"], r["yaw"], r["pitch"], r["pb"])
        print('near ring', await g.ev("""()=>{const out=[],v=new THREE.Vector3(),sp=new THREE.Sphere();camera.updateMatrixWorld();scene.updateMatrixWorld();
          scene.traverseVisible(o=>{if(!(o.isMesh||o.isLine||o.isSprite||o.isPoints))return;const g=o.geometry;if(!g)return;if(!g.boundingSphere)g.computeBoundingSphere();sp.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);if(sp.radius>40)return;
            v.copy(sp.center);const z=-v.clone().applyMatrix4(camera.matrixWorldInverse).z;if(z<.05)return;v.project(camera);const x=(v.x+1)/2*innerWidth,y=(1-v.y)/2*innerHeight;if(Math.hypot(x-633,y-430)>90)return;
            let p=o,path=[];while(p&&path.length<5){path.push(p.type+(p.name?':'+p.name:''));p=p.parent;}out.push({t:o.type,geo:g.type,par:g.parameters?JSON.stringify(g.parameters).slice(0,90):'',r:+sp.radius.toFixed(2),c:sp.center.toArray().map(q=>+q.toFixed(2)),x:Math.round(x),y:Math.round(y),z:+z.toFixed(2),path:path.join('<'),col:o.material&&o.material.color?'#'+o.material.color.getHexString():'',ud:Object.keys(o.userData||{}).join(',')});});return out;}"""))
        print('domrect', await g.ev("()=>[...document.querySelectorAll('*')].map(e=>[e,e.getBoundingClientRect()]).filter(([e,r])=>r.width>40&&r.width<200&&r.left>540&&r.left<600&&r.top>370&&r.top<420).map(([e,r])=>e.tagName+'#'+e.id+'.'+e.className+' '+[r.left,r.top,r.width,r.height].map(Math.round).join(',')+' vis:'+getComputedStyle(e).visibility)"))
        print('cross', await g.ev("()=>{const e=$('cross'),r=e.getBoundingClientRect(),cs=getComputedStyle(e);return [e.className,[r.left,r.top,r.width,r.height].map(Math.round),cs.visibility,cs.transform,e.parentElement.id,getComputedStyle(e.parentElement).transform];}"))
        print('crossCS', await g.ev("()=>{const cs=getComputedStyle($('cross'));const out={};for(const k of['width','height','padding','margin','boxSizing','borderWidth','minWidth','minHeight','display','position','left','top','fontSize','lineHeight','content']){out[k]=cs[k];}out.inline=$('cross').getAttribute('style');out.html=$('cross').outerHTML.slice(0,200);return out;}"))
        const_rules = await g.ev("()=>{const out=[];for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules;}catch(e){continue;}const walk=rs=>{for(const r of rs){if(r.cssRules)walk(r.cssRules);else if(r.selectorText&&$('cross').matches(r.selectorText))out.push((r.parentRule&&r.parentRule.conditionText?'@'+r.parentRule.conditionText+' ':'')+r.cssText.slice(0,200));}};walk(rs);}return out;}")
        print('rules', const_rules)
        print('dom', await g.ev("()=>document.elementsFromPoint(633,430).map(e=>e.tagName+'#'+e.id+'.'+e.className).slice(0,8)"))
        print('PB parts', await g.ev("()=>{const out=[];PB.root.traverse(o=>{if(o.isMesh&&o.geometry.type==='BoxGeometry'&&Math.abs(o.geometry.parameters.width-.34)<.01){let p=o,path=[];while(p&&p!==PB.root){path.push(p.name||p.type);p=p.parent;}out.push(path.join('<'));}});return {n:out.length,out:out.slice(0,5),pbIn:PB.root.parent===scene,keys:Object.keys(PB).join(',')};}"))
        await g.ev("()=>{window.__PB=PB;PB.root.visible=false;PB=null;}"); await g.step(4)
        p = await g.shot('room-1-noPB', both=False); print(p)
        await g.ev("()=>{PB=window.__PB;}"); await g.step(4)
        await g.step(60); await g.wait(500)
        p = await g.shot('room-1-later', both=False); print(p)
        r = await g.ev(RAY); print(r["pops"])
        print('errors', g.errors[:3])
        await run.close(g)
asyncio.run(main())
