"""Stage 3, REPORTER: the glitch entries of pass 1 (G4-002 onward), each grouping the viewer marks the double-checker kept
(stage3-dc/merged.json) by their cause, with the pass-1 picture as "before" and the pass-2 picture of the same spot as "after"
(filled in when stage3-p2/ exists). G4-001 (the Easter boot) is already in glitches.json and stays first.
usage: python3 mkglitches.py  -> rewrites glitches.json (keeps G4-001)"""
import json, os, re
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
merged = json.load(open(f'{S}/stage3-dc/merged.json'))
by_id = {m['id']: m for m in merged}
def pic(mark_id):
    m = by_id[mark_id]; f = m['file']
    for d in ('stage3-shots', 'stage3-extra', 'stage3-retake1', 'stage3-kit'):
        p = f'{S}/{d}/shots/{f}'
        if os.path.exists(p): return p
    return None
def after_of(mark_id):
    """the pass-2 picture of the same spot, device and theme"""
    m = by_id[mark_id]; f = m['file']
    for d in ('stage3-p2c', 'stage3-p2', 'stage3-p2b'):
        mp = f'{S}/{d}/map.json'
        if not os.path.exists(mp): continue
        for e in json.load(open(mp)):
            if not e.get('file'): continue
            if f.startswith('s3'):
                spot = re.sub(r'^.*?_\d{3}_', '', f)[:-4]; prof, theme = m['file'].split('_')[1], m['file'].split('_')[2]
                if e['name'] == spot and e['prof'] == prof and e['theme'] == theme: return f'{S}/{d}/shots/{e["file"]}'
    return None
# (id suffix, marks, place, device, what, bad, status, fix, check)
G = [
 ('002', ['M-013','M-043','M-110','M-113','M-121','M-129','M-131'], 'the photographer job: the shoot', 'every device',
  "The player's own pets (and following friends) walked into every photo: they stood between the camera and the family with their big name tags, and ended up in the finished picture.", 2, 'fixed',
  'During a shoot your pets and the friends who follow you wait out of the picture; they come back when the shoot ends. (The first fix hid them once and their every-frame visibility rule showed them again: pass 2 caught it, the rule itself now keeps them out.)', 'N25 and N3 pass; the pass-2 retake of the shoot shows the family alone.'),
 ('003', ['M-044','M-073','M-075','M-078','M-107','M-108','M-112','M-120','M-122','M-123','M-128','M-130','M-132'], 'the photographer job: the viewfinder frame', 'every device, worst on iPhone sideways',
  'The dashed frame was drawn over the HUD: through the coin, apple and clock chips (they looked struck out), the corner map, the job box and the notepad.', 2, 'fixed',
  'The frame starts under the chips and stops above the photo bar on an upright phone; the corner map, notepad and job box step aside during a shoot; the score uses the frame as it is really drawn.', 'N25 passes with the new frame.'),
 ('004', ['M-012','M-042','M-074'], 'the photographer job: the pose card', 'iPad and phones sideways',
  "The pose card opened in the middle-bottom and covered the photo bar (the 🏞️ background chip and the − button) and, on a phone, the hint and the Snap! button.", 2, 'fixed',
  'On a wide screen the pose card sits at the left, the family in the middle and the photo bar at the right stay in view.', 'pass-2 pose-card pictures.'),
 ('005', ['M-015','M-045','M-076','M-111'], 'the photographer job: the result card', 'every device, worst on iPhone sideways',
  "The photo bar, the frame and the job box stayed on screen behind the result card, and on a short screen the card's '📸 Mia' name tab was pushed off the top.", 2, 'fixed',
  'The frame and the bar go the moment the photo is taken; the name tab sits inside the card; the photo is at most 38% of the screen height.', 'pass-2 result pictures.'),
 ('006', ['M-054','M-063','M-055','M-062','M-109'], 'the photographer job on an upright phone', 'iPhone upright',
  "The photo bar was 192 px wide ('the fou…'), the notepad and the job box covered a family member, and the hint toast sat on the family's heads.", 2, 'fixed',
  'On an upright phone the bar spans the width; the side boxes hide during a shoot; the toast moves under the chips.', 'pass-2 upright-phone shoot picture.'),
 ('007', ['M-061'], 'the photographer job on an upright phone: the pose step', 'iPhone upright', "The hint toast cut the corner map's palette badge in half.", 1, 'fixed',
  'The toast moves under the chips during a shoot (the map hides then too).', 'pass 2.'),
 ('008', ['M-011','M-041','M-069','M-106','M-119','M-127'], 'the party invitation', 'every device',
  "The invitation came twice at once: a message card ('…is hosting a party! Go check it out.') and the card with the two buttons on top of it, the message cut on both sides.", 2, 'fixed',
  "Only the card with the buttons shows (it carries the host's name); the second message is gone. The kit's N39 now reads the card.", 'N39 passes.'),
 ('009', ['M-052','M-053'], 'the party invitation and the dance-off card', 'iPhone upright', 'The cards sat over the apple chip, the clock chip and the corner map.', 1, 'fixed',
  'On an upright phone the two cards sit 150 px from the top, under the chips.', 'pass 2.'),
 ('010', ['M-064'], 'the dance-off', 'iPhone upright', "The score bar sat on the apple chip.", 1, 'fixed', 'While dancing on an upright phone the chips hide (the score bar has coins and faces).', 'pass 2.'),
 ('011', ['M-050','M-118'], "the house colour card: 'Pick any colour'", 'every device', 'The slider was a plain blue browser slider with a 14 px thumb and nothing showed the colour the house has now.', 2, 'fixed',
  'A rainbow slider with a 44 px white thumb and a "Your house now" swatch that follows every change.', 'N34 passes; probe picture.'),
 ('012', ['M-036','M-037','M-038','M-040','M-068','M-097','M-099','M-101','M-103','M-105','M-049','M-060'], "the cards' scroll-down arrow", 'every device',
  "The little ⬇ arrow of a long card was 38 px, sat half outside the card's right edge over the mint ⬆ button, and on the settings card on top of the 'Bring my pets to…' button.", 1, 'fixed',
  "The arrow is 46 px and sits on the card's bottom edge, under the words and buttons.", 'pass 2.'),
 ('013', ['M-006','M-035','M-047','M-057','M-087','M-115','M-126'], "the phone: Rosie's chat and job list", 'every device',
  "The chat header (back button, Rosie, the coin chip) scrolled away under the phone's top when the chat was long, its top cut.", 1, 'fixed', 'The header sticks to the top of the phone screen.', 'pass 2.'),
 ('014', ['M-058'], "the phone: Rosie's job cards", 'phones', 'The job descriptions were 11 px on a narrow screen.', 1, 'fixed', '12.5 px.', 'pass 2.'),
 ('015', ['M-066','M-094'], 'the big map', 'iPhone sideways', 'The 📍 Me, + and − buttons sat on the map and cut the Duck Pond and Tree Park labels.', 2, 'fixed',
  'On a phone held sideways the three buttons move up into the title row.', 'N26 passes; pass 2.'),
 ('016', ['M-095'], 'the big map', 'iPhone sideways', "The 'Tap a place to see the way there!' bar lies over the bottom row of the map.", 1, 'not a glitch', 'By design: the map pans by dragging, the bar is the map\'s hint.', ''),
 ('017', ['M-017','M-018','M-019','M-021','M-023','M-025','M-046'], 'the Pet Show stage', 'every device', "A balloon bunch stood in front of the stage's sign: 'Every Saturday!' read 'Saturda' or 'Saturday!' and the trophy was half hidden.", 1, 'fixed',
  "Both balloon bunches stand at the stage's front corners.", 'probe picture; pass 2.'),
 ('018', ['M-014','M-016','M-020','M-022','M-024'], 'the Pet Show judges', 'every device', "The three judges' name tags sat at one height in a row and piled up into one unreadable jumble from the square.", 1, 'fixed',
  'The three tags hang at three heights.', 'pass 2.'),
 ('019', ['M-001','M-124'], 'the Pet Show corner: bunting', 'every device', 'The Halloween bunting pennants and the stage pennants were paper-thin: seen edge-on they looked like flat slivers floating over the food truck and sticking out of the stage posts.', 2, 'fixed',
  'Every pennant is thicker (a flag that reads as a flag from any side).', 'N32 passes; pass 2.'),
 ('020', ['M-002','M-125','M-134','M-135','M-080'], "the grandmas' speech bubbles", 'every device, worst on phones', "A grandma's bubble sat right behind her head: her bun or hair hid a word, and on a phone the letters were 7 px.", 2, 'fixed',
  'The bubble floats higher (above the bun) and is a quarter bigger.', 'N24 passes; pass 2.'),
 ('021', ['M-003','M-027'], 'the Tree Park: the tall trees', 'every device', 'A crown seen from its shady side was a flat muddy olive, like a dead tree among the bright ones.', 1, 'fixed',
  "The park's crowns keep a glow of their own colour on the shady side (a little emissive light).", 'N37 passes; pass 2.'),
 ('022', ['M-004','M-032'], 'inside the fire station', 'every device', 'The fire bell was a yellow ball floating beside the sign with nothing holding it.', 2, 'fixed', 'A red plate and a short rod hold the bell to the wall.', 'pass 2.'),
 ('023', ['M-005'], 'the Pet Shop upstairs', 'every device', "The button said 'Adopt a owl'.", 1, 'fixed', "'Adopt an owl' (a / an by the first letter).", 'N28 passes.'),
 ('024', ['M-030'], 'the library', 'every device', 'A slit of bare wall showed between the two middle bookcases.', 1, 'fixed', 'The four bookcases touch.', 'pass 2.'),
 ('025', ['M-033'], 'my house, the upper floors', 'every device', 'The back-wall windows of floors 2 to 6 were unevenly spaced.', 1, 'fixed', 'Four windows, evenly spaced (also for the wide house).', 'N34 passes; pass 2.'),
 ('026', ['M-079','M-136'], 'the Flower Corner gate', 'every device', 'A pavement tree stood right in front of the open gate and hid it and the start of the stepping stones.', 2, 'fixed', 'That tree stands 3 m further west.', 'pass 2.'),
 ('027', ['M-139'], 'the classroom', 'iPad', "A kid's name tag covered the tag of the kid behind.", 2, 'fixed', 'Name tags and bubbles step apart on screen (the same rule the football kids had since night 3, now also for friends and classroom kids).', 'teacher stage of the full check.'),
 ('028', ['M-142','M-144','M-145'], 'the friends who follow you', 'every device', "When the four friends gathered, one stood behind another and the front one's tag covered the other's.", 2, 'fixed', 'Their tags step apart on screen.', 'N3 passes.'),
 ('029', ['M-140','M-141'], 'the designer job: the new-client message', 'iPad', "The '+20 🪙' coin pop and the 'Knock knock!' card landed on the message card and hid its lines.", 2, 'fixed', 'While a message card is up, the coin pop and the knock card keep under it.', 'pass 2 / the full check.'),
 ('030', ['M-155'], 'the spooky path: a scare', 'iPad', "The 'BOO! 👻' words floated 2.1 m up, above the top of the screen when the ghost was close.", 2, 'fixed', 'The words float at eye height.', 'N19 of the full check.'),
 ('031', ['M-143'], 'October: the little ghosts', 'iPad', 'A little ghost drifted right into the camera and filled a third of the view for a moment.', 1, 'open', 'Not changed: the ghosts drift where they drift; walking on takes you past one. Written down for the owner.', ''),
 ('032', ['M-147'], 'the park by the food truck', 'iPad', "Flat yellow bars seemed to stick out of the truck's wheels.", 1, 'not a glitch', "Looked at: they are the park's butterflies (flat cartoon wings) flying past the wheels; a wing seen edge-on is a bar. The food truck itself passes N32.", ''),
 ('033', ['M-039','M-067','M-070','M-071','M-072','M-084','M-085','M-086','M-088','M-089','M-090','M-091','M-092','M-093','M-096','M-098','M-100','M-102','M-104'], 'cards and the phone on a short screen', 'iPhone sideways (and the Pet Shop card on iPad)',
  'A tall card, a tutorial card or the phone covers the HUD chips and buttons behind it.', 1, 'not a glitch', 'By design: a card or the phone takes the screen while it is open (the HUD behind is dimmed and cannot be tapped); on a 390-px-tall screen there is no room beside it.', ''),
]
old = json.load(open(f'{S}/glitches.json', encoding='utf-8'))
out = [g for g in old if g['id'] == 'G4-001']
for suf, marks, place, device, what, bad, status, fix, check in G:
    before = next((pic(m) for m in marks if pic(m)), None); after = next((after_of(m) for m in marks if after_of(m)), None)
    out.append(dict(id='G4-' + suf, place=place, device=device, what=what + f" (viewer marks {', '.join(marks)})", bad=bad, found_by='PHOTOVIEWER + DOUBLE-CHECKER (pass 1)', fix=fix, before=before, after=after, status=status, check=check))
json.dump(out, open(f'{S}/glitches.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
used = {m for g in G for m in g[1]}; kept = {m['id'] for m in merged if m['verdict'] == 'KEEP'}
print(len(out), 'entries;', 'kept marks not in any entry:', sorted(kept - used))
