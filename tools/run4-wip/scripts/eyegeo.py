"""Run 4 finish, f13: from which directions is a duck's FAR eye shine (the one on the side away from you) visible? Spheres: head r .1 at
(0,.33,.17) with its outline hull r .12 (back faces only), eyes r .034, shines r .012; view directions over the upper half (elevation 0-55 deg)."""
import numpy as np
H=np.array([0,.33,.17]);RH=.1;RO=.12
def seg_hits_sphere(Q,v,C,R):
    # the ray from Q toward the camera (direction v, s>0): does it pass through the sphere? returns the s of the far (exit) and near (entry) hits
    d=Q-C;b=np.dot(d,v);c=np.dot(d,d)-R*R;disc=b*b-c
    if disc<0:return None
    r=np.sqrt(disc);return (-b-r,-b+r)
def far_shine_visible(eye,shine,v):
    for s in(-1,1):
        E=np.array([s*eye[0],eye[1],eye[2]]);Sh=np.array([s*shine[0],shine[1],shine[2]])
        if np.dot(E-H,v)>0:continue   # this eye faces the camera: the near one
        vis=0
        # sample points on the shine's half facing the camera
        for a in np.linspace(0,2*np.pi,12,endpoint=False):
            for k in(0,.5,.85):
                u=np.cross(v,[0,1,0]);u=u/np.linalg.norm(u) if np.linalg.norm(u)>1e-6 else np.array([1,0,0]);w=np.cross(v,u)
                Q=Sh+.012*(np.sqrt(1-k*k)*v+k*(np.cos(a)*u+np.sin(a)*w))
                h=seg_hits_sphere(Q,v,H,RH)
                if h and h[1]>0:continue          # the head is in front of it
                o=seg_hits_sphere(Q,v,H,RO)
                if o and o[1]>0 and o[0]<0:continue  # inside the outline's hull: its back face between? (Q inside: exit toward the camera is the far face? no)
                if o and o[0]>0:continue          # the hull lies between Q and the camera: its far (back) face hides Q
                e=seg_hits_sphere(Q,v,E,.034)
                if e and e[1]>1e-4 and e[0]>-1e-4:continue   # its own eye in front
                vis+=1
        return vis
    return 0
def scan(eye,shine):
    n=tot=0;worst=0
    for el in np.radians(np.arange(0,56,5)):
        for az in np.radians(np.arange(0,360,3)):
            v=np.array([np.cos(el)*np.sin(az),np.sin(el),np.cos(el)*np.cos(az)])
            k=far_shine_visible(eye,shine,v);tot+=1
            if k:n+=1;worst=max(worst,k)
    return n,tot,worst
print('before: far shine visible from',*scan((.06,.36,.248),(.066,.374,.274)),'(directions, of all, most sample points seen)')
print('after:  far shine visible from',*scan((.06,.358,.243),(.066,.371,.268)))
