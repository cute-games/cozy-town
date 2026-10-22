GO = "extraCheck();__goto('school');__setClock(null,12);__run(2);P.x=LOC.school.ox;P.z=LOC.school.oz+3.2;P.yaw=0;P.pitch=0;"
def cand(posters, pos):
    return ("const I=LOC.school;for(const o of I.g.children){if(Math.abs(o.position.y-1.7)<.01&&Math.abs(o.position.z+4.43)<.01&&Math.abs(o.position.x)>1&&Math.abs(o.position.x)<3)o.position.x=Math.sign(o.position.x)*%s;}" % posters +
            "if(SCH.gin&&SCH.gin.parent)SCH.gin.parent.remove(SCH.gin);const gi=new THREE.Group();I.g.add(gi);SCH.gin=gi;const C=['#ff6b6b','#ffd45c','#7cc8ff','#5fd4b0','#ff9ec4','#b79cff'];%s.forEach(([x,z],k)=>balloonBunch(gi,x,z,[4,1,2,5].map(j=>C[(j+k)%%6])));bake(gi,true);" % pos + GO)
VIEWS = [
 ('hall-now', GO + "SCH.on"),
 ('hall-A', cand('1.25', '[[-5.0,3.6],[5.0,3.6],[-2.45,-3.98],[2.45,-3.98]]')),
 ('hall-C', cand('1.9', '[[-5.0,3.6],[5.0,3.6],[-5.55,-4.0],[5.55,-4.0]]')),
 ('hall-D', cand('1.9', '[[-5.0,3.6],[5.0,3.6],[-2.8,-2.2],[2.8,-2.2]]')),
]
