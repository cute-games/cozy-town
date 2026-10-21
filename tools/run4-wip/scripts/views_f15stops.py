# Run 4 finish, pass 18 M-004: the grandmas' stop spots, and which are within 4 m of the photographer's town spots
SPOTS = r"""(()=>{closePanel();__goto('city');__run(2);const out=[];for(const s of GRAN_STOPS){const sp=s.spot;if(!sp)continue;const d=Math.hypot(sp[0]+10,sp[1]-4),d2=Math.hypot(sp[0]+14.5,sp[1]-2);out.push(s.id+' '+sp.map(v=>v.toFixed(1)).join(',')+(d<4?' NEAR house-paint spot ('+d.toFixed(1)+' m)':'')+(d2<4?' NEAR phone spot ('+d2.toFixed(1)+' m)':''));}return out.join('\n');})()"""
VIEWS = [('stops', SPOTS)]
