"""Run 4 finish, f13: for each placement, from how many view directions (elevation 0-55, every 3 deg round) a shine of an eye on the far side of the
head shows at all (over the outline ring or past it), and past the outline (floating). Near eyes show their shine by design."""
import numpy as np
H=np.array([0,.33,.17])
def hits(Q,v,C,R):
    d=Q-C;b=np.dot(d,v);c=np.dot(d,d)-R*R;disc=b*b-c
    if disc<0:return None
    r=np.sqrt(disc);return (-b-r,-b+r)
def look(eye,shine,v):
    u=np.cross(v,[0,1,0]);u=u/np.linalg.norm(u);w=np.cross(v,u);seen=past=0
    for s in(-1,1):
        E=np.array([s*eye[0],eye[1],eye[2]]);Sh=np.array([s*shine[0],shine[1],shine[2]])
        if np.dot(E-H,v)>0:continue   # a near eye
        for a in np.linspace(0,2*np.pi,16,endpoint=False):
            for k in(0,.4,.7,.9):
                Q=Sh+.012*(np.sqrt(1-k*k)*v+k*(np.cos(a)*u+np.sin(a)*w))
                h=hits(Q,v,H,.1)
                if h and h[1]>0:continue
                o=hits(Q,v,H,.12)
                if o and o[0]>0:continue
                e=hits(Q,v,E,.034)
                if e and e[1]>1e-4:continue
                seen+=1
                if np.linalg.norm((Q-H)-np.dot(Q-H,v)*v)>.12:past+=1
    return seen,past
def scan(eye,shine):
    a=b=t=0
    for el in np.radians(np.arange(0,56,5)):
        for az in np.radians(np.arange(0,360,3)):
            v=np.array([np.cos(el)*np.sin(az),np.sin(el),np.cos(el)*np.cos(az)]);t+=1;s,p=look(eye,shine,v)
            a+=s>0;b+=p>0
    return a,b,t
