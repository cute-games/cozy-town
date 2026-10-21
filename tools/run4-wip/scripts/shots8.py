"""Stage 3, PHOTOGRAPHER (pass 8 on: shots4.py plus a close look at the pond ducks; pass 9: the duck close-up after feeding them, the school
hall from nearer its door, your pets a step behind you indoors, an upright phone's room views a little lower): pictures of every place, every building inside, every new thing and every screen, with a map of where each was taken.
usage: python3 shots4.py OUTDIR [profiles] [themes]  (defaults: ipad-landscape,iphone-portrait,iphone-landscape,pc-1366 ; light,dark)"""
import asyncio, json, os, sys, time
KIT='/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/stage3-shots'
PROFS = (sys.argv[2] if len(sys.argv) > 2 else 'ipad-landscape,iphone-portrait,iphone-landscape,pc-1366').split(',')
THEMES = (sys.argv[3] if len(sys.argv) > 3 else 'light,dark').split(',')
CLEAN = "()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"   # (pass 3: following friends stay away: they gathered in front of the camera)
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const q of PET_ACTORS){const f=P.yaw;q.x=P.x+Math.sin(f)*2.5;q.z=P.z+Math.cos(f)*2.5;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<16){c.d+=c.total/2;carPlace(c);}"   # passers-by near the spot go home, the pets wait behind the camera
LANEJS = "laneRefresh(true);__run(2);const j=LANE.own?LANE.own.findIndex(o=>o&&o.k===laneMe()):-1;const d=((j>=0?LOC.city.lane[j]:null)||LOC.city.lane[LANE.mine]||LOC.city.lane[0]).door;"
# a spot: name, javascript that sets the scene (teleports, opens a card), frames to settle, notes for the map
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
OUTDOOR = [
 ('town-square-fountain', "__goto('city');__setClock(null,11);wxForce('sun');" + look(-22, 9.0, -22, 19, .06), 'the park from the square, the fountain'),
 ('town-pet-show-stage', "__goto('city');" + look(-25.9, 10.5, -31.4, 20.4, .08), 'the Pet Show stage and the food truck corner'),   # (pass 6: turned a little right: the truck's sign ran off the edge; pass 10: a step in through the gate, past its post, which filled an upright phone's view)
 ('town-flower-corner', "__goto('city');" + look(-17, 0, -17, -8, .05), 'the Flower Corner gate from the square'),
 ('town-duck-pond', "__goto('city');" + look(38.6, -32.6, 36.2, -36.2, -.3), 'the duck pond'),   # (pass 6: a step back from the house corner)
 ('town-school-front', "__goto('city');" + look(-26.2, -45.2, -25, -58, .08), 'the school front'),   # (pass 6: a step left, away from the lamp post; pass 10: on the pavement, not 30 cm into the road, where a passing car filled the picture)
 ('town-east-shops', "__goto('city');" + look(53, -25.5, 64, -31.5, .06), 'the Toy Store and the east shops'),
 ('town-treepark-gate', "__goto('city');" + look(68.6, -38, 74, -38, .05), 'the Tree Park gate in the woods'),
 ('town-apartments', "__goto('city');" + look(-50, 30, -63.5, 40.5, .08), 'the Hair Salon and the apartments on the west road'),
 ('town-lake', "__goto('city');" + look(58, 58, 69, 69, -.1), 'the lake'),
 ('town-football', "__goto('city');" + look(-39.6, 49.4, -25, 64, .04), 'the football field'),   # (pass 5: a step west: a pavement tree stood in front; pass 6: back from the lamp post)
 ('town-bus-stop', "__goto('city');" + look(-14.5, 2.0, -16.2, 9.6, .05), 'the bus stop at the park'),   # (pass 5: from the south: a lamp post stood in front)
 ('lane-my-house', "S.bighouse=false;S.home.xf=0;S.home.col='';applyHouse();__goto('city');" + LANEJS + "P.x=d[0]-Math.sin(d[2])*7;P.z=d[1]-Math.cos(d[2])*7;P.yaw=d[2]+Math.PI;P.pitch=.1;", 'my house on Friends Lane from the street (one storey)'),
 ('lane-mailbox', "__goto('city');const mb=CUR.inter.find(q=>/Mailbox/.test(typeof q.label==='function'?q.label():q.label));if(mb){P.x=mb.x+1.5;P.z=mb.z+2;P.yaw=Math.atan2(-(mb.x-P.x),-(mb.z-P.z));P.pitch=.15;}", 'the mailbox in my yard'),
 ('beach', "__goto('beach');" + look(1000-14, 6, 1000+8, -2, .02), 'the beach from the boardwalk'),
 ('treepark-start', "__goto('treepark');" + look(0, TPZ := -1000+22.5, 0, -1000+10, .0), 'the Tree Park clearing with the three signs'),
 ('treepark-easy-deck', "__goto('treepark');tpStart('easy');", 'on the first deck of the easy path'),
 ('treepark-hard-decks', "__goto('treepark');tpStart('hard');", 'on the first deck of the hard path'),
 ('treepark-finish', "__goto('treepark');const d=TP.decks.find(q=>q.path==='medium'&&q.fin);P.x=d.x+.3;P.z=d.z+1.15;P.cy=d.h;P.yaw=Math.atan2(-((d.x-.85)-P.x),-((d.z-.3)-P.z));P.pitch=.08;TP.last=d;", 'the medium path\'s finish deck: the bell and the Finish banner'),
 ('town-ducks-close', "__goto('city');P.x=33.9;P.z=-38.3;S.bag.bread=(S.bag.bread||0)+1;feedDucks(0);__run(90);{const t=$('toast');if(t)t.classList.remove('show');}const ds=LOC.city.ducks.filter(d=>d.pond===0);if(ds.length){const cx=ds.reduce((a,d)=>a+d.x,0)/ds.length,cz=ds.reduce((a,d)=>a+d.z,0)/ds.length;P.yaw=Math.atan2(-(cx-P.x),-(cz-P.z));P.pitch=-Math.atan2(1.3,Math.hypot(cx-P.x,cz-P.z));}", 'the two pond ducks after you feed them: they swim up to you; their faces (bill, eyes), wings and tails'),   # (pass 9: fed, so they come close; from a fixed spot they were small at the far rim behind the cattails)   # (run 4 finish: the ducks' new faces had not been seen by a viewer)
]
STEP = {'market': 0.6, 'pets': 1.5, 'flowers': 0.6, 'cafe': 1.5, 'clothes': 0.6, 'salon': 0.6, 'toys': 2.4, 'bakery': 0.6, 'library': 0.6, 'icecream': 0.6, 'school': 0.6, 'fire': 2.4, 'pizza': 1.5, 'home': 1.5}   # (pass 3: tried 0.6 / 1.5 / 2.4 m in, picked per room)
INDOOR = [('inside-' + k, f"__goto('{k}');__setClock(null,11);__run(2);P.x-=Math.sin(P.yaw)*{STEP[k]};P.z-=Math.cos(P.yaw)*{STEP[k]};[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.pitch=innerWidth<innerHeight?-.08:.02;for(const q of PET_ACTORS)if(q.loc===CUR.id){{q.x=P.x+Math.sin(P.yaw)*1.4;q.z=P.z+Math.cos(P.yaw)*1.4;[q.x,q.z]=collideXZ(q.x,q.z,.3,CUR);}}for(const q of SHOPPERS)if(q.L===CUR&&Math.hypot(q.x-P.x,q.z-P.z)<3.4){{let best=-1,bd=0;q.cfg.spots.forEach((sp,j)=>{{const x=CUR.ox+sp[0],z=CUR.oz+sp[1],d=Math.hypot(x-P.x,z-P.z);if(d>bd&&!SHOPPERS.some(o=>o!==q&&o.L===CUR&&(o.i===j||o.next===j||Math.hypot(o.x-x,o.z-z)<1.2))){{bd=d;best=j;}}}});if(best>=0){{const sp=q.cfg.spots[best];q.i=best;q.next=-1;q.x=CUR.ox+sp[0];q.z=CUR.oz+sp[1];q.wait=9;}}}}", 'inside the ' + k) for k in ('market','pets','flowers','cafe','clothes','salon','toys','bakery','library','icecream','school','fire','pizza','home')]
INDOOR = [(e[0], "__goto('fire');__setClock(null,11);__run(2);P.x=CUR.ox+1.5;P.z=CUR.oz-4.2;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.yaw=Math.atan2(-(CUR.ox-3-P.x),-(CUR.oz+1-P.z));P.pitch=0;") + tuple(e[2:]) if e[0] == 'inside-fire' else e for e in INDOOR]   # (pass 6: the fire station from its far corner: the whole truck; it stood beside the truck)
INDOOR += [('inside-pets-upstairs', "__goto('pets');P.z=LOC.pets.oz+UPZ+2.3;P.x=LOC.pets.ox+.4;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.yaw=0;P.pitch=.12;for(const q of PET_ACTORS)if(q.loc===CUR.id){q.x=P.x+Math.sin(P.yaw)*1.4;q.z=P.z+Math.cos(P.yaw)*1.4;[q.x,q.z]=collideXZ(q.x,q.z,.3,CUR);}", 'the Pet Shop upstairs: the pens and their signs on the back wall'),   # (pass 5: in the aisle; it stood at the hamster table)
           ('inside-home-floor-2', "__goto('home');S.bighouse=true;S.home.xf=4;applyHouse();P.z=LOC.home.oz+UPZ+3.5;P.x=LOC.home.ox;P.yaw=0;P.pitch=.05;", 'my house, floor 2 (six floors owned)'),
           ('inside-home-stairs', "__goto('home');P.x=LOC.home.ox-HOMEW+1.2;P.z=LOC.home.oz;P.yaw=Math.PI/2;P.pitch=.16;", 'the stairs in my house, up to the door with its Upstairs plate'),
           ('inside-home-floor-2-stairs', "__goto('home');S.bighouse=true;S.home.xf=4;applyHouse();P.z=LOC.home.oz+UPZ;P.x=LOC.home.ox-HOMEW+3.4;P.yaw=Math.PI/2;P.pitch=.1;", 'floor 2: the stairs doorway with its Upstairs and Downstairs plates'),
           ('lane-my-house-six-floors', "S.bighouse=true;S.home.xf=4;S.home.col='#b79cff';applyHouse();__goto('city');" + LANEJS + "P.x=d[0]-Math.sin(d[2])*14;P.z=d[1]-Math.cos(d[2])*14;P.yaw=d[2]+Math.PI;P.pitch=.46;", 'my house from the lane with six floors, painted purple'),
           ('lane-my-garden', "S.bighouse=false;S.home.xf=0;S.home.col='';applyHouse();__goto('city');" + LANEJS + "const q=lotPt(LANE.mine,-18.3,-25.6),t=lotPt(LANE.mine,-18.3,-20.5);P.x=q[0];P.z=q[1];P.yaw=Math.atan2(-(t[0]-P.x),-(t[1]-P.z));P.pitch=-.5;", 'my garden behind the house: the seed spots and the pots')]
RESET_JS = "closePanel();const el=$('dnHud');if(el)el.hidden=true;document.body.classList.remove('dancing');DANCE.on=false;for(const id of['hpCard','dnCard'])if($(id))$(id).hidden=true;if(PHO.on)ptClear();setJob(null);jobHud(true);"
SCREENS = [
 ('phone-messages', "__goto('city');__setClock(null,11);wxForce('sun');" + look(-14.5, 2.0, -16.2, 9.6, .05) + WALK + "openPhone('msg');", 'the phone: messages'),   # (pass 5: the cards' camera moved off the lamp post)
 ('phone-chat-rosie', "openPhone('msg','ro');", "Rosie's chat"),
 ('phone-jobs', "openPhone('msg','ro');ACT.rjob&&ACT.rjob();", "Rosie's job list"),
 ('phone-friends', "openPhone('mp');", 'the phone: friends'),
 ('phone-quests', "openPhone('quest');", 'the phone: quests'),
 ('phone-skills', "openPhone('skills');", 'the phone: skills'),
 ('phone-pets', "openPhone('pets');", 'the phone: pets'),
 ('phone-furniture', "openPhone('furn');", 'the phone: furniture shop'),
 ('phone-calendar', "openPhone('cal');", 'the phone: calendar'),
 ('big-map', "closePanel();openMap();", 'the big map'),
 ('bag', "closePanel();openBag();", 'the bag'),
 ('settings', "closePanel();openSettings();", 'settings'),
 ('whats-new-book', "closePanel();bookOpen();", "the title's What's new book, page 1"),
 ('whats-new-book-p2', "BOOK.cur=1;bookRender();", "the title's What's new book, page 2: your house grows"),   # (run 4 finish: every page of the book, not only the cover)
 ('whats-new-book-p3', "BOOK.cur=2;bookRender();", "the title's What's new book, page 3: holidays all year"),   # (run 4 finish: every page of the book, not only the cover)
 ('whats-new-book-p4', "BOOK.cur=3;bookRender();", "the title's What's new book, page 4: the Pet Shop upstairs and more furniture"),   # (run 4 finish: every page of the book, not only the cover)
 ('whats-new-book-p5', "BOOK.cur=4;bookRender();", "the title's What's new book, page 5: the photographer job"),   # (run 4 finish: every page of the book, not only the cover)
 ('whats-new-book-p6', "BOOK.cur=5;bookRender();", "the title's What's new book, page 6: the Tree Park"),   # (run 4 finish: every page of the book, not only the cover)
 ('whats-new-book-p7', "BOOK.cur=6;bookRender();", "the title's What's new book, page 7: parties and the dance-off"),   # (run 4 finish: every page of the book, not only the cover)
 ('shop-market', "try{bookClose();}catch(e){}closePanel();openShop('market');", 'the Market shop card'),
 ('shop-pets', "closePanel();openShop('pets');", 'the Pet Shop card'),
 ('shop-beach', "closePanel();openShop('beach');", 'the beach kiosk card'),
 ('house-paint', "closePanel();__goto('city');" + look(-10, 4, -22, 16, .05) + WALK + "openHousePaint();", 'the house colour card'),
 ('big-house', "closePanel();openBigHouse();", 'the bigger house card'),
 ('mailbox-menu', "closePanel();hpMailMenu();", 'the mailbox menu'),
 ('party-time', "closePanel();ACT.hpplan();", 'the party time card'),
 ('party-invitation', "closePanel();MP.peers.set('fakep',{peer:'fakep',nm:'Mia',av:null});HPT.cur=null;HPT.queue=[{peer:'fakep',id:'pidx',at:realMs()+60000,h:13,nm:'Mia'}];hpCard();", 'the party invitation card'),
 ('dance-card', "const el=$('hpCard');if(el)el.hidden=true;MP.peers.set('fakep2',{peer:'fakep2',nm:'Leo',av:null,dn:{r:'rx',w:MP.me,st:'ask'}});dnCardShow(MP.peers.get('fakep2'));", 'the dance-off card'),
 ('tutorial-pizza', "const el=$('dnCard');if(el)el.hidden=true;closePanel();tutStart();", 'the pizza tutorial, step 1'),
 ('tutorial-hair', "tutEnd();hsTutStart();", 'the hairstylist tutorial, step 1'),
 ('tutorial-photo', "tutEnd();ptTutStart();", 'the photographer tutorial, step 1'),
 ('photo-pose-card', "tutEnd();__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};P.x=-22;P.z=11.4;P.yaw=Math.PI;P.pitch=.02;__run(2);ptSetup();" + WALK + "ptPoseCard(0);", "the photographer's pose card"),
 ('photo-shoot', "closePanel();for(const m of PHO.group)m.pose='wave';const g=PHO.group,cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;P.x=cx+Math.sin(f)*4.4;P.z=cz+Math.cos(f)*4.4;P.yaw=f;P.pitch=innerWidth<innerHeight?-.17:-.04;" + WALK, 'the photo shoot: the family at the fountain'),
 ('photo-result', "ACT.ptsnap();", "the photo's result card"),
 ('dance-hud', "ACT.ptbye();setJob(null);__goto('home');DANCE.partnerNm='Leo';DANCE.r='rx';DANCE.pat=dnPattern('rx').map(q=>({t:q.t,d:q.d,j:0}));DANCE.sc=45;DANCE.osc=30;DANCE.bar=.56;DANCE.t=6.2;DANCE.on=true;dnHud(true);dnHudTick();DANCE.on=false;document.body.classList.add('dancing');", 'the dance-off HUD (a still)'),
]
async def main():
    os.makedirs(OUT, exist_ok=True); themap = []
    async with Run('s3', OUT) as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        for prof in PROFS:
            for theme in THEMES:
                g = await run.open(fb, 'web', prof, theme, f'{prof}-{theme}', save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
                spots = OUTDOOR + INDOOR + SCREENS if prof == 'ipad-landscape' else SCREENS + [('reset', RESET_JS, 'reset')] + OUTDOOR[:8] + INDOOR[:3]
                for name, js, note in spots:
                    if name == 'reset':
                        await g.ev("(js)=>{try{eval(js);}catch(e){console.error('reset',e);}}", js); await g.step(4); continue
                    try:
                        await g.ev("()=>{$('note').hidden=true;const t=$('toast');if(t)t.classList.remove('show');}")
                        await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js + ("if(innerWidth<innerHeight&&CUR.id==='city'){const ss=solids(),at=k=>[P.x+Math.sin(P.yaw)*k,P.z+Math.cos(P.yaw)*k];let k=4;while(k>0&&ss.some(c=>pushOut(...at(k),1.5,c)))k-=.5;[P.x,P.z]=collideXZ(...at(k),.3,CUR);}" if name.startswith('town-') else '') + (WALK if name.startswith(('town-', 'lane-', 'beach')) else ''))   # (pass 8: the step back stops 1.5 m short of the parked bus or a car: in pass 7 it put the camera against the bus's side) (pass 5: the step back comes before the pets are sent behind the camera; in pass 4 it came after and the pets stood in front of the lens) (pass 4: an upright phone sees a narrow slice: its town spots stand 4 m further back)
                        for _ in range(6):
                            await g.step(4); await g.wait(60)
                            if not await g.ev("()=>fading||!!CLIMB"): break
                        await g.wait(900); await g.step(6)   # a fade (270 ms + 80 ms real time) must be over before the picture (pass 3: 900 ms, two pictures were still dim)
                        p = await g.shot(name, both=False)
                        st = await g.ev("()=>({loc:CUR&&CUR.id,x:+P.x.toFixed(1),z:+P.z.toFixed(1),yaw:+P.yaw.toFixed(2),time:clockStr(S.time),wx:WX.cur,open:UI.open})")
                        themap.append(dict(name=name, prof=prof, theme=theme, note=note, file=os.path.basename(p) if p else None, **st))
                    except Exception as e:
                        themap.append(dict(name=name, prof=prof, theme=theme, note=note, error=repr(e)[:200]))
                # night and rain in town (iPad only)
                if prof == 'ipad-landscape':
                    for tag, js in (('night', RESET_JS + "__goto('city');__setClock(null,21.5);wxForce('sun');"), ('rain', "__goto('city');__setClock(null,11);wxForce('rain');")):
                        await g.ev(js); await g.step(8)
                        for name, js2, note in OUTDOOR[:8]:
                            js3 = js2.split(';', 1)[1] if js2.startswith("__goto('city');") else None
                            if not js3: continue
                            await g.ev("(js)=>{try{eval(js);}catch(e){}}", js3.replace("__setClock(null,11);wxForce('sun');", '')); await g.step(6)
                            p = await g.shot(f'{name}-{tag}', both=False)
                            themap.append(dict(name=f'{name}-{tag}', prof=prof, theme=theme, note=note + f' at {tag}', file=os.path.basename(p) if p else None))
                print(prof, theme, 'errors', g.errors[:3], flush=True); await run.close(g)
    json.dump(themap, open(os.path.join(OUT, 'map.json'), 'w'), indent=1); print('pictures', len(themap), 'map at', os.path.join(OUT, 'map.json'))
asyncio.run(main())
