# Run 4 finish, f7 probes on an upright iPhone: the phone's job list, the Pet Show stage's far name tags
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
VIEWS = [
 ('phone-jobs', "__goto('city');__setClock(null,11);openPhone('msg','ro');ACT.rjob&&ACT.rjob();"),
 ('stage', "closePanel();__goto('city');__setClock(null,12);wxForce('sun');" + look(-25.9, 10.5, -31.4, 20.4, .08)),
]
