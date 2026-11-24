import re,sys
s=open(sys.argv[1]).read()
i=s.index('seasonSet();buildSky();');j=s.index('\n',i)
line=s[i:j]
calls=re.findall(r'(\w+)\(\);',line.split('S=freshState')[0])
new=''.join(f"{{const _a=performance.now();{c}();(window.__LT=window.__LT||[]).push(['{c}',+(performance.now()-_a).toFixed(1)]);}}" for c in calls)
rest=line[line.index('S=freshState'):] if 'S=freshState' in line else ''
s=s[:i]+new+rest+s[j:]
s=s.replace('async function boot(){','async function boot(){window.__LT0=performance.now();',1)
s=s.replace("const b=$('tPlay');b.disabled=false;","window.__LT1=performance.now();const b=$('tPlay');b.disabled=false;",1)
open(sys.argv[2],'w').write(s)
print(len(calls))
