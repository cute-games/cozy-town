MOVE = """(()=>{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const D=LOC.city.ducks.filter(d=>d.pond===0);const len=D.map(()=>0),stuck=D.map(()=>0);let prev=D.map(d=>[d.x,d.z]),apart=9;
  for(let f=0;f<6000;f++){__run(1);D.forEach((d,i)=>{const s=Math.hypot(d.x-prev[i][0],d.z-prev[i][1]);len[i]+=s;prev[i]=[d.x,d.z];});apart=Math.min(apart,Math.hypot(D[0].x-D[1].x,D[0].z-D[1].z));}
  const fed=[];S.bag.bread=(S.bag.bread|0)+3;for(let k=0;k<3;k++){P.x=33.9+Math.cos(k*2)*.6;P.z=-38.3+Math.sin(k*2)*.6;feedDucks(0);for(let f=0;f<120;f++)__run(1);fed.push(D.map(d=>Math.hypot(d.x-P.x,d.z-P.z).toFixed(2)+(d.wait>0?'w':'')).join('/'));}
  return 'swum in 5 min: '+len.map(v=>v.toFixed(1)+' m').join(', ')+'; nearest the two came: '+apart.toFixed(2)+' m; after each feeding (6 s) their distance to you: '+fed.join('  ');})()"""
VIEWS = [('ducks-move', MOVE)]
