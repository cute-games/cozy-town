# Run 4 finish, pass 13: the school front at night (the photographer's night view): which car is near the camera, and where?
INFO = """const cp=camera.position,o=[];CARS.forEach((c,i)=>{const d=Math.hypot(c.x-cp.x,c.z-cp.z);if(d<6)o.push('car '+i+' at '+c.x.toFixed(1)+','+c.z.toFixed(1)+' '+d.toFixed(2)+' m from the camera, away '+c.away+', seen '+c.g.visible+', v '+c.v.toFixed(2));});'P '+P.x.toFixed(2)+','+P.z.toFixed(2)+' cam '+cp.x.toFixed(2)+','+cp.y.toFixed(2)+','+cp.z.toFixed(2)+' ride '+(P.ride&&P.ride.kind)+' sit '+!!P.sit+' | '+(o.join('; ')||'no car within 6 m')"""
VIEWS = [('school-night-1', "__goto('city');__setClock(null,21.5);wxForce('sun');P.x=-26.2;P.z=-45.2;P.yaw=Math.atan2(-(-25-P.x),-(-58-P.z));P.pitch=.08;" + INFO),
         ('school-night-2', INFO)]
