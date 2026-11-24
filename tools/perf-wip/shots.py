import asyncio, json, sys, os, shutil
sys.argv=[sys.argv[0],'x','shots']
exec(open('/home/claude/w/pfs/measure.py').read().split('async def main')[0])
FREEZE=r"""(()=>{let k=0;const B=Date.UTC(2026,10,23,10,0,0);const P0=1000;Date.now=()=>B+k;
 let s=12345;Math.random=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 window.__adv=(ms)=>{k+=ms;};})();"""
SC=[('town',12),('park',12),('lane',12),('farmyard',12),('fields',12),('jumps',12),('farmyard',21.5),('town',21.5),('petshop',12),('vet',12),('home',12),('school',12)]
async def main():
  outd='/home/claude/w/pfs/shots'; os.makedirs(outd,exist_ok=True)
  async with Run('pf-shots','/home/claude/w/pfs/run-shots') as run:
    for tag,f in [('main','/home/claude/w/pf/pf-main-s.html'),('new','/home/claude/w/pf/pf-new-s.html')]:
      orig=run.browser.new_context
      async def nc(*a,**k):
        c=await orig(*a,**k); await c.add_init_script(FREEZE); return c
      run.browser.new_context=nc
      g=await begin(run,open(f,'rb').read(),'ipad-landscape','sh-'+tag,dict(SAVE,name='ZZTEST-PERF'))
      run.browser.new_context=orig
      await g.ev(INSTALL); await g.ev("()=>{const f0=frame;window.frame=function(t){__adv(50);return f0(t);};}")
      for nm,h in SC:
        await g.ev(AREAS[nm].replace('H;',D%h)); await g.step(40)
        print(tag,nm,h,await g.ev('()=>[P.x,P.z,P.yaw,P.pitch,camera.position.toArray(),CUR.id,WX.kind]'),flush=True)
        p=await g.shot(f'{nm}-{h}',both=False); shutil.copy(p,f'{outd}/{tag}_{nm}-{h}.png')
      # Ieva grooming close-up
      await g.ev("()=>{__goto('city');__setClock(null,12);P.x=-100;P.z=-101;__run(4);farmLiveAll();__run(10);const IV=FARM.ppl.find(p=>p.who==='ieva');P.x=IV.x+3;P.z=IV.z+2.5;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);__run(20);LOOKP(IV.x,IV.z,-.1);}")
      await g.step(20); p=await g.shot('ieva',both=False); shutil.copy(p,f'{outd}/{tag}_ieva.png')
      print(tag,'brush',await g.ev("()=>{const IV=FARM.ppl.find(p=>p.who==='ieva');return IV.brush?{vis:IV.brush.visible,p:IV.brush.position.toArray()}:null}"))
      await run.close(g)
asyncio.run(main())
