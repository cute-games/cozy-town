VIEWS = [
 ('calendar', "closePanel();__goto('city');__setClock(null,11.3);wxForce('cloudy');__run(4);openPhone('cal');"),
 ('furniture', "closePanel();openPhone('furn');"),
 ('shop-pets', "closePanel();openShop('pets');"),
 ('delivery', "closePanel();setJob('delivery');dl().o=null;newOrder();__run(4);{const n=$('note');if(n)n.hidden=true;}"),
 ('flowers-door', "closePanel();setJob(null);__goto('flowers');__setClock(null,11);__run(2);P.pitch=innerWidth<innerHeight?-.08:.02;"),
 ('ducks', "__goto('city');wxForce('sun');P.x=33.9;P.z=-38.3;S.bag.bread=(S.bag.bread||0)+1;feedDucks(0);__run(90);const ds=LOC.city.ducks.filter(d=>d.pond===0);if(ds.length){const cx=ds.reduce((a,d)=>a+d.x,0)/ds.length,cz=ds.reduce((a,d)=>a+d.z,0)/ds.length;P.yaw=Math.atan2(-(cx-P.x),-(cz-P.z));P.pitch=-Math.atan2(1.3,Math.hypot(cx-P.x,cz-P.z));}JSON.stringify(ds.map(d=>[+d.x.toFixed(2),+d.z.toFixed(2),+d.g.rotation.y.toFixed(2),+Math.atan2(P.x-d.x,P.z-d.z).toFixed(2)]))"),
 ('stairs', "S.bighouse=true;S.home.xf=1;applyHouse();__goto('home');__run(4);P.x=LOC.home.ox-HOMEW+1.0;P.z=LOC.home.oz-1.2;P.yaw=Math.PI/2;P.pitch=0;__run(4);TARGET&&TARGET.icon"),
]
