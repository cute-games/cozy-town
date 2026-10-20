"""Stage 3, CRITIC briefs: one brief per big change, with only the pictures of that part and the builder's "should look like" line(s).
usage: python3 criticbrief.py OUTDIR ROUND MAPJSON...
The pictures are picked from the maps by spot name; a later round (after fixes) re-takes the pictures and calls this again."""
import json, os, re, sys
S = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad'
OUT, ROUND, maps = sys.argv[1], sys.argv[2], sys.argv[3:]; os.makedirs(OUT, exist_ok=True)
prompt = open(f'{S}/stage3/prompt-critic.md', encoding='utf-8').read().strip()
should = [l for l in open(f'{S}/stage3/should-look-like.md', encoding='utf-8').read().splitlines() if l.startswith('- [')]
TOPICS = {
 'photographer': (r'^(photo-|tutorial-photo|phone-jobs|kit\d-n25)', r'Job 15'),
 'treepark': (r'^(treepark-|town-treepark-gate|kit\d-n37)', r'Job 16'),
 'parties': (r'^(mailbox-menu|party-|dance-|two-players|kit\d-n39)', r'Job 17'),
 'holidayspot': (r'^(holiday-|halloween-|town-flower-corner|kit\d-n19|kit\d-n20|kit\d-n21|kit\d-n22)', r'Job 4|Job 11|Job 3'),
 'floors': (r'^(inside-home|house-paint|big-house|lane-my-house|kit\d-n33|kit\d-n34|lane-my-garden)', r'Job 10'),
 'oneclock': (r'^(job-sleep-screen|phone-calendar|phone-messages|kit\d-n15|town-square-fountain|town-square-fountain-night|town-duck-pond$|town-ducks-close|settings$|whats-new-book$|kit\d-n3-|town-east-shops$|inside-pets-upstairs|tutorial-pizza)', r'Job (1|9):'),   # (round 6: the pond ducks close up, the phone's messages with their times)
}
pics = []; seen_k = set()
for mp in maps:
    d = os.path.dirname(mp)
    for e in json.load(open(mp)):
        if (e['name'], e['prof'], e['theme']) in seen_k: continue
        seen_k.add((e['name'], e['prof'], e['theme']))
        if e.get('file'): pics.append(dict(path=os.path.join(d, 'shots', e['file']), **{k: e.get(k) for k in ('name', 'prof', 'theme', 'note')}))
SKIP = {'dance-hud'}   # (round 5: the staged dance still has no partner; the real two-phone dance pictures stand in for it)
FIRST = {'holidayspot': [r'halloween-spooky-gate', r'n19-halloween-oct31-night', r'n19-spooky-path-scare', r'holiday-newyear-fireworks$', r'holiday-christmas-tree-night', r'holiday-valentine-from-gate', r'n20-A-valentine-fountain', r'n19-halloween-nov1', r'halloween-ghosts-square'],   # (round 6: the fifth critic missed the February fountain, a closed gate in another month and October in the shops)
         'parties': [r'^dance-two-portrait', r'^dance-two-landscape', r'^dance-two-result-portrait', r'^dance-two-result-landscape', r'n39-A-dance-off', r'n39-A-dance-result'],
         'floors': [r'inside-home-floor-2-stairs', r'inside-home-stairs', r'lane-my-garden', r'lane-my-house-six-floors'],
         'oneclock': [r'job-sleep-screen', r'kit\d-n15-A-one-clock', r'kit\d-n15-A-phone-calendar', r'phone-messages', r'kit\d-n3-friends-friends-in-view-1', r'kit\d-n3-friends-friends-after-turn-1', r'town-ducks-close', r'town-duck-pond$', r'town-square-fountain-rain']}   # (round 6: the clock's own screens first, then the friends and the ducks the README sends to this round)   # (round 5: a picture of each thing the line promises comes first)
for topic, (pat, jobpat) in TOPICS.items():
    mine = [p for p in pics if re.search(pat, p['name']) and p['name'] not in SKIP]
    # keep the brief small: iPad light first, then one of each other device, at most 14 pictures
    order = sorted(mine, key=lambda p: (p['prof'] != 'ipad-landscape', p['theme'] != 'light', p['name']))
    # round 3 on: first one picture of every spot (iPad, light if there is one), then the other devices, at most 18
    pick = []; names = set()
    for fp in FIRST.get(topic, []):
        c = [p for p in order if re.search(fp, p['name']) and p['name'] not in names]
        if c: pick.append(c[0]); names.add(c[0]['name'])
    for p in order:
        if p['name'] not in names: pick.append(p); names.add(p['name'])
    for p in order:
        if len(pick) >= 18: break
        if p in pick: continue
        if p['prof'] != 'ipad-landscape' and len([q for q in pick if q['prof'] == p['prof']]) < 3: pick.append(p)
    pick = pick[:18]
    sl = [l for l in should if re.search(jobpat, l)]
    lines = [prompt, '', f'## The part: {topic} (round {ROUND})', '', "The builder's \"should look like\" line(s):"] + sl + ['', 'Pictures (read each with the Read tool; the line under a path says what it shows):', '']
    for p in pick:
        lines.append(f"- {p['path']}"); lines.append(f"  {p['prof']}, {p['theme']}: {p['note']}")
    lines += ['', 'Notes: a pale message bar in the middle of a picture ("You are online!…", "New! A cozy Beach Bus…", "Pizza time is…") is a passing game message, not part of this part; the test player is called Cozy Kid or ZZTEST-…; the check machine has no colour emoji font, so emoji can show as hollow boxes.', '', 'Answer exactly: SCORE: n  then at most five short lines, most important first.']
    open(os.path.join(OUT, f'critic-{topic}-r{ROUND}.md'), 'w', encoding='utf-8').write('\n'.join(lines))
    print(topic, len(pick), 'pictures of', len(mine))
