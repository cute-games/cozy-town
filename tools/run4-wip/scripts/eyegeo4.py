"""Run 4 finish, f13: search the shine's place on the eye (eye centre .086 from the head's middle, shine .027 from the eye's centre): never
past the head's outline, shown from the fewest view directions from behind; coarse grid (elevation 0-55 every 10, round every 6 deg)."""
import numpy as np, runpy
L=runpy.run_path('/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/eyegeo3_lib.py')
H=L['H'];look=L['look']
def scan(eye,shine):
    a=b=t=0
    for el in np.radians(np.arange(0,56,10)):
        for az in np.radians(np.arange(0,360,6)):
            v=np.array([np.cos(el)*np.sin(az),np.sin(el),np.cos(el)*np.cos(az)]);t+=1;s,p=look(eye,shine,v);a+=s>0;b+=p>0
    return a,b,t
u=np.array([.583,.2915,.758]);u/=np.linalg.norm(u);E=H+.086*u
up=np.array([0,1,0])-np.dot([0,1,0],u)*u;up/=np.linalg.norm(up);side=np.cross(up,u)
best=[]
for t in np.radians([20,35,50,65]):
    for p in np.radians([-90,-45,0,45,90,135,180]):
        d=np.cos(t)*u+np.sin(t)*(np.cos(p)*up+np.sin(p)*side);Sh=E+.027*d
        if np.linalg.norm(Sh-H)>.1075:continue
        a,b,tot=scan(tuple(E),tuple(Sh))
        best.append((b,a,round(np.degrees(t)),round(np.degrees(p)),tuple(np.round(Sh,4))))
best.sort()
for r in best[:8]:print(r)
print('E',np.round(E,4))
