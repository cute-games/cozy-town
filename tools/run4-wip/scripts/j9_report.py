# appends the job 9 entry to the report; argv = log files to paste (in order)
import sys
p='/home/user/cozy-town/tools/RUN-4-REPORT.md'; s=open(p,encoding='utf-8').read()
row="| 8. Grandmas | yes | yes | N24 pass; N6 (rewritten) pass |\n"
assert row in s
s=s.replace(row,row+"| 9. Small things and the stage-1 book | yes | yes | N27, N29, N35, N41 pass; book stage W1/W2 pass (7 pages) |\n")
entry="""### Job 9: Small things (items 3, 11, 24, 19) and the stage-1 book
- Pond (item 3). Old: a wooden arched bridge over the duck pond with a walk strip through the water, four post colliders, hand rails, its own "Feed the ducks" spot, and the pond's rim stones kept clear of it. New: the bridge is gone (removal 2 of the 4 allowed): the pond is solid water all round (walking at it from four sides stops 2.5 m from its middle, the water's edge is 1.45 m), the 14 rim stones go all the way round, the two ducks stay with their feeding spot by the bench; `brY`/`brAt` stay as functions that return 0 (friends' and pets' heights used them). Test N29.
- Trash (item 11). Old: three looks (a white ball, a coloured tube, two yellow sticks). New: four looks, picked by the spot's number (removal 3 of 4, the old looks): a soda can (a coloured tin on its side with a grey lid), crumpled paper (four off-white lumps), a banana peel (a stub with three yellow strips) and a coffee cup (white cup, brown band, dark lid); each piece carries its kind. Picking up works as before (+3 coins, remembered for the day, the quests and tasks count). Test N27: over 8 days all four kinds show; 28 spots, 10 a day.
- Notepad switch (item 24). New: ⚙️ Settings → "✏️ Notepad": On/Off (default On, saved with the other settings, 52 px tall). Off hides the notepad, On brings it back; the notes live in their own storage and are untouched. The designer card still takes the notepad's place while it shows, and the notepad returns after it. Test N35.
- Bus (item 19). No change by design; proved with the one clock (N41): every week has exactly 3 bus days, two devices agree on every bus day and hour, and the park-stop pill names the weekday of the next bus on a morning without one.
- What's new book (stage 1): 7 pages (cover with four pictures and the credit line as it is; One clock; Halloween all October; Three grandmas; Your map; Look around; Small things), 1 to 3 short kid lines each, 11 new 400×300 webp pictures (135 KB in all, taken from the new game). The night-3 book is kept in tools/books/night-3-pages.js with its 13 pictures in tools/books/night-3/. The kit's book stage now reads the page count from the game (it was fixed at 9).
- Should look like (BUILDER): the duck pond is a round blue pool ringed by grey stones with two ducks and the bench beside it, no bridge; on the pavements small cans, paper balls, peels and cups with a ✨ above them; ⚙️ Settings shows "✏️ Notepad  [✏️ On] [↩️ Last page]"; the title's "What's new" opens a 7-page book that starts with a four-picture cover. Pictures: tools/pictures-4/after-pond-no-bridge.png, after-pond-ducks.png, after-trash-soda-can.png, after-trash-banana-peel.png, after-notepad-switch-off.png, and the book pages in the check's shots.
- Decided alone: the bridge's feeding spot went with it (the bench's spot stays); the Notepad switch sits in the same Settings row as "↩️ Last page".

"""
anchor="## 2. Check output per job, exactly as printed"
assert anchor in s; s=s.replace(anchor, entry+anchor)
def body(path):
    log=open(path,encoding='utf-8').read(); k=min([log.index(x) for x in ('[stage run4','[stage book') if x in log]); return log[k:].replace('EXIT 0\n','').rstrip()
s=s.rstrip('\n')+"\n\n### Job 9 (N27, N29 and N35 from the first run, where N29 failed on the test's own too-wide look for bridge bits: it counted the lake pier's walk strip; N29 again after narrowing it to the pond; N41 after fixing the test's own day loop, which moved its end with the clock it set; the book stage with 7 pages)\n"
for f in sys.argv[1:]: s+="```\n"+body(f)+"\n```\n"
open(p,'w',encoding='utf-8').write(s); print('report updated')
