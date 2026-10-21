# Run 4 finish, f13 (pass 16's kept marks), before and after: the little pond's ducks over 6000 frames (5 game minutes) and 6 feedings, how
# often a duck's middle comes within 29 cm (body on the bud) or 34 cm of a lily flower; the white duck seen from the side, close
DUCKS = """(()=>{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const p={x:36.2,z:-36.2},F=[[-.75,.3],[.45,.9],[.75,-.6]];let n=0,on29=0,on34=0,minD=9;
  const D=LOC.city.ducks.filter(d=>d.pond===0);const look=()=>{for(const d of D){const m=Math.min(...F.map(([fx,fz])=>Math.hypot(d.x-p.x-fx,d.z-p.z-fz)));n++;if(m<.29)on29++;if(m<.34)on34++;if(m<minD)minD=m;}};
  for(let f=0;f<6000;f++){__run(1);look();}
  S.bag.bread=(S.bag.bread|0)+6;for(let k=0;k<6;k++){P.x=33.9+Math.cos(k)*.6;P.z=-38.3+Math.sin(k)*.6;feedDucks(0);for(let f=0;f<200;f++){__run(1);look();}}
  return 'duck-frames '+n+', middle within 29 cm of a flower: '+on29+', within 34 cm: '+on34+', nearest '+minD.toFixed(2)+' m';})()"""
SIDE = """(()=>{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const D=LOC.city.ducks.filter(d=>d.pond===0);const w=D.find(d=>d.g&&d.g.children.length&&D.indexOf(d)===1)||D[1];
  for(const d of D){d.wait=1e9;d.fed=0;d.via=null;}w.x=36.2;w.z=-36.2+.1;w.tx=w.x;w.tz=w.z;w.face=Math.PI/2;w.g.rotation.y=Math.PI/2;const o=D[0];o.x=36.2-1.0;o.z=-36.2-.9;o.tx=o.x;o.tz=o.z;
  P.x=36.2;P.z=-36.2+2.25;P.yaw=Math.atan2(-(w.x-P.x),-(w.z-P.z));P.pitch=-.42;})()"""
SIDE2 = """(()=>{const D=LOC.city.ducks.filter(d=>d.pond===0);const w=D[1];w.face=-Math.PI/2;w.g.rotation.y=-Math.PI/2;})()"""
VIEWS = [('ducks-frames', DUCKS), ('duck-side', SIDE), ('duck-side-2', SIDE2)]
