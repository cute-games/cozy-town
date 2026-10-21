"""Run 4 finish, f13: the far eye's white shine seen OUTSIDE the head's outline (a dot floating past the black ring), by view direction
(elevation 0-55 deg, every 3 deg round): spheres head r .1 at (0,.33,.17), its outline hull r .12, eyes r .034, shines r .012."""
import numpy as np
H=np.array([0,.33,.17])
def hits(Q,v,C,R):
    d=Q-C;b=np.dot(d,v);c=np.dot(d,d)-R*R;disc=b*b-c
    if disc<0:return None
    r=np.sqrt(disc);return (-b-r,-b+r)
def floating(eye,shine,v):
    u=np.cross(v,[0,1,0]);u=u/np.linalg.norm(u);w=np.cross(v,u);n=0
    for s in(-1,1):
        E=np.array([s*eye[0],eye[1],eye[2]]);Sh=np.array([s*shine[0],shine[1],shine[2]])
        for a in np.linspace(0,2*np.pi,16,endpoint=False):
            for k in(0,.4,.7,.9):
                Q=Sh+.012*(np.sqrt(1-k*k)*v+k*(np.cos(a)*u+np.sin(a)*w))
                h=hits(Q,v,H,.1)
                if h and h[1]>0:continue
                o=hits(Q,v,H,.12)
                if o and o[0]>0:continue
                e=hits(Q,v,E,.034)
                if e and e[1]>1e-4:continue
                perp=np.linalg.norm((Q-H)-np.dot(Q-H,v)*v)
                if perp>.12:n+=1   # seen past the outline's edge
    return n
def scan(eye,shine):
    cnt=0;tot=0
    for el in np.radians(np.arange(0,56,5)):
        for az in np.radians(np.arange(0,360,3)):
            v=np.array([np.cos(el)*np.sin(az),np.sin(el),np.cos(el)*np.cos(az)]);tot+=1
            if floating(eye,shine,v):cnt+=1
    return cnt,tot
for nm,e,sh in (('before',(.06,.36,.248),(.066,.374,.274)),('f13 draft (x.94)',(.06,.358,.243),(.066,.371,.268)),('eye in at .086, shine inside the hull',(.050,.355,.235),(.0577,.3788,.2451))):
    print(nm,': a shine seen past the outline from',*scan(e,sh),'directions')
