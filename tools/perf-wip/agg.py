import json,sys,collections
pr=json.load(open(sys.argv[1])); N=int(sys.argv[3]) if len(sys.argv)>3 else 30
nodes={n['id']:n for n in pr['nodes']}; parent={}
for n in pr['nodes']:
  for c in n.get('children',[]): parent[c]=n['id']
cnt=collections.Counter(pr['samples']); tot=sum(cnt.values())
selfc=collections.Counter(); incl=collections.Counter()
def key(n):
  cf=n['callFrame']; return f"{cf['functionName'] or '(anon)'}:{cf['lineNumber']+1}"
for nid,c in cnt.items():
  n=nodes[nid]; selfc[key(n)]+=c; seen=set(); x=nid
  while x is not None:
    k=key(nodes[x])
    if k not in seen: incl[k]+=c; seen.add(k)
    x=parent.get(x)
print('SELF'); [print(f'{v*100/tot:5.1f}% {k}') for k,v in selfc.most_common(N)]
print('INCL'); [print(f'{v*100/tot:5.1f}% {k}') for k,v in incl.most_common(N)]
if len(sys.argv)>2 and sys.argv[2]!='-':
  hp=json.load(open(sys.argv[2])); a=collections.Counter(); inc=collections.Counter()
  def walk(n,stack):
    cf=n['callFrame']; k=f"{cf['functionName'] or '(anon)'}:{cf['lineNumber']+1}"; st=stack+[k]
    a[k]+=n['selfSize']
    for s in set(st): inc[s]+=n['selfSize']
    for c in n['children']: walk(c,st)
  walk(hp['head'],[]); T=sum(a.values())
  print('ALLOC self'); [print(f'{v/1024:8.0f}KB {k}') for k,v in a.most_common(N)]
  print('ALLOC incl'); [print(f'{v/1024:8.0f}KB {k}') for k,v in inc.most_common(N)]
