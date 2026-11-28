(function (root) {
  'use strict';

  function seedFor(text) {
    let seed = 2166136261;
    for (let i = 0; i < text.length; i++) {
      seed = Math.imul(seed ^ text.charCodeAt(i), 16777619);
    }
    return seed >>> 0;
  }

  function seeded(seed) {
    let state = seed >>> 0;
    return function () {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function makeChart(grid, level, seed) {
    const random = seeded(seed);
    const period = 60 / grid.bpm;
    const notes = [];
    const first = Math.ceil((0.46 - grid.firstBeat) / period);
    const last = Math.floor((grid.duration - 0.64 - grid.firstBeat) / period);
    const span = Math.max(1, last - first);
    let previous = -1;
    function add(time, double) {
      const lane = previous < 0 ? Math.floor(random() * 4) : (previous + 1 + Math.floor(random() * 3)) % 4;
      notes.push({ time, lane });
      if (double) notes.push({ time, lane: (lane + 2) % 4 });
      previous = lane;
    }

    for (let beat = first; beat <= last; beat++) {
      const progress = (beat - first) / span;
      const time = grid.firstBeat + beat * period;
      // Level one stays on alternate beats. At higher levels, extra
      // subdivisions and doubles enter progressively over the round.
      const primary = (beat - first) % 2 === 0 ||
        (level > 1 && (level >= 4 || random() < (level - 1) * (0.21 + progress * 0.22)));
      if (primary) add(time, level === 5 && (beat - first) % (progress < 0.5 ? 8 : 4) === 2);
      if (beat < last && level >= 3 &&
          (level === 5 && progress >= 0.67 || random() < (level - 2) * (0.10 + progress * 0.16))) {
        add(time + period / 2, false);
      }
    }
    return notes;
  }

  const api = { seedFor, seeded, makeChart };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DanceChart = api;
}(typeof window === 'object' ? window : globalThis));
