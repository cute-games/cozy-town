# Run 4 finish, f8: the fireworks at three moments
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
VIEWS = [
 ('fw1', "__goto('city');__setClock(null,21.6);wxForce('sun');" + look(-16, 12.5, -22, 30, .5) + "updateCamera(0);__run(420);"),
 ('fw2', "__run(17);"),
 ('fw3', "__run(23);"),
]
