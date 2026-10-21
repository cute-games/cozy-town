"""Run 4 finish, f7: checks by script of the changes that a still picture cannot show (a grandma walking round you, a friend out for a walk
giving way, a passer-by kept out of your friends' circle, the chip's sky, a hair customer's wish, the coin pop over a card).
usage: python3 probe_f7js.py OUTDIR FILE"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
GRAN_JS = """()=>{__goto('city');wxForce('sun');const ms0=realMs();granPlan(ms0);const k0=Math.floor((ms0-GRAN.day0)/GRAN.T);let pick=null;
  for(let k=k0+1;k<GRAN.plan.length&&!pick;k++)for(let g=0;g<3;g++){const ms=GRAN.day0+k*GRAN.T;if(GRAN.plan[k][g]!==0&&GRAN.plan[k][g]!==GRAN.plan[k-1][g]&&clockAt(ms).time>=9.5&&clockAt(ms+30000).time<=17.5&&granPath(GRAN.plan[k-1][g],GRAN.plan[k][g]).len>=25){pick={k,g,ms};break;}}
  if(!pick)return 'no walk found';const {g,ms}=pick,q=GRAN.g[g];const at=granPose(g,ms+12000);P.x=at.x;P.z=at.z;P.yaw=Math.atan2(-(granPose(g,ms+4000).x-P.x),-(granPose(g,ms+4000).z-P.z));P.pitch=0;
  __clockMs(ms+4000);let minDrawn=99,minPlan=99,minVis=99,jump=0,lx=null,lz=null,hid=0;
  for(let f=0;f<320;f++){__run(1);const R=q.p.root.position,d=Math.hypot(R.x-P.x,R.z-P.z),dp=Math.hypot(q.x-P.x,q.z-P.z);minDrawn=Math.min(minDrawn,d);minPlan=Math.min(minPlan,dp);if(q.p.root.visible)minVis=Math.min(minVis,d);else hid++;
    if(lx!=null)jump=Math.max(jump,Math.hypot(R.x-lx,R.z-lz));lx=R.x;lz=R.z;}
  return {grandma:g,walk:+granPath(GRAN.plan[pick.k-1][g],GRAN.plan[pick.k][g]).len.toFixed(1),minPlan:+minPlan.toFixed(2),minDrawn:+minDrawn.toFixed(2),minVisible:+minVis.toFixed(2),framesHidden:hid,biggestStepPerFrame:+jump.toFixed(3)};}"""
FRIEND_JS = """()=>{__goto('city');__setClock(null,12);wxForce('sun');const f=FRIEND_ACTORS.find(x=>x.loc==='city'&&(x.mode==='walk'||x.mode==='away'));if(!f)return 'no friend';f.mode='walk';f.rt=null;f.wait=0;
  let best=null;for(let i=0;i<WP.length&&!best;i++)for(const j of NEIGH[i]){const L=Math.hypot(WP[j][0]-WP[i][0],WP[j][1]-WP[i][1]);if(L>=12){best=[i,j,L];break;}}if(!best)return 'no long path';
  const [i,j]=best,ux=(WP[j][0]-WP[i][0])/best[2],uz=(WP[j][1]-WP[i][1])/best[2];f.x=WP[i][0]+ux*1;f.z=WP[i][1]+uz*1;f.node=j;f.prev=i;
  P.x=f.x+ux*3.4;P.z=f.z+uz*3.4;P.yaw=Math.atan2(ux,uz);P.pitch=0;let minD=99,minVisD=99,stopAt=null,back=false;
  for(let k=0;k<120;k++){__run(1);const dd=Math.hypot(f.x-P.x,f.z-P.z);minD=Math.min(minD,dd);if(f.g.visible)minVisD=Math.min(minVisD,dd);if((f.blk||0)>0&&stopAt==null)stopAt=+dd.toFixed(2);if(f.node===i)back=true;}
  return {friend:f.d.name,startGap:3.4,stoppedAt:stopAt,closest:+minD.toFixed(2),closestSeen:+minVisD.toFixed(2),turnedBack:back,mode:f.mode};}"""
FAN_JS = """()=>{__goto('city');__setClock(null,12);wxForce('sun');P.x=-17;P.z=-4.6;P.yaw=Math.PI;P.pitch=0;const fr=FRIEND_ACTORS.slice(0,3);for(const f of fr){f.mode='follow';f.loc='city';f.x=P.x+1;f.z=P.z+1;}
  for(let i=0;i<120;i++)__run(1);if(!FAN.on)return 'no fan';const f=fr.find(x=>x.fan);if(!f)return 'no spot';const cx=camera.position.x,cz=camera.position.z,mx=(cx+f.fan[0])/2,mz=(cz+f.fan[1])/2;
  const w=WALKERS.find(x=>x.state==='out')||WALKERS[0];w.state='out';w.x=mx;w.z=mz;w.wait=5;w.update(.05);const inside=w.g.visible;
  w.x=mx+6;w.z=mz+6;w.update(.05);const outside=w.g.visible;
  const ex=mx-(f.fan[0]-cx)*.0+(f.fan[1]-cz)*0,ez=mz;const dx=mx-(w.x),dz=mz-(w.z),dl=Math.hypot(dx,dz)||1;w.x=mx-dx/dl*.9;w.z=mz-dz/dl*.9;const outsideNow=ptInFan(w.x,w.z),blocked=wkBlocked(w,dx/dl,dz/dl);
  return {fanOn:FAN.on,friendsWithSpots:fr.filter(x=>x.fan).length,walkerInsideVisible:inside,walkerOutsideVisible:outside,walkerAtEdgeInside:outsideNow,stepInBlocked:blocked};}"""
SKY_JS = """()=>{__goto('city');__setClock(null,12);wxForce(null);const out=[];for(const [sky,rain,snow] of [[0,0,0],[.3,0,0],[.6,0,0],[1,.2,0],[1,.35,0],[1,0,.4]]){WX.sky=sky;WX.rain=rain;WX.snow=snow;out.push([sky,rain,snow,skyIc()]);}return out;}"""
HAIR_JS = """()=>HS_STYLES.map(s=>hsAsk({want:{style:s[0],len:['long','shoulder','short'][HS_STYLES.indexOf(s)%3],col:'#8d6238'}}))"""
POP_JS = """()=>{popText('+120 🪙','coin');return new Promise(r=>setTimeout(()=>{const e=document.querySelector('.pop.coin');r(e?{z:getComputedStyle(e).zIndex,panel:getComputedStyle($('panel')).zIndex}:'no pop');},1000));}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pj', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pj', save=save); await start_from_save(g); await g.ev(INSTR)
        for nm, js in (('grandma walks round you', GRAN_JS), ('a friend out for a walk', FRIEND_JS), ("your friends' circle", FAN_JS), ("the chip's sky", SKY_JS), ("a hair customer's wish", HAIR_JS), ('a coin pop', POP_JS)):
            try: r = await g.ev(js)
            except Exception as e: r = f'ERROR {e}'
            print(nm, '->', json.dumps(r, ensure_ascii=False), flush=True)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
