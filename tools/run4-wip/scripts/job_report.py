"""Put a job's part into tools/RUN-4-REPORT.md: the entry (before section 2), the progress row (after the previous row), the check output (before section 3).
usage: job_report.py ENTRY.md ROW_TEXT PREV_ROW_PREFIX OUTPUT_FILE TITLE"""
import sys
entry, row, prev, outf, title = sys.argv[1:6]
p = '/home/user/cozy-town/tools/RUN-4-REPORT.md'; r = open(p, encoding='utf-8').read()
lines = r.split('\n'); i = next(k for k, l in enumerate(lines) if l.startswith(prev)); lines.insert(i + 1, row); r = '\n'.join(lines)
e = open(entry, encoding='utf-8').read().rstrip('\n') + '\n\n'
m = '## 2. Check output per job, exactly as printed'; assert m in r; r = r.replace(m, e + m, 1)
out = open(outf, encoding='utf-8').read(); a = out.index('[stage run4: running]'); b = out.index('[partial run: some stages skipped by --only]') + len('[partial run: some stages skipped by --only]')
block = '### ' + title + '\n```\n' + out[a:b] + '\n```\n\n'
m3 = '## 3. Before and after pictures'; assert m3 in r; r = r.replace(m3, block + m3, 1)
open(p, 'w', encoding='utf-8').write(r); print('report updated')
