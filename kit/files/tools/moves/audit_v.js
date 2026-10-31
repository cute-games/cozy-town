const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.cwd()+'/mv/c15.html');await p.waitForTimeout(3000);
const picks={};for(const f of fs.readdirSync('db11/cmp_picks')){const d=JSON.parse(fs.readFileSync('db11/cmp_picks/'+f));if(d.claude&&d.opt)picks[f]=d;}
const res=await p.evaluate(picks=>{const out=[];for(const k in picks){const d=picks[k];const P=PU[d.claude];if(!P){out.push([k,d.claude,'NO MODEL']);continue;}const df=P.dflt||{};for(const o in d.opt){const kept=String(d.opt[o]).split(',');const dv=df[o];if(dv!==undefined&&!kept.includes(String(dv)))out.push([k,d.claude,o,'default='+dv,'kept='+kept.join('|'),d.pick]);}}return out;},picks);
for(const r of res)console.log(r.join('  '));await b.close();})();
