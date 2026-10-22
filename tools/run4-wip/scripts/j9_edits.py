# Run 4, job 9 (items 3, 11, 24, 19): the pond bridge goes, new trash, the Notepad switch. Exact-match edits for edit.py (applied after job 8 is committed).
import json
E = []
# ---- the pond bridge goes: the water is solid all round again, the ducks stay ----
E.append(["  buildBridge(L,st);\n", ""])
E.append(["  Object.assign(L.pondC,{lk:1,walk:[{ax:L.ox+BRG.x,az:L.oz+BRG.z-BRG.hl,ux:0,uz:1,len:BRG.hl*2,hw:.62}]});for(const a of[-1,1])for(const b of[-1,1])colC(L,BRG.x+.68*a,BRG.z+2.2*b,.1);   /* 🌉 the pond stays solid water, except the way over the bridge; its end posts are solid (set after the nature above, so every bush stays where it was) */\n",
          "  /* (the little bridge over the duck pond went in run 4, item 3: the pond is solid water all round again) */\n"])
E.append(["if(Math.abs(sx-BRG.x)<BRG.hw+sr*1.2&&brY(BRG.x,sz)-.17<.1+sr*.6)continue;   /* 🌉 no rim stone pokes into the bridge where it is low */", ""])
E.append(["const PONDS=[{x:36.2,z:-36.2,r:1.45,br:1},{x:69,z:69,r:6.4,dock:LAKEW}];", "const PONDS=[{x:36.2,z:-36.2,r:1.45},{x:69,z:69,r:6.4,dock:LAKEW}];"])
E.append(["function duckOk(i,x,z){const p=PONDS[i];if(Math.hypot(x-p.x,z-p.z)>p.r)return false;if(p.br&&Math.abs(x-BRG.x)<BRG.hw+.25&&Math.abs(z-BRG.z)>1)return false;",
          "function duckOk(i,x,z){const p=PONDS[i];if(Math.hypot(x-p.x,z-p.z)>p.r)return false;"])
E.append(["@between", "/* ---- 🌉 a little wooden arched bridge over the duck pond (the designer's wish)", "inter(L,{x:X,z:Z,r:1.25,icon:'🦆',label:'Feed the ducks',act:()=>feedDucks(0)});}",
          "/* ---- the little arched bridge over the duck pond went in run 4 (item 3): the pond is solid water all round, the ducks stay; brY stays for the friends' and pets' heights (always 0 now) ---- */\nfunction brY(x,z){return 0;}\nconst brAt=(loc,x,z)=>0;   /* how high someone stands at x,z in that place (nothing to climb in town any more) */"])
# ---- the trash: soda cans, crumpled paper, banana peels and coffee cups ----
E.append(["    const kind=k%3;if(kind===0)sph(g,.1,'#ffffff',0,.1,0,{ws:6,hs:5,ol:.015});else if(kind===1)cyl(g,.05,.05,.15,pick(['#ff6b6b','#7cc8ff']),0,.05,0,{rz:Math.PI/2,center:true,seg:10,ol:.015});else{box(g,.18,.03,.06,'#ffd84a',0,0,0,{ry:.5,ol:.012});box(g,.18,.03,.06,'#ffd84a',0,0,0,{ry:-.6,ol:.012});}",
          "    const kind=['can','paper','peel','cup'][k%4];g.userData.kind=kind;   /* 🥤📄🍌☕ run 4, item 11: soda cans, crumpled paper, banana peels and coffee cups */\n    if(kind==='can'){const c=['#ff6b6b','#7cc8ff','#7fdcb5','#ffd45c'][k%4^(k>>2)%4];cyl(g,.034,.034,.12,c,0,.034,0,{rz:Math.PI/2,ry:.4+k,center:true,seg:10,ol:.012});cyl(g,.03,.03,.012,'#c8cde0',.062*Math.cos(.4+k),.034,-.062*Math.sin(.4+k),{rz:Math.PI/2,ry:.4+k,center:true,seg:10,ol:false});}\n    else if(kind==='paper'){for(const [dx,dy,dz,r] of [[0,.06,0,.065],[.045,.05,.03,.045],[-.04,.045,.035,.04],[.01,.09,-.03,.035]])sph(g,r,'#f4f1ea',dx,dy,dz,{ws:5,hs:4,ol:.01});}\n    else if(kind==='peel'){cyl(g,.035,.03,.06,'#ffe27a',0,.015,0,{seg:7,ol:.01});for(let i=0;i<3;i++){const a=i*2.1+k;box(g,.045,.012,.14,'#ffd84a',Math.cos(a)*.08,.012,Math.sin(a)*.08,{ry:-a,rx:0,ol:.01});}}\n    else{cyl(g,.04,.03,.11,'#ffffff',0,0,0,{seg:10,ol:.012});cyl(g,.038,.038,.025,'#c98f5e',0,.045,0,{seg:10,ol:false});cyl(g,.043,.043,.014,'#3d2c5e',0,.11,0,{seg:10,ol:.01});}"])
# ---- ✏️ Notepad switch in Settings (default on; the notes are kept) ----
E.append(["const SET=Object.assign({look:1,sound:true,gfx:'nice'},", "const SET=Object.assign({look:1,sound:true,gfx:'nice',pad:true},"])
E.append(["    <div class=\"opt\"><span>✏️ Notepad</span><button class=\"btn ${PAD.del?'butter':'white'}\" data-a=\"padrest\"${PAD.del?'':' disabled'}>↩️ Last page</button></div>",
          "    <div class=\"opt\"><span>✏️ Notepad</span><span class=\"row\" style=\"margin:0\"><button class=\"btn ${SET.pad!==false?'mint':'white'}\" data-a=\"spad\" aria-pressed=\"${SET.pad!==false}\">${SET.pad!==false?'✏️ On':'Off'}</button><button class=\"btn ${PAD.del?'butter':'white'}\" data-a=\"padrest\"${PAD.del?'':' disabled'}>↩️ Last page</button></span></div>"])
E.append(["ACT.ssound=()=>{SET.sound=!SET.sound;saveSet();audioInit();openSettings();};",
          "ACT.ssound=()=>{SET.sound=!SET.sound;saveSet();audioInit();openSettings();};\nACT.spad=()=>{SET.pad=SET.pad===false;saveSet();dcardUpd(true);leftFit();openSettings();};   /* ✏️ the Notepad switch (run 4, item 24): off hides the notepad, on brings it back; the notes stay in their own storage */"])
E.append(["if($('pad').hidden!==on)$('pad').hidden=on;if(!on){DCARD_KEY", "{const ph=on||SET.pad===false;if($('pad').hidden!==ph)$('pad').hidden=ph;}if(!on){DCARD_KEY"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j9.json', 'w'), ensure_ascii=False)
print(len(E), 'edits (not applied)')
