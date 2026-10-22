# Run 4 finish, f8 probes: New Year's fireworks over the park (30 Dec, 21:40), and a photo shoot at the Pet Show stage on a Saturday (the judges)
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
VIEWS = [
 ('fireworks', "__goto('city');__setClock(null,21.6);wxForce('sun');" + look(-16, 12.5, -22, 30, .5) + "updateCamera(0);__run(420);"),
]
