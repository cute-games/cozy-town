# Run 4 finish, pass 10 (M-001, M-002): which part draws the dashes? The same view with the outlines, the shadows or one piece switched off.
EAST = "__goto('city');__setClock(null,11.33);wxForce('sun');P.x=53;P.z=-25.5;P.yaw=Math.atan2(-(64-P.x),-(-31.5-P.z));P.pitch=.06;"
HARD = "__goto('treepark');__setClock(null,11.66);wxForce('sun');tpStart('hard');"
OLOFF = "scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.side===THREE.BackSide&&o.material.color&&o.material.color.getHex()===OL.color.getHex())o.visible=false;});"
OLON = "scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.side===THREE.BackSide)o.visible=true;});"
SHOFF = "sun.castShadow=false;"
SHON = "sun.castShadow=true;"
VIEWS = [
 ('east-base', EAST),
 ('east-nool', EAST + OLOFF),
 ('east-noshadow', OLON + EAST + SHOFF),
 ('hard-base', SHON + HARD),
 ('hard-noshadow', HARD + SHOFF),
 ('hard-nool', SHON + HARD + OLOFF),
]
