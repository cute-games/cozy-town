import json,sys,collections
hp=json.load(open(sys.argv[1]));tgt=sys.argv[2];D=int(sys.argv[3]) if len(sys.argv)>3 else 3
c=collections.Counter()
def walk(n,st):
  cf=n['callFrame'];k=f"{cf['functionName'] or '(anon)'}:{cf['lineNumber']+1}";st=st+[k]
  if k.startswith(tgt):c[' < '.join(reversed(st[-D-1:-1]))]+=n['selfSize']
  for ch in n['children']:walk(ch,st)
walk(hp['head'],[])
for k,v in c.most_common(12):print(f'{v/1024:8.0f}KB {k}')
