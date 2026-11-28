(function (root) {
  'use strict';

  const perfect = { key: 'perfect', label: 'Perfect', points: 15 };
  const good = { key: 'good', label: 'Good', points: 10 };
  const late = { key: 'late', label: 'Late-but-OK', points: 10 };
  const miss = { key: 'miss', label: 'Miss', points: 0 };

  function judge(error, window = 0.28) {
    const distance = Math.abs(error);
    if (distance > window) return miss;
    if (distance <= Math.min(window, 0.10)) return perfect;
    if (distance <= Math.min(window, 0.19)) return good;
    return late;
  }

  function emptyScore() {
    return { total: 0, combo: 0, best: 0, perfect: 0 };
  }

  function score(previous, result) {
    const combo = result.points ? previous.combo + 1 : 0;
    return {
      total: previous.total + result.points,
      combo,
      best: Math.max(previous.best, combo),
      perfect: previous.perfect + Number(result.key === 'perfect')
    };
  }

  const api = { judge, emptyScore, score };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DanceJudge = api;
}(typeof window === 'object' ? window : globalThis));
