# Run 4 finish, pass 14: what is the thin dark strip at the bottom-right corner during a photo shoot?
JS = """(()=>{__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();if(!d.o)ptNew();const o=d.o;if(!o)return 'no booking';const sp=PT_SPOTS[o.spot];P.x=sp.at[0];P.z=sp.at[1]-1.2;__run(3);ptSetup();__run(5);
  const W=innerWidth,H=innerHeight,out=[];for(const [x,y] of [[W-30,H-3],[W-80,H-3],[W-120,H-2]]){const els=document.elementsFromPoint(x,y).slice(0,4).map(e=>{const r=e.getBoundingClientRect();return (e.id||e.className||e.tagName)+' ['+[r.left,r.top,r.width,r.height].map(Math.round).join(',')+'] '+getComputedStyle(e).visibility;});out.push(x+','+y+': '+els.join(' | '));}return out.join('\\n');})()"""
VIEWS = [('shoot-strip', JS)]
