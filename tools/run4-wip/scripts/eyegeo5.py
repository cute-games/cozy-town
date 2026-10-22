"""Run 4 finish, f13: the shine as a one-sided flat disc on the eye (seen only from the side it faces). For each tilt: from how many view
directions (elevation 0-55 every 5, round every 3 deg) a FAR eye's shine shows, and any shine (near or far) shows past the head's outline."""
import numpy as np
H=np.array([0,.33,.17])
def hits(Q,v,C,R):
    d=Q-C;b=np.dot(d,v);c=np.dot(d,d)-R*R;disc=b*b-c
    if disc<0:return None
    r=np.sqrt(disc);return (-b-r,-b+r)
u0=np.array([.583,.2915,.758]);u0/=np.linalg.norm(u0)
def parts(tilt,off,rad,s):
    u=u0*np.array([s,1,1]);E=H+.086*u;up=np.array([0,1,0])-np.dot([0,1,0],u)*u;up/=np.linalg.norm(up)
    n=np.cos(tilt)*u+np.sin(tilt)*up;return E,n,E+off*n
def look(tilt,off,rad,v):
    far=past=0
    for s in(-1,1):
        E,n,C=parts(tilt,off,rad,s)
        if np.dot(n,v)<=0:continue      # its back: not drawn
        a1=np.cross(n,[0,1,0]);a1/=np.linalg.norm(a1);a2=np.cross(n,a1)
        for a in np.linspace(0,2*np.pi,12,endpoint=False):
            for k in(0,.5,1):
                Q=C+rad*k*(np.cos(a)*a1+np.sin(a)*a2)
                h=hits(Q,v,H,.1)
                if h and h[1]>0:continue
                o=hits(Q,v,H,.12)
                if o and o[0]>0:continue
                e=hits(Q,v,E,.034)
                if e and e[1]>1e-4 and e[0]>-1e-4:continue
                if np.dot(E-H,v)<0:far+=1
                if np.linalg.norm((Q-H)-np.dot(Q-H,v)*v)>.12:past+=1
    return far,past
def scan(*p):
    a=b=t=0
    for el in np.radians(np.arange(0,56,5)):
        for az in np.radians(np.arange(0,360,3)):
            v=np.array([np.cos(el)*np.sin(az),np.sin(el),np.cos(el)*np.cos(az)]);t+=1;f,q=look(*p,v);a+=f>0;b+=q>0
    return a,b,t
for tilt in (20,30,40):
    for rad in (.011,.013):
        print('tilt %d, radius %.3f: a far shine shows from %d, a shine past the outline from %d, of %d'%((tilt,rad)+scan(np.radians(tilt),.035,rad)))
E,n,C=parts(np.radians(30),.035,.013,1);print('tilt 30: shine centre',np.round(C,4),'normal',np.round(n,4))
