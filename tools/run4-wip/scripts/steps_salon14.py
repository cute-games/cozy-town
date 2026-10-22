FIND = r"""(()=>{const real=renderer.render,gl=renderer.getContext(),dpr=renderer.getPixelRatio(),buf=new Uint8Array(4),pts=[[60,330],[40,310],[100,300]];
const rd=()=>pts.map(([x,y])=>{gl.readPixels(Math.round(x*dpr),Math.round((innerHeight-y)*dpr),1,1,gl.RGBA,gl.UNSIGNED_BYTE,buf);return '#'+[...buf.slice(0,3)].map(v=>v.toString(16).padStart(2,'0')).join('');});
const run=(hide)=>{let res=null;renderer.render=(sc,cam)=>{let was;if(hide){was=hide.visible;hide.visible=false;}real.call(renderer,sc,cam);res=rd();if(hide)hide.visible=was;};try{window.__t=Math.max(window.__t||0,performance.now())+50;frame(window.__t);}finally{renderer.render=real;}return [res,+P.yaw.toFixed(2),+P.pitch.toFixed(2),+PB.root.rotation.y.toFixed(2)];};
const out=[];for(let i=0;i<12;i++)out.push(run(null));for(let i=0;i<3;i++){out.push(['PBhid'].concat(run(PB.root)));out.push(run(null));}
const legs=[];PB.legs.forEach(l=>l.traverse(o=>{if(o.isMesh)legs.push('#'+o.material.color.getHexString()+(o.visible?'':'(hid)'));}));
const vis=[];PB.root.traverse(o=>{if(o.isMesh&&o.visible&&o.material!==SHADOW_ONLY){let leg=false;for(let q=o.parent;q;q=q.parent)if(PB.legs.includes(q))leg=true;if(!leg)vis.push('#'+(o.material.color?o.material.color.getHexString():'?')+':'+o.material.type);}});
return {frames:out,legs,nonLegVisible:vis,look:S.look};})()"""
STEPS = [
 ('job', "(()=>{S.job='hair';S.hsTut=1;__goto('salon');__setClock(null,12);return CUR.id;})()", False),
 ('wait', "(()=>{let n=0;const real=renderer.render;renderer.render=()=>{};try{for(let i=0;i<600&&!(HS.cust&&HS.cust.sat);i++){__run(1);n++;}}finally{renderer.render=real;}return {sat:!!(HS.cust&&HS.cust.sat),n,card:UI.open};})()", False),
 ('find', FIND, False),
]
