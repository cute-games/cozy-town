Q = "JSON.stringify(S.home.items.filter(it=>it.f&&/bed/.test(it.t)).map(it=>[it.t,it.x,it.z,it.r]))+' P '+(P.x-LOC.home.ox).toFixed(2)+','+(P.z-LOC.home.oz-UPZ).toFixed(2)+' yaw '+P.yaw.toFixed(2)"
VIEWS = [
 ('beds-kit', "__goto('home');__run(4);P.x=LOC.home.ox+4.6;P.z=LOC.home.oz+UPZ+3.9;__run(4);" + Q),
 ('beds-side', "P.x=LOC.home.ox-4.0;P.z=LOC.home.oz+UPZ+1.0;P.yaw=Math.atan2(-(-4.0-(-4.0)),-(-4.0-1.0));P.pitch=-.45;__run(2);" + Q),
 ('beds-top', "P.x=LOC.home.ox-1.2;P.z=LOC.home.oz+UPZ-2.6;P.yaw=Math.PI/2;P.pitch=-.7;__run(2);" + Q),
]
