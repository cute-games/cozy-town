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
