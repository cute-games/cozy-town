# Run 4 finish, f9 probe: the What's new book's footer on every page: the back button, the dots and the next button never overlap; the dots' centre
JS = """(()=>{const bx=id=>{const e=document.getElementById(id);if(!e||e.offsetParent===null)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.right)];};
 const f=document.querySelector('#book .bk-foot').getBoundingClientRect(),p=bx('bkPrev'),d=bx('bkDots'),n=bx('bkNext');
 const ov=(a,b)=>a&&b?Math.max(0,Math.min(a[1],b[1])-Math.max(a[0],b[0])):0;
 return 'page '+(BOOK.cur+1)+' prev '+JSON.stringify(p)+' dots '+JSON.stringify(d)+' next '+JSON.stringify(n)+' overlap '+(ov(p,d)+ov(d,n))+' off-centre '+(d?Math.round((d[0]+d[1])/2-(f.left+f.right)/2):'-');})()"""
VIEWS = [('book-p1', "closePanel();bookOpen();BOOK.cur=0;bookRender();" + JS)] + [(f'book-p{i+1}', f"BOOK.cur={i};bookRender();" + JS) for i in range(1, 7)]
