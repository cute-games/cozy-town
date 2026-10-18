# Run 4, job 11: the other holidays (items 4, 5, 6): Valentine's February, the Easter month with the egg hunt, December with the tree and Santa at the Flower Corner;
# New Year fireworks, party hats and confetti; the school party on 1 Sep with the teacher's globe. Exact-match edits for edit.py.
import json
E = []

# ---- 1. the holiday months and the extra days ----
E.append(["/* 'halloween' 1 to 31 Oct (run 4: all of October, the owner's decision 17 Oct) · 'xmas' 1 Dec to 6 Jan · 'easter' Palm Sunday to Easter Monday · null on other days */\nfunction holidayOf(d){const y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate(),md=m*100+day;\n  if(m===10)return'halloween';if(md>=1201||md<=106)return'xmas';\n  const E=easterOf(y),t=new Date(y,m-1,day).getTime();if(t>=E.getTime()-7*864e5-36e5&&t<=E.getTime()+864e5+36e5)return'easter';return null;}",
"""/* 🗓️ run 4, job 11 (the owner's design 17 Oct): every holiday fills its whole month. 'halloween' all of October · 'valentine' all of February · 'easter' the month of Easter Sunday · 'xmas' 1 to 31 December · null in other months.
   New Year and the school party are days, not months: nyeFireworks (the nights of 28 to 31 Dec), nyeParty (31 Dec and 1 Jan: party hats and confetti), schoolParty (1 Sep) */
function holidayOf(d){const y=d.getFullYear(),m=d.getMonth()+1;
  if(m===10)return'halloween';if(m===12)return'xmas';if(m===2)return'valentine';
  if(m===easterOf(y).getMonth()+1)return'easter';return null;}
function nyeFireworks(d){return d.getMonth()===11&&d.getDate()>=28;}
function nyeParty(d){const m=d.getMonth(),day=d.getDate();return(m===11&&day===31)||(m===0&&day===1);}
function schoolParty(d){return d.getMonth()===8&&d.getDate()===1;}"""])

# ---- 2. HOL keeps the new things ----
E.append(["const HOL={cur:undefined,g:null,n:0,t:0,anim:[],cols:[],pieces:[],ghosts:[]};",
          "const HOL={cur:undefined,g:null,n:0,t:0,anim:[],cols:[],pieces:[],ghosts:[],eggs:null,eggG:null,eggN:0,petals:null,santa:null};"])
E.append(["ls=[];L.inter=L.inter.filter(t=>!t.hol);HOL.n=0;HOL.anim=[];HOL.pieces=[];HOL.ghosts=[];spookClear();}\n/* 🦇🐦🦋 ",
          "ls=[];L.inter=L.inter.filter(t=>!t.hol);HOL.n=0;HOL.anim=[];HOL.pieces=[];HOL.ghosts=[];HOL.eggs=null;HOL.eggG=null;HOL.eggN=0;HOL.petals=null;HOL.santa=null;spookClear();}\n" + open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j11_block.js', encoding='utf-8').read().rstrip('\n') + "\n/* 🦇🐦🦋 "])
E.append(["function holTick(dt){HOL.t+=dt;if(HOL.t<2)return;HOL.t=0;holCheck();}",
          "function holTick(dt){HOL.t+=dt;if(HOL.t<2)return;HOL.t=0;holCheck();extraCheck();}   /* 🎉 extraCheck: New Year and the school party (run 4, job 11) */"])

# ---- 3. December: the tree and its presents move to the Flower Corner, Santa beside them ----
E.append(["    const T=buildFurn('xmastree');T.scale.setScalar(4.2);T.position.set(-27.5,0,13.5);st.add(T);HOL.n++;holPiece('christmas tree',-27.5,13.5,0);{const c={cx:L.ox-27.5,cz:L.oz+13.5,cr:1.7};L.cols.push(c);HOL.cols.push(c);}",
          "    const XT=HOL_SPOT;const T=buildFurn('xmastree');T.scale.setScalar(4.2);T.position.set(XT[0],0,XT[1]);st.add(T);HOL.n++;holPiece('christmas tree',XT[0],XT[1],0);{const c={cx:L.ox+XT[0],cz:L.oz+XT[1],cr:1.7};L.cols.push(c);HOL.cols.push(c);}   /* 🎄 run 4, job 11: the big tree stands at the Flower Corner (the holiday spot) with its presents; Santa beside it */\n    santaBuild(L,G,XT);"])
E.append(["for(let i=0;i<10;i++){const a=i/10*TAU+.3,r=1.9+(i%2)*.4,x=-27.5+Math.cos(a)*r,z=13.5+Math.sin(a)*r,",
          "for(let i=0;i<10;i++){const a=i/10*TAU+.3,r=1.6+(i%2)*.3,x=XT[0]+Math.cos(a)*r,z=XT[1]+Math.sin(a)*r,"])
E.append(["for(let i=0;i<24;i++){const a=i/24*TAU;glows.push([-27.5+Math.cos(a)*(1.2-i%3*.25),1.3+i*.1,13.5+Math.sin(a)*(1.2-i%3*.25),.6,",
          "for(let i=0;i<24;i++){const a=i/24*TAU;glows.push([XT[0]+Math.cos(a)*(1.2-i%3*.25),1.3+i*.1,XT[1]+Math.sin(a)*(1.2-i%3*.25),.6,"])

# ---- 4. February before Easter; the egg hunt inside the Easter month ----
E.append(["  else if(h==='easter'){\n    const PC=",
          "  else if(h==='valentine'){valentineBuild(L,G,st,glows);}   /* 💗 run 4, job 11 */\n  else if(h==='easter'){\n    const PC="])
E.append(["garland(st,-38.0,1.9,8.3,-24.2,8.3,PC);garland(st,-19.8,1.9,8.3,-8.3,8.3,PC);garland(st,-84.6,3.7,-4.45,-84.6,4.45,PC);HOL.n+=3;}",
          "garland(st,-38.0,1.9,8.3,-24.2,8.3,PC);garland(st,-19.8,1.9,8.3,-8.3,8.3,PC);garland(st,-84.6,3.7,-4.45,-84.6,4.45,PC);HOL.n+=3;\n    eggHuntBuild(L,G);}   /* 🥚 run 4, job 11: the Easter Bunny and the 25 hunt eggs */"])

# ---- 5. the party hat: a hat kind, a colour, and a hidden hat on everyone that shows on 31 Dec and 1 Jan ----
E.append(["  if(k==='cap'){sph(h,.29,c,0,.45,0,{s:[1,.55,1],ws:14,hs:8,...o});box(h,.36,.04,.26,c,0,.45,.31,o);sph(h,.03,'#ffffff',0,.61,0,{ws:6,hs:5,ol:false});}",
          "  if(k==='cap'){sph(h,.29,c,0,.45,0,{s:[1,.55,1],ws:14,hs:8,...o});box(h,.36,.04,.26,c,0,.45,.31,o);sph(h,.03,'#ffffff',0,.61,0,{ws:6,hs:5,ol:false});}\n  else if(k==='party'){cone(h,.19,.46,c,0,.4,0,{seg:14,...o});for(let i=0;i<3;i++)for(let j=0;j<3;j++){const a=j/3*TAU+i*.7,rr=.19*(1-(i+.5)*.3);sph(h,.028,'#ffffff',Math.cos(a)*rr,.4+(i+.5)*.153,Math.sin(a)*rr,{ws:6,hs:5,ol:false});}sph(h,.06,'#ffd45c',0,.9,0,{ws:8,hs:6,ol:false});}   /* 🥳 the New Year party hat (run 4, job 11) */"])
E.append(["const HAT_DEF={cap:'#ff6b6b',", "const HAT_DEF={party:'#ff6b6b',cap:'#ff6b6b',"])
E.append(["function makePerson(L){\n  const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.scale.setScalar(L.scale||1);",
          """/* 🥳 run 4, job 11: on 31 Dec and 1 Jan everyone wears a party hat. Every person gets one at birth (hidden), in its own little baked group, and an own hat sits in a group too, so the two can swap at midnight without rebuilding anyone */
const PARTY={on:false,hats:[],own:[],cols:['#ff6b6b','#ffd45c','#7cc8ff','#5fd4b0','#b79cff','#ff9ec4']};try{PARTY.on=nyeParty(realDate());}catch(e){}
function makePerson(L){
  const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.scale.setScalar(L.scale||1);"""])
E.append(["  if(L.hat&&L.hat!=='none')hatFor(head,L.hat,L.hatc);if(L.glasses&&L.glasses!=='none')glassesFor(head,L.glasses,L.glc);",
          """  if(L.hat&&L.hat!=='none'){const hg=new THREE.Group();hg.userData.keep=1;head.add(hg);hatFor(hg,L.hat,L.hatc);bake(hg,false);if(!L.nohat){hg.visible=!PARTY.on;PARTY.own.push(hg);}}
  if(!L.nohat){const ph=new THREE.Group();ph.userData.keep=1;ph.visible=PARTY.on;head.add(ph);hatFor(ph,'party',PARTY.cols[PARTY.hats.length%PARTY.cols.length]);bake(ph,false);PARTY.hats.push(ph);}   /* 🥳 the New Year party hat (run 4, job 11) */
  if(L.glasses&&L.glasses!=='none')glassesFor(head,L.glasses,L.glc);"""])

# ---- 6. the bunny costume (the egg hunt's prize) ----
E.append(["const COSTUMES={cat:{c:'#8e8e9e',n:'Cat'},dog:{c:'#b07a52',n:'Dog'},ghost:{c:'#f4f2ff',n:'Ghost'},dino:{c:'#5fbf74',n:'Dinosaur'}};",
          "const COSTUMES={cat:{c:'#8e8e9e',n:'Cat'},dog:{c:'#b07a52',n:'Dog'},ghost:{c:'#f4f2ff',n:'Ghost'},dino:{c:'#5fbf74',n:'Dinosaur'},bunny:{c:'#ffffff',n:'Bunny'}};   /* 🐰 bunny: the Easter egg hunt's prize (run 4, job 11) */"])
E.append(["  else if(k==='dog'){for(const s of[-1,1])box(head,.11,.28,.06,D,s*.31,.06,-.06,{rz:s*.22,...o});",
          "  else if(k==='bunny'){for(const s of[-1,1]){sph(head,.075,C,s*.15,.62,-.04,{s:[1,2.8,.75],ws:8,hs:6,...o});sph(head,.04,'#ffb3c7',s*.15,.64,0,{s:[1,2.4,.5],ws:6,hs:5,ol:false});}sph(b,.085,C,0,.4,-.2,{ws:8,hs:6,ol:false});box(b,.26,.32,.02,'#ffe4ee',0,.6,.165,{ol:false});}   /* 🐰 long ears with pink insides, a fluffy tail, a soft tummy */\n  else if(k==='dog'){for(const s of[-1,1])box(head,.11,.28,.06,D,s*.31,.06,-.06,{rz:s*.22,...o});"])
E.append(["co_dino:{n:'Dinosaur costume',i:'🦖',p:180,co:'dino',oct:1}};",
          "co_dino:{n:'Dinosaur costume',i:'🦖',p:180,co:'dino',oct:1},co_bunny:{n:'Bunny costume',i:'🐰',p:0,co:'bunny',gift:1}};   /* 🐰 gift: not for sale, the Easter Bunny gives it (run 4, job 11) */"])
E.append(["${Object.entries(CLOTHES).filter(([k,c])=>!c.oct||HOL.cur==='halloween'||owns(k)).map(",
          "${Object.entries(CLOTHES).filter(([k,c])=>(!c.oct||HOL.cur==='halloween'||owns(k))&&(!c.gift||owns(k))).map("])
E.append(["if(c.oct&&HOL.cur!=='halloween'){toast('🎃 Costumes come back in October!',3);return;}",
          "if(c.gift){toast('🐰 This one is a prize: find all 25 Easter eggs!',3);return;}if(c.oct&&HOL.cur!=='halloween'){toast('🎃 Costumes come back in October!',3);return;}"])

# ---- 7. the globe, a little furniture piece the teacher gives ----
E.append(["  xmastree:{n:'Holiday tree',i:'🎄',p:300,w:1.0,d:1.0,b(g){",
          """  globe:{n:'Little globe',i:'🌍',p:0,w:.4,d:.4,b(g){cyl(g,.14,.17,.05,'#3d2c5e',0,0,0,{seg:12});cyl(g,.03,.03,.22,'#c9a24a',0,.05,0,{seg:6,ol:.01});
    const a=new THREE.Mesh(new THREE.TorusGeometry(.2,.018,6,20,Math.PI*1.2),mat('#c9a24a'));a.rotation.z=Math.PI*.4;a.position.set(0,.42,0);g.add(a);
    sph(g,.17,'#6fb7ff',0,.42,0,{ws:14,hs:10,ol:.012});for(const [x,y,z,s] of [[.09,.5,.12,.07],[-.1,.44,.11,.06],[.04,.33,.15,.05],[-.07,.52,-.1,.05],[.12,.38,-.1,.06],[-.12,.3,-.08,.05]])sph(g,s,'#6fcf7a',x,y,z,{s:[1.3,.8,1],ws:7,hs:5,ol:false});}},   /* 🌍 the school party's gift (run 4, job 11): not for sale */
  xmastree:{n:'Holiday tree',i:'🎄',p:300,w:1.0,d:1.0,b(g){"""])
E.append(["function tcTalk(){const o=S&&S.job==='teacher'&&S.tc&&S.tc.o;",
          "function tcTalk(){if(S&&schoolGift())return;   /* 🎈 1 Sep: the teacher's globe, once a year (run 4, job 11) */\n  const o=S&&S.job==='teacher'&&S.tc&&S.tc.o;"])

# ---- 8. the frame loop: fireworks and confetti ----
E.append(["psUpdate(dt);dayTick();holTick(dt);spookTick(dt);wxTick(dt);hsTick(dt);hsTutTick(dt);",
          "psUpdate(dt);dayTick();holTick(dt);fwTick(dt);confTick(dt);spookTick(dt);wxTick(dt);hsTick(dt);hsTutTick(dt);"])

json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j11.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
