"""Stage 3, patch k part 7 (round-5 critic notes, the holiday spot): fireworks burst where you look, more often and bigger; Santa's coins
pop on the screen like every other reward (not a big blurry sign in your face under his words); the holiday tree's baubles sit on its
branches and its star glows at night; the bunnies' bows sit on their heads; a hunt egg's nest is soft straw."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))

# x1 fireworks: in front of you (within about 60 degrees of where you look), nearer, more often and bigger
ed(r"const a=rand(0,TAU),d=rand(40,70);FW.c.set([P.x+Math.cos(a)*d,rand(26,40),P.z+Math.sin(a)*d],FW.k*3);FW.t0[FW.k]=FW.t;FW.next=FW.t+rand(1.4,2.6);",
   r"const a=Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw))+rand(-1.05,1.05),d=rand(34,58);FW.c.set([P.x+Math.cos(a)*d,rand(24,36),P.z+Math.sin(a)*d],FW.k*3);FW.t0[FW.k]=FW.t;FW.next=FW.t+rand(.8,1.5);   /* (run 4, stage 3: where you look and more often: most bursts went off behind you) */")
ed(r"gl_PointSize=clamp(260.0/max(1.0,-mv.z),2.0,7.0)", r"gl_PointSize=clamp(360.0/max(1.0,-mv.z),2.5,9.0)")
# x2 Santa's coins pop on the screen like every other reward
ed(r"floatText('🪙 +'+n,P.x-Math.sin(P.yaw)*1.4,1.8,P.z-Math.cos(P.yaw)*1.4,{h:.6});",
   r"popText('+'+n+' 🪙','coin');")   # (run 4, stage 3: a big floating sign 1.4 m in front of you, blurry, under Santa's words)
# x3 the holiday tree: its baubles on the branches (half of each sat inside), its star glows (it was dark at night)
ed(r"for(let i=0;i<10;i++){const a=i*2.4,y=.35+i*.1,r=.42-i*.03;sph(g,.045,",
   r"for(let i=0;i<10;i++){const a=i*2.4,y=.35+i*.1,r=xmasProf(y)+.035;sph(g,.045,")
ed(r"function starOn(g,x,y,z,r,c){for(const ry of[0,Math.PI/2]){const m=new THREE.Mesh(starGeo(r,0,r*.22),mat(c||'#ffd45c'));",
   r"""/* the holiday tree's outline: its three cones' radius at a height (the furniture's own size; the town's big tree is it scaled up) */
function xmasProf(y){let r=0;for(const [cy,cr,ch] of [[.25,.5,.7],[.65,.4,.6],[1.0,.28,.5]])if(y>=cy&&y<=cy+ch)r=Math.max(r,cr*(1-(y-cy)/ch));return r;}
const STARM=new THREE.MeshBasicMaterial({color:'#ffd45c',fog:false});   /* ⭐ a star shines by itself (run 4, stage 3: the tree's star was dark at night) */
function starOn(g,x,y,z,r,c){for(const ry of[0,Math.PI/2]){const m=new THREE.Mesh(starGeo(r,0,r*.22),c?mat(c):STARM);""")
# x4 the bunnies' bows sit on their heads (they floated above the ears)
ed(r"const bw=new THREE.Group();bw.position.set(0,.5,.12);", r"const bw=new THREE.Group();bw.position.set(0,.31,.1);", 2)
# x5 a hunt egg's nest: soft straw tufts in a ring (green cones read as spikes)
ed(r"for(let k=0;k<6;k++){const a=k/6*TAU;cone(g,.1,.18,'#6fcf7a',e.x+Math.cos(a)*.24,y,e.z+Math.sin(a)*.24,{seg:5,ol:false});}   /* the nest */",
   r"for(let k=0;k<8;k++){const a=k/8*TAU;sph(g,.1,k%2?'#e2c27a':'#cfa95e',e.x+Math.cos(a)*.23,y+.05,e.z+Math.sin(a)*.23,{s:[1.35,.55,1],ry:-a,ws:6,hs:4,ol:false});}   /* the nest: straw tufts in a ring (run 4, stage 3: green cones read as spikes) */")

bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
