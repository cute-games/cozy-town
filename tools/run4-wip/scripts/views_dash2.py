# Run 4 finish, pass 10 (M-002): the dashes on the Tree Park's crown: shadows, the zip-line cables or the rope rails?
HARD = "__goto('treepark');__setClock(null,11.66);wxForce('sun');tpStart('hard');"
HIDE = lambda c: f"LOC.treepark.g.traverse(o=>{{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='{c}')o.visible=false;}});"
SHOW = "LOC.treepark.g.traverse(o=>{if(o.isMesh&&o.userData.pvHid){o.visible=true;}});"
VIEWS = [
 ('hard-base', HARD),
 ('hard-noshadow', HARD + "sun.castShadow=false;"),
 ('hard-nocable', "sun.castShadow=true;" + HARD + HIDE('5a5f8c')),
 ('hard-norails', HARD + HIDE('e8d7b0')),
]
