"""Pets and Farm Update: the pictures the kit's full check did not take, for the picture pass (no game change; ZZTEST test data only).
   python3 tools/pfu-wip/shots_pfu.py <kit>/cozycheck <joined github file> <out folder>
   Every scene on iPad landscape light AND dark (shot both=True); cards also on android-phone-portrait. Files: <screen>_<light|dark>_<what>.png
   plus list.txt (one line a picture: file, then what should be seen and whether the subjects were inside the view)."""
import asyncio, json, os, shutil, sys, traceback
KIT, NEW, OUT = sys.argv[1:4]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
HERE = os.path.dirname(os.path.abspath(__file__))
new_wb = open(NEW, 'rb').read()
SAVE = json.load(open(os.path.join(HERE, '..', 'check-fixtures', 'save-prenight3-pets.json')))   # 4 pets (dog, cat, bunny follow; a hamster at home), a Friends Lane lot
os.makedirs(OUT, exist_ok=True)
LIST = []; FAILED = []

# a hook run right before the real render (the harness renders only the last frame of a step): a camera of our own, or a pose, for that one picture
INSTALL = """()=>{if(window.__preOn)return;window.__preOn=1;const r=window.__realRender||renderer.render;
  window.__realRender=function(s,c){if(window.__pre)try{window.__pre();}catch(e){console.warn('pre',e);}return r.call(renderer,s,c);};renderer.render=window.__realRender;
  window.CAM=(c,t)=>{window.__pre=()=>{if(PB)PB.root.visible=false;camera.position.set(c[0],c[1],c[2]);camera.lookAt(t[0],t[1],t[2]);};};
  window.LOOKP=(x,z,p)=>{P.yaw=Math.atan2(-(x-P.x),-(z-P.z));P.pitch=p==null?-.1:p;};
  window.FOL=(kinds)=>{for(const e of PET_ACTORS){const k=petKind(e.d);if(kinds.includes(k)){e.d.stay=false;delete e.d.home;e.far=0;}else if(!e.d.stay)petGoHome(e);}bringFollowers(true);__run(4);
    return PET_ACTORS.filter(e=>!e.d.stay).map(e=>petKind(e.d));};
  window.CAMPETS=(dist,h)=>{const F=PET_ACTORS.filter(e=>!e.d.stay&&e.loc===CUR.id);if(!F.length)return null;const cx=F.reduce((a,e)=>a+e.x,0)/F.length,cz=F.reduce((a,e)=>a+e.z,0)/F.length;
    let dx=cx-P.x,dz=cz-P.z,d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;CAM([cx+dx*dist,h||1.45,cz+dz*dist],[cx,.4,cz]);return [cx,cz];};
  window.INV=(pts)=>{camera.updateMatrixWorld(true);return pts.map(([n,x,y,z])=>{const v=new THREE.Vector3(x,y,z).project(camera);return n+(Math.abs(v.x)<=1&&Math.abs(v.y)<=1&&v.z<1?' in view':' NOT in view');}).join(', ');};
  window.PETPTS=(ks)=>PET_ACTORS.filter(e=>e.loc===CUR.id&&e.g.visible&&(!ks||ks.includes(petKind(e.d)))).map(e=>[e.d.name+' ('+petKind(e.d)+')',e.g.position.x,e.g.position.y+.3,e.g.position.z]);
  $('toast').classList.remove('show');}"""
QUIET = "()=>{$('toast').classList.remove('show');closePanel();window.__pre=null;}"

async def snap(g, what, note, pts=None, both=True):
    """One picture (and the other light/dark), copied to OUT as <screen>_<theme>_<what>.png and listed."""
    n0 = len(g.shots)
    await g.shot(what, both=both)
    inv = ''
    if pts:
        try: inv = ' [' + await g.ev(f"()=>INV({pts})") + ']'
        except Exception as e: inv = f' [view check failed: {e}]'
    for p in g.shots[n0:]:
        theme = 'dark' if f'_{g.profile}_dark_' in os.path.basename(p) else 'light'
        name = f'{g.profile}_{theme}_{what}.png'; shutil.copy(p, os.path.join(OUT, name))
        LIST.append(f'{name}\t{note}{inv}')

ONLY = [x for x in os.environ.get('ONLY', '').split(',') if x]   # (picture pass 1: ONLY='yard 3,farm,...' retakes some scenes; 'phone cards' and 'show join' are scenes too)
async def scene(label, coro):
    if ONLY and label not in ONLY: coro.close(); return
    try: await coro
    except Exception as e:
        FAILED.append(f'{label}: {e}'); print('FAILED', label, e); traceback.print_exc()

# big-needs pets ready: Pet care 40, pet yard 3 with tree, pond and den, license 3, a glass tank in the house; the old pets sent home, then the four adopted
BIG = """()=>{__goto('city');__setClock(null,12);__run(2);S.coins=9000;sk('pets').lv=40;sk('garden').lv=40;S.lic.lv=3;S.lic.wins=Math.max(S.lic.wins||0,3);
  S.yard={pet:3,garden:3,home:['tree','pond','den'],gear:['dog','cat','bear']};yardLv();PBR.sick=false;
  if(!S.home.items.some(i=>i.t==='snaketank')){S.home.items.push({u:'zztank',t:'snaketank',c:'#7a2bff',x:0,z:-3,r:0});rebuildHome();}
  for(const e of PET_ACTORS){e.d.happy=90;e.d.sick=0;e.d.sad=0;if(!e.d.stay)petGoHome(e);}
  const got=[];for(const k of['monkey','seal','bear','snake']){if(S.pets.some(d=>petKind(d)===k))continue;openAdopt(k,PET_TYPES[k].cols[0]);ACT.adopt();closePanel();const d=S.pets[S.pets.length-1];if(petKind(d)===k){got.push(k);d.happy=90;}}
  closePanel();return {got,pets:S.pets.map(d=>petKind(d)+(d.stay?'@home':''))};}"""
TOWN = "()=>{__goto('city');__setClock(null,12);P.x=18;P.z=4;P.yaw=Math.PI/2;P.pitch=0;P.cy=0;}"
WALK = "(n)=>{for(let i=0;i<n;i++){P.x-=.09;P.moving=true;__run(1);}P.moving=false;__run(25);}"   # walk west along the street a little, so the pets trot after you, then stop

async def ipad_world(run):
    g = await begin(run, new_wb, 'ipad-landscape', 'gap-world', dict(SAVE, name='ZZTEST-GAP'))
    await g.ev(INSTALL)
    b = await g.ev(BIG); print('big pets', b)
    if len(b['got']) < 4: FAILED.append(f"adopting big pets: only {b['got']}")

    async def follow(kinds, what):
        await g.ev(QUIET); await g.ev(TOWN); f = await g.ev(f"()=>FOL({json.dumps(kinds)})")
        await g.ev(WALK, 60); await g.ev("()=>CAMPETS(3.3,1.5)")
        await snap(g, what, f'following you in town (street by the Market, noon): {f}', 'PETPTS()')
    await scene('follow monkey+seal', follow(['monkey', 'seal'], 'town-follow-monkey-seal'))
    await scene('follow bear+snake', follow(['bear', 'snake'], 'town-follow-bear-snake'))

    # the yard at levels 1, 2, 3 (garden and pet yard), from above and at eye height, with gear; at 3 the big pets rest at their homes
    async def yard(lv):
        gear = {1: ['cat'], 2: ['dog', 'cat'], 3: ['dog', 'cat', 'bear']}[lv]
        home = ",home:['tree','pond','den']" if lv == 3 else ''
        await g.ev(QUIET)
        st = await g.ev(f"()=>{{__goto('city');__setClock(null,12);S.yard={{pet:{lv},garden:{lv},gear:{json.dumps(gear)}{home}}};yardLv();FOL([]);for(const e of PET_ACTORS)e.far=0;"
                   f"const j=LANE.mine,[x,z]=lotPt(j,-17,-19.9);P.x=x;P.z=z;__run(80);"
                   # (picture pass 1: the big pets walk home round the house by themselves; at most 120 s of play, then where each one is)
                   f"const B=PET_ACTORS.filter(e=>bigRest(e.d)),at=e=>{{const h=bigRest(e.d);return Math.hypot(h[0]-e.x,h[1]-e.z)<1.2;}};let f=0;while(f<2400&&!B.every(at)){{__run(20);f+=20;}}"
                   f"window.__st=B.map(e=>petKind(e.d)+(at(e)?' home':' NOT home'))+' after '+Math.round(f*.05)+' s';return __st;}}")
        pts = "[...PETPTS(),...YARD.gear.filter(Boolean).map((q,i)=>{const v=new THREE.Vector3();q.o.getWorldPosition(v);return ['gear '+i,v.x,v.y+.3,v.z];})" + \
              (",...BHOME_IDS.map(id=>{const H=BHOME[id],[x,z]=lotPt(LANE.mine,H.x,H.z);return [id,x,.8,z];})]" if lv == 3 else "]")
        await g.ev("()=>{const j=LANE.mine,[cx,cz]=lotPt(j,-17,-19.5),[tx,tz]=lotPt(j,-16.5,-27.5);CAM([cx,14,cz],[tx,0,tz]);}")
        await snap(g, f'yard-L{lv}-above', f'your yard, garden and pet yard level {lv}, gear {gear}' + (f', the big-pets area with jungle tree, pond and den, monkey/seal/bear at their homes (sent home, they walked there round the house: {st})' if lv == 3 else '') + ', from above', pts)
        await g.ev("()=>{window.__pre=null;const j=LANE.mine,[x,z]=lotPt(j,-20.5,-19.9),[tx,tz]=lotPt(j,-13.5,-24.5);P.x=x;P.z=z;LOOKP(tx,tz,-.14);}")
        await snap(g, f'yard-L{lv}-eye', f'your yard level {lv} at eye height from the back of the house, gear {gear}', pts)
        if lv == 3:
            await g.ev("()=>{const j=LANE.mine,[x,z]=lotPt(j,-16.5,-23.2),[tx,tz]=lotPt(j,-16.5,-32);P.x=x;P.z=z;LOOKP(tx,tz,-.16);}")
            await snap(g, 'yard-L3-bighomes-eye', 'level-3 big-pets area at eye height: jungle tree (monkey), pond (seal), den (bear), each big pet at its home (walked there, see above)', pts)
    for lv in (1, 2, 3): await scene(f'yard {lv}', yard(lv))

    async def gearplay():
        await g.ev(QUIET)
        r = await g.ev("""()=>{__goto('city');S.yard={pet:3,garden:3,home:['tree','pond','den'],gear:['dog']};yardLv();FOL(['dog']);const q=YARD.gear.find(Boolean),sl=GEAR_SLOTS[q.k],[px,pz]=yardPt(sl.x,sl.z+(q.k===2?-1.6:1.9));
          P.x=px;P.z=pz;bringFollowers(true);__run(6);for(const p of PET_ACTORS)p.d.happy=60;gearUse(q.k);const e=PET_ACTORS.find(p=>p.gp);window.__gq=q;return e?petKind(e.d)+' on '+gearLabel(q.k):'nobody played';}""")
        await g.step(50)
        await g.ev("()=>{const v=new THREE.Vector3();__gq.o.getWorldPosition(v);const e=PET_ACTORS.find(p=>p.gp)||PET_ACTORS[0];CAM([v.x+3.2,2.1,v.z+2.6],[e.g.position.x,.4,e.g.position.z]);}")
        await snap(g, 'yard-gear-play', f'a pet playing on yard gear, 2.5 s into the move: {r}', 'PETPTS()')
        await g.ev("()=>{S.yard.gear=['dog','cat','bear'];yardLv();}")
    await scene('gear play', gearplay())

    async def tank():
        await g.ev(QUIET)
        r = await g.ev("""()=>{FOL([]);__goto('home');__setClock(null,12);const rec=[...HOME_ITEMS.values()].find(r=>r.it.t==='snaketank');rec.inter.act();ACT.tank('on');closePanel();__run(30);
          const T=rec.g.position;P.x=T.x;P.z=T.z+2.3;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);LOOKP(T.x,T.z,-.32);window.__tk=rec;const s=PET_ACTORS.find(e=>petKind(e.d)==='snake');return {c:rec.it.c,snake:s&&[s.loc,!!s.tk]};}""")
        await snap(g, 'home-snake-tank', f'the snake in its glass tank at home, light on ({r["c"]}): {r["snake"]}', "[['tank',__tk.g.position.x,.6,__tk.g.position.z]]")
        await g.ev("()=>{$('toast').classList.remove('show');__tk.inter.act();}"); await g.step(3)
        await snap(g, 'card-glass-tank', 'the Glass tank card (light on/off, 8 colours)')
    await scene('tank', tank())

    async def wait_out():
        await g.ev(QUIET)
        r = await g.ev("""()=>{__goto('city');__setClock(null,12);FOL(['bear','seal']);const D=DOORS.market.city;P.x=D[0];P.z=D[1];P.yaw=D[2];bringFollowers(true);__run(20);setLoc('market');
          const L=LOC.market,d=DOORS.market;P.x=L.ox+d.inside[0];P.z=L.oz+d.inside[1];bringFollowers();__run(60);const W=PET_ACTORS.filter(e=>e.wo);
          const fx=-Math.sin(D[2]),fz=-Math.cos(D[2]),cam=[D[0]+fx*4.6,1.6,D[1]+fz*4.6];
          window.__pre=()=>{const C=LOC.city;C.g.visible=true;LOC.market.g.visible=false;outside.visible=true;skyMesh.visible=true;sunSprite.visible=true;FOG.near=60;FOG.far=340;
            for(const e of W){e.g.visible=true;e.g.position.set(e.x,0,e.z);e.g.rotation.y=e.wo.f;COZY_MOVES.play(e.m,'pet.wait',3,{kind:petKind(e.d)});}
            if(PB)PB.root.visible=false;$('actWrap').hidden=true;camera.position.set(...cam);camera.lookAt(D[0],.6,D[1]);};
          window.__wpts=W.map(e=>[petKind(e.d),e.x,.4,e.z]);return W.map(e=>petKind(e.d)+' '+Math.hypot(e.x-D[0],e.z-D[1]).toFixed(1)+' m from the door');}""")
        await snap(g, 'town-wait-outside-market', f'bear and seal waiting by the Market door while you are inside (the outside drawn for this picture): {r}', '__wpts')
        await g.ev("()=>{window.__pre=null;$('actWrap').hidden=false;exitTo('market');}"); await g.wait(1500); await g.step(10)
    await scene('wait outside', wait_out())

    async def vet():
        await g.ev(QUIET)
        r = await g.ev("""()=>{__goto('vet');__setClock(null,12);FOL(['dog']);const V=LOC.vet,K=VK('Nurse Penny');P.x=K.x;P.z=K.z+3.2;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);floorVis();bringFollowers(true);__run(20);LOOKP(K.x,K.z,-.08);
          return [+(K.x-V.ox).toFixed(1),+(K.z-V.oz).toFixed(1)];}""")
        await snap(g, 'vet-lobby-penny', f'vet station lobby, Nurse Penny at her desk (at {r})', "[['Penny',VK('Nurse Penny').x,1.2,VK('Nurse Penny').z]]")
        await g.ev("""()=>{$('toast').classList.remove('show');const V=LOC.vet;P.x=V.ox-2.2;P.z=V.oz+UPZ-.4;P.yaw=0;P.pitch=-.18;floorVis();bringFollowers(true);__run(4);
          const F=PET_ACTORS.filter(e=>!e.d.stay);F[0].d.sick=1;S.vet.bk=null;S.coins=Math.max(S.coins,500);vetStart();__run(170);CAM([V.ox-1.8,2.0,V.oz+UPZ+.1],[V.ox-2.1,.85,V.oz+UPZ-2.1]);}""")
        await snap(g, 'vet-exam-table', 'a dog on the exam table upstairs, Dr. Rūta examining, Vet nurse Leo giving the treat',
                   "[...PETPTS(),['Rūta',VK('Dr. Rūta').x,1.2,VK('Dr. Rūta').z],['Leo',VK('Vet nurse Leo').x,1.2,VK('Vet nurse Leo').z]]")
        await g.ev("()=>{let n=0;while(VX&&n++<800)__run(1);}")
        r = await g.ev("""()=>{$('toast').classList.remove('show');const V=LOC.vet;P.x=V.ox-2.2;P.z=V.oz+UPZ-.4;P.yaw=0;FOL(['bear']);__run(4);const b=PET_ACTORS.find(e=>petKind(e.d)==='bear');b.d.sick=1;VX={L:[b],i:0,t:0,said:0};
          let up=0;for(let i=0;i<300&&VX;i++){__run(1);if(b.ps&&Math.abs(b.g.position.y-.54)<.01&&++up>25)break;}const p=b.g.position;
          CAM([p.x+.4,1.7,p.z+4.4],[p.x,.95,p.z]);return {up,on:!!b.ps,y:+p.y.toFixed(2)};}""")
        await snap(g, 'vet-bear-platform', f'the bear on the big-pet platform with Dr. Rūta: {r}', "[...PETPTS(),['Rūta',VK('Dr. Rūta').x,1.2,VK('Dr. Rūta').z]]")
        await g.ev("()=>{let n=0;while(VX&&n++<900)__run(1);window.__pre=null;closePanel();for(const e of PET_ACTORS)e.d.sick=0;openVetBook();}"); await g.step(4)
        await snap(g, 'card-vet-booking', 'the vet booking screen on the phone (Nurse Penny\'s desk opens the same)')
        await g.ev("()=>{PH.app=null;closePanel();}")
    await scene('vet', vet())

    async def moods():
        await g.ev("()=>{}"); await g.ev(QUIET); await g.ev(TOWN)
        await g.ev("()=>{const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__clockMs(msAt(d,12)-CLK.sk);__run(2);S.hw.rb=petWeek()+1;}")   # (picture pass 1: the ribbon is worn on Saturday and Sunday)
        r = await g.ev("""()=>{PBR.sick=true;FOL(['dog','cat','bunny']);const by=k=>PET_ACTORS.find(e=>petKind(e.d)===k);const a=by('dog'),b=by('cat'),c=by('bunny');
          a.d.happy=100;b.d.happy=8;c.d.happy=30;c.d.sick=1;__run(30);const now=gameMs()/1000;petMove(a,'pet.veryHappy',now);petMove(b,'pet.unhappyPlay',now);return [a.d.name+' very happy',b.d.name+' sad',c.d.name+' sick'];}""")
        await g.step(20); await g.ev("()=>CAMPETS(3.0,1.4)")
        await snap(g, 'town-pet-moods', f'three pets in three moods in town, Saturday after a healthy week (every pet wears the green ribbon); moods are body language only (no icons): {r}', "PETPTS(['dog','cat','bunny'])")
        await g.ev("()=>{window.__pre=null;S.hw.rb=petWeek()+1;S.lic.lv=Math.max(1,S.lic.lv);openMyPets();}"); await g.step(4)
        await snap(g, 'card-mypets', 'My pets card: who follows / is at home, the animal license strip (by design no hearts here: hearts are on each pet\'s own card)')
        await g.ev("()=>{closePanel();for(const e of PET_ACTORS){e.d.sick=0;e.d.sad=0;e.d.happy=90;}PBR.sick=false;}")
    await scene('moods', moods())

    async def petshop():
        await g.ev(QUIET)
        r = await g.ev("""()=>{__goto('pets');__setClock(null,12);FOL(['dog']);const L=LOC.pets,K=KEEPERS.find(k=>k.name==='Ms. Paws');P.x=L.ox+1.6;P.z=L.oz+3.2;P.cy=0;bringFollowers(true);__run(20);LOOKP(K.x,K.z,.02);return [+(K.x-L.ox).toFixed(2),+(K.z-L.oz).toFixed(2)];}""")
        await snap(g, 'petshop-floor1-mspaws', f'the 3-floor Pet Shop from floor 1, Ms. Paws behind the counter (at {r})', "[['Ms. Paws',KEEPERS.find(k=>k.name==='Ms. Paws').x,1.2,KEEPERS.find(k=>k.name==='Ms. Paws').z]]")
        r = await g.ev("""()=>{$('toast').classList.remove('show');const L=LOC.pets;const go=(x,z,n)=>{const sx=P.x,sz=P.z;for(let i=1;i<=n;i++){P.x=sx+(L.ox+x-sx)*i/n;P.z=sz+(L.oz+z-sz)*i/n;__run(1);}};
          P.x=L.ox;P.z=L.oz+3.7;P.cy=0;__run(3);for(const q of [[-4.6,4.5,40],[-5.95,4.5,20],[-5.95,2.2,40],[-5.95,-.3,40],[-4.2,-.5,30],[-4.0,-2.2,30],[-2.9,-2.25,30],[3.0,-2.3,60],[4.4,-1.2,30],[4.4,4.6,60],[5.95,4.6,20],[5.95,-.3,80],[4.0,-1.0,30]])go(...q);
          __run(30);const it=L.inter.find(t=>t.label==='Big pets');LOOKP(it.x,it.z,-.05);window.__bp=it;return {cy:P.cy,board:[+(it.x-L.ox).toFixed(2),+(it.z-L.oz).toFixed(2)]};}""")
        await snap(g, 'petshop-topfloor-bigboard', f'the Pet Shop top floor (height {r["cy"]}), the Big pets lock board (at {r["board"]}), the big-pet spots', "[['board',__bp.x,PSH.F[2]+1.2,__bp.z]]")
        await g.ev("()=>{$('toast').classList.remove('show');S.lic.lv=1;openBig();}"); await g.step(3)
        await snap(g, 'card-bigpets-board', 'the Big pets board card (bear locked: license 3; the others adopted)')
        await g.ev("()=>{closePanel();S.lic.lv=3;}")
    await scene('pet shop', petshop())

    async def show():
        await g.ev(QUIET)
        await g.ev("""()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__clockMs(msAt(d,12)-CLK.sk);__run(4);closePanel();FOL(['dog']);
          for(const p of PET_ACTORS){p.d.happy=90;p.d.sick=0;p.d.sad=0;}PBR.sick=false;S.show=null;P.x=-31;P.z=22.6;P.yaw=Math.PI/2;bringFollowers(true);__run(6);
          const p=PET_ACTORS.find(q=>!q.d.stay);p.d.tr=3;psStart(p);}""")
        r = await g.ev(r"""()=>{let n=0;while(n++<9000){__run(1);const C=CUT;if(!C||!C.show)return 'ended';if(C.stage==='trick'&&C.order[C.ri]&&C.order[C.ri].you)return 'your trick, round '+C.round;
            if(C.stage==='aim'&&C.t-C.st>.3){C.t0=performance.now()-((.25+1-C.ph)%1)*[1.8,1.5,1.25][C.round]*1000;ACT.pstap();}
            if(/^(intro|r|wait)/.test(C.stage)&&C.ri<C.me&&C.ts==null)ACT.psskip();}return 'timeout '+(CUT&&CUT.stage);}""")
        await g.step(36); await g.ev("()=>{$('toast').classList.remove('show');popDrop();}")   # (picture pass 2: the script runs the show's start in a fifth of a second: its bus hint and 'Pet Show!' were still up)
        await snap(g, 'show-trick', f'the Pet Show on the stage, your dog mid-trick ({r})')
        await g.ev(r"""()=>{let n=0;while(CUT&&CUT.show&&n++<6000){__run(1);const C=CUT;if(!C)break;if(C.stage==='aim'&&C.t-C.st>.3)ACT.pstap();if(C.stage==='res'&&C.paid)ACT.psbye();if(C.stage==='lic'&&C.licOpen)ACT.licok();}closePanel();}""")
    await scene('pet show', show())

    async def farm():
        await g.ev(QUIET)
        await g.ev("""()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==1)d++;__clockMs(msAt(d,12)-CLK.sk);__run(4);closePanel();FOL(['dog']);S.coins=Math.max(S.coins,2000);S.ride={lesson:0};S.farm={eggs:0,milk:0};
          P.x=-100;P.z=-101;P.yaw=Math.PI/2;bringFollowers(true);__run(4);farmLiveAll();__run(10);}""")
        await g.ev("()=>{const IV=FARM.ppl.find(p=>p.who==='ieva'),cl=(x,z)=>Math.min(...FARM.hs.map(h=>Math.hypot(h.m.root.position.x-x,h.m.root.position.z-z)-1.5));let best=null;for(let a=0;a<12;a++)for(const r of[3.2,4]){let [x,z]=collideXZ(IV.x+Math.sin(a/12*TAU)*r,IV.z+Math.cos(a/12*TAU)*r,.3,CUR);const c=cl(x,z);if(!best||c>best[2])best=[x,z,c];}P.x=best[0];P.z=best[1];__run(20);LOOKP(IV.x,IV.z,-.08);farmIeva();__run(10);}")
        await asyncio.sleep(3); await g.ev("()=>toastOff()")   # (picture pass 3: Ieva's second line waits 2.6 s on a real timer and then in the toast queue; the script used to ride before it came)
        await snap(g, 'farm-stable-ieva', 'the stable with Ieva grooming/pointing, horses in their stalls', "[['Ieva',FARM.ppl.find(p=>p.who==='ieva').x,1.2,FARM.ppl.find(p=>p.who==='ieva').z]]")
        await g.ev("()=>{const C=FARM.an.filter(a=>a.type==='cow'&&!a.baby),cx=C.reduce((s,a)=>s+a.x,0)/C.length,cz=C.reduce((s,a)=>s+a.z,0)/C.length;P.x=cx+7;P.z=cz+3;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);LOOKP(cx,cz,-.12);__run(4);window.__cw=[cx,cz];}")   # (picture pass 3: the cows were 2.5 m drums)
        await snap(g, 'farm-cows', 'the cows grazing in their field (picture pass 3: each a cow with a head, a slim neck and spots, not a big drum)', "[['cows',__cw[0],1,__cw[1]]]")
        r = await g.ev("""()=>{toastOff();farmLessonStart();ACT.flesson();const LH=FARM.hs.find(h=>h.kind==='lesson');P.x=LH.x+1;P.z=LH.z+1;FARM.on=true;
          const out=[];farmTargets(out);const t=out.find(t=>t.label==='Get on');if(t)t.act();
          const go=(x,z)=>{for(let i=0;i<300&&P.horse&&Math.hypot(P.x-x,P.z-z)>1;i++){P.yaw=Math.atan2(-(x-P.x),-(z-P.z));IN.keys.KeyW=true;farmRide(1/30);farmLessonTick(1/30);}IN.keys.KeyW=false;};
          go(FARM.flags.blue.x,FARM.flags.blue.z);if(P.horse)P.horse.sp=0;const SN=FARMD.lesson.stan;LOOKP(SN[0],SN[1],-.12);return {step:FARM.lesson&&FARM.lesson.step,horse:!!P.horse};}""")
        await g.step(4)
        await snap(g, 'farm-lesson-step', f"Stan's riding lesson, at the blue flag on the lesson horse, Stan's next line (step {r})", "[['Stan',FARMD.lesson.stan[0],1.2,FARMD.lesson.stan[1]]]")
        r = await g.ev("""()=>{toastOff();FARM.lesson=null;S.ride.lesson=1;if(P.horse)farmOff(true);__run(4);const H=FARM.hs.find(h=>h.kind==='pad'&&farmHorseFree(h));P.x=H.x;P.z=H.z;farmMount(H);
          const T=FARM.trail,i=Math.floor(T.length*.45),a=T[i],b=T[Math.min(T.length-1,i+2)];P.x=a[0]!==undefined?a[0]:a.x;P.z=a[1]!==undefined?a[1]:a.z;const bx=b[0]!==undefined?b[0]:b.x,bz=b[1]!==undefined?b[1]:b.z;LOOKP(bx,bz,-.15);P.horse.ry=P.yaw+Math.PI;__run(6);toastOff();return {horse:!!P.horse,at:[+P.x.toFixed(1),+P.z.toFixed(1)]};}""")
        await snap(g, 'farm-trail-ride', f'riding a horse on the horse trail (first person; {r})')
        r = await g.ev("""()=>{toastOff();const J=FARM.jumps.o122;P.x=J.x+3*Math.sin(J.ry);P.z=J.z+3*Math.cos(J.ry);LOOKP(J.x,J.z,-.22);if(P.horse)P.horse.ry=P.yaw+Math.PI;__run(3);if(P.horse){P.horse.sp=4;P.horse.j=gameMs()/1000;window.__pre=()=>{if(!P.horse)return;P.horse.j=gameMs()/1000-.45;P.horse.sp=4;farmRide(0);updateCamera(0);};}return {horse:!!P.horse};}""")
        await g.step(8)   # (picture pass 3: the hook holds the jump at 0.45 s for the picture; a step of real frames ran past it)
        await snap(g, 'farm-jump-mid', f'the jump field, first person on a horse 0.45 s into the jump over jump o122: its head and neck in front of you, the bar below (you are up in the air with it; {r})')
        await g.ev("""()=>{window.__pre=null;toastOff();if(P.horse)farmOff(true);__run(4);__clockMs(msAt(S.day,21.6)-CLK.sk);__run(4);P.x=-92;P.z=-104;P.yaw=Math.PI*.55;P.pitch=-.08;__run(20);}""")
        await snap(g, 'farm-night', 'the farm yard at night (21:36)')
    await scene('farm', farm())

    async def bus():
        await g.ev(QUIET)
        r = await g.ev("""()=>{FOL([]);let d=S.day+1;while(!(busArr(d)===undefined&&!busWB(d)&&busSess(d).some(s=>s.p==='beach'&&s.go==='town'&&s.a===8)))d++;
          __goto('beach');__clockMs(msAt(d,8.2)-CLK.sk);__run(2);const L=LOC.beach;P.x=L.ox-24;P.z=L.oz;let n=0;while(!busReady('beach')&&n++<2400)__run(1);
          const v=new THREE.Vector3();BUS.g.getWorldPosition(v);const dx=P.x-v.x,dz=P.z-v.z,dd=Math.hypot(dx,dz)||1;P.x=v.x+dx/dd*10;P.z=v.z+dz/dd*10;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);LOOKP(v.x,v.z,-.06);__run(2);
          window.__bv=[v.x,v.z];return {day:d,wd:wdName(d),t:+S.time.toFixed(2),ready:busReady('beach'),frames:n};}""")
        await snap(g, 'beach-morning-bus', f'the morning bus home at the beach stop (8:00-9:30 on a no-bus day): {r}', "[['bus',__bv[0],1.5,__bv[1]]]")
    await scene('bus', bus())

    async def hats():
        await g.ev(QUIET); await g.ev(TOWN)
        r = await g.ev("""()=>{__run(4);P.yaw=0;P.pitch=-.06;const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);window.__hp=[];
          const L=[['beanie','#6b3e26','long','long'],['cowboy','#f2c94c','straight','long']];
          L.forEach(([h,hair,st,len],i)=>{const p=makePerson(Object.assign({},DEFAULT_LOOK,{hair,style:st,len,hat:h,top:i?'#7ec8e3':'#ff9ec4'}));const s=i?1:-1;
            p.root.position.set(P.x+fx*2.3+rx*.48*s,0,P.z+fz*2.3+rz*.48*s);p.root.rotation.y=P.yaw+s*.35;scene.add(p.root);__hp.push(p);});
          return L.map(q=>q[0]+' on '+q[2]+'/'+q[3]+' hair');}""")
        await snap(g, 'town-hats-long-hair', f'two people with long hair and hats, close up: {r}', "__hp.map((p,i)=>['person '+i,p.root.position.x,1.5,p.root.position.z])")
        await g.ev("()=>{for(const p of __hp)scene.remove(p.root);}")
    await scene('hats', hats())

    async def sleep():
        await g.ev(QUIET)
        r = await g.ev("""()=>{__clockMs(msAt(S.day,22)-CLK.sk);__goto('home');__run(2);if(![...HOME_ITEMS.values()].some(r=>FURN[r.it.t].use==='sleep')){S.home.items.push({u:'zzbed',t:'bed',c:'#ff9ec4',x:-4.6,z:-3.85,r:0});rebuildHome();}
          const rec=[...HOME_ITEMS.values()].find(r=>FURN[r.it.t].use==='sleep');P.x=rec.g.position.x+1;P.z=rec.g.position.z;rec.inter.act();__run(3);return {bed:zzIn(),t:+S.time.toFixed(2)};}""")
        await g.step(2); await g.wait(1200); await g.step(1)   # (picture pass 1: the screen fades in for 0.8 s)
        await snap(g, 'sleep-screen', f'the night-skip sleep screen in bed at 22:00 (Sleeping until 7:00, Wake up): {r}')
    await scene('sleep', sleep())
    await run.close(g)

async def phone_cards(run):
    g = await begin(run, new_wb, 'android-phone-portrait', 'gap-cards', dict(SAVE, name='ZZTEST-GAPP'))
    await g.ev(INSTALL); b = await g.ev(BIG); print('phone big pets', b)
    async def cards():
        await g.ev("()=>{FOL([]);__goto('home');const rec=[...HOME_ITEMS.values()].find(r=>r.it.t==='snaketank');rec.inter.act();ACT.tank('on');}"); await g.step(3)
        await snap(g, 'card-glass-tank', 'the Glass tank card (light on/off, 8 colours)')
        await g.ev("()=>{closePanel();__goto('vet');__setClock(null,12);openVetBook();}"); await g.step(4)
        await snap(g, 'card-vet-booking', 'the vet booking screen on the phone')
        await g.ev("()=>{PH.app=null;__goto('city');PBR.sick=true;const e=PET_ACTORS.find(p=>petKind(p.d)==='cat');if(e){e.d.happy=8;}const c=PET_ACTORS.find(p=>petKind(p.d)==='bunny');if(c){c.d.sick=1;c.d.happy=30;}S.hw.rb=petWeek()+1;S.lic.lv=Math.max(1,S.lic.lv);openMyPets();}"); await g.step(4)
        await snap(g, 'card-mypets', 'My pets card: who follows / is at home, the animal license strip (by design no hearts here: hearts are on each pet\'s own card)')
        await g.ev("()=>{closePanel();__goto('pets');S.lic.lv=1;openBig();}"); await g.step(3)
        await snap(g, 'card-bigpets-board', 'the Big pets board card (bear locked: license 3; the others adopted)')
    await scene('phone cards', cards())
    await run.close(g)

async def show_join(run):
    """A enters the Pet Show; B (iPad) and C (Android phone) in the park get the join card (as P29 does it)."""
    SAT = """()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__clockMs(msAt(d,12)-CLK.sk);__run(4);closePanel();
      for(const p of PET_ACTORS){p.d.happy=90;p.d.sick=0;p.d.sad=0;}PBR.sick=false;S.show=null;P.x=-31;P.z=22.6;P.yaw=Math.PI/2;bringFollowers(true);__run(6);}"""
    A = B = C = None
    try:
        A = await begin(run, new_wb, 'ipad-landscape', 'gap-showA', dict(SAVE, name='ZZTEST-SHA'))
        B = await begin(run, new_wb, 'ipad-landscape', 'gap-showB', dict(SAVE, name='ZZTEST-SHB'))
        C = await begin(run, new_wb, 'android-phone-portrait', 'gap-showC', dict(SAVE, name='ZZTEST-SHC'))
        for x in (A, B, C): await x.ev(SAT)
        ms = await A.ev("()=>realMs()")
        for x, (px, pz, nm) in ((B, (-30.5, 24.5, 'Biscuit')), (C, (-30.2, 20.8, 'Pepper'))):
            await x.ev("(ms)=>{__clockMs(ms);}", ms)
            await x.ev(f"()=>{{P.x={px};P.z={pz};P.yaw=Math.PI/2;const d=PET_ACTORS.find(p=>!p.d.stay).d;d.name='{nm}';bringFollowers(true);change();}}")
        async def flow(k):
            for _ in range(k):
                for x in (A, B, C): await x.step(6)
                await asyncio.sleep(.25)
        await flow(6)
        await A.ev("()=>{openShow();ACT.psgo(0);}"); await flow(5)
        for x in (B, C):
            card = await x.ev("()=>UI.open?$('card').innerText.slice(0,80):''")
            if 'Pet Show' not in card and 'join' not in card.lower(): FAILED.append(f'join card on {x.profile}: card is {card!r}')
            await snap(x, 'card-show-join', f'the Pet Show join card (a friend entered; 45 s to join): {card[:60]!r}')
    except Exception as e:
        FAILED.append(f'show join: {e}'); traceback.print_exc()
    finally:
        for x in (A, B, C):
            if x: await run.close(x)

async def main():
    async with Run('gap', os.path.join(OUT, '..', 'gap-run')) as run:
        await ipad_world(run)
        if not ONLY or 'phone cards' in ONLY: await phone_cards(run)
        if not ONLY or 'show join' in ONLY: await show_join(run)
    LIST.sort()
    with open(os.path.join(OUT, 'list.txt'), 'w') as f:
        f.write(f'{len(LIST)} pictures (Pets and Farm Update, gaps after the full check; tools/pfu-wip/shots_pfu.py)\n')
        f.write('\n'.join(LIST) + '\n')
        if FAILED: f.write('\nNOT MADE:\n' + '\n'.join(FAILED) + '\n')
    print(len(LIST), 'pictures;', 'FAILED:', FAILED)
asyncio.run(main())
