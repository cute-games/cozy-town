# Run 4 finish, f7 probes on the iPad (sideways): the Toy Store's post and awning, the Tree Park's marker star, the pond's reeds, the bakery counter, the far name tags at the Pet Show
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const q of PET_ACTORS){const f=P.yaw;q.x=P.x+Math.sin(f)*2.5;q.z=P.z+Math.cos(f)*2.5;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<16){c.d+=c.total/2;carPlace(c);}"
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
VIEWS = [
 ('east', "__goto('city');__setClock(null,11.33);wxForce('sun');" + look(53, -25.5, 64, -31.5, .06) + WALK),
 ('east-far-end', "__goto('city');__setClock(null,11.33);wxForce('sun');" + look(56, -21, 60, -40, .1) + WALK),
 ('treepark-easy', "__goto('treepark');__setClock(null,11.66);tpStart('easy');"),
 ('ducks', "__goto('city');__setClock(null,11);P.x=33.9;P.z=-38.3;S.bag.bread=(S.bag.bread||0)+1;feedDucks(0);__run(90);const ds=LOC.city.ducks.filter(d=>d.pond===0);if(ds.length){const cx=ds.reduce((a,d)=>a+d.x,0)/ds.length,cz=ds.reduce((a,d)=>a+d.z,0)/ds.length;P.yaw=Math.atan2(-(cx-P.x),-(cz-P.z));P.pitch=-Math.atan2(1.3,Math.hypot(cx-P.x,cz-P.z));}"),
 ('bakery', "__goto('bakery');__setClock(null,11);__run(2);P.x-=Math.sin(P.yaw)*1.2;P.z-=Math.cos(P.yaw)*1.2;P.pitch=.02;const L=CUR;let n=0;for(const q of SHOPPERS)if(q.L===L){const sp=q.cfg.spots[n===0?2:0];q.i=n===0?2:0;q.next=-1;q.x=L.ox+sp[0];q.z=L.oz+sp[1];q.wait=60;n++;}for(const q of PET_ACTORS)if(q.loc===CUR.id){q.x=P.x+Math.sin(P.yaw)*1.4;q.z=P.z+Math.cos(P.yaw)*1.4;}"),
 ('show-from-fountain', "__goto('city');__setClock(null,12);wxForce('sun');" + look(-22, 9.0, -34, 21, .04) + WALK),
]
