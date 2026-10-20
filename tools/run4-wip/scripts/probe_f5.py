"""Run 4 finish: look at the f5 fixes (and find causes) in the game file: pictures + numbers.
usage: python3 probe_f5.py OUTDIR [scene,...]"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open(os.environ.get('GAME', '/home/user/cozy-town/index.html'), 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
fx = lambda n: json.load(open(os.path.join(FIX, n)))
CLEAN = "()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"
LANEJS = "laneRefresh(true);__run(2);const j=LANE.own?LANE.own.findIndex(o=>o&&o.k===laneMe()):-1;const d=((j>=0?LOC.city.lane[j]:null)||LOC.city.lane[LANE.mine]||LOC.city.lane[0]).door;"
# name: (profile, save, [(label, js-before-shot, js-numbers-after)])
SCENES = {
 'garden': ('ipad-landscape', 'save-prenight3-pets.json', [
   ('garden', "S.bighouse=false;S.home.xf=0;S.home.col='';applyHouse();__goto('city');__setClock(null,11);wxForce('sun');" + LANEJS + "const q=lotPt(LANE.mine,-18.3,-25.6),t=lotPt(LANE.mine,-18.3,-20.5);P.x=q[0];P.z=q[1];P.yaw=Math.atan2(-(t[0]-P.x),-(t[1]-P.z));P.pitch=-.5;",
    "(()=>{const rc=new THREE.Raycaster(),out={col:houseColNow(),own:laneOwnCol(),saved:S.home.col||null,hits:[]};for(const [sx,sy] of [[0,.75],[-.3,.8],[.3,.85]]){rc.setFromCamera({x:sx,y:sy},camera);const h=rc.intersectObjects(scene.children,true).find(i=>i.object.visible&&i.object.material&&i.object.material.side!==THREE.BackSide);if(h){const m=h.object.material,c=m.color?'#'+m.color.getHexString():null;let p=h.object,path=[];while(p&&path.length<4){path.push(p.type+(p.name?':'+p.name:''));p=p.parent;}out.hits.push({sx,sy,d:+h.distance.toFixed(2),c,vc:!!h.object.geometry.attributes.color,n:h.face&&h.face.normal?[+h.face.normal.x.toFixed(2),+h.face.normal.y.toFixed(2),+h.face.normal.z.toFixed(2)]:null,path:path.join('<')});}}return out;})()")]),
 'gardenhours': ('ipad-landscape', 'save-prenight3-pets.json', [(f'garden-{h}', "S.bighouse=false;S.home.xf=0;S.home.col='';applyHouse();__goto('city');__setClock(null,%d);wxForce('sun');" % h + LANEJS + "const q=lotPt(LANE.mine,-18.3,-25.6),t=lotPt(LANE.mine,-18.3,-20.5);P.x=q[0];P.z=q[1];P.yaw=Math.atan2(-(t[0]-P.x),-(t[1]-P.z));P.pitch=-.5;", "[sun.position.x-sun.target.position.x,sun.position.y-sun.target.position.y,sun.position.z-sun.target.position.z].map(v=>+v.toFixed(1)).join(',')+' lot side '+LOC.city.lane[LANE.mine].s") for h in (8, 11, 14, 17)]),
 'ducks': ('ipad-landscape', 'save-prenight3-pets.json', [
   ('ducks', "__goto('pets');__setClock(null,11);P.x=LOC.pets.ox-5.1;P.z=LOC.pets.oz+UPZ+.2;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.yaw=Math.PI;P.pitch=-.42;for(const q of PET_ACTORS)q.g.visible=false;",
    "PEN.filter(a=>a.t==='duck').map(a=>({x:+(a.x-LOC.pets.ox).toFixed(2),z:+(a.z-LOC.pets.oz-UPZ).toFixed(2),y:+a.m.root.position.y.toFixed(3)}))")]),
 'rug': ('ipad-landscape', 'save-prenight3-upstairs.json', [
   ('rug-up', "__goto('home');P.x=LOC.home.ox+4.6;P.z=LOC.home.oz+UPZ+3.9;P.yaw=Math.PI/4;P.pitch=-.18;", "S.home.items.filter(i=>(i.f|0)===1).map(i=>i.t+'@'+i.x+','+i.z).join(' ')")]),
 'tags': ('ipad-landscape', 'save-live-web-rich.json', [
   ('tags-home', "__goto('home');P.x=LOC.home.ox+4.6;P.z=LOC.home.oz+3.9;P.yaw=Math.PI/4;P.pitch=-.18;",
    "(()=>{camera.updateMatrixWorld();const v=new THREE.Vector3(),r=[];for(const p of PET_ACTORS){if(!p.g.visible||p.loc!==CUR.id)continue;p.tag.getWorldPosition(v);const z=-v.clone().applyMatrix4(camera.matrixWorldInverse).z;v.project(camera);const f=innerHeight/(2*Math.tan(camera.fov*Math.PI/360));r.push({n:p.d.name,x:Math.round((v.x+1)/2*innerWidth),y:Math.round((1-v.y)/2*innerHeight-(p.tag.center.y-.5)*p.tag.scale.y*f/z),w:Math.round(p.tag.scale.x*f/z),h:Math.round(p.tag.scale.y*f/z),cy:+p.tag.center.y.toFixed(2)});}const ov=[];for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++){const a=r[i],b=r[j];if(Math.abs(a.x-b.x)<(a.w+b.w)/2-2&&Math.abs(a.y-b.y)<(a.h+b.h)/2-2)ov.push(a.n+'/'+b.n);}return{tags:r,overlaps:ov};})()")]),
 'tags2': ('ipad-landscape', 'save-f2cdd53-rich.json', [
   ('tags-home2', "__goto('home');P.x=LOC.home.ox+4.6;P.z=LOC.home.oz+3.9;P.yaw=Math.PI/4;P.pitch=-.18;", "PET_ACTORS.filter(p=>p.loc===CUR.id).map(p=>p.d.name+':'+p.tag.center.y.toFixed(2)).join(' ')")]),
 'hair': ('ipad-landscape', 'save-prenight3-pets.json', [
   ('hair-card', "__goto('salon');__setClock(null,11);wxForce('sun');S.hsTut=1;setJob('hair');HS.wait=0;__run(220);", "(()=>{const c=HS.cust;return c?{sat:c.sat,open:UI.open,card:!!document.querySelector('#card [data-a=\"hsdone\"]'),yaw:+P.yaw.toFixed(2),pitch:+P.pitch.toFixed(2)}:null;})()")]),
 'hairphone': ('iphone-landscape', 'save-prenight3-pets.json', [
   ('hair-card-phone', "__goto('salon');__setClock(null,11);wxForce('sun');S.hsTut=1;setJob('hair');HS.wait=0;__run(220);", "UI.open")]),
 'disco': ('iphone-portrait', 'save-prenight3-pets.json', [
   ('disco', "__goto('home');for(const it of [{u:'zzd1',t:'discofloor',c:null,x:0,z:0,r:0},{u:'zzd2',t:'discoball',c:null,x:1.6,z:-1.2,r:0}]){S.home.items.push(it);addHomeItem(it);}P.x=LOC.home.ox-1;P.z=LOC.home.oz+3.2;P.yaw=Math.atan2(-(LOC.home.ox+1.6-P.x),-(LOC.home.oz-1.2-P.z));P.pitch=.18;", "S.home.items.length")]),
 'shortcards': ('iphone-landscape', 'save-prenight3-pets.json', [
   ('big-house', "__goto('city');__setClock(null,11);openBigHouse();", "['stats','topbtns','moveBtns','joy'].map(id=>id+':'+$(id).classList.contains('underCard')).join(' ')"),
   ('mailbox-menu', "closePanel();hpMailMenu();", "['stats','topbtns','moveBtns','joy'].map(id=>id+':'+$(id).classList.contains('underCard')).join(' ')"),
   ('party-time', "closePanel();ACT.hpplan();", "['stats','topbtns','moveBtns','joy'].map(id=>id+':'+$(id).classList.contains('underCard')).join(' ')"),
   ('closed', "closePanel();", "['stats','topbtns','moveBtns','joy'].map(id=>id+':'+$(id).classList.contains('underCard')+':'+getComputedStyle($(id)).visibility).join(' ')"),
   ('tutorial-pizza', "tutStart();", "getComputedStyle($('stats')).visibility+' '+getComputedStyle($('topbtns')).visibility"),
   ('tutorial-step2', "$('tutNext').click();", "getComputedStyle($('stats')).visibility+' '+getComputedStyle($('topbtns')).visibility+' hole:'+$('tutHole').className"),
   ('shop-pets', "tutEnd();openShop('pets');", "1")]),
}
async def main():
    res = {}
    async with Run('pf5', OUT) as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        for key, (prof, sv, shots) in SCENES.items():
            if ONLY and key not in ONLY: continue
            save = fx(sv)
            g = await run.open(fb, 'web', prof, 'light', 'pf5-' + key, save=save); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(6)
            for label, js, num in shots:
                await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js); await g.step(20); await g.wait(700); await g.step(30); await g.wait(300)
                p = await g.shot(label, both=False)
                try: n = await g.ev("(js)=>{try{return eval(js);}catch(e){return 'ERR '+e;}}", num)
                except Exception as e: n = repr(e)[:200]
                res[label] = n; print(label, p, json.dumps(n)[:1500], flush=True)
            print(key, 'errors', g.errors[:3], flush=True); await run.close(g)
    json.dump(res, open(os.path.join(OUT, 'probe.json'), 'w'), indent=1)
asyncio.run(main())
