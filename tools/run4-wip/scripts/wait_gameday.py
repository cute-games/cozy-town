"""Sleep until the one clock's shared day is the given weekday (0 Mon .. 4 Fri, 5 Sat) with at least MIN s of it left and at least 20 s gone
(a game day = 15 real minutes counted from 1 Jan 2026 UTC). usage: python3 wait_gameday.py WEEKDAY [MIN]"""
import sys, time, datetime
WD = int(sys.argv[1]); MIN = int(sys.argv[2]) if len(sys.argv) > 2 else 90
EP = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc).timestamp(); DAY = 900
while True:
    now = time.time(); k = int((now - EP) // DAY); d = k + 1; left = EP + (k + 1) * DAY - now
    if (d - 1) % 7 == WD and MIN < left < DAY - 20: break
    time.sleep(5)
print('game day', d, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][WD], '%d s left' % left, datetime.datetime.now(datetime.timezone.utc).strftime('%H:%M:%S'))
