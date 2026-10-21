# Run 4 finish, pass 13: the two ducks on the town's little pond: how near do they come over many frames?
STEP = """(()=>{if(!window.__dk){__goto('city');P.x=34.6;P.z=-31.4;window.__dk={min:9,n:0};}const D=LOC.city.ducks.filter(d=>d.pond===0);for(let f=0;f<150;f++){__run(1);if(D.length>=2){const d=Math.hypot(D[0].x-D[1].x,D[0].z-D[1].z);if(d<window.__dk.min)window.__dk.min=d;window.__dk.n++;}}return 'pond ducks '+D.length+', frames '+window.__dk.n+', nearest '+window.__dk.min.toFixed(3)+' m';})()"""
VIEWS = [(f'ducks-{i}', STEP) for i in range(8)]
