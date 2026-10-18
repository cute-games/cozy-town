"""Stage 3, REPORTER, pass 2: the glitch entries G4-034 onward, grouping the pass-2 viewer marks the double-checkers kept
(stage3-dc2/merged.json) by cause; "before" = the pass-2 picture, "after" = the pass-3 picture of the same spot (when stage3-p3 exists).
usage: python3 mkglitches2.py  -> appends to glitches.json (replacing any G4-034+ entries already there)"""
import json, os, re
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
merged = json.load(open(f'{S}/stage3-dc2/merged.json')); by_id = {m['id']: m for m in merged}
def pic(mid):
    m = by_id.get(mid)
    if not m: return None
    f = m['file']
    for d in ('stage3-p2c', 'stage3-p2', 'stage3-p2b', 'stage3-kit2'):
        p = f'{S}/{d}/shots/{f}'
        if os.path.exists(p): return p
    return None
def after_of(mid):
    m = by_id.get(mid)
    if not m: return None
    f = m['file']
    if f.startswith('kit2-'):
        key = f[5:-4]
        for d in ('stage3-kit3',):
            mp = f'{S}/{d}/map.json'
            if os.path.exists(mp):
                for e in json.load(open(mp)):
                    if e.get('file') and e['name'].endswith(key): return f'{S}/{d}/shots/{e["file"]}'
        return None
    spot = re.sub(r'^.*?_\d{3}_', '', f)[:-4]; prof, theme = f.split('_')[1], f.split('_')[2]
    for d in ('stage3-p3', 'stage3-p3b'):
        mp = f'{S}/{d}/map.json'
        if not os.path.exists(mp): continue
        for e in json.load(open(mp)):
            if e.get('file') and e['name'] == spot and e['prof'] == prof and e['theme'] == theme: return f'{S}/{d}/shots/{e["file"]}'
    return None
# (id suffix, marks, place, device, what, bad, status, fix, check)
G = [
 ('034', ['M-007','M-011','M-028','M-035','M-058','M-060','M-066','M-067','M-070','M-074','M-075','M-076','M-077','M-086'], "the cards' scroll-down arrow", 'every device',
  "The ⬇ arrow of a long card sat on the card's bottom edge and still covered the end of the last visible row: 'Move my ga…', 'Show me the ti…', 'Bring my pets to me', the end of the colour slider, a shop tile's price.", 2, 'fixed',
  'The arrow sits outside the card when there is room (under it, else beside it); only on an upright phone it stays on the bottom edge, in the right corner over the padding.', 'pass 3 pictures of settings, the shops and the colour card.'),
 ('035', ['M-006','M-010','M-027','M-034','M-049','M-065','M-069','M-073','M-105'], "the phone: Rosie's chat and the job list", 'every device',
  "Earlier bubbles and job cards scrolled under the chat header and showed through it (it was 94% white) and beside it; a long title ('Photo booking') was cut without an ellipsis.", 2, 'fixed',
  'The header is solid white, spans the whole phone screen width and a long title ends in …', 'pass 3 phone pictures.'),
 ('036', ['M-013','M-014','M-037','M-038'], 'the party invitation and the dance-off card', 'iPhone upright', 'The cards were drawn over the corner map and the top of the notepad: a sliver of map and \"Write here!\" poked out at their edges.', 2, 'fixed',
  'While one of the cards is up on an upright phone, the corner map and the notepad hide.', 'pass 3 upright-phone card pictures.'),
 ('037', ['M-016','M-017','M-040','M-041'], 'the photographer job: the frame', 'iPhone upright', 'The dashed frame ran straight through the apple chip and down the side of the chips.', 1, 'fixed',
  'On an upright phone the frame starts 150 px down, under the three chips (the hint toast moves under it).', 'pass 3 upright-phone shoot pictures.'),
 ('038', ['M-018','M-106'], 'the photographer job: the joystick', 'iPhone upright', 'The joystick ring sat under the photo bar (the bar spans the width on an upright phone), so a child could not walk to frame the photo.', 2, 'fixed',
  'During a shoot on an upright phone the joystick moves up above the bar.', 'pass 3.'),
 ('039', ['M-061','M-068'], 'the photographer job: the pose card', 'iPhone sideways', 'The pose card was taller than the screen: the Hug and Sit tiles ran off the bottom with no scroll hint.', 2, 'fixed',
  'On a short sideways screen the pose card scrolls inside the screen (44-px pose buttons, tighter rows).', 'pass 3 sideways-phone pose-card picture.'),
 ('040', ['M-063','M-042','M-109'], 'the photographer job: the result card', 'iPhone sideways and upright', "The result card ran off the bottom of a sideways phone (the Bye! button on the edge); on an upright phone the '+120 🪙' pop was half behind the card; in the kit's pictures the '🏞️ the hedge' toast was still drawn over the card.", 2, 'fixed',
  'On a short sideways screen the card keeps side margins and a smaller photo (24% of the height); the coin pop floats higher while a bottom card is up; the background toast clears the moment the photo is taken.', 'pass 3 result pictures; N25 passes.'),
 ('041', ['M-047','M-048','M-050','M-051','M-052','M-053','M-054','M-055','M-056'], 'the phone on a short screen', 'iPhone sideways', "The dimmed clock chip and the chat button peeked out above the phone's top edge.", 1, 'fixed',
  'On a screen under 500 px tall the chips and the chat button hide while the phone is open.', 'pass 3 sideways-phone phone pictures.'),
 ('042', ['M-021','M-079','M-090','M-096'], 'the park: the food truck', 'every device', "The Halloween bunting (and the Valentine garland) hung across the front of the food truck: its pennants looked stuck to the truck's body, 'pink and yellow slivers and a purple one across the wheel'.", 2, 'fixed',
  'Both garlands now start east of the truck (x −32.2 instead of −38).', 'N23 and N32 pass; pass 3 truck pictures.'),
 ('043', ['M-043','M-064'], 'the Flower Corner in October', 'every device', "The spooky path's purple discs ran beside the garden's white stepping stones for the first 6 m: a double row, 'floating stones'.", 2, 'fixed',
  'The purple trail starts where the white stones end and winds 21.9 m deeper into the corner (its 6 scare spots follow it).', 'N19 passes; pass 3 Flower Corner pictures.'),
 ('044', ['M-084'], 'the spooky path at night', 'iPad', 'The little path lamps were plain dark cubes with no glow after 18:00.', 1, 'fixed', 'The lamp glass is a self-lit material: it reads as a lamp by night and by day.', 'pass 3 spooky path picture.'),
 ('045', ['M-080'], 'the Easter hunt eggs', 'every device', 'A plain white ball (meant as a shine) bulged out of the egg between its two gold bands.', 1, 'fixed', 'The ball is gone; the gold bands stay.', 'pass 3 Easter egg picture.'),
 ('046', ['M-081','M-088'], 'the Christmas tree at night', 'iPad', "The tree's night glows sat inside the branches, so they showed as bright yellow, cyan and pink chevron slivers poking out of the lower branches.", 1, 'fixed',
  "The 24 glows sit on the tree's surface (the cone radius at each height plus 14 cm).", 'pass 3 December night picture.'),
 ('047', ['M-004','M-026'], 'inside the fire station', 'every device', "The 'Fire Station' sign's right end lay over the bell's red plate.", 1, 'fixed', 'The bell (plate, rod, bell and its button) moved 50 cm to the right.', 'pass 3 fire station picture.'),
 ('048', ['M-032'], "the grandmas' speech bubbles", 'iPad', "A grandma's own head still covered the middle of her bubble from a low angle.", 1, 'fixed', 'The bubble floats 10 cm higher and is drawn over everything (no depth test), like a comic bubble.', 'N24 passes; pass 3.'),
 ('049', ['M-008'], 'the photographer job: the shoot', 'every device', 'A passer-by walked between the camera and the family and hid them.', 2, 'fixed', 'A townsperson who comes within 3 m of the line from the camera to the family steps out of the picture (hidden) until the shoot ends.', 'pass 3 shoot pictures.'),
 ('050', ['M-104','M-108','M-111','M-092','M-093'], "the kit's own pictures (N25 and N37)", 'iPad and iPhone sideways', "The kit took its result picture while the snap flash was on (washed out) and its Tree Park pictures mid-fade (a dark veil).", 1, 'fixed',
  'The kit waits 700 ms after the snap and 900 ms after entering the park (cozy-check-v6.zip updated).', 'the N25 and N37 pictures of the next run.'),
 ('051', ['M-107','M-110'], 'the photographer job: the bus pill', 'iPhone sideways and PC', "The 'Next bus' pill sat across the frame's top-left corner.", 1, 'fixed', 'The bus pill hides during a shoot.', 'pass 3.'),
 ('052', ['M-036'], "the Pet Shop's 'New in' tiles", 'iPhone upright', 'The colour dot of a long name wrapped onto a line of its own.', 1, 'fixed', 'The dot is glued to the last word (a non-breaking space).', 'pass 3 pet shop card.'),
 ('053', ['M-012'], 'settings', 'iPhone upright', "'Fast' wrapped alone under 'Slow' and the 'Show me the tips' buttons broke into two lines.", 1, 'fixed', 'On a screen under 430 px wide the settings rows use smaller buttons that do not wrap.', 'pass 3 upright-phone settings picture.'),
 ('054', ['M-001','M-071','M-078'], 'the park: the butterflies and the stage pennants', 'every device', "The park's butterflies flying low over the grass read as flat shards or 'two red sheets' dropped by the stage; the stage's end pennants stuck out past its posts.", 1, 'fixed',
  'The butterflies are a quarter smaller and fly 30 cm higher; the pennants hang inside the posts.', 'pass 3 stage pictures.'),
 ('055', ['M-003','M-015'], 'the photographer (not the game)', 'iPad, iPhone upright', 'Two camera spots were bad: the bakery spot stood inside the counter, the dance-card spot was left wherever the previous picture ended (against a fence).', 1, 'not a glitch',
  'Photographer errors: the indoor spots were tried at three depths and set per room; every card picture now has a park backdrop.', 'pass 3.'),
 ('056', ['M-091','M-095','M-097'], "the clock chip in the kit's pictures", 'iPad', 'The chip said ☀️ while rain streaks fell, 🌧️ under a clear sky, and ☀️ 10:00 at dusk.', 1, 'not a glitch',
  "The kit forces the weather and the sky for those pictures and the change takes a few seconds (the rain fades out, the sky lerps); the chip follows the game's own weather. Nothing a player sees.", '—'),
 ('057', ['M-098'], 'the notepad on a sideways phone', 'iPhone sideways', "The small notepad is 104 × 68 px there and its 'Write here!' hint about 11 px.", 1, 'not a glitch', 'By design: the small pad is the button that opens the big pad; on a short screen it shrinks with the corner map (decided in night 3).', '—'),
 ('058', ['M-101','M-102'], 'the friends who follow you, in October', 'iPad', 'Halloween ghosts drifted between the camera and the friends and hid one; one friend stood in line behind another.', 1, 'not a glitch',
  'The ghosts drift on; the friends stand 1.2 m apart in a loose arc and one can be in line with another from the camera for a moment (N3 holds).', '—'),
 ('059', ['M-083'], "a pet's name tag", 'iPad', "The 'Waffles' tag was partly behind the witch hat's pompom of the player's own costume.", 1, 'not a glitch', 'The own hat sits on the camera; a pet right behind the player can put its tag behind the brim for a moment. Not changed.', '—'),
 ('061', ['M-072'], "the Toy Store's sign", 'PC', "'🧸 Toy Store' seemed to sit left of the middle of its long white board.", 1, 'not a glitch',
  "Looked at: the text is centred on the board (the sign plane and the board share x 0, and the drawing centres the measured ink twice); the camera stood near the board's right end, so the near half of the board looks much bigger in perspective. Nothing to change.", '—'),
 ('062', ['M-046'], 'inside the Market', 'iPhone upright', 'An orange strip with a crisp dark edge seemed to run down the floor from the player.', 1, 'not a glitch',
  "Looked at: it is the stand's own wooden top showing in the 15 cm gap between two fruit bins, seen from straight above them. Nothing to change.", '—'),
 ('063', ['M-005'], 'the Pet Shop upstairs', 'every device', 'No pen had its name sign: the wall above the dog, cat, bunny and capybara pens was bare, and the hamsters had no sign either.', 2, 'fixed',
  "Cause: the upstairs group is already placed 40 m along, and the signs added those 40 m a second time, so every sign hung 40 m outside the room. They now use the group's own coordinates. (The first look called this \"not a glitch\" from the code alone; a pass-3 viewer saw the bare wall again.)", 'N28 passes; pass 4 Pet Shop upstairs picture.'),
 ('060', ['M-085','M-099'], 'cards over the HUD', 'iPad, iPhone sideways', "The Clothing store card covered the time chip; the big map's 'Tap a place' bar lies over the bottom row of the map.", 1, 'not a glitch', 'By design (see G4-016 and G4-033).', '—'),
]
old = json.load(open(f'{S}/glitches.json', encoding='utf-8'))
out = [g for g in old if int(g['id'].split('-')[1]) < 34]
for suf, marks, place, device, what, bad, status, fix, check in G:
    before = next((pic(m) for m in marks if pic(m)), None); after = next((after_of(m) for m in marks if after_of(m)), None)
    out.append(dict(id='G4-' + suf, place=place, device=device, what=what + f" (viewer marks {', '.join(marks)} of pass 2)", bad=bad, found_by='PHOTOVIEWER + DOUBLE-CHECKER (pass 2)', fix=fix, before=before, after=after, status=status, check=check))
json.dump(out, open(f'{S}/glitches.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
n = {}
for g in out: n[g['status']] = n.get(g['status'], 0) + 1
print(len(out), 'entries', n, '; pass-2 entries without a before picture:', [g['id'] for g in out if int(g['id'][3:]) >= 34 and not g['before']])
