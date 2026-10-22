# appends the job 8 entry to the report (run after N24 passes); argv[1] = the log file to paste
import sys
p='/home/user/cozy-town/tools/RUN-4-REPORT.md'; s=open(p,encoding='utf-8').read()
row="| 7. Map | yes | yes | N26 pass (5 screen sizes) |\n"
assert row in s
s=s.replace(row,row+"| 8. Grandmas | yes | yes | N24 pass; N6 (rewritten) pass |\n")
entry="""### Job 8: Grandmas (items 8, 20)
- Old: twelve grandmas sat in pairs on six benches by the town houses (two baked parts each), chatting in bubbles; "Say hi" at each bench. Their seats were taken while they sat.
- New: the twelve are gone; the six benches stay as ordinary benches with two seats each (removal 1 of the 4 allowed). Three grandmas (the first three looks of the twelve) walk round town with the one clock: the real UTC day is cut into 80-second turns, and a seeded plan of the real date gives each grandma a place for every turn: 19 stops (a step off a townspeople's path node in front of the school, each shop, the fire station, the salon, the park, the Flower Corner gate, the bus stop, the beach gate, the field, the lake) and the duck-pond bench, where two of them sit together about one turn in four, toss crumbs every 6 s (the ducks of the little pond come to them) and chat about ducks and life; a stop is never more than 70 m of walking from the last (85 m to the pond), no two at the same shop. Between turns they walk the paths at 1.15 m/s (face along the way, then towards the place), talk about where they stand in bubbles every 5.5 s (the pond pair take turns), nod when greeted; "Say hi" gets one of the ten kind lines, never the same twice in a row. The pond bench's seats count as taken while a grandma sits on them. They are walkers for the townspeople (given way to), pedestrians for the cars and the bus. Out 9:00 to 18:00 in dry weather as before; gone (and the bench free) at night and in rain or snow. Nothing is saved or sent: position is a pure function of the shared clock, so every device shows them in the same spot.
- Tests: N24 (3 grandmas; the 6 house benches never held; two devices with clocks 1 s apart agree on every grandma's place at 8 moments within 1.3 m; a turn with the pair sitting on the two seats, ducks fed within 8 s; a 20 m+ walk at 1.15 m/s, standing at the place at 72 s with a bubble; Say hi 4 times never repeats). N6 rewritten (old: "out in dry daytime; inside in rain, snow and at night; their bench is full while they sit" → new: "the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit"), never weaker.
- Should look like (BUILDER): three little grandmas with grey buns and cardigans strolling the pavements, one stopping in front of a shop window with a speech bubble about it; some turns two of them side by side on the bench by the duck pond, crumbs flying, the ducks paddling over. Pictures: tools/pictures-4/after-grandmas-pond.png, after-grandma-at-a-place.png.
- Decided alone: 80-second turns and the real UTC day as the plan's anchor (the plan restarts at midnight UTC when nobody sees it); the three looks are the first three of the old twelve; the pond pair is chosen by the plan, the third grandma goes elsewhere.

"""
anchor="## 2. Check output per job, exactly as printed"
assert anchor in s; s=s.replace(anchor, entry+anchor)
def body(path):
    log=open(path,encoding='utf-8').read(); i=log.index('[stage night3' if '[stage night3' in log else '[stage run4'); return log[i:].replace('EXIT 0\n','').rstrip()
s=s.rstrip('\n')+"\n\n### Job 8 (the rewritten N6 from the first run, and N24 after two test fixes: the game hour follows the shared clock, so the test picks real moments that are game daytime; the walk is measured along the path, 20 m or more)\n```\n"+body(sys.argv[1])+"\n```\n"
if len(sys.argv)>2: s=s.rstrip('\n')+"\n```\n"+body(sys.argv[2])+"\n```\n"
open(p,'w',encoding='utf-8').write(s); print('report updated')
