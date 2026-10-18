"""Open the job-10 scratch copy the kit's way and print the page errors that stop the title screen."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from playwright.async_api import async_playwright
SRC = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j13try.html','rb').read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width':1180,'height':820})
        errs = []
        pg.on('pageerror', lambda e: errs.append('pageerror: '+str(e)))
        pg.on('console', lambda m: errs.append('console.'+m.type+': '+m.text) if m.type in ('error','warning') else None)
        await pg.route('**/index.html', lambda r: r.fulfill(status=200, content_type='text/html; charset=utf-8', body=SRC))
        await pg.route('**/three*.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=open(os.path.join(KIT,'three-r128.min.js'),'rb').read()))
        try:
            await pg.goto('http://cozy.test/index.html', wait_until='load', timeout=60000)
            await pg.wait_for_timeout(4000)
        except Exception as e: errs.append('goto: '+str(e)[:200])
        st = await pg.evaluate("()=>({has$:typeof $==='function',tPlay:!!document.getElementById('tPlay'),disabled:!!(document.getElementById('tPlay')||{}).disabled,title:document.title})")
        print(json.dumps(st)); print('\n'.join(errs[:8])); await b.close()
asyncio.run(main())
