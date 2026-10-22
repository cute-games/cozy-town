DBG = """(()=>{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const p={x:36.2,z:-36.2},F=[[-.75,.3],[.45,.9],[.75,-.6]];const D=LOC.city.ducks.filter(d=>d.pond===0);const ev=[];let prev=D.map(d=>[d.x,d.z]);
  const look=(f,tag)=>{D.forEach((d,i)=>{const m=Math.min(...F.map(([fx,fz])=>Math.hypot(d.x-p.x-fx,d.z-p.z-fz)));if(m<.29&&ev.length<12)ev.push(tag+' f'+f+' duck'+i+' at '+(d.x-p.x).toFixed(2)+','+(d.z-p.z).toFixed(2)+' m '+m.toFixed(2)+' prev '+(prev[i][0]-p.x).toFixed(2)+','+(prev[i][1]-p.z).toFixed(2)+' tgt '+(d.tx-p.x).toFixed(2)+','+(d.tz-p.z).toFixed(2)+' fed '+d.fed.toFixed(1)+' wait '+d.wait.toFixed(1)+' okNow '+duckOk(0,d.x,d.z));prev[i]=[d.x,d.z];});};
  for(let f=0;f<6000;f++){__run(1);look(f,'walk');}
  S.bag.bread=(S.bag.bread|0)+6;for(let k=0;k<6;k++){P.x=33.9+Math.cos(k)*.6;P.z=-38.3+Math.sin(k)*.6;feedDucks(0);for(let f=0;f<200;f++){__run(1);look(f,'fed'+k);}}
  return ev.join('\\n')||'none';})()"""
VIEWS = [('dbg', DBG)]
