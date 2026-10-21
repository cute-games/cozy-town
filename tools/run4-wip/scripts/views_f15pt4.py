# Run 4 finish, pass 18 M-018: the photographer's pose card on a sideways phone, after the same views as shots8 (the hair and photo tutorials first)
import runpy, os
H = os.path.dirname(os.path.abspath(__file__))
V = runpy.run_path(os.path.join(H, 'views_f15pt.py'))
SETUP, WALK, INFO, BOX = V['SETUP'], V['WALK'], V['INFO'], V['BOX']
CHK = r"""(()=>{const o=pt().o;return 'job '+S.job+' shoot '+(PHO.on?1:0)+' order '+(o?o.st:'-')+' zoom '+PHO.zoom+' ptvf '+(!$('ptvf').hidden)+' tut '+(typeof TUT!=='undefined'?JSON.stringify(TUT).slice(0,80):'?')+' P '+P.x.toFixed(2)+','+P.z.toFixed(2)+' pitch '+P.pitch.toFixed(3);})()"""
GO = "(()=>{" + SETUP + "window.__go=ptCamGo(ptSpotOf(pt().o).bgs.find(b=>b.id===PHO.bg));" + WALK + "ptPoseCard(0);return 'ptCamGo again: '+window.__go;})()"
VIEWS = [('tutorial-hair', "tutEnd();hsTutStart();"), ('tutorial-photo', "tutEnd();ptTutStart();"), ('tut-state', CHK),
         ('photo-pose-card', "tutEnd();" + SETUP + WALK + "ptPoseCard(0);"), ('pose-state', CHK), ('pose-info', INFO), ('pose-box', BOX)]
