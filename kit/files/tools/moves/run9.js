const {chromium}=require('playwright');const fs=require('fs');
const sets=process.argv.slice(2);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message.slice(0,300)));
await p.goto('file://'+process.cwd()+'/c15.html');await p.waitForTimeout(3500);
await p.addScriptTag({path:'engine.js'});await p.addScriptTag({path:'rig.js'});await p.addScriptTag({path:'anim2.js'});for(const f of (fs.existsSync('sets')?fs.readdirSync('sets').filter(x=>x.endsWith('.js')).sort():[]))await p.addScriptTag({path:'sets/'+f});
for(const s of sets){fs.mkdirSync('fr2/'+s,{recursive:true});
 const fr=await p.evaluate(s=>{try{const c=CLIPS2[s];return MV.sheet(Object.assign({frames:36},c));}catch(e){return 'E '+e.stack}},s);
 if(typeof fr==='string'){console.log(s,fr.slice(0,500));continue;}
 const dg=await p.evaluate(()=>{const d=window.__dbg||[];window.__dbg=[];return d;});if(dg.length)console.log(dg.join('\n'));fr.forEach((u,i)=>fs.writeFileSync(`fr2/${s}/${String(i).padStart(3,'0')}.png`,Buffer.from(u.split(',')[1],'base64')));console.log(s,fr.length);}
await b.close();})();
