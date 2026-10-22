Q = ("(()=>{const out=[];const v=new THREE.Vector3();scene.traverse(o=>{if(!o.isMesh||!o.visible)return;let p=o,vis=true;while(p){if(p.visible===false){vis=false;break;}p=p.parent;}if(!vis)return;o.getWorldPosition(v);"
     "const d=Math.hypot(v.x+22,v.z-22);if(d<3.4&&v.y>-.2&&v.y<1.4){const bs=o.geometry&&(o.geometry.boundingSphere||(o.geometry.computeBoundingSphere(),o.geometry.boundingSphere));if(bs&&bs.radius<1.0){let n=o,nm='';while(n&&!nm){nm=n.name||'';n=n.parent;}"
     "out.push((o.material&&o.material.color?o.material.color.getHexString():'?')+'@'+v.x.toFixed(2)+','+v.y.toFixed(2)+','+v.z.toFixed(2)+' r'+bs.radius.toFixed(2)+' '+nm);}}});"
     "for(const w of WALKERS)if(Math.hypot(w.x+22,w.z-22)<5)out.push('WALKER '+w.x.toFixed(1)+','+w.z.toFixed(1)+' '+w.state+' vis '+w.g.visible);"
     "for(const p of PET_ACTORS)out.push('PET '+(p.d&&p.d.name)+' '+(p.loc)+' '+(+p.x).toFixed(1)+','+(+p.z).toFixed(1));"
     "return out.slice(0,60).join(' | ');})()")
def at(iso, h): return f"realDate=()=>new Date('{iso}');__setClock(null,{h});holCheck();__run(8);__goto('city');P.x=-22;P.z=12;P.yaw=Math.PI;P.pitch=-.1;__run(3);"
VIEWS = [
 ('h-day', at('2026-10-25T12:00:00', 12)), ('h-night', at('2026-10-25T20:00:00', 19.5)),
 ('xmas', at('2026-12-20T12:00:00', 12) + Q),
 ('xmas-side', "P.x=-17;P.z=17;P.yaw=Math.atan2(-(-22-P.x),-(22-P.z));P.pitch=-.35;__run(1);" + Q),
]
