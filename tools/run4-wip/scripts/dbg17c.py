import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j17try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d17c', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d17c-run') as run:
        for prof in ('pc-1366','ipad-landscape'):
            g = await begin(run, BUILD, prof, 'tap-'+prof, dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-TAP'))
            await g.ev("()=>{__goto('city');MP.peers.set('fakepeer',{peer:'fakepeer',nm:'Fakey',av:null});HPT.queue.push({peer:'fakepeer',id:'pid1',at:realMs()+60000,h:13,nm:'Fakey'});hpCard();}"); await g.step(3)
            st = await g.ev("()=>{const b=$('hpYes'),r=b.getBoundingClientRect();const top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {rect:[r.left,r.top,r.width,r.height].map(Math.round),top:top&&(top.id||top.className||top.tagName),card:!$('hpCard').hidden,cur:!!HPT.cur};}")
            print(prof, 'before', st)
            r = await g.tap('#hpYes'); await g.step(2)
            print(prof, 'tap ->', r, await g.ev("()=>({rsvp:S.rsvp,cur:!!HPT.cur,hidden:$('hpCard').hidden})"))
            await run.close(g)
asyncio.run(main())
