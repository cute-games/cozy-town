"""Run 4, start step 5: new test saves made with the STARTING version (tools/prerun4-index.html), all named ZZTEST-*.
(a) a player on day 58 with a garden growing, a designer order and the hairstylist counters in progress
(b) a player on day 1 (fresh after Rosie's welcome)
(c) a player in bed at night (saved at home by the bed at 23:00)
(d) a player at level 10 in every skill
(e) a player with pets of the new kinds, every outfit slot filled
(f) the big-house and upstairs fixtures already exist from night 3 (save-prenight3-bighouse / -upstairs)
usage: python3 mkfix.py KITDIR OUTDIR"""
import asyncio, json, os, sys
KIT, OUT = sys.argv[1], sys.argv[2]
sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
OLD = open('/home/user/cozy-town/tools/prerun4-index.html', 'rb').read()
BASE = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))

async def dump(g):
    await g.ev("()=>{saveLocal();}")
    return json.loads(await g.ev("()=>localStorage.getItem('cozytown-save-1')"))

async def main():
    os.makedirs(OUT, exist_ok=True)
    async with Run('mkfix', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/mkfix-run') as run:
        # (a) day 58: garden growing (watered today, half grown), a designer order in progress, hairstylist counters, name ZZTEST-DAY58
        sv = dict(BASE, name='ZZTEST-DAY58', day=58, time=10.4, coins=740, job='designer')
        sv['q'] = {'day': 57, 'list': sv['q']['list'], 'st': {}}   # yesterday's quests: the game re-draws them on load (same in both versions)
        g = await run.open(OLD, 'web', 'ipad-landscape', 'light', 'fx-a', save=sv); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev("""()=>{S.garden[0]={seed:'tomato',g:.45,w:S.day};S.garden[1]={seed:'carrot',g:.2,w:S.day};S.garden[2]={seed:'carrot',g:1,w:S.day-1};for(const rec of PLOTS)plotRefresh(rec);
          S.time=10.4;ds().done=1;ds().o=null;dsNew(1);S.hs={day:S.day,done:2};S.hsTut=1;S.dsTut=1;return {day:S.day,order:!!(S.ds&&S.ds.o),h:S.ds.o&&S.ds.o.h,garden:S.garden.filter(x=>x&&x.seed).length};}""")
        print('(a)', r); a = await dump(g); await run.close(g)
        a['day'] = 58; a['time'] = 10.45
        json.dump(a, open(os.path.join(OUT, 'save-prerun4-day58.json'), 'w'))
        # (b) day 1: a brand-new player right after the welcome
        g = await run.open(OLD, 'web', 'ipad-landscape', 'light', 'fx-b'); await g.manual(); ok = await g.play_intro('ZZTEST-DAY1'); await g.ev(INSTR); await g.step(40)
        b = await dump(g); print('(b) intro', ok, 'day', b.get('day'), 'time', b.get('time')); await run.close(g)
        json.dump(b, open(os.path.join(OUT, 'save-prerun4-day1.json'), 'w'))
        # (c) in bed at night: at home beside the bed, 23:10
        sv = dict(BASE, name='ZZTEST-BED', day=30, time=23.1)
        g = await run.open(OLD, 'web', 'ipad-landscape', 'light', 'fx-c', save=sv); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev("""()=>{__goto('home');S.time=23.1;const rec=[...HOME_ITEMS.values()].find(r=>FURN[r.it.t].use==='sleep');if(!rec)return 'no bed';
          P.x=rec.g.position.x+1.0;P.z=rec.g.position.z;P.yaw=Math.PI/2;sleep(rec,1,0);__run(4);return {bed:!!(P.sit&&P.sit.bed),loc:CUR.id,time:S.time};}""")
        print('(c)', r); c = await dump(g); await run.close(g); c['time'] = 23.15
        json.dump(c, open(os.path.join(OUT, 'save-prerun4-bed.json'), 'w'))
        # (d) level 10 in every skill
        sv = dict(BASE, name='ZZTEST-LV10', day=40, time=12.0, coins=5200)
        sv['skills'] = {k: {'lv': 10, 'xp': 0} for k in ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']}
        g = await run.open(OLD, 'web', 'ipad-landscape', 'light', 'fx-d', save=sv); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev("()=>({lv:Object.keys(SKILLS).map(k=>sk(k).lv),max:MAXLV})"); print('(d)', r); d = await dump(g); await run.close(g)
        json.dump(d, open(os.path.join(OUT, 'save-prerun4-lv10.json'), 'w'))
        # (e) three pets of the new kinds (the game allows 3), every outfit slot filled
        sv = dict(BASE, name='ZZTEST-PETS2', day=33, time=14.0, coins=3000); sv['pets'] = []
        sv['bag'] = dict(sv.get('bag') or {}, hat=3, collar=3, shades=3, cape=3, bow=3, scarf=3, boots=3)
        g = await run.open(OLD, 'web', 'ipad-landscape', 'light', 'fx-e', save=sv); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev("""()=>{const out=[];for(const k of ['pug','capybara','owl']){const T=PET_TYPES[k];openAdopt(k,T.cols[0]);ACT.adopt();const d=S.pets[S.pets.length-1],p=PET_ACTORS[PET_ACTORS.length-1];
          PT=p;for(const [sl] of PSLOTS){const acc=Object.keys(ACCS).find(a=>ACCS[a].s===sl);S.bag[acc]=(S.bag[acc]||0)+1;ACT.pwear(acc);}closePanel();out.push([d.type,d.kind,Object.keys(petOutfit(d)).length]);}
          __run(20);return out;}""")
        print('(e)', r); e = await dump(g); await run.close(g)
        json.dump(e, open(os.path.join(OUT, 'save-prerun4-pets2.json'), 'w'))
    for f in sorted(os.listdir(OUT)):
        x = json.load(open(os.path.join(OUT, f))); print(f, 'name', x.get('name'), 'day', x.get('day'), 'time', round(x.get('time', 0), 2), 'coins', x.get('coins'), 'pets', len(x.get('pets') or []), 'job', x.get('job'))
asyncio.run(main())
