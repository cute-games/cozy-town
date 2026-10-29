"""One-time step before the first split (owner's OK 29 Oct 2026). Makes the one-file game ready to split:
  1. the version stamp gets its own small inline script (old Home Screen copies look for it inside index.html);
  2. the update check reads that stamp script instead of "the script running now" (a file script has no inline text);
  3. the stamp is bumped;
  4. realDate() and nyeParty() move from the main loop up to the party-hat line in models that calls them while the game loads.
  python3 tools/split/prepare.py OLD.html NEW.html NEW_STAMP
Stops unless every edit matches exactly once. Nothing else changes."""
import re, sys
src, dst, stamp = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8', newline='').read()
def rep(s, a, b):
    if s.count(a) != 1: sys.exit(f'STOP: expected 1 x {a[:70]!r}, found {s.count(a)}')
    return s.replace(a, b)
m = re.search(r"<script>\n'use strict';\nconst COZY_BUILD=(\d+);([^\n]*)\n/\* ================= core ================= \*/", s)
if not m: sys.exit('STOP: stamp line not found')
if int(stamp) <= int(m.group(1)): sys.exit(f'STOP: new stamp {stamp} must be bigger than {m.group(1)}')
s = s[:m.start()] + f"<script>\n'use strict';\nconst COZY_BUILD={stamp};{m.group(2)}\n</script>\n<script>\n'use strict';\n/* ================= core ================= */" + s[m.end():]
s = rep(s, "el:document.currentScript,", "el:null,")   # updMine() then finds the inline script holding 'const COZY_BUILD=' (works split or in one file)
# split files run one after another, so code that runs while the game loads can only call functions of its own file or an earlier one.
# The party-hat line in models (try{PARTY.on=nyeParty(realDate());}catch(e){}) calls two main-loop functions: they move up next to it, unchanged.
RD = "function realDate(){return new Date();}\n"
NP = "function nyeParty(d){const m=d.getMonth(),day=d.getDate();return(m===11&&day===31)||(m===0&&day===1);}\n"
s = rep(s, RD, "/* realDate() and nyeParty() are in models, just above PARTY: the party hats read them while the game loads */\n")
s = rep(s, NP, "")
s = rep(s, "\nconst PARTY={on:false,", "\n" + RD + NP + "const PARTY={on:false,")
open(dst, 'w', encoding='utf-8', newline='').write(s)
print(f'{dst}: stamp {m.group(1)} -> {stamp}, stamp script on its own, update check reads it')
