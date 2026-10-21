# Run 4 finish, pass 17 M-015/M-016: which parts of your own body (PB) are drawn, outside and inside the Pet Shop
PB_LIST = r"""(()=>{const out=[];let n=0;PB.root.traverse(o=>{if(!o.isMesh&&!o.isSprite)return;let leg=false;for(let q=o.parent;q;q=q.parent)if(PB.legs.includes(q)){leg=true;break;}
  let vis=o.visible;for(let q=o.parent;q;q=q.parent)if(!q.visible)vis=false;const m=Array.isArray(o.material)?o.material[0]:o.material;
  if(vis&&!leg&&m!==SHADOW_ONLY&&!(m&&m.colorWrite===false)){n++;if(out.length<12)out.push((o.isSprite?'sprite':o.geometry.type)+' #'+(m&&m.color?m.color.getHexString():'?')+(o.parent&&o.parent.userData&&o.parent.userData.keep?' (parent keep)':'')+(o.userData.keep?' keep':'')+' in b: '+(()=>{for(let q=o.parent;q;q=q.parent)if(q===PB.b)return true;return false;})());}});
  return 'where '+CUR.id+'; PB visible '+PB.root.visible+'; drawn parts that are not legs: '+n+'\n'+out.join('\n');})()"""
VIEWS = [('pb-town', "(()=>{closePanel();__goto('city');__setClock(null,11);})()"), ('pb-town-list', PB_LIST),
         ('pb-pets', "(()=>{__goto('pets');__setClock(null,11);__run(2);})()"), ('pb-pets-list', PB_LIST),
         ('pb-flowers', "(()=>{__goto('flowers');__setClock(null,11);__run(2);})()"), ('pb-flowers-list', PB_LIST)]
