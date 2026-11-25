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
const roundSource = loop.slice(loop.indexOf('/* BEGIN DANCE SOURCES'), loop.indexOf('/* The new profile is a continuous stereo file'));
function danceClient() {
  const context = { window: {}, MP: { me: 'ZZTEST' }, realMs: () => 1795580000000 };
  const bot = loop.slice(loop.indexOf('function dnBotPlan'), loop.indexOf('function dnBotTick'));
  return vm.runInNewContext(seeded + '\n' + roundSource + '\n' + bot +
    '\nconst { DanceChart, DanceJudge } = window; ({dnRoundId,dnOnBeat,dnChart,dnClassic,DN_TRACK,dnStyle,dnMoveKind,dnRememberMove,DN_TYPES,DN_LOOP,dnProfile,dnBeatAt,dnRating,dnTally,dnTallyRating,dnPeerGrade,dnLeadTarget,dnBotPlan,DN_RATINGS})',
  context);
}
const dance = danceClient();

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


test('Funky variants match on separate clients and cover both moves per arrow', () => {
  const r = dance.dnRoundId({ v: 2026112507 });
  const chart = dance.dnChart(r);
  const remote = danceClient().dnChart(r);
  assert.equal(JSON.stringify(chart), JSON.stringify(remote));
  assert.ok(dance.dnStyle(r));
  assert.equal(Object.keys(dance.DN_TYPES).length, 11);
  assert.equal(new Set(chart.map(note => note.variant)).size, 8);
  for (const note of chart) assert.equal(Math.floor((note.variant - 4) / 2), note.d);
  assert.equal(dance.dnStyle(dance.dnRoundId({ v: 2026112506 })), null);
});

test('5- and 10-combo moves stay shared when another note lands', () => {
  const r = dance.dnRoundId({ v: 2026112507 });
  const chart = dance.dnChart(r), wire = {};
  dance.dnRememberMove(wire, chart[0], 0, 5, 1);
  dance.dnRememberMove(wire, chart[1], 1, 6, 1.3);
  assert.equal(wire.m, 0);
  assert.equal(dance.dnMoveKind(chart[wire.m].variant, wire.c), 12);
  dance.dnRememberMove(wire, chart[5], 5, 10, 2);
  assert.equal(wire.at, 2000);
  assert.equal(dance.dnMoveKind(chart[wire.m].variant, wire.c), 13);
});

const fullLoop = require('../alley-cat-loop.json');
const slice3ID = 'beat3s-alley-cat-slice-3';
test('both players get the same five loops, tempo steps and steady fallback', () => {
  const other = danceClient(), r = dance.dnRoundId({v: 2026112508, dp: true}, true);
  const fast = dance.dnProfile(r);
  assert.ok(fast);
  assert.equal(JSON.stringify(fast), JSON.stringify(other.dnProfile(r)));
  assert.deepEqual(Array.from(fast.segments.slice(0, 5), s => s[2]), [1, 1, 1.06, 1.12, 1.12]);
  for (const [i, [start, end, speed]] of fast.segments.slice(0, 5).entries()) {
    assert.ok(Math.abs((end - start) * speed - fullLoop.sourceLength) < .000025);
    assert.equal(Math.round(dance.dnBeatAt(start, fast)), i * 32);
    assert.ok(Math.abs(dance.dnBeatAt(start + .25, fast) - i*32 - .25*speed*fullLoop.bpm/60) < 1e-8);
  }
  for (const [local, remote] of [[false,true],[true,false]]) {
    const steady = dance.dnRoundId({v: 2026112508, dp: remote}, local);
    assert.ok(steady.startsWith('beat3n-'));
    assert.ok(other.dnProfile(steady).segments.every(segment => segment[2] === 1));
  }
  assert.equal(fast.segments.at(-1)[1], 85);
  assert.equal(dance.DN_LOOP.preroll, 1.5);
});
test('seeded chart uses attacks, short runs and doubles at faster density', () => {
  const notes = dance.dnChart(slice3ID), {accents, segments} = dance.dnProfile(slice3ID);
  assert.equal(JSON.stringify(notes), JSON.stringify(danceClient().dnChart(slice3ID)));
  assert.notEqual(JSON.stringify(notes),JSON.stringify(dance.dnChart(slice3ID+'-2')));
  const at = new Map(accents.map(([t, ,kind])=>[t,kind]));
  assert.ok(notes.every(note=>at.get(note.t)===note.kind));
  assert.equal(new Set(notes.map(note=>note.kind)).size,4);
  const base = notes.filter(note=>note.t<segments[2][0]).length / segments[2][0];
  const fast = notes.filter(note=>note.t>=segments[3][0]).length / (85-segments[3][0]);
  const pairs = notes.filter((n,i)=>i>0&&n.t===notes[i-1].t&&n.d!==notes[i-1].d);
  assert.ok(base>=1.6&&base<=2&&fast>base&&pairs.length>=2&&pairs.length<=22,
    JSON.stringify({base,fast,doubles:pairs.length}));
  assert.ok(notes.some((n,i)=>i>=2&&n.t-notes[i-2].t<.55&&n.t>notes[i-1].t&&notes[i-1].t>notes[i-2].t));
  console.log(`Chart: ${base.toFixed(2)} arrows/s at base, ${fast.toFixed(2)} at +12%, ${pairs.length} doubles`);
});
test('quick runs keep the complete Funky move on its musical accent', () => {
  const notes = dance.dnChart(slice3ID), profile = dance.dnProfile(slice3ID), wire = {};
  dance.dnRememberMove(wire, notes[0], 0, 1, notes[0].t + .07, profile, notes);
  const start = wire.at;
  assert.equal(start, Math.round(notes[0].t * 1000));
  dance.dnRememberMove(wire, notes[1], 1, 2, notes[1].t, profile, notes);
  assert.equal(wire.at, start);
  dance.dnRememberMove(wire, notes[2], 2, 5, notes[2].t, profile, notes);
  assert.equal(wire.m, 2);
});
function printSync(notes,onsets,label){
  const picks = Array.from({length:20}, (_,i)=>notes[Math.floor((i+.5)*notes.length/20)]);
  const errors = picks.map(note => {
    let best = Infinity;
    for(const at of onsets){const error=(note.t-at)*1000;if(Math.abs(error)<Math.abs(best))best=error;}
    return best;
  });
  const absolute = errors.map(Math.abs).sort((a,b)=>a-b), median=(absolute[9]+absolute[10])/2;
  console.log(`${label}, arrow hit minus onset in ms: ${errors.map(n=>Math.abs(n)<.05?'0.0':(n>=0?'+':'')+n.toFixed(1)).join(', ')}`);
  console.log(`${label}, median absolute: ${median.toFixed(1)} ms`);
  assert.ok(median<25);
}
test('20 sampled chart events meet the 25 ms median against independently detected onsets', () => {
  printSync(dance.dnChart(slice3ID),fullLoop.profiles.fast.verify,'MP3 fast');
  printSync(dance.dnChart(slice3ID.replace('beat3s-', 'beat3n-')),fullLoop.profiles.steady.verify,'MP3 steady');
});

test('five duel ratings keep the full inclusive hit window and reset combo on either miss', () => {
  assert.deepEqual([0,.10,.1001,.19,.1901,.28,.2801,-.28].map(dance.dnRating), [0,0,1,1,2,2,3,2]);
  assert.deepEqual(Array.from(dance.DN_RATINGS.slice(0,5), r=>r.points), [15,10,5,0,0]);
  const tally=dance.dnTally();
  for(const grade of [0,1,2,3,0,4,2])dance.dnTallyRating(tally,grade);
  assert.deepEqual(Array.from(tally.counts),[2,1,2,1,1]);
  assert.equal(tally.combo,1);
  assert.equal(tally.best,3);
});
test('peer score deltas classify only single known hits and signed leads stay bounded', () => {
  assert.deepEqual([dance.dnPeerGrade(15,1,false),dance.dnPeerGrade(10,1,true),
    dance.dnPeerGrade(5,1,true),dance.dnPeerGrade(10,1,false),dance.dnPeerGrade(15,2,true)],[0,1,2,5,5]);
  assert.deepEqual([dance.dnLeadTarget(15,0),dance.dnLeadTarget(0,15),dance.dnLeadTarget(900,5),
    dance.dnLeadTarget(5,900),dance.dnLeadTarget(10,10)],[.03125,-.03125,1,-1,0]);
});
test('the bot plays a seeded chart with real hit grades and separate empty-note misses', () => {
  const chart=dance.dnChart(slice3ID),events=dance.dnBotPlan(slice3ID,chart);
  assert.equal(JSON.stringify(events),JSON.stringify(danceClient().dnBotPlan(slice3ID,chart)));
  const marks=Array.from(events).filter(e=>e.i>=0);
  assert.equal(marks.length,chart.length);
  assert.equal(new Set(marks.map(e=>e.i)).size,chart.length);
  assert.equal(marks.filter(e=>e.grade<=2).length,Math.round(chart.length*.8));
  assert.equal(new Set(events.map(e=>e.grade)).size,5);
  assert.ok(events.every((e,i)=>!i||e.t>=events[i-1].t));
});
