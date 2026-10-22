import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
from checks import STATIC_JS
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j16try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
JUMP = """(d)=>{const n=TP.decks.find(q=>q.path===d.path&&q.i===d.i+1);const cur=TP.decks.find(q=>q.path===d.path&&q.i===d.i);
  const dx=n.x-cur.x,dz=n.z-cur.z,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;const ex=Math.abs(ux)>1e-6?(cur.w/2-.05)/Math.abs(ux):1e9,ez=Math.abs(uz)>1e-6?(cur.d/2-.05)/Math.abs(uz):1e9,t=Math.min(ex,ez);
  P.x=cur.x+ux*t;P.z=cur.z+uz*t;P.cy=cur.h;P.jy=0;P.vy=0;P.yaw=Math.atan2(-ux,-uz);TP.px=P.x;TP.pz=P.z;TP.last=cur;const x0=P.x,z0=P.z;
  IN.keys.KeyW=true;jump();let fr=0,maxA=0;for(;fr<120;fr++){__run(1);maxA=Math.max(maxA,(P.cy||0)+P.jy);if(P.jy<=0&&P.vy<=0&&fr>3)break;}IN.keys.KeyW=false;__run(2);
  const on=tpDeckAt(P.x,P.z,P.cy||0);return {from:cur.i,to:n.i,gap:+(L-(Math.abs(ux)>.7?cur.w/2+n.w/2:Math.abs(uz)>.7?cur.d/2+n.d/2:(cur.w/2+n.w/2)*1.41)).toFixed(2),dh:+(n.h-cur.h).toFixed(2),frames:fr,flew:+Math.hypot(P.x-x0,P.z-z0).toFixed(2),maxA:+maxA.toFixed(2),cy:P.cy,landedOn:on?on.i:null,ok:!!on&&on.i===n.i,x:+P.x.toFixed(2),z:+P.z.toFixed(2),fading:fading};}"""
async def main():
    async with Run('d16', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d16-run') as run:
        save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-DBG', job=None)
        g = await begin(run, BUILD, 'ipad-landscape', 'dbg', save)
        w = await g.ev(STATIC_JS); print('weights: treepark', w.get('treepark'), 'beach', w.get('beach'))
        near = await g.ev("""()=>{const L=LOC.city;const out=[];for(const c of L.cols){const x=c.cx!==undefined?c.cx:(c.x1+c.x2)/2,z=c.cz!==undefined?c.cz:(c.z1+c.z2)/2;if(x>66&&x<80&&z>-48&&z<-28)out.push(c.cr!==undefined?['circle',+c.cx.toFixed(1),+c.cz.toFixed(1),c.cr]:['box',+c.x1.toFixed(1),+c.z1.toFixed(1),+c.x2.toFixed(1),+c.z2.toFixed(1)]);}
          const tr=[];if(typeof WE!=='undefined')for(const [a,b] of WE){const A=WP[a],B=WP[b];if((A[0]>60&&A[1]<-25&&A[1]>-50)||(B[0]>60&&B[1]<-25&&B[1]>-50))tr.push([A,B]);}return {cols:out,trail:tr,inter:L.inter.filter(t=>t.icon==='🌲').map(t=>[t.x,t.z,t.label])};}""")
        print('near the gate:', json.dumps(near))
        await g.ev("()=>{__goto('city');__setClock(null,11);P.x=69;P.z=-38;P.yaw=Math.PI/2*3;P.pitch=0;}"); await g.step(3); await g.shot('gate-town', both=False)
        tg = await g.ev("()=>{P.x=72.2;P.z=-38;__run(2);const t=findTarget();return t?[t.icon,typeof t.label==='function'?t.label():t.label]:null;}"); print('gate target', tg)
        await g.ev("()=>{__goto('treepark');}"); await g.step(4); await g.shot('park-start', both=False)
        st = await g.ev("()=>({cur:CUR.id,x:P.x,z:P.z,cy:P.cy,decks:TP.decks.length,walk:TP.walk.length,zips:TP.zips.map(z=>[z.from&&z.from.i,z.to&&z.to.i,+z.T.toFixed(2)]),signs:TP.signs.length,inter:CUR.inter.length})"); print('park state', st)
        # the signs and the ladder target
        t = await g.ev("()=>{P.x=-9;P.z=TP_Z+17.8;P.yaw=0;__run(2);const t=findTarget();return t?[t.icon,typeof t.label==='function'?t.label():t.label]:null;}"); print('easy sign target', t)
        await g.ev("()=>tpStart('easy')"); await g.step(12); await g.wait(400); await g.step(3)
        print('after start', await g.ev("()=>({x:+P.x.toFixed(2),z:+P.z.toFixed(2),cy:P.cy,last:TP.last&&TP.last.i,fading})"))
        await g.shot('park-easy-first-deck', both=False)
        for path in ():
            decks = await g.ev("(p)=>TP_COURSE[p].map((d,i)=>({i,b:!!d.b,zip:!!d.zip,fin:!!d.fin,h:d.h}))", path)
            for d in decks:
                if d['fin']: break
                if d['b'] or d['zip']: continue
                r = await g.ev(JUMP, {'path': path, 'i': d['i']}); print(path, json.dumps(r))
        # a fall: step off a deck
        f = await g.ev("""()=>{const d=TP.decks.find(q=>q.path==='easy'&&q.i===2);P.x=d.x;P.z=d.z;P.cy=d.h;P.jy=0;P.vy=0;TP.last=d;TP.px=P.x;TP.pz=P.z;const f0=(S.tp&&S.tp.falls)||0;tp();
          P.x=d.x+d.w/2+.6;let fr=0,minCy=9;for(;fr<200;fr++){__run(1);minCy=Math.min(minCy,P.cy||0);if(!fading&&fr>20&&TP.falling===0&&Math.abs((P.cy||0)-d.h)<.01&&Math.abs(P.x-d.x)<.1)break;}
          return {frames:fr,minCy,back:Math.abs(P.x-d.x)<.1&&Math.abs((P.cy||0)-d.h)<.01,falls:((S.tp&&S.tp.falls)||0)-f0,fading};}""")
        print('fall', f)
        # the zip line of the easy path
        z = await g.ev("""()=>{const Z=TP.zips[0];const d=Z.from;P.x=d.x;P.z=d.z;P.cy=d.h;P.jy=0;P.vy=0;TP.last=d;TP.px=P.x;TP.pz=P.z;P.x=Z.ax-(Z.bx-Z.ax)/Math.hypot(Z.bx-Z.ax,Z.bz-Z.az)*.9;P.z=Z.az-(Z.bz-Z.az)/Math.hypot(Z.bx-Z.ax,Z.bz-Z.az)*.9;__run(2);const t=findTarget();const lab=t?(typeof t.label==='function'?t.label():t.label):null;
          if(t)t.act();let fr=0;const ys=[];for(;fr<400&&P.ride;fr++){__run(1);if(fr%10===0)ys.push(+(P.cy||0).toFixed(2));}const on=tpDeckAt(P.x,P.z,P.cy||0);return {lab,frames:fr,ys,on:on&&on.i,to:Z.to&&Z.to.i,cy:P.cy,last:TP.last&&TP.last.i};}""")
        print('zip', z)
        await g.shot('park-after-zip', both=False)
        print('errors', g.errors[:3])
        await run.close(g)
asyncio.run(main())
