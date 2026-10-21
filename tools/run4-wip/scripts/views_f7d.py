# Run 4 finish, f7 probes on a Saturday (the photographer's date): the far name tags at the Pet Show, from the fountain and in a photo shoot
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const q of PET_ACTORS){const f=P.yaw;q.x=P.x+Math.sin(f)*2.5;q.z=P.z+Math.cos(f)*2.5;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<16){c.d+=c.total/2;carPlace(c);}"
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
VIEWS = [
 ('show-from-fountain', "__goto('city');__setClock(6,12);wxForce('sun');" + look(-22, 9.0, -34, 21, .04) + WALK),
 ('photo-shoot', "__goto('city');__setClock(6,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};P.x=-22;P.z=11.4;P.yaw=Math.PI;P.pitch=.02;__run(2);ptSetup();" + WALK + "ptPoseCard(0);closePanel();for(const m of PHO.group)m.pose='wave';const g=PHO.group,cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;P.x=cx+Math.sin(f)*4.4;P.z=cz+Math.cos(f)*4.4;P.yaw=f;P.pitch=innerWidth<innerHeight?-.17:-.04;" + WALK),
 ('stage', "ACT.ptbye&&ACT.ptbye();setJob(null);closePanel();__goto('city');__setClock(6,12);wxForce('sun');" + look(-25.9, 10.5, -31.4, 20.4, .08)),
 ('calendar', "__goto('city');__setClock(6,11);openPhone('cal');"),
]
