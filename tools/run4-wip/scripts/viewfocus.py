"""Glitch loop rules of 21 Oct (CLAUDE.md): PHOTOVIEWER briefs with a focus. A re-check pass: 4 or 5 viewers, each sees every changed picture
and reports what is wrong in its own focus (and anything broken, grade 3, whatever its focus); the focuses rotate each pass (with 4 viewers the
one left out moves on). The full final pass (--full): each picture goes to the one focus it belongs to, each focus in batches of at most 40.
usage: python3 viewfocus.py OUTDIR PASS N_VIEWERS PICTURES.json [--full]
PICTURES.json: [{"path": ..., "prof": ..., "theme": ..., "note": ...}, ...] (a full pass: viewbatch.py's pictures.json works as it is)"""
import json, os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
OUT, PASS, NV, PJ = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]; FULL = '--full' in sys.argv
os.makedirs(OUT, exist_ok=True)
prompt = open(os.path.join(S, 'stage3', 'prompt-photoviewer.md'), encoding='utf-8').read().strip()
should = open(os.path.join(S, 'stage3', 'should-look-like.md'), encoding='utf-8').read().strip()
FOCUS = [
 ('dark mode', 'the dark theme: words, numbers and icons readable on dark cards, tiles and bars; pictures and emoji standing out from a dark background; nothing left light-only, see-through or invisible in the dark theme. In a light-theme picture, look only for anything broken.'),
 ('iPad touch', 'touch on a tablet or phone: every button and tap target at least a fingertip big and not on top of another; the joystick, the action buttons and the cards where thumbs reach and never over each other; a card fitting the screen with its buttons in view; nothing under a thumb that a child must read.'),
 ('shops/people', 'people, pets and shops: townsfolk, shoppers, keepers, grandmas, friends and pets standing on the floor (not floating, not inside walls, furniture or each other), not right against the camera, facing sensibly; shop shelves, counters and items in place.'),
 ('lighting/objects', 'light and things in the scene: shadows, sky, night and rain light, colours that look wrong, flicker-looking stripes, things floating, cut through, inside walls or poking through other things, holiday pieces and furniture in sensible places, the camera inside an object.'),
 ('text/UI', 'words and screens: spelling and grammar a child reads, cut or overlapping text, cards and buttons overlapping each other or the screen edge, scroll hints, tabs and lists laid out right, HUD parts covering what the picture is about.'),
]
pics = json.load(open(PJ))
UI = re.compile(r'phone|card|book|tutorial|shop-|settings|bag|map|menu|invitation|result|chat|pose|quest|calendar|hair|big-house|house-paint|party|dance|job')
PEOPLE = re.compile(r'inside-|people|walkers|grandma|friends|n6-|n4-|n3-|n21|n24')
def focus_of(p):   # the one focus a picture belongs to in a full pass
    n = (p.get('name') or '') + ' ' + os.path.basename(p['path'])
    ui = bool(UI.search(n))
    if p.get('theme') == 'dark' and ui: return 'dark mode'
    if p.get('prof') in ('ipad-landscape', 'iphone-portrait', 'iphone-landscape') and ui and re.search(r'tutorial|job|pose|menu|invitation|dance|party|hair|map|bag', n): return 'iPad touch'
    if PEOPLE.search(n): return 'shops/people'
    if ui: return 'text/UI'
    return 'lighting/objects'
def brief(focus, text, items, k, n):
    L = [prompt, '', f'## Your focus: {focus}', f'Look at every picture below, but report only what is wrong in your focus: {text}', '',
         f'## {"Batch" if FULL else "Viewer"} {k} of {n}: {len(items)} pictures', '',
         'Read every picture file below with the Read tool (they are PNG screenshots) and judge it. The line after each path says where it was taken.', '']
    for p in items:
        L.append(f"- {p['path']}"); L.append(f"  {p.get('prof', '?')}, {p.get('theme', '?')} theme: {p.get('note', '')}")
    L += ['', should, '', 'Answer with the problem lines only (PICTURE FILE | where | what is wrong | how bad), then the count. The PICTURE FILE is the file name only (not the folder).']
    return '\n'.join(L)
rot = FOCUS[PASS % len(FOCUS):] + FOCUS[:PASS % len(FOCUS)]
out = []
if not FULL:
    for k, (f, t) in enumerate(rot[:NV], 1):
        name = f'viewer-{k:02d}.md'; open(os.path.join(OUT, name), 'w', encoding='utf-8').write(brief(f, t, pics, k, NV)); out.append((name, f, len(pics)))
else:
    groups = {f: [p for p in pics if focus_of(p) == f] for f, _ in FOCUS}
    jobs = []
    for f, t in rot:
        g = groups[f]
        for i in range(0, len(g), 40): jobs.append((f, t, g[i:i + 40]))
    for k, (f, t, items) in enumerate(jobs, 1):
        name = f'batch-{k:02d}.md'; open(os.path.join(OUT, name), 'w', encoding='utf-8').write(brief(f, t, items, k, len(jobs))); out.append((name, f, len(items)))
json.dump(pics, open(os.path.join(OUT, 'pictures.json'), 'w'), indent=1)
for name, f, n in out: print(name, f, n, 'pictures')
