'use strict';

const assert = require('node:assert/strict');
const { makeChart } = require('../chart.js');
const { judge, score, emptyScore } = require('../judge.js');

function test(label, fn) {
  try {
    fn();
    console.log('PASS ' + label);
  } catch (error) {
    console.log('FAIL ' + label + ' — ' + error.message);
    process.exitCode = 1;
  }
}

const grid = { bpm: 120, firstBeat: 0.12, duration: 25 };
test('same seed gives the same chart', () => {
  const chart = makeChart(grid, 5, 197);
  assert.deepEqual(chart, makeChart(grid, 5, 197));
  assert.notDeepEqual(chart, makeChart(grid, 5, 198));
});
test('level 1 is every two beats and level 5 is denser', () => {
  const easy = makeChart(grid, 1, 197);
  const hard = makeChart(grid, 5, 197);
  assert.ok(easy.every((note, index) => !index || Math.abs(note.time - easy[index - 1].time - 1) < 1e-8));
  assert.ok(hard.length > easy.length * 2);
  assert.ok(hard.filter(note => note.time > grid.duration / 2).length >
    hard.filter(note => note.time <= grid.duration / 2).length);
  assert.ok(hard.some((note, index) => index && note.time === hard[index - 1].time));
  assert.ok(hard.some(note => Math.abs((note.time - grid.firstBeat) % 0.5 - 0.25) < 1e-8));
});
test('0.09 s off is Perfect and scores 15', () => assert.deepEqual(
  [judge(0.09).label, judge(-0.09).points], ['Perfect', 15]));
test('0.27 s off is Late-but-OK and scores 10', () => assert.deepEqual(
  [judge(0.27).label, judge(-0.27).points], ['Late-but-OK', 10]));
test('0.29 s off is a Miss', () => assert.equal(judge(0.29).label, 'Miss'));
test('a miss clears the combo and keeps the best combo', () => {
  const first = score(emptyScore(), judge(0));
  const second = score(first, judge(0.17));
  assert.deepEqual(score(second, judge(0.30)), { total: 25, combo: 0, best: 2, perfect: 1 });
});

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const repo = path.resolve(__dirname, '../../..');
const core = fs.readFileSync(path.join(repo, 'js/00-core.js'), 'utf8');
const loop = fs.readFileSync(path.join(repo, 'js/09-mainloop.js'), 'utf8');
const seeded = core.match(/^function seeded.*$/m)[0];
const roundSource = loop.slice(loop.indexOf('/* BEGIN DANCE SOURCES'), loop.indexOf('/* Only the countdown'));
const context = { window: {}, MP: { me: 'ZZTEST' }, realMs: () => 1795580000000 };
const dance = vm.runInNewContext(seeded + '\n' + roundSource +
  '\nconst { DanceChart, DanceJudge } = window; ({dnRoundId,dnOnBeat,dnChart,dnClassic,DN_TRACK})', context);

test('both clients get the same Alley Cat beat chart from the round id', () => {
  const r = dance.dnRoundId({ v: 2026112506 });
  const chart = dance.dnChart(r);
  assert.equal(dance.DN_TRACK.src, 'music/alley-cat-dumpster-divin.mp3');
  assert.ok(dance.dnOnBeat(r));
  assert.deepEqual(chart, dance.dnChart(r));
  assert.ok(chart.every(note => {
    const beat = (note.t - dance.DN_TRACK.firstBeat) * dance.DN_TRACK.bpm / 30;
    return Math.abs(beat - Math.round(beat)) < 1e-8;
  }));
});
test('an older partner keeps the classic chart and older spectators can read the moves', () => {
  const r = dance.dnRoundId({ v: 2026112505 });
  const classic = dance.dnChart(r);
  assert.ok(!dance.dnOnBeat(r));
  assert.equal(classic.length, 20);
  assert.ok(classic.every((note, i) => Math.abs(note.t - (2 + i * 1.15)) < 1e-8));
  const newer = dance.dnRoundId({ v: 2026112506 });
  const oldView = dance.dnClassic(newer);
  assert.ok(dance.dnChart(newer).every(note => oldView[note.move]?.d === note.d));
});
