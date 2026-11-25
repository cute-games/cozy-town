/* Cozy Town: the database rules, tried one write and one read at a time (25 Nov 2026).
   Uses targaryen, an open-source stand-in for the Realtime Database rules engine. It is NOT Google's own engine: the real
   project is only proven once the rules are pasted and two real devices have tried the features.
   Run:  mkdir -p /tmp/rt && cd /tmp/rt && npm install --no-save targaryen@3.1.0
         NODE_PATH=/tmp/rt/node_modules node tools/social/rules_test.js
   Each line: what is tried, and whether the rules must allow it. Ends with "RULES: n of n as expected". */
const targaryen = require('targaryen'), fs = require('fs'), path = require('path');
const load = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const NEW = load('firebase-rules.json'), OLD = load('firebase-rules-before.json');
const S = 'worlds/cozy-town/social/', NOW = 1795000000000, TS = { '.sv': 'timestamp' };
const SIDA = 'A'.repeat(22), SIDB = 'B'.repeat(22), TID = 'T'.repeat(43), E = 'B' + 'e'.repeat(86), C = 'c'.repeat(154);
const id = n => ('00000000' + (NOW + n).toString(36)).slice(-9) + 'abc';
let n = 0, bad = 0;
function expect(what, res, want) { n++; if (res.allowed !== want) { bad++; console.log('WRONG | ' + what + ' | allowed ' + res.allowed + ', wanted ' + want + '\n' + res.info); } else console.log((want ? 'allowed' : 'refused') + ' | ' + what); }
const db = (rules, data, now) => { const d = targaryen.database(rules, data || {}, now || NOW), o = { now: now || NOW };   /* every try happens at the time given (NOW if none) */
  return { read: p => d.read(p, o), write: (p, v) => d.write(p, v, o), update: (p, v) => d.update(p, v, o) }; };
const at = (o, k, v) => { const r = {}; k.split('/').reduce((p, x, i, a) => p[x] = i === a.length - 1 ? v : (p[x] || {}), r); return Object.assign({}, o, r); };
function tree(paths) { const t = {}; for (const p in paths) { const ks = p.split('/'); let o = t; ks.forEach((k, i) => { if (i === ks.length - 1) o[k] = paths[p]; else o = o[k] = o[k] || {}; }); } return t; }

/* ---- 1. what the game already does must work exactly as before, under the new rules too ---- */
for (const [nm, R] of [['old rules', OLD], ['new rules', NEW]]) {
  const note = { t: 'A slide in the park', n: 'ZZTEST', at: NOW - 5000, p: 'uabc123' };
  const D = tree({ 'worlds/cozy-town/board/notes/n1': note, 'worlds/cozy-town/move/BCDFGH': { s: '{"a":1}', at: NOW - 1000, exp: NOW + 500000, v: 1 }, 'worlds/cozy-town/cozy-world/peers/pabc': { nm: 'ZZTEST', t: NOW } });
  const d = db(R, D);
  expect(nm + ': read the players', d.read('worlds/cozy-town/cozy-world/peers'), true);
  expect(nm + ': write my player', d.write('worlds/cozy-town/cozy-world/peers/pxyz', { nm: 'ZZTEST', x: 1, t: TS }), true);
  expect(nm + ': update my player', d.update('worlds/cozy-town/cozy-world/peers/pabc', { x: 2, t: TS }), true);
  expect(nm + ': remove my player', d.write('worlds/cozy-town/cozy-world/peers/pabc', null), true);
  expect(nm + ': the night skip (peers/clock)', d.write('worlds/cozy-town/cozy-world/peers/clock', { sk: 5, d: 3, at: NOW }), true);
  expect(nm + ': read the ideas board', d.read('worlds/cozy-town/board/notes'), true);
  expect(nm + ': the board\'s "may I write?" test', d.write('worlds/cozy-town/board/notes/probe/h/uabc123', null), true);
  expect(nm + ': pin an idea', d.write('worlds/cozy-town/board/notes/n2', { t: 'More ducks', n: 'ZZTEST', at: TS, p: 'uabc123' }), true);
  expect(nm + ': change someone\'s idea', d.write('worlds/cozy-town/board/notes/n1', Object.assign({}, note, { t: 'x' })), false);
  expect(nm + ': give a heart', d.write('worlds/cozy-town/board/notes/n1/h/uabc123', 2), true);
  expect(nm + ': give 4 hearts', d.write('worlds/cozy-town/board/notes/n1/h/uabc123', 4), false);
  expect(nm + ': take a heart back', d.write('worlds/cozy-town/board/notes/n1/h/uabc123', null), true);
  expect(nm + ': Move my game: read a code', d.read('worlds/cozy-town/move/BCDFGH'), true);
  expect(nm + ': Move my game: send', d.write('worlds/cozy-town/move/ZXWVTS', { s: '{"name":"ZZTEST"}', at: TS, exp: NOW + 600000, v: 1 }), true);
  expect(nm + ': Move my game: take a code down', d.write('worlds/cozy-town/move/BCDFGH', null), true);
  expect(nm + ': Move my game: list all codes', d.read('worlds/cozy-town/move'), false);
  expect(nm + ': read everything', d.read('/'), false);
  expect(nm + ': write somewhere else', d.write('worlds/other', 1), false);
}
/* ---- 2. before the new rules are pasted: every new place says no (the game then shows "coming soon") ---- */
{ const d = db(OLD);
  expect('old rules: look into my inbox', d.read(S + 'in/' + SIDA), false);
  expect('old rules: read the world chat', d.read(S + 'g'), false);
  expect('old rules: write a chat line', d.update(S, { ['g/' + id(0)]: { s: SIDA, n: 'ZZTEST', t: 'hi', at: TS }, gl: TS }), false);
  expect('old rules: read a thread', d.read(S + 't/' + TID + '/s'), false);
  expect('old rules: write my side of a thread', d.write(S + 't/' + TID + '/s/a', { s: 'r', at: TS, n: 'x' }), false); }
/* ---- 3. the new places ---- */
{ const d = db(NEW), ping = { e: E, c: C, at: TS }, P = S + 'in/' + SIDB + '/' + id(0);
  expect('nobody can list the social part', d.read(S.slice(0, -1)), false);
  expect('nobody can list the inboxes', d.read(S + 'in'), false);
  expect('nobody can list the threads', d.read(S + 't'), false);
  expect('nobody can read a thread\'s hidden parts (t/<tid>)', d.read(S + 't/' + TID), false);
  expect('nobody can read the text timers', d.read(S + 't/' + TID + '/x'), false);
  expect('nobody can read the inbox timers', d.read(S + 'ir'), false);
  expect('look into an inbox (sealed notes)', d.read(S + 'in/' + SIDB), true);
  expect('a friend request note, with its timer', d.update(S, { ['in/' + SIDB + '/' + id(0)]: ping, ['ir/' + SIDB]: TS }), true);
  expect('a note without the timer', d.write(P, ping), false);
  expect('a note with an old time', d.update(S, { ['in/' + SIDB + '/' + id(0)]: at(ping, 'at', NOW - 9), ['ir/' + SIDB]: TS }), false);
  expect('a note with an extra field', d.update(S, { ['in/' + SIDB + '/' + id(0)]: at(ping, 'x', 1), ['ir/' + SIDB]: TS }), false);
  expect('a note with a short key', d.update(S, { ['in/' + SIDB + '/' + id(0)]: at(ping, 'e', 'Bshort'), ['ir/' + SIDB]: TS }), false);
  expect('a note that is far too big', d.update(S, { ['in/' + SIDB + '/' + id(0)]: at(ping, 'c', 'c'.repeat(301)), ['ir/' + SIDB]: TS }), false);
  expect('a note with a bad name (id)', d.update(S, { ['in/' + SIDB + '/BAD']: ping, ['ir/' + SIDB]: TS }), false);
  expect('a note into a badly named inbox', d.update(S, { ['in/short/' + id(0)]: ping, 'ir/short': TS }), false);
  const one = tree({ [S + 'in/' + SIDB + '/' + id(0)]: { e: E, c: C, at: NOW }, [S + 'ir/' + SIDB]: NOW });
  expect('a second note into the same inbox 1 s later', db(NEW, one, NOW + 1000).update(S, { ['in/' + SIDB + '/' + id(1000)]: ping, ['ir/' + SIDB]: TS }), false);
  expect('a second note 4 s later', db(NEW, one, NOW + 4000).update(S, { ['in/' + SIDB + '/' + id(4000)]: ping, ['ir/' + SIDB]: TS }), true);
  expect('change a note that is there', db(NEW, one, NOW + 4000).update(S, { ['in/' + SIDB + '/' + id(0)]: ping, ['ir/' + SIDB]: TS }), false);
  expect('delete a fresh note', db(NEW, one, NOW + 4000).write(P, null), false);
  expect('tidy away a note after 2 weeks', db(NEW, one, NOW + 15 * 864e5).write(P, null), true);
  expect('delete the inbox timer', db(NEW, one, NOW + 4000).write(S + 'ir/' + SIDB, null), false);
}
{ const T = S + 't/' + TID + '/', side = { s: 'r', at: TS, n: 'n'.repeat(60) }, d = db(NEW);
  expect('my side of a thread: I ask', d.write(T + 's/a', side), true);
  expect('my side: yes', d.write(T + 's/b', at(side, 's', 'y')), true);
  expect('my side: no, without a name', d.write(T + 's/b', { s: 'n', at: TS }), true);
  expect('my side: a word that is not r, y or n', d.write(T + 's/a', at(side, 's', 'q')), false);
  expect('my side: an old time', d.write(T + 's/a', at(side, 'at', NOW - 5)), false);
  expect('my side: an extra field', d.write(T + 's/a', at(side, 'z', 1)), false);
  expect('my side: a name that is far too long', d.write(T + 's/a', at(side, 'n', 'n'.repeat(161))), false);
  expect('a third side', d.write(T + 's/c', side), false);
  expect('a thread with a short name', d.write(S + 't/short/s/a', side), false);
  expect('anything else in a thread', d.write(T + 'junk', 1), false);
  expect('read the two sides (who knows the thread\'s name)', d.read(T + 's'), true);
  expect('read the texts', d.read(T + 'm'), true);
  const fr = (a, b) => tree(Object.assign({}, a ? { [T + 's/a']: { s: a, at: NOW - 9000 } } : {}, b ? { [T + 's/b']: { s: b, at: NOW - 8000 } } : {}));
  const msg = f => ({ f, c: 'm'.repeat(60), at: TS }), put = (data, f, extra, now) => db(NEW, data, now).update(T.slice(0, -1), Object.assign({ ['m/' + id(0)]: msg(f), ['x/' + f]: TS }, extra || {}));
  expect('a text between friends (asked + yes)', put(fr('r', 'y'), 'a'), true);
  expect('a text between friends (yes + yes), from side b', put(fr('y', 'y'), 'b'), true);
  expect('a text when one side said no', put(fr('y', 'n'), 'a'), false);
  expect('a text when the other side never answered', put(fr('r', null), 'a'), false);
  expect('a text in an empty thread', put({}, 'a'), false);
  expect('a text without its timer', db(NEW, fr('y', 'y')).write(T + 'm/' + id(0), msg('a')), false);
  expect('a text with the other side\'s timer', db(NEW, fr('y', 'y')).update(T.slice(0, -1), { ['m/' + id(0)]: msg('a'), 'x/b': TS }), false);
  const sent = Object.assign(fr('y', 'y'));
  sent.worlds['cozy-town'].social.t[TID].x = { a: NOW }; sent.worlds['cozy-town'].social.t[TID].m = { [id(0)]: { f: 'a', c: 'm'.repeat(60), at: NOW } };
  expect('a second text half a second later', db(NEW, sent, NOW + 500).update(T.slice(0, -1), { ['m/' + id(500)]: msg('a'), 'x/a': TS }), false);
  expect('a second text a second later', db(NEW, sent, NOW + 1000).update(T.slice(0, -1), { ['m/' + id(1000)]: msg('a'), 'x/a': TS }), true);
  expect('the other side answers at once', db(NEW, sent, NOW + 100).update(T.slice(0, -1), { ['m/' + id(100)]: msg('b'), 'x/b': TS }), true);
  expect('change a text', db(NEW, sent, NOW + 1000).update(T.slice(0, -1), { ['m/' + id(0)]: msg('a'), 'x/a': TS }), false);
  expect('delete a text', db(NEW, sent, NOW + 1000).write(T + 'm/' + id(0), null), true);
  expect('a text that is far too long', db(NEW, fr('y', 'y')).update(T.slice(0, -1), { ['m/' + id(0)]: at(msg('a'), 'c', 'm'.repeat(901)), 'x/a': TS }), false);
  expect('a text from side c', db(NEW, fr('y', 'y')).update(T.slice(0, -1), { ['m/' + id(0)]: msg('c'), 'x/a': TS }), false);
  expect('a text with an extra field', db(NEW, fr('y', 'y')).update(T.slice(0, -1), { ['m/' + id(0)]: at(msg('a'), 'z', 1), 'x/a': TS }), false);
  expect('delete a text timer', db(NEW, sent, NOW + 1000).write(T + 'x/a', null), false);
  const call = k => ({ i: id(0), k, d: 'd'.repeat(5000), at: TS });
  expect('call a friend', db(NEW, fr('y', 'y')).write(T + 's/ca', call('o')), true);
  expect('answer a friend\'s call', db(NEW, fr('r', 'y')).write(T + 's/cb', call('a')), true);
  expect('call somebody who said no', db(NEW, fr('y', 'n')).write(T + 's/ca', call('o')), false);
  expect('call in an empty thread', db(NEW).write(T + 's/ca', call('o')), false);
  expect('hang up (also when no longer friends)', db(NEW, fr('y', 'n')).write(T + 's/ca', { i: id(0), k: 'x', at: TS }), true);
  expect('my call note goes when I leave', db(NEW, fr('y', 'y')).write(T + 's/ca', null), true);
  expect('a call note that is far too big', db(NEW, fr('y', 'y')).write(T + 's/ca', at(call('o'), 'd', 'd'.repeat(16001))), false);
  expect('a call note with another word', db(NEW, fr('y', 'y')).write(T + 's/ca', call('z')), false);
  expect('a call note with an extra field', db(NEW, fr('y', 'y')).write(T + 's/ca', at(call('o'), 'z', 1)), false);
}
{ const line = { s: SIDA, n: 'ZZTEST', t: 'Hello everyone!', at: TS }, d = db(NEW), say = (D, l, now, extra) => db(NEW, D, now).update(S.slice(0, -1), Object.assign({ ['g/' + id(now ? now - NOW : 0)]: l }, extra === undefined ? { gl: TS } : extra));
  expect('read the world chat', d.read(S + 'g'), true);
  expect('a world chat line, with the room\'s timer', say({}, line), true);
  expect('a line without the timer', say({}, line, 0, {}), false);
  expect('a line of 121 letters', say({}, at(line, 't', 'x'.repeat(121))), false);
  expect('an empty line', say({}, at(line, 't', '')), false);
  expect('a line with a 15-letter name', say({}, at(line, 'n', 'x'.repeat(15))), false);
  expect('a line with a bad player id', say({}, at(line, 's', 'short')), false);
  expect('a line with an extra field', say({}, at(line, 'url', 'x')), false);
  expect('a line with an old time', say({}, at(line, 'at', NOW - 60000)), false);
  expect('a line that is a number', say({}, 5), false);
  const one = tree({ [S + 'g/' + id(0)]: { s: SIDA, n: 'ZZTEST', t: 'hi', at: NOW }, [S + 'gl']: NOW });
  expect('a second line half a second later (anyone)', say(one, line, NOW + 500), false);
  expect('a second line 1.2 s later', say(one, line, NOW + 1200), true);
  expect('change a line', db(NEW, one, NOW + 5000).update(S.slice(0, -1), { ['g/' + id(0)]: line, gl: TS }), false);
  expect('delete a fresh line', db(NEW, one, NOW + 5000).write(S + 'g/' + id(0), null), false);
  expect('tidy away a line after a day', db(NEW, one, NOW + 864e5 + 5000).write(S + 'g/' + id(0), null), true);
  expect('delete the whole chat', db(NEW, one, NOW + 864e5 + 5000).write(S + 'g', null), false);
  expect('delete the room\'s timer', db(NEW, one, NOW + 5000).write(S + 'gl', null), false);
  expect('wipe the whole social part', db(NEW, one, NOW + 5000).write(S.slice(0, -1), null), false);
}
console.log('RULES: ' + (n - bad) + ' of ' + n + ' as expected' + (bad ? ' · ' + bad + ' WRONG' : ''));
process.exit(bad ? 1 : 0);
