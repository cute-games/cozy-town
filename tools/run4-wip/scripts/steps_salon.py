INFO = r"""(()=>{const cp=camera.position,o={P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2),+(P.pitch||0).toFixed(2)],cam:[+cp.x.toFixed(2),+cp.y.toFixed(2),+cp.z.toFixed(2)],cur:CUR.id,card:UI.open};
o.fr=FRIEND_ACTORS.map(f=>{const v=new THREE.Vector3();(f.p&&f.p.head?f.p.head:f.g).getWorldPosition(v);return [f.d.name,f.mode,f.loc,+f.x.toFixed(2),+f.z.toFixed(2),+v.distanceTo(cp).toFixed(2),f.g.visible];});
o.pets=PET_ACTORS.map(q=>{const v=new THREE.Vector3();q.g.getWorldPosition(v);return [q.d.name||q.d.kind,q.loc,+q.x.toFixed(2),+q.z.toFixed(2),+v.distanceTo(cp).toFixed(2),q.g.visible];});
const near=[];scene.traverse(m=>{if(!m.isMesh||!m.visible)return;let vis=true;for(let q=m;q;q=q.parent)if(q.visible===false){vis=false;break;}if(!vis||m.material.colorWrite===false)return;const v=new THREE.Vector3();m.getWorldPosition(v);const d=v.distanceTo(cp);if(d<1.0)near.push([m.name||m.geometry.type,+d.toFixed(2),m.material.color?'#'+m.material.color.getHexString():'']);});o.near=near.slice(0,12);return o;})()"""
STEPS = [
 ('who', "FRIEND_ACTORS.map(f=>[f.d.name,f.mode,f.loc])", False),
 ('job', "(()=>{S.job='hair';S.hsTut=1;__goto('salon');__setClock(null,12);return CUR.id;})()", False),
 ('wait', "(()=>{let n=0;const real=renderer.render;renderer.render=()=>{};try{for(let i=0;i<600&&!(HS.cust&&HS.cust.sat);i++){__run(1);n++;}}finally{renderer.render=real;}return {sat:!!(HS.cust&&HS.cust.sat),n,card:UI.open};})()", False),
 ('arrive', INFO, True),
 ('act', "(()=>{if(!(UI.open&&document.querySelector('#card [data-a=\"hsdone\"]'))){const t=LOC.salon.inter.find(t=>t.hs);if(t){P.x=t.x;P.z=t.z;t.act();}return 'acted '+!!t;}return 'card was open';})()", False),
 ('card', INFO, True),
]
