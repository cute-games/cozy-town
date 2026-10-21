# Run 4 finish, f15 (pass 18 M-018) before and after: the fountain shoot's start on a sideways phone (a) with a tall box in front of the family that
# blocks every clear view (the camera stays where it was, or takes the nearest spot where everyone fits), (b) with a grandma 1.5 m in front of the
# middle one (she steps out of a shoot: is she still counted as in the way?)
import runpy, os
V = runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'views_f15.py'))
SETUP, WALK, FIT = V['SETUP'], V['WALK'], V['FIT']
PRE = "tutEnd();closePanel();if(PHO.on&&ACT.ptbye)ACT.ptbye();setJob(null);__goto('city');__setClock(null,12);__run(2);"
BOX = "(()=>{" + PRE + "const b=new THREE.Mesh(new THREE.BoxGeometry(4,2.6,.2),new THREE.MeshBasicMaterial({color:'#888888'}));b.position.set(-22,1.3,13.2);b.updateMatrixWorld(true);CUR.g.add(b);window.__box=b;" + SETUP.replace("tutEnd();__goto('city');__setClock(null,12);", "") + "CUR.g.remove(window.__box);" + WALK + "return 'camera '+P.x.toFixed(2)+','+P.z.toFixed(2)+' pitch '+P.pitch.toFixed(3)+' (the script put it at -22,11.4)';})()"
GRAN = "(()=>{if(PHO.on&&ACT.ptbye)ACT.ptbye();" + PRE + "const q=GRAN.g[0];q.p.root.visible=true;q.p.root.position.set(-22,0,13.5);q.p.root.updateMatrixWorld(true);" + SETUP.replace("tutEnd();__goto('city');__setClock(null,12);", "") + WALK + "return 'camera '+P.x.toFixed(2)+','+P.z.toFixed(2)+' pitch '+P.pitch.toFixed(3);})()"
VIEWS = [('box-start', BOX), ('box-fit', FIT), ('gran-start', GRAN), ('gran-fit', FIT)]
