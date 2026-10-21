"""before | after side by side, each at half size: python3 compose_ba.py SHOTSDIR OUTDIR [scale]"""
import glob, os, re, sys
from PIL import Image
D, O = sys.argv[1], sys.argv[2]; k = float(sys.argv[3]) if len(sys.argv) > 3 else .5; os.makedirs(O, exist_ok=True)
for b in sorted(glob.glob(os.path.join(D, '*-before-*.png'))):
    a = b.replace('pv-before-', 'pv-after-').replace('-before-', '-after-')
    if not os.path.exists(a): continue
    A, B = Image.open(b), Image.open(a); w, h = int(A.width * k), int(A.height * k)
    C = Image.new('RGB', (w * 2 + 8, h), 'white'); C.paste(A.resize((w, h)), (0, 0)); C.paste(B.resize((int(B.width * k), int(B.height * k))), (w + 8, 0))
    n = re.sub(r'.*_\d{3}_', '', os.path.basename(b)).replace('-before', ''); C.save(os.path.join(O, n)); print(os.path.join(O, n))
