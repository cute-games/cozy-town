# Run 4 finish, f14 (pass 17 M-017) before and after: only the grandma views of views_f14.py (a far grandma's bubble behind the bus shelter, a near one)
import runpy, os
V = runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'views_f14.py'))['VIEWS']
VIEWS = [v for v in V if 'bubble' in v[0]]
