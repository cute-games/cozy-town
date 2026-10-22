# the white and the yellow duck close up: from the front, from the side, from behind and three-quarters behind (1.3 m, a little above)
def V(rel, pitch=-.32, d=1.3):
    return f"""(()=>{{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const D=LOC.city.ducks.filter(d=>d.pond===0);for(const q of D){{q.wait=1e9;q.fed=0;q.via=null;}}
  const w=D[1],y=D[0];w.x=36.2;w.z=-36.2;y.x=36.2+.55;y.z=-36.2+.15;for(const q of D){{q.tx=q.x;q.tz=q.z;q.face=0;q.g.rotation.y=0;}}
  const a={rel};P.x=36.4+Math.sin(a)*{d};P.z=-36.15+Math.cos(a)*{d};P.yaw=Math.atan2(-(36.4-P.x),-(-36.15-P.z));P.pitch={pitch};}})()"""
VIEWS = [('face-front', V('0')), ('face-side', V('Math.PI/2')), ('face-34back', V('Math.PI*.8')), ('face-back', V('Math.PI'))]
