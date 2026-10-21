"""Run 4 finish, f8: checks by script: a grandma passing you on a slow screen (frames 200 ms apart), a waiting message after a clock jump,
the photo's background test (the bench in the picture or not), the friends' names on the big map.
usage: python3 probe_f8js.py OUTDIR FILE"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
GRAN_SET = """(slow)=>{__goto('city');wxForce('sun');const ms0=realMs();granPlan(ms0);const k0=Math.floor((ms0-GRAN.day0)/GRAN.T);let pick=null;
  for(let k=k0+1;k<GRAN.plan.length&&!pick;k++)for(let g=0;g<3;g++){const ms=GRAN.day0+k*GRAN.T;if(GRAN.plan[k][g]!==0&&GRAN.plan[k][g]!==GRAN.plan[k-1][g]&&clockAt(ms).time>=9.5&&clockAt(ms+30000).time<=17.5&&granPath(GRAN.plan[k-1][g],GRAN.plan[k][g]).len>=25){pick={k,g,ms};break;}}
  if(!pick)return 'no walk found';const {g,ms}=pick;const at=granPose(g,ms+12000);P.x=at.x+.4;P.z=at.z+.4;P.yaw=Math.atan2(-(granPose(g,ms+4000).x-P.x),-(granPose(g,ms+4000).z-P.z));P.pitch=0;
  __clockMs(ms+4000);window.__gr={g,minDrawn:99,minVis:99,hid:0,f:0};return pick;}"""
GRAN_RUN = """(step)=>{const R0=renderer.render;renderer.render=()=>{};const G=window.__gr,q=GRAN.g[G.g];try{for(let f=0;f<40;f++){window.__t+=step;frame(window.__t);G.f++;const R=q.p.root.position,d=Math.hypot(R.x-camera.position.x,R.z-camera.position.z);G.minDrawn=Math.min(G.minDrawn,d);if(q.p.root.visible)G.minVis=Math.min(G.minVis,d);else G.hid++;}}finally{renderer.render=window.__realRender||R0;}
  return {frames:G.f,minDrawn:+G.minDrawn.toFixed(2),minVisible:+G.minVis.toFixed(2),framesHidden:G.hid};}"""
TOAST_JS = """()=>{__goto('city');__setClock(null,14.05);TQ.q.length=0;clearTimeout(TQ.tm);toastEnd();TQ.card=performance.now();TQ.hold=true;
  toast('⚽ The football friends are at the field until 19:00. Come and play!',3.4,1);const queued=TQ.q.map(m=>m.m.slice(0,24));__setClock(null,22.1);TQ.hold=false;toastPump();
  return new Promise(r=>setTimeout(()=>{const t=$('toast');r({queued,shown:t.classList.contains('show')?t.textContent.slice(0,40):null,stillWaiting:TQ.q.map(m=>m.m.slice(0,24))});},900));}"""
PHOTO_JS = """()=>{__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'pond',bg:'bench',who:['n1','n2','s1'],pet:null,st:'go'};P.x=34.6;P.z=-31.4;P.yaw=Math.PI;__run(2);ptSetup();
  while(PHO.bg!==d.o.bg)ptNextBg();for(const m of PHO.group)if(m.kind==='person')m.pose='smile';__run(30);const g=PHO.group,cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;
  const at=(dist,turn)=>{P.x=cx+Math.sin(f)*dist;P.z=cz+Math.cos(f)*dist;P.yaw=f+turn;P.pitch=-.04;P.jy=0;updateCamera(0);camera.updateMatrixWorld();return ptScore();};
  const front=at(4.4,0);const B=PT_SPOTS.pond.bgs.find(b=>b.id==='bench');
  // from the bench's side, looking back over the group (the bench behind the camera)
  P.x=B.g[0]-Math.sin(f)*2.6;P.z=B.g[1]-Math.cos(f)*2.6;P.yaw=f+Math.PI;updateCamera(0);camera.updateMatrixWorld();const away=ptScore();
  ACT.ptbye&&ACT.ptbye();return {front,fromBehind:away};}"""
MAP_JS = """()=>{closePanel();__goto('city');__setClock(null,11);for(const f of FRIEND_ACTORS){f.mode='walk';f.loc='city';}__run(4);openMap&&openMap();__run(4);
  return new Promise(r=>setTimeout(()=>{const fr=mapFriends();r({friends:fr.length,names:fr.map(f=>f.n)});},400));}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pf8', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pf8', save=save); await start_from_save(g); await g.ev(INSTR)
        for step in ():
            pick = await g.ev(GRAN_SET, step)
            r = None
            for _ in range(12): r = await g.ev(GRAN_RUN, step)
            print(f'grandma, frames {step} ms apart ->', json.dumps(pick), json.dumps(r), flush=True)
        for nm, js in (('a waiting message after the clock jumps', TOAST_JS),):
            try: r = await g.ev(js)
            except Exception as e: r = f'ERROR {e}'
            print(nm, '->', json.dumps(r, ensure_ascii=False), flush=True)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
