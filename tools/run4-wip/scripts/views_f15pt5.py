# Run 4 finish, pass 18 M-018: where the feet are drawn if the start spot is not taken (the camera left where the script put it: -22, 11.4, pitch 0.02)
import runpy, os
H = os.path.dirname(os.path.abspath(__file__))
V = runpy.run_path(os.path.join(H, 'views_f15pt.py'))
SETUP, WALK, BOX = V['SETUP'], V['WALK'], V['BOX']
VIEWS = [('pose-card', "(()=>{" + SETUP + WALK + "ptPoseCard(0);})()"), ('fallback', "(()=>{P.x=-22;P.z=11.4;P.yaw=Math.PI;P.pitch=.02;})()"), ('fallback-box', BOX)]
