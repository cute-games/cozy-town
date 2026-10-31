# Model movements: preview kit (Model movements chat, updated 31 Oct 2026)

Makes the animated movement previews (img/moves2-* … img/moves7-*.gif) in the Main Book.

- Models: tools/compare.html from the book (PU[id].build). Copy the live file and swap its three.js CDN line for a local three.min.js r128 (npm three@0.128.0; cdnjs is blocked in the cloud). Always copy the newest compare.html (31 Oct: the old copy missed the vets and the riding people).
- rig.js: bakes a model into canonical space (faces +x, ground y=0). Legs (ground columns grown upward), knees, ankles (horse; people since 31 Oct), head, tail, arms/wings, a people rig (kind 'human'). RIG.pose(R,P): hip/knee/ankle per leg, head pitch/yaw/move, tail (tail move + swing now work together), arms + wings, spine wave, breathing, root pivot/squash, floor fix, blob shadow. RIG.gait: walk/trot/gallop/pace/hop/biped.
- Rigid legs (no mesh bending): RIG.make(id,o,kind,face,{rigid:true}). anim2.js mk() now passes this option on (before 31 Oct it was dropped).
- anim2.js: every clip (CLIPS2 sets: shared, sick, friends, riders, vet, cows, cowsG, chickens, …). Helpers for people: crouchP (knees, feet flat), handW/solveArm/placeReach (put a hand on a target), fixShadow.
- engine.js renders the labelled sheets. run9.js <sets>: frames to fr2/ (prints helper checks). mkchk.sh (36 frames), mk48.sh (48 frames), cowchk.sh (cows, 72 frames): GIFs (gif2/) + contact sheets (chk2/).
- Facing: game models face +z. People face +x after baking.
- Limits found: cow and chicken have no neck joint and no jaw; people arms have no elbow (a hand cannot reach the mouth or the floor).
