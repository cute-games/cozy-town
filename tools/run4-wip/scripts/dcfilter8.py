"""Stage 3, pass 8 on (run 4 finish: dcfilter7.py plus the check's own staging seen in pass 8, each with its reason); pass 7 on (the pass-5 rules for any kit set, without the pass-5-only delivery staging rule): sort the PHOTOVIEWER marks before the DOUBLE-CHECKER. Marks about the photographer's own staging, about a card
over the dimmed HUD (G4-033, G4-060: not a glitch), or about test names are set aside with the reason; the rest go to the double-checker.
usage: python3 dcfilter7.py MARKDIR...  -> FIRST_MARKDIR/marks-keep.txt, marks-aside.txt"""
import glob, os, re, sys
ASIDE = [
 (r'small white ring .*cent|white (dot|ring) (with a dark outline )?(stays fixed )?at the (exact )?screen.? cent|aim(ing)? dot',
  'by design: the little ring at the middle of the screen is the aim dot, it shows what the use button acts on (since night 1)'),
 (r'^kit\d+-n1-holidays-(holiday-christmas|holiday-valentine|spooky-path)',
  'KIT STAGING: N1 counts each holiday\'s pieces from a fixed camera in the park; its pictures are not of the Flower Corner (the photographer\'s holiday pictures are)'),
 (r'^kit\d+-n11-old-',
  'KIT STAGING: N11\'s old-version picture is taken where the check stands, behind the garden fence'),
 (r'^kit\d+-n(5|15)-B-.*(other player|blob|right (on|at|against) the camera|not to be seen)',
  'KIT STAGING: the check puts the second test player right beside you (on the same bench, at the same spot)'),
 (r'^kit\d+-n12-.*(bathtub|right at the camera|fills the lower-left)',
  'KIT STAGING: N12 looks at each old house from the spot the check stands on'),
 (r'^kit\d+-n15-A-phone-calendar.*(wall|window)',
  'KIT STAGING: N15 opens the phone where the bed test left you, by the bedroom wall'),
 (r'^kit\d+-n(3|4|19|20|21|24|27|29|30|41)-.*(camera (sits|stands|is) (inside|right (up )?against|right behind|wedged)|camera tilted|camera right behind|wedged against|no (duck )?pond in the picture|street-lamp post stands right in front|right up against the|house wall fills|shelter\) right at the camera|board \(bus stop shelter\)|cut off by the (right|left) screen edge and (its lower part|covered))',
  'KIT STAGING: the check takes its pictures where its test stands (tilted at the sky after a pick-up, inside the fountain, against a sign, a gate post or a lamp post); its own lines measure what they check'),
 (r'^kit\d+-n20-A-december.*(Easter bunny.s bubble|Happy Easter)',
  'KIT TIMING: the kit jumps from March to December in one page; the Easter Bunny\'s words from a second before were still on screen'),
 (r'^kit\d+-n6-.*(friends|pets?) .*(stand|are) right in front of the camera',
  'KIT STAGING: the player\'s pets follow the test player to the bench'),
 (r'grey-lilac veil|dimmed under a',
  'KIT TIMING: the kit took this picture during the fade of the floor change'),
 (r'^s3_.*(pets? (crowd|bunch|fill|are piled)|pressed against the lens|right at the lens|right under the camera|piled right in front)',
  'PHOTOGRAPHER: the player\'s pets came along on the town spots and stood where the camera then turned or stepped back; from pass 5 the town spots leave the pets at home'),
 (r'^s3.*(camera (is )?(pressed|jammed|squeezed)|stands right against|pressed up to the bell|right beside the camera|camera stands right|lamp post (stands )?right (at|beside)|stands right in front of the bus shelter|lamp post stands in the middle)',
  'PHOTOGRAPHER: the camera spot stands against a post, a wall, a board or a bell; a child walking there sees it from any step around it'),
 (r'(covers?|clips?|sits over|sits on top of) (the )?(rounded right end of the )?("?\d+:\d+ \w+"? )?(time|clock) (chip|pill)|time chip.*(clipped|covered)|corner map (and the notepad )?(stick|peek|show)s? out|strip of the (small )?corner map|corner map.s .*(peeks|shows)|book.s left edge lies over the corner map|left edge sits on top of the corner map|left border (sits|lies) on|top-left corner is jammed against the notepad',
  'KNOWN, not a glitch (G4-033, G4-060): a card over the dimmed HUD; the HUD under an open card is dimmed and the card takes the taps'),
 (r'notepad (HUD )?(covers|hides)|under the notepad|notepad card covers',
  'DECIDED, not a glitch (section 9c): on an upright phone the fixed HUD (the notepad under the corner map, the pet buttons, the action pill) can cover part of a sign while you walk'),
 (r'^s3_iphone-landscape.*joystick (ring )?(and knob )?(sits|covers|overlaps)|^kit\d-n26-map-iphone-landscape.*joystick',
  'DECIDED, not a glitch: on a sideways phone the joystick stands where the owner put it (300 px in, commit 0f5939f); only during a photo shoot it moves to the edge'),
 (r'^(?!.*(whats-new-book|overlap|huge|right (at|against) the camera|chat bubble)).*(speech bubble|bubble .*(sticks out|runs off|cut))',   # (pass 8: only a townsperson's own bubble cut at the screen's edge; a book picture, two bubbles on each other, a huge one from someone at the camera go on)
  'not a glitch: a talking townsperson\'s bubble stays by their head; at the screen edge or behind a card it is cut like the townsperson'),
 (r'(place )?labels? (are |is )?cut (off )?(by|at) the map|labels? at the map.s (right |left )?edges?|map labels cut|cut (off )?at the map.s|"en" (shows )?at the left edge|"ne" at the map',
  'not a glitch: the big map is wider than its frame and scrolls; names at its edge are cut like the map'),
 (r'awning (is )?wider than the shop|awning hangs past',
  'by design: an awning overhangs its shop by 20 cm on each side'),
 (r'ghost (hangs|floats|drifts)|big (faceless )?grey ghost',
  'not a glitch (G4-058): the Halloween ghosts drift across the town and can pass in front of a sign for a moment'),
 (r'(bats|birds).*(tick marks|sticks)|dark sticks in the sky',
  'by design: far-away birds and bats are a few flat strokes'),
 (r'grey veil|mid stair-fade|caught (while )?(mid )?fad|mid fade-in|caught while fading',
  'KIT TIMING: the kit took this picture during the 0.4 s fade of a door or a card'),
 (r'mixed theme|round .*buttons .*(stay )?(bright )?white|buttons stay bright white',
  'by design: the round top buttons and the run button keep their white face in the dark theme (as in the builder\'s dark pictures)'),
 (r'squeezed into the side HUD|pressed flat against the corner map|left (edge|border) lies on top of the corner map|card.s left (edge|border) (is pressed|lies)|card is squeezed|no space between card and HUD|book panel is wider than the gap|HUD.s corner map, notepad and joystick stick out',
  'KNOWN, not a glitch (G4-033, G4-060): a card over the dimmed HUD; the HUD under an open card is dimmed and the card takes the taps'),
 (r'^kit\d-.*(head is right against the camera|other player stands right against the camera|Home shop panel fills the view)',
  'KIT STAGING: the kit puts the camera, the second player or a shop card where its check needs them, not where a child would look'),
 (r'^s3_.*(lamp ?post right (at|beside) the camera|right against a (dark )?(street )?lamp|lamp post right beside|dark lamp post right at|camera stands right against a lamppost|thick dark pole runs the full height)',
  'PHOTOGRAPHER: the camera spot stands against a lamp post; pass 6 steps it aside'),
 (r'^s3_.*((sign|signs|banner|truck)\b.*(cut|runs off|cut off|reads only|is cut).*(screen )?edge|reads "?(ower Corner|Capyba|Food t)|"Capyba|Food t\.\.\.|"Food t")',
  'PHOTOGRAPHER: the camera spot frames the sign too tight for this screen; a child turns or steps back'),
 (r'^s3_.*(fire truck is cut off|the view is mostly a bare|hardly shows)',
  'PHOTOGRAPHER: the camera spot inside looks at a bare wall; pass 6 turns it to the truck'),
 (r'^s3_.*lane-my-garden.*(pressed against|flat pink wall|big pink board)',
  'PHOTOGRAPHER: the pass-5 garden spot stood against the house\'s back wall; pass 6 moves it into the garden'),
 (r'^s3b?_.*townsperson (stands )?right (against|in front of|beside) the camera|^s3b?_.*townsperson.s back is right in front',
  'PHOTOGRAPHER: a townsperson walked up to the camera spot just before the picture; a child steps aside'),
 (r'^kit\d-.*(townsperson (stands )?right (in front of|beside|against) the camera|townsperson.s back is right in front|townsperson right beside the camera)',
  'KIT STAGING: the kit puts the camera where its check needs it, not where a child would look'),
 (r'^kit\d-n20-A-december.*(Easter Bunny speech box|All 25)',
  'KIT TIMING: the kit jumps from March to December in one page; the Easter Bunny\'s message from a second before was still on screen'),
 (r'^kit\d-n21-newyear-fireworks.*no firework',
  'KIT TIMING: the bursts come one at a time; the picture fell between two (N21 counts the bursts: 2 in 4.5 s)'),
 (r'coin pop-up is huge|"\+\d+" coin pop',
  'not a glitch: the coin pop-up shows for about a second and floats away'),
 (r'scroll button floats outside the panel',
  'by design (G4-034): on a wide screen the scroll arrow sits beside the card, outside it, so it never covers a word or a button'),
 (r'(ZZTEST|Cozy Kid)', 'test name'),
]
D = sys.argv[1]; keep, aside = [], []
for d in sys.argv[1:]:
    for f in sorted(glob.glob(os.path.join(d, 'batch-*.txt'))):
        for l in open(f, encoding='utf-8'):
            l = l.strip()
            if not l or l.count('|') < 3: continue
            why = None if re.search(r'Finish', l) else next((w for pat, w in ASIDE if re.search(pat, l, re.I) and not ('whats-new-book' in l.split('|')[0] and w.startswith('PHOTOGRAPHER'))), None)   # (pass 8: the book's pictures are part of the game, never the photographer's camera spot)
            (aside if why else keep).append((l, why, os.path.basename(os.path.dirname(f)) + '/' + os.path.basename(f)))
open(os.path.join(D, 'marks-keep.txt'), 'w', encoding='utf-8').write('\n'.join(l for l, _, _ in keep) + '\n')
open(os.path.join(D, 'marks-aside.txt'), 'w', encoding='utf-8').write('\n'.join(f'{l}  ⟵ {w} [{b}]' for l, w, b in aside) + '\n')
print(len(keep), 'kept for the double-checker;', len(aside), 'set aside')
