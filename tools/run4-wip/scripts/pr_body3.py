# the PR body for "Run 4, stage 3": the stage's part of the report
import json, re
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
p = '/home/user/cozy-town/tools/RUN-4-REPORT.md'; s = open(p, encoding='utf-8').read()
i = s.index('## 0. Progress'); j = s.index('## 1. Every change'); table = s[i:j]
row19 = next(l for l in table.splitlines() if l.startswith('| 19. Stage 3'))
head = [l for l in table.splitlines() if l.startswith('| Job') or l.startswith('|---')][:2]
k = s.index('### Job 19 / stage 3'); l2 = s.index('## 2. Check output', k); entry = s[k:l2].strip()
G = json.load(open(f'{S}/glitches.json', encoding='utf-8')); n = {}
for g in G: n[g['status']] = n.get(g['status'], 0) + 1
scores = open(f'{S}/critic-scores.md', encoding='utf-8').read(); tbl = scores[scores.index('| part'):scores.index('## What the critics said')].strip()
body = f"""## Run 4, stage 3

Job 19 on branch `claude/run-4-s3` (made from stage 2's branch): the GLITCH HUNTER pass and the critic loops over everything stages 1 and 2 built, then the full check. The complete report with every change old → new, the check output, the counts, the pictures and the "should look like" lines is in **tools/RUN-4-REPORT.md** (the stage-3 parts marked 3c, 4, 5c, 6c, 7c, 9c); the glitch list in **tools/GLITCH-LIST-4.md**; pictures in tools/pictures-4/stage3/ and tools/pictures-4/stage3-glitches/; the kit as cozy-check-v6.zip.

Built on top of PR #4 (stage 1) and PR #5 (stage 2): until they merge, this pull request's diff also shows their commits; merge #4, then #5, then this one.

{chr(10).join(head)}
{row19}

{entry}

### The glitch list
{len(G)} entries: {', '.join(f'{v} {k}' for k, v in sorted(n.items()))}. Each entry names the viewer marks it covers, the root cause, the fix and a before/after picture.

### The critic loops
{tbl}

### Also in this stage
- tools/prerun4-rollback.html: the starting file with a stamp bigger than any run-4 stamp ("Go back to PRE-RUN 4" = put it live).
- Not verified (section 6c of the report): real devices, a real second player over Firebase, real holiday dates, sound, how it feels to a child.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01621mivMqSmwiKFfYDfaf7V"""
open(f'{S}/pr_body3.md', 'w', encoding='utf-8').write(body); print(body[:300]); print('...', len(body), 'chars')
