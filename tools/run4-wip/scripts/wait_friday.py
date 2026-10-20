"""Sleep until the one clock's shared day is a Friday with at least 90 s of it left (a game day = 15 real minutes from 1 Jan 2026 UTC)."""
import time, datetime
EP = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc).timestamp(); DAY = 900
while True:
    now = time.time(); k = int((now - EP) // DAY); d = k + 1; left = EP + (k + 1) * DAY - now
    if (d - 1) % 7 == 4 and left > 90 and left < DAY - 20: break
    time.sleep(5)
print('game day', d, 'Friday, %d s left' % left, datetime.datetime.now(datetime.timezone.utc).strftime('%H:%M:%S'))
