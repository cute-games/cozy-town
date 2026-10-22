# Run 4 finish, f7 probes on a sideways iPhone (dark): the calendar on a Saturday in October, the Toy Store's awning, the costumes' colour dots
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
VIEWS = [
 ('calendar', "__goto('city');__setClock(null,11);openPhone('cal');"),
 ('east', "closePanel();__goto('city');__setClock(null,11.17);wxForce('sun');" + look(53, -25.5, 64, -31.5, .06)),
 ('costumes', "__goto('clothes');__setClock(null,19.5);const t=LOC.clothes.inter.find(q=>/shop|buy|clothes/i.test(typeof q.label==='function'?q.label():q.label||''));if(t)t.act();"),
]
