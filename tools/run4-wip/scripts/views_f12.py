# Run 4 finish, f12 (pass 15's kept marks), before and after: a quest card with a shopping spree at the Ice Cream Shop (signed up, one step done),
# the photo shoot at the fountain from in front of the family (the frame, the score, the result card's photo), the clock chip on a cloudy
# night, the path through the Tree Park's gate in town
SPREE = """(()=>{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');const ic=SHOPS.icecream.items.find(id=>/cake/.test(itemInfo(id).n))||SHOPS.icecream.items[0];
  const k='trk:spree:'+[SHOPS.bakery.items[0],SHOPS.cafe.items[0],ic].join('|');S.q.list[0]=k;S.q.st=S.q.st||{};S.q.st[k]={s:'on',c:[1,0,0]};openPhone('quest');
  const li=[...document.querySelectorAll('#card .qsteps li')].map(e=>{const r=e.getBoundingClientRect(),t=e.querySelector('span'),tr=t?t.getBoundingClientRect():null,rects=t?[...t.getClientRects()].map(q=>Math.round(q.left)):[];return e.textContent.replace(/\\u00a0/g,'~')+' | lines '+Math.round(r.height/21)+' | text starts at x '+rects.join(',');});return li.join('\\n');})()"""
SHOOT = """(()=>{closePanel();tutEnd();__goto('city');__setClock(null,12);wxForce('sunny');setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};
  P.x=-22;P.z=11.4;P.yaw=Math.PI;P.pitch=.02;__run(2);ptSetup();closePanel();for(const m of PHO.group)m.pose='wave';const g=PHO.group,cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;
  P.x=cx+Math.sin(f)*4.4;P.z=cz+Math.cos(f)*4.4;P.yaw=f;P.pitch=innerWidth<innerHeight?-.17:-.04;})()"""
INFO = """(()=>{updateCamera(0);camera.updateMatrixWorld();const R=$('ptvf').getBoundingClientRect(),W=innerWidth,v=new THREE.Vector3(),g=PHO.group;let sx=0;for(const m of g){v.set(m.x,1,m.z).project(camera);sx+=(v.x+1)/2*W;}sx/=g.length;
  return 'frame x '+Math.round(R.left)+'..'+Math.round(R.right)+' of '+W+' (its middle '+Math.round((R.left+R.right)/2)+'), the family\\'s middle at x '+Math.round(sx)+'; score '+JSON.stringify(ptScore());})()"""
SNAP = "ACT.ptsnap();"
CHIP = """(()=>{closePanel();ACT.ptbye&&PHO.on&&ACT.ptbye();setJob(null);__goto('city');__setClock(null,21.5);wxForce('cloudy');__run(30);const a=skyIc();wxForce('sunny');__run(30);const b=skyIc();wxForce('cloudy');__setClock(null,12);__run(30);const c=skyIc();wxForce('rain');__setClock(null,21.5);__run(30);const d=skyIc();
  wxForce('cloudy');__setClock(null,21.5);P.x=-22;P.z=4;P.yaw=Math.PI;P.pitch=.35;return 'cloudy night '+a+', clear night '+b+', cloudy noon '+c+', rainy night '+d;})()"""
GATE = "(()=>{wxForce('sunny');__setClock(null,11);P.x=68.6;P.z=-38;P.yaw=Math.atan2(-(74-P.x),-(-38-P.z));P.pitch=.05;})()"
GATE2 = "(()=>{P.x=66;P.z=-36.4;P.yaw=Math.atan2(-(80-P.x),-(-38-P.z));P.pitch=-.12;})()"
VIEWS = [('quests', SPREE), ('shoot', SHOOT), ('shoot-info', INFO), ('shoot-result', SNAP), ('chip-night-cloudy', CHIP), ('gate-path', GATE), ('gate-path-2', GATE2)]
