/* Cozy Town: a pretend database that keeps the rules (25 Nov 2026). test_social.py talks to it, one line of JSON at a time.
   {id, op:'read'|'write'|'update', path, val, now}  ->  {id, ok, why}
   It holds the data itself and lets a write in only when the rules (argv[2], a rules .json file) allow it, checked by targaryen
   (an open-source stand-in for the Realtime Database rules engine; not Google's own). */
const targaryen = require('targaryen'), fs = require('fs'), readline = require('readline');
let db = targaryen.database(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')), {}, Date.now());
readline.createInterface({ input: process.stdin }).on('line', line => {
  let m, out;
  try {
    m = JSON.parse(line); const o = { now: m.now };
    const r = m.op === 'read' ? db.read(m.path, o) : m.op === 'update' ? db.update(m.path, m.val, o) : db.write(m.path, m.val === undefined ? null : m.val, o);
    if (r.allowed && m.op !== 'read') db = r.newDatabase;
    out = { id: m.id, ok: !!r.allowed, why: r.allowed ? '' : String(r.info).split('\n').filter(l => /=> false|No \.(read|write) rule/.test(l)).slice(0, 3).join(' | ').slice(0, 400) };
  } catch (e) { out = { id: m && m.id, ok: false, why: 'ERROR ' + e.message }; }
  process.stdout.write(JSON.stringify(out) + '\n');
});
