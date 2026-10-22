GO = "extraCheck();closePanel();__goto('school');__setClock(null,12);__run(2);P.x=LOC.school.ox;P.z=LOC.school.oz+3.2;P.yaw=0;P.pitch=0;"
VIEWS = [
 ('hall', GO + "SCH.on"),
 ('flowers-door', "closePanel();__goto('flowers');__setClock(null,11);__run(2);P.pitch=innerWidth<innerHeight?-.08:.02;"),
 ('hair-sits', "closePanel();setJob('hair');S.hsTut=1;S.intro=1;__goto('salon');__setClock(null,11);HS.cust=null;HS.wait=0;__run(260);(document.querySelector('.pop')?'POP '+document.querySelector('.pop').textContent:'no pop')+' card '+!!document.querySelector('#card [data-a=\"hsdone\"]')"),
 ('booking', "closePanel();setJob('photo');S.ptTut=1;const d=pt();d.o=null;d.done=0;ptNew();$('note').innerText.replace(/\\n/g,' ')"),
]
