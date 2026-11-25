/* Cozy Town check: runs inside TEST COPIES only, never in the real game (25 Nov 2026).
   The kit's fakenet.js with one thing more: the pretend database can say NO, like the real one does when its rules refuse a
   read or a write. A refused listener gets its "cancel" call (the 3rd argument of on); a refused write's promise is rejected.
   test_social.py puts this file in place of fakenet.js when it runs with --rules (the relay then asks rules_server.js). */
(() => {
  const _raf = window.requestAnimationFrame.bind(window);
  const L = window.__loop = { manual: false, cb: null };
  window.requestAnimationFrame = function (cb) { if (L.manual) { L.cb = cb; return 1; } return _raf(cb); };

  const send = (o) => (window.__relay ? window.__relay(JSON.stringify(o)) : Promise.resolve()).then((r) => {
    if (r === 'denied') { const e = new Error('PERMISSION_DENIED: Permission denied'); e.code = 'PERMISSION_DENIED'; throw e; } return r; });
  const listeners = {};
  const copy = (v) => (v === undefined || v === null) ? null : JSON.parse(JSON.stringify(v));
  const snap = (v) => ({ val: () => copy(v), exists: () => v != null });
  window.__relayPush = (path, val) => {
    const S = listeners[path];
    if (S) for (const cb of [...S]) { try { cb(snap(val)); } catch (e) { console.error(e); } }
  };
  window.__denied = [];   /* every refused read or write, for the test to look at */
  const norm = (p) => String(p).replace(/^\/+|\/+$/g, '');
  const wr = (o) => send(o).catch((e) => { window.__denied.push(o.op + ' ' + o.path); throw e; });   /* (the game must catch it, as with the real library) */
  function ref(p) {
    p = norm(p);
    return {
      key: p.split('/').pop(),
      child: (k) => ref(p + '/' + k),
      set: (v) => wr({ op: 'set', path: p, val: v }),
      update: (d) => wr({ op: 'update', path: p, val: d }),
      remove: () => wr({ op: 'remove', path: p }),
      onDisconnect: () => ({ remove: () => send({ op: 'ondisc', path: p }) }),
      on: (ev, cb, err) => {
        (listeners[p] = listeners[p] || new Set()).add(cb);
        if (p === '.info/serverTimeOffset') { setTimeout(() => cb(snap(0)), 0); return cb; }
        if (p === '.info/connected') { setTimeout(() => cb(snap(true)), 0); return cb; }
        send({ op: 'listen', path: p }).catch((e) => { window.__denied.push('listen ' + p); listeners[p].delete(cb); if (err) { try { err(e); } catch (x) { console.error(x); } } });
        return cb;
      },
      off: (ev, cb) => { const S = listeners[p]; if (S) { if (cb) S.delete(cb); else S.clear(); } },
    };
  }
  const TS = { '.sv': 'timestamp' };
  const db = { ref };
  const database = function () { return db; };
  database.ServerValue = { TIMESTAMP: TS };
  const app = { name: '[DEFAULT]', options: {} };
  const FAKE = {
    apps: [], SDK_VERSION: 'cozycheck-fake',
    initializeApp() { if (!FAKE.apps.length) FAKE.apps.push(app); return app; },
    app() { return app; }, database,
  };
  const NOOP = new Proxy(function () {}, {
    get: (t, k) => (k === Symbol.toPrimitive ? () => '' : NOOP), apply: () => NOOP, construct: () => NOOP,
  });
  const FB = new Proxy(FAKE, { get(t, k) { return (k in t) ? t[k] : NOOP; } });
  Object.defineProperty(window, 'firebase', { configurable: true, get() { return FB; }, set(v) { window.__realFirebaseIgnored = true; } });
})();
