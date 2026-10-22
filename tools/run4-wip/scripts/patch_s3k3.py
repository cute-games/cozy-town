"""Stage 3, patch k part 3: the friends' spots reach both ends of the fan and count as hidden only when one would really stand behind
another (by how wide a person looks at that distance); a passer-by or a friend right at the camera waits unseen for that moment."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))
ed(r"for(let a=-h;a<=h+1e-6;a+=.1)for(let r=2.4;r<=5.2;r+=.4){let sc=Math.abs(a-wa)*2+Math.abs(r-wr)*.6;",
   r"for(let i=0;i<=10;i++)for(let r=2.4;r<=5.2;r+=.4){const a=-h+h*i/5;let sc=Math.abs(a-wa)*2+Math.abs(r-wr)*.6;")   # (the steps of 0.1 never reached the fan's right end)
ed(r"const hid=(x,z)=>{const bx=Math.atan2(x-P.x,z-P.z);return got.some(g=>{const da=Math.atan2(g[0]-P.x,g[1]-P.z)-bx;return Math.abs(Math.atan2(Math.sin(da),Math.cos(da)))<.24;})?2.2:0;};",
   r"const hid=(x,z)=>{const bx=Math.atan2(x-P.x,z-P.z),r1=Math.hypot(x-P.x,z-P.z);return got.some(g=>{const da=Math.atan2(g[0]-P.x,g[1]-P.z)-bx,r2=Math.hypot(g[0]-P.x,g[1]-P.z);return Math.abs(Math.atan2(Math.sin(da),Math.cos(da)))<.3/Math.min(r1,r2)+.15/Math.max(r1,r2);})?2.2:0;};")   # (hidden = the far one's face behind the near one's body)
ed(r"const far=Math.hypot(this.x-camera.position.x,this.z-camera.position.z)>48;this.g.visible=CUR.id==='city'&&!far&&!ptInShot(this.x,this.z);",
   r"const dcam=Math.hypot(this.x-camera.position.x,this.z-camera.position.z),far=dcam>48;this.g.visible=CUR.id==='city'&&!far&&dcam>.6&&!ptInShot(this.x,this.z);   /* (you walked right into a passer-by: they wait unseen while the camera is inside them; run 4, stage 3) */")
ed(r"&&!(this.fan&&FAN.on&&dcam<.75)&&",
   r"&&dcam>(this.fan&&FAN.on?.75:.55)&&")
bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
