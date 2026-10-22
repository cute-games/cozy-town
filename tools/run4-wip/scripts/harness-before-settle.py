"""Cozy Town check harness. Everything here runs on TEST COPIES in a local browser.
No request ever reaches the real game, GitHub, Firebase or claude.ai."""
import asyncio, json, os, time, hashlib, re

HERE = os.path.dirname(os.path.abspath(__file__))
ORIGIN = 'https://cozy.test'
GAME_URL = ORIGIN + '/cozy-town/'
THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
TESTNAME = 'ZZTEST'

# CSS px sizes of common devices. Pixel ratio 1 in tests (real screens are sharper; layout is the same).
PROFILES = {
    'ipad-landscape':           dict(w=1180, h=820,  touch=True,  mobile=False, group='iPad'),
    'ipad-portrait':            dict(w=820,  h=1180, touch=True,  mobile=False, group='iPad'),
    'pc-1920':                  dict(w=1920, h=1080, touch=False, mobile=False, group='PC'),
    'pc-1366':                  dict(w=1366, h=768,  touch=False, mobile=False, group='PC'),
    'iphone-portrait':          dict(w=390,  h=844,  touch=True,  mobile=True,  group='iPhone'),
    'iphone-landscape':         dict(w=844,  h=390,  touch=True,  mobile=True,  group='iPhone'),
    'android-phone-portrait':   dict(w=412,  h=915,  touch=True,  mobile=True,  group='Android phone'),
    'android-phone-landscape':  dict(w=915,  h=412,  touch=True,  mobile=True,  group='Android phone'),
    'android-tablet-portrait':  dict(w=800,  h=1280, touch=True,  mobile=False, group='Android tablet'),
    'android-tablet-landscape': dict(w=1280, h=800,  touch=True,  mobile=False, group='Android tablet'),
}

def md5b(b): return hashlib.md5(b).hexdigest()

class Log:
    """Test log: every test action, and its undo."""
    def __init__(self, path):
        self.path = path; self.f = open(path, 'a')
    def action(self, txt): self.f.write(f'{time.strftime("%H:%M:%S")} ACTION {txt}\n'); self.f.flush()
    def undone(self, txt): self.f.write(f'{time.strftime("%H:%M:%S")} UNDONE {txt}\n'); self.f.flush()
    def note(self, txt): self.f.write(f'{time.strftime("%H:%M:%S")} NOTE {txt}\n'); self.f.flush()

class Relay:
    """In-memory stand-in for Firebase / the room. Shared by all test pages of one run."""
    def __init__(self):
        self.tree = {}; self.pages = {}
    def _get(self, path):
        node = self.tree
        for k in [k for k in path.split('/') if k]:
            if not isinstance(node, dict) or k not in node: return None
            node = node[k]
        return node
    def _set(self, path, val):
        keys = [k for k in path.split('/') if k]; node = self.tree
        for k in keys[:-1]:
            if not isinstance(node.get(k), dict): node[k] = {}
            node = node[k]
        if val is None: node.pop(keys[-1], None)
        else: node[keys[-1]] = val
    def _ts(self, v):
        if isinstance(v, dict):
            if v.get('.sv') == 'timestamp' and len(v) == 1: return int(time.time() * 1000)
            return {k: self._ts(x) for k, x in v.items()}
        if isinstance(v, list): return [self._ts(x) for x in v]
        return v
    def attach(self, page): self.pages[page] = {'listen': set(), 'ondisc': set()}
    async def handle(self, source, payload):
        page = source['page']; m = json.loads(payload); op, path = m['op'], m['path']
        info = self.pages.setdefault(page, {'listen': set(), 'ondisc': set()})
        if op == 'listen':
            info['listen'].add(path); await self._push(page, path); return True
        if op == 'ondisc': info['ondisc'].add(path); return True
        if op == 'set': self._set(path, self._ts(m['val']))
        elif op == 'update':
            for k, v in (m['val'] or {}).items(): self._set(path + '/' + k, self._ts(v))
        elif op == 'remove': self._set(path, None)
        await self._notify(path); return True
    async def _notify(self, path):
        for pg, info in list(self.pages.items()):
            for lp in list(info['listen']):
                if lp == path or lp.startswith(path + '/') or path.startswith(lp + '/'):
                    await self._push(pg, lp)
    async def _push(self, pg, lp):
        try: await pg.evaluate('([p,v])=>window.__relayPush&&window.__relayPush(p,v)', [lp, self._get(lp)])
        except Exception: pass
    async def disconnect(self, page):
        info = self.pages.pop(page, None)
        if not info: return
        for p in info['ondisc']:
            self._set(p, None); await self._notify(p)

AUDIT_JS = r"""(touch)=>{
 const W=innerWidth,H=innerHeight,out=[];
 const shown=el=>{let e=el;while(e&&e!==document.documentElement){const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity<0.05)return false;if(e.hidden)return false;e=e.parentElement;}return true;};
 const rect=el=>{const r=el.getBoundingClientRect();return(r.width<1||r.height<1)?null:r;};
 const nm=el=>{let s=el.id?'#'+el.id:el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).join('.'):'');if(el.dataset&&el.dataset.a)s+='['+el.dataset.a+']';const t=(el.getAttribute('aria-label')||el.textContent||'').trim().replace(/\s+/g,' ').slice(0,28);return t?s+' "'+t+'"':s;};
 const scroller=el=>{let e=el.parentElement;while(e&&e!==document.body){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY+cs.overflowX)&&(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1))return e;e=e.parentElement;}return null;};
 const roots=['hud','panel','title','tut','dtut','toast','note','bar'].map(id=>document.getElementById(id)).filter(el=>el&&shown(el));
 const inter=[];const seen=new Set();
 for(const root of roots){
  for(const el of root.querySelectorAll('button,[data-a],[data-d],[role=button],input,select,#joy,#pad,.chip')){
   if(seen.has(el))continue;seen.add(el);if(!shown(el))continue;const r=rect(el);if(!r)continue;const panelUp=!document.getElementById('panel').hidden;
   const sc=scroller(el);
   if(sc){const s=rect(sc);if(s&&(s.left<-1||s.top<-1||s.right>W+1||s.bottom>H+1))out.push({k:'cut-off',el:nm(sc),box:[s.left,s.top,s.right,s.bottom].map(Math.round)});}
   else if(r.left<-1||r.top<-1||r.right>W+1||r.bottom>H+1)out.push({k:'cut-off',el:nm(el),box:[r.left,r.top,r.right,r.bottom].map(Math.round)});
   if(el.matches('button,[data-a],[data-d],[role=button],input,select,#joy')&&!(panelUp&&root.id==='hud')){let vr=r;if(sc){const s2=sc.getBoundingClientRect();const L2=Math.max(r.left,s2.left),T2=Math.max(r.top,s2.top),R2=Math.min(r.right,s2.right),B2=Math.min(r.bottom,s2.bottom);vr=(R2-L2>2&&B2-T2>2)?{left:L2,top:T2,right:R2,bottom:B2}:null;}const fixedish=/(sticky|fixed)/.test(getComputedStyle(el).position)||(el.parentElement&&/(sticky|fixed)/.test(getComputedStyle(el.parentElement).position));if(vr)inter.push({el,r:vr,sc,fixedish});}
   if(touch&&el.matches('button,[data-a],[data-d],[role=button]')&&!(panelUp&&root.id==='hud')&&(r.width<44||r.height<44))out.push({k:'small-target',el:nm(el),size:[Math.round(r.width),Math.round(r.height)]});
  }
  for(const el of root.querySelectorAll('*')){
   if(el.childElementCount||!el.textContent.trim()||!shown(el)||!/[A-Za-z0-9\u00C0-\u024F]/.test(el.textContent))continue;const r=rect(el);if(!r)continue;const cs=getComputedStyle(el);
   if(el.scrollWidth>el.clientWidth+1&&cs.textOverflow!=='ellipsis'&&!/(auto|scroll)/.test(cs.overflowX)&&cs.display!=='inline')out.push({k:'text-overflow',el:nm(el)});
   let b=el,bg=null,img=false;while(b&&b!==root.parentElement){const bcs=getComputedStyle(b);if(bcs.backgroundImage&&bcs.backgroundImage!=='none'){img=true;break;}const m=bcs.backgroundColor.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(',').map(Number);if(p.length<4||p[3]>0.85){bg=p;break;}}b=b.parentElement;}
   if(img)bg=null;
   const fm=cs.color.match(/rgba?\(([^)]+)\)/);
   if(bg&&fm){const f=fm[1].split(',').map(Number);const L=c=>{const v=c.slice(0,3).map(x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);});return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];};const a=L(f),bb=L(bg);const cr=(Math.max(a,bb)+0.05)/(Math.min(a,bb)+0.05);if(cr<3)out.push({k:'low-contrast',el:nm(el),ratio:Math.round(cr*100)/100});}
  }
 }
 for(let i=0;i<inter.length;i++)for(let j=i+1;j<inter.length;j++){const a=inter[i],b=inter[j];if(a.el.contains(b.el)||b.el.contains(a.el))continue;if((a.fixedish||b.fixedish)&&(a.sc===b.sc||(a.sc&&a.sc.contains(b.el))||(b.sc&&b.sc.contains(a.el))))continue;
  const x=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),y=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
  if(x>2&&y>2){const top=document.elementFromPoint((Math.max(a.r.left,b.r.left)+Math.min(a.r.right,b.r.right))/2,(Math.max(a.r.top,b.r.top)+Math.min(a.r.bottom,b.r.bottom))/2);out.push({k:'overlap',el:nm(a.el)+' + '+nm(b.el),on_top:top?nm(top):''});}}
 const btn=[];for(const el of document.querySelectorAll('.btn')){if(!shown(el)||!rect(el))continue;const cs=getComputedStyle(el);btn.push({cls:[...el.classList].filter(c=>!/^(on|sel|off|dim|hot|pulse)$/.test(c)).sort().join('.'),font:cs.fontFamily.split(',')[0]+' '+cs.fontWeight,rad:cs.borderTopLeftRadius,bw:cs.borderTopWidth});}
 return {issues:out,btn};
}"""

class Game:
    def __init__(self, run, page, ctx, profile, theme, flavor, name, build_md5):
        self.run, self.page, self.ctx = run, page, ctx
        self.profile, self.p, self.theme, self.flavor, self.name = profile, PROFILES[profile], theme, flavor, name
        self.build_md5 = build_md5; self.seq = 0; self.errors = []; self.shots = []; self.issues = []; self.btn = []; self.both = True

    async def ev(self, js, arg=None):
        return await self.page.evaluate(js, arg) if arg is not None else await self.page.evaluate(js)

    async def manual(self):
        await self.ev("()=>{window.__loop.manual=true;}")
        await asyncio.sleep(0.3)

    async def step(self, n=1, render=False):
        return await self.ev("""([n,render])=>{if(!window.__loop.manual)return 'auto';
          const real=window.__realRender||(window.__realRender=renderer.render);for(let i=0;i<n;i++){window.__t=Math.max(window.__t||0,performance.now())+50;
          const last=(i===n-1)&&render;renderer.render=last?real:(()=>{});try{frame(window.__t);}finally{renderer.render=real;}}return 'ok';}""", [n, render])

    async def wait(self, ms):
        await asyncio.sleep(ms / 1000)

    async def center(self, sel, scroll=False):
        return await self.ev("""([sel,scroll])=>{const el=typeof sel==='string'?document.querySelector(sel):null;if(!el)return null;
          if(scroll){const r0=el.getBoundingClientRect();let out=r0.top<0||r0.bottom>innerHeight||r0.left<0||r0.right>innerWidth;
            let a=el.parentElement;while(a&&a!==document.body&&!out){const cs=getComputedStyle(a);if(/(auto|scroll|hidden)/.test(cs.overflowY+cs.overflowX)){const ar=a.getBoundingClientRect();if(r0.top<ar.top-1||r0.bottom>ar.bottom+1||r0.left<ar.left-1||r0.right>ar.right+1)out=true;}a=a.parentElement;}
            if(out)el.scrollIntoView({block:'nearest',inline:'nearest'});}
          const r=el.getBoundingClientRect();if(r.width<1||r.height<1)return null;
          const x=r.left+r.width/2,y=r.top+r.height/2;const top=document.elementFromPoint(x,y);return {x,y,hit:!!top&&(top===el||el.contains(top)),top:top?(top.id||top.tagName)+'':'outside the screen'};}""", [sel, scroll])

    async def tap(self, sel, label=None, scroll=True):
        """A real finger tap (touch devices) or mouse click (PC) on the middle of an element.
        Scrolls a list first if the button is below the fold (as a player would).
        Returns None if it can't be seen, 'covered:<x>' if something else is on top (that is a bug)."""
        for _ in range(6):   # a button that is still popping in: wait for its animation, as a player would
            busy = await self.ev("(sel)=>{const el=document.querySelector(sel);return !!el&&el.getAnimations().some(a=>a.playState==='running')}", sel)
            if not busy: break
            await asyncio.sleep(0.3)
        c = await self.center(sel, scroll)
        if not c: return None
        if not c['hit']:
            # a panel may still be sliding in: wait a moment and look again before calling it covered
            await asyncio.sleep(0.45); await self.step(2); c = await self.center(sel, False)
            if not c: return None
            if not c['hit']: return 'covered:' + c['top']
        if self.p['touch']: await self.page.touchscreen.tap(c['x'], c['y'])
        else: await self.page.mouse.click(c['x'], c['y'])
        return 'ok'

    async def tap_xy(self, x, y):
        if self.p['touch']: await self.page.touchscreen.tap(x, y)
        else: await self.page.mouse.click(x, y)

    async def key(self, code):
        await self.page.keyboard.press(code)

    async def _one(self, label, theme, render=True):
        self.seq += 1
        safe = re.sub(r'[^A-Za-z0-9_.-]+', '-', label)[:60]
        path = os.path.join(self.run.shots, f'{self.run.tag}_{self.profile}_{theme}_{self.name}_{self.seq:03d}_{safe}.png')
        if render: await self.step(1, True)
        await self.page.screenshot(path=path, timeout=90000)
        a = await self.ev(AUDIT_JS, self.p['touch'])
        for i in a['issues']: i['at'] = label; i['theme'] = theme; i['profile'] = self.profile; i['build'] = self.build_md5; self.issues.append(i)
        self.btn.extend([dict(b, build=self.build_md5) for b in a['btn']])
        self.shots.append(path)
        return path

    async def shot(self, label, both=False):
        """Screenshot (and layout audit) of this moment; with both=True also in the other light/dark setting."""
        p = await self._one(label, self.theme)
        if both:
            other = 'dark' if self.theme == 'light' else 'light'
            await self.page.emulate_media(color_scheme=other)
            await self._one(label, other, render=False)
            await self.page.emulate_media(color_scheme=self.theme)
        return p

    async def play_intro(self, name):
        """Play the opening like a new player: Play, Rosie's lines, the mirror, the name, the job question."""
        for _ in range(60):
            st = await self.ev("""()=>({title:!$('title').hidden,panel:!$('panel').hidden,cr:!!CR,playing:PLAYING,intro:!!(S&&S.intro),
              crName:!!$('crName'),acts:[...document.querySelectorAll('#card [data-a]')].filter(b=>b.offsetParent).map(b=>b.dataset.a),
              tut:!$('tut').hidden,dtut:!$('dtut').hidden,fading:typeof fading!=='undefined'?!!fading:false})""")
            if st['playing'] and st['intro'] and not st['panel'] and not st['cr'] and not st['tut'] and not st['dtut']: return True
            if st['title']:
                await self.tap('#tPlay'); await self.wait(1500); await self.step(5); continue
            if st['tut']: await self.tap('#tutSkip'); await self.step(3); continue
            if st['dtut']: await self.tap('#dtSkip'); await self.step(3); continue
            if st['panel']:
                if st['crName']:
                    v = await self.ev("()=>$('crName').value")
                    if not v:
                        await self.tap('#crName'); await self.page.keyboard.type(name); await self.step(1)
                order = ['crdone', 'iname', 'inext', 'imake', 'jobskip', 'tutgo', 'dtutgo', 'close']
                pick = next((a for o in order for a in st['acts'] if a == o), None)
                if pick:
                    if pick in ('crdone', 'iname', 'inext', 'imake', 'jobskip'): await self.shot('intro-' + pick, both=self.both)
                    await self.tap(f'#card [data-a="{pick}"]'); await self.wait(700); await self.step(8); continue
            await self.wait(400); await self.step(6)
        return False

    async def state(self):
        return await self.ev("()=>JSON.parse(JSON.stringify(S))")

    async def counts(self):
        return await self.ev(COUNTS_JS)

    async def weight(self, spots):
        out = {}
        for loc, x, z, yaw in spots:
            r = await self.ev("""([loc,x,z,yaw])=>{if(!LOC[loc])return null;closePanel();setLoc(loc);P.x=(LOC[loc].ox||0)+x;P.z=(LOC[loc].oz||0)+z;P.yaw=yaw;P.pitch=0;
              for(let i=0;i<4;i++){window.__t=Math.max(window.__t||0,performance.now())+50;frame(window.__t);}
              renderer.info.reset&&renderer.info.reset();const t0=performance.now();for(let i=0;i<5;i++){window.__t+=50;frame(window.__t);}const ms=(performance.now()-t0)/5;
              return {calls:renderer.info.render.calls,tris:renderer.info.render.triangles,geo:renderer.info.memory.geometries,tex:renderer.info.memory.textures,ms:Math.round(ms)};}""", [loc, x, z, yaw])
            out[loc] = r
        return out

COUNTS_JS = r"""()=>{
 const ids=(v,f)=>Array.isArray(v)?v.map((x,i)=>typeof x==='string'?x:(x&&(x.id||x.k||x.n||x.name||x[0]))!=null?String(x.id||x.k||x.n||x.name||x[0]):'#'+i):Object.keys(v||{});
 const T={areas:LOC,houses:HOUSES,shops:SHOPS,places:PLACES,doors:DOORS,furniture:FURN,furniture_for_sale:BUY_FURN,flower_shop:FLOWER_SHOP,foods:FOODS,recipes:RECIPES,seeds:SEEDS,
  pet_items:PET_ITEMS,pet_kinds:PET_TYPES,pet_accessories:ACCS,hats:HAT_DEF,clothes:CLOTHES,floors:FLOORS,wall_colors:WALLS,friends:FRIENDS,townsfolk:TOWNFOLK,
  jobs:JOBS,quests:QUESTS,hard_quests:HARD,skills:SKILLS,daily_tasks:TASKS,school_subjects:SUBJ,tutorial_steps:TUT_STEPS,pizzas:PIZZAS,chat_phrases:QUICK,chat_emojis:EMOS,
  new_colors:NEWCOLS,designer_plants:DS_PLANTS,designer_toys:DS_TOYS,book_facts:BOOK_FACTS,friends_lane_plots:LANE_PLOTS,apartment_buildings:APTB,people_who_order:WHO,vip_customers:VIPS,phone_chats:CHATS};
 const out={};for(const k in T){try{out[k]=ids(T[k]);}catch(e){out[k]=['ERROR '+e.message];}}
 for(const k of Object.keys(LOOK_OPTS))out['look_'+k]=ids(LOOK_OPTS[k]);
 for(const k of Object.keys(SHOPS)){const s=SHOPS[k];out['shop_'+k]=Array.isArray(s)?ids(s):(s&&s.items?ids(s.items):Object.keys(s||{}));}
 return out;}"""

class Run:
    def __init__(self, tag, outdir):
        self.tag = tag; self.out = outdir
        self.shots = os.path.join(outdir, 'shots'); os.makedirs(self.shots, exist_ok=True)
        self.log = Log(os.path.join(outdir, f'testlog_{tag}.txt'))
        self.relay = Relay(); self.pw = None; self.browser = None; self.games = []; self.all_games = []
        self.served = {}   # md5 of each game file a test page loaded -> count
        self.blocked = []

    async def __aenter__(self):
        from playwright.async_api import async_playwright
        self.pw = await async_playwright().start()
        self.browser = await self.pw.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'])
        return self

    async def __aexit__(self, *a):
        for g in list(self.games): await self.close(g)
        await self.browser.close(); await self.pw.stop()

    async def open(self, build_bytes, flavor='web', profile='ipad-landscape', theme='light', name='p1', save=None, storage=None):
        P = PROFILES[profile]
        ctx = await self.browser.new_context(viewport={'width': P['w'], 'height': P['h']}, device_scale_factor=1,
                                             has_touch=P['touch'], is_mobile=P['mobile'], color_scheme=theme)
        bmd5 = md5b(build_bytes); box = {'newer': None}   # box['newer'] (run 4, N17): once set, every later request for the game file gets this newer file instead
        async def route(r):
            u = r.request.url
            if u.split('#')[0].split('?')[0] in (GAME_URL, GAME_URL + 'index.html'):
                body = box['newer'] or build_bytes; m = md5b(body)
                self.served[m] = self.served.get(m, 0) + 1
                return await r.fulfill(body=body, content_type='text/html; charset=utf-8')
            if u == THREE_URL: return await r.fulfill(path=os.path.join(HERE, 'three-r128.min.js'), content_type='text/javascript')
            if u.startswith('https://fonts.googleapis.com/'): return await r.fulfill(path=os.path.join(HERE, 'fonts.css'), content_type='text/css')
            if u.startswith('https://fonts.gstatic.com/__cozytest/'):
                return await r.fulfill(path=os.path.join(HERE, u.rsplit('/', 1)[1]), content_type='font/woff2')
            if u.startswith(ORIGIN + '/cozy-town/') and (u.endswith('.webmanifest') or u.endswith('.png')):
                return await r.fulfill(status=204, body='')
            self.blocked.append(u[:140]); return await r.abort()
        await ctx.route('**/*', route)
        await ctx.add_init_script(f'window.__COZY_FLAVOR={json.dumps(flavor)};')
        await ctx.add_init_script(path=os.path.join(HERE, 'fakenet.js'))
        if save is not None:
            await ctx.add_init_script('try{if(!sessionStorage.getItem("__seeded")){localStorage.setItem("cozytown-save-1",' + json.dumps(json.dumps(save)) + ');sessionStorage.setItem("__seeded","1");}}catch(e){}')
        if storage:
            await ctx.add_init_script('try{if(!sessionStorage.getItem("__seeded2")){const o=' + json.dumps(storage) + ';for(const k in o)localStorage.setItem(k,o[k]);sessionStorage.setItem("__seeded2","1");}}catch(e){}')
        relay = self.relay
        await ctx.expose_binding('__relay', lambda source, payload: relay.handle(source, payload))
        page = await ctx.new_page()
        g = Game(self, page, ctx, profile, theme, flavor, name, bmd5); g.box = box
        page.on('pageerror', lambda e: g.errors.append('PAGEERROR ' + str(e)[:300]))
        page.on('console', lambda m: g.errors.append('console.error ' + m.text[:300]) if m.type == 'error' else None)
        relay.attach(page)
        self.log.action(f'open test copy {flavor} build md5 {bmd5[:8]} on {profile} {theme} as {name}')
        try:
            await page.goto(GAME_URL)
            await page.wait_for_function("()=>typeof $==='function'&&$('tPlay')&&!$('tPlay').disabled", timeout=240000)
        except Exception:
            try: await relay.disconnect(page)
            except Exception: pass
            await ctx.close(); self.log.undone(f'closed test copy {flavor} {profile} {theme} {name} after it failed to start')
            raise
        self.games.append(g); self.all_games.append(g)
        return g

    async def close(self, g):
        try: await self.relay.disconnect(g.page)
        except Exception: pass
        try: await g.ctx.close()
        except Exception: pass
        if g in self.games: self.games.remove(g)
        self.log.undone(f'closed test copy {g.flavor} {g.profile} {g.theme} {g.name}: its saves and test data are thrown away')
