# the white duck at the pond's middle seen from the photographer's pond spot (38.6,-32.6; pitch -.3), turned four ways round side-on
def V(k):
    return f"""(()=>{{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const D=LOC.city.ducks.filter(d=>d.pond===0);const w=D[1],o=D[0];for(const d of D){{d.wait=1e9;d.fed=0;d.via=null;}}
  w.x=36.2;w.z=-36.0;w.tx=w.x;w.tz=w.z;o.x=37.3;o.z=-36.9;o.tx=o.x;o.tz=o.z;P.x=38.6;P.z=-32.6;P.yaw=Math.atan2(-(w.x-P.x),-(w.z-P.z));P.pitch=-.3;
  const vy=Math.atan2(w.x-P.x,w.z-P.z),f=[vy+Math.PI/2,vy+Math.PI/2+.5,vy-Math.PI/2,vy-Math.PI/2-.5][{k}];w.face=f;w.g.rotation.y=f;}})()"""
VIEWS = [(f'eye-{k}', V(k)) for k in range(4)]
