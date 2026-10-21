# Run 4 finish, pass 18 M-006: the fireworks frozen at one moment, with and without the sky's clouds (does a cloud 112 m away hide a burst 59 m away?)
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
FW1 = "__goto('city');__setClock(null,21.6);wxForce('sun');" + look(-16, 12.5, -22, 30, .5) + "updateCamera(0);__run(420);"
FREEZE = "(()=>{window.__T=FW.t;fwTick=function(){};FW.m.material.uniforms.tm.value=window.__T;for(const c of clouds)c.userData.sp0=c.userData.sp,c.userData.sp=0;return 'frozen at '+FW.t.toFixed(2);})()"
HIDE = "(()=>{for(const c of clouds)c.visible=false;return 'clouds hidden';})()"
SHOW = "(()=>{for(const c of clouds)c.visible=true;const m=clouds[0]&&clouds[0].children[0]&&clouds[0].children[0].material;return 'clouds shown; cloud material '+(m&&m.type)+' transparent '+(m&&m.transparent)+' depthTest '+(m&&m.depthTest)+' depthWrite '+(m&&m.depthWrite)+' renderOrder '+(clouds[0]&&clouds[0].renderOrder)+'/'+(clouds[0]&&clouds[0].children[0]&&clouds[0].children[0].renderOrder)+'; fireworks depthTest '+FW.m.material.depthTest;})()"
VIEWS = [('fw-live', FW1), ('fw-frozen', FREEZE), ('fw-no-clouds', HIDE), ('fw-clouds-again', SHOW)]
