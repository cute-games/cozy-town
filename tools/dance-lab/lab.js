(function () {
  'use strict';

  const songs = window.DANCE_SONGS;
  const { makeChart, seedFor, seeded } = window.DanceChart;
  const { judge, score, emptyScore } = window.DanceJudge;
  const { themes, stagePainter, lanePainter } = window.DanceFX;
  const byId = id => document.getElementById(id);
  const lab = byId('lab');
  const audio = byId('audio');
  const stage = byId('stage');
  const arrows = byId('arrows');
  const drawStage = stagePainter(stage);
  const drawLane = lanePainter(arrows);
  const pads = Array.from(document.querySelectorAll('.pad'));
  const guide = byId('guide');
  const settings = byId('settings');
  const status = byId('calibration-status');
  const songList = byId('song-list');
  const version = byId('version');
  const callout = byId('callout');
  const progress = byId('progress');
  const offsetStorage = 'cozy-dance-lab-offset';
  const arrowsByKey = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3 };
  const judgmentColors = { perfect: '#ffe0a2', good: '#aef0d4', late: '#cbe0ff', miss: '#d4c9d9' };
  const controls = Object.fromEntries(['level', 'speed', 'window', 'strength', 'offset', 'calm', 'auto', 'grid']
    .map(name => [name, byId(name)]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let selected = 0;
  let selectedVersion = 0;
  let expanded = -1;
  let round;
  let mode = 'lobby';
  let nextFrame = 0;
  let lastDraw = -Infinity;
  let sizeDirty = true;
  let elapsed = -1;
  let judgmentTimeout = 0;
  let progressTick = -1;
  let calibration;
  let audioContext;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function timeText(seconds) {
    const whole = Math.max(0, Math.floor(seconds));
    return Math.floor(whole / 60) + ':' + ('0' + whole % 60).slice(-2);
  }

  function currentTrack() {
    return songs[selected].versions[selectedVersion];
  }

  function makeSongList() {
    byId('track-count').textContent = songs.length + ' songs';
    songs.forEach((song, index) => {
      const theme = themes[song.id];
      const group = document.createElement('div');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'song';
      button.dataset.song = song.id;
      button.setAttribute('aria-pressed', String(index === selected));
      button.style.setProperty('--tile', theme.tile);
      button.style.setProperty('--song-accent', theme.accent);

      const icon = document.createElement('span');
      icon.className = 'song-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = theme.icon;
      const copy = document.createElement('span');
      const title = document.createElement('span');
      title.className = 'song-title';
      title.textContent = song.title;
      const artist = document.createElement('span');
      artist.className = 'song-artist';
      artist.textContent = song.artist;
      copy.append(title, artist);
      const meta = document.createElement('span');
      meta.className = 'song-meta';
      meta.textContent = song.versions.length > 1 ? song.versions.length + ' versions' : '▶︎';
      if (song.versions.length === 1) meta.setAttribute('aria-hidden', 'true');
      button.append(icon, copy, meta);
      group.append(button);

      const choices = document.createElement('div');
      choices.className = 'song-versions';
      choices.hidden = true;
      if (song.versions.length > 1) {
        choices.id = 'versions-' + song.id;
        button.setAttribute('aria-controls', choices.id);
        button.setAttribute('aria-expanded', 'false');
        song.versions.forEach((track, n) => {
          const pick = document.createElement('button');
          pick.type = 'button';
          pick.textContent = track.label;
          pick.className = 'button secondary';
          pick.addEventListener('click', () => {
            selectedVersion = n;
            startRound();
          });
          choices.append(pick);
        });
        group.append(choices);
      }

      button.addEventListener('click', () => {
        const sameSong = selected === index;
        selected = index;
        if (!sameSong) selectedVersion = 0;
        expanded = song.versions.length > 1 && expanded !== index ? index : -1;
        showSelection();
        if (song.versions.length === 1) startRound();
      });
      songList.append(group);
    });
  }

  function showSelection() {
    const song = songs[selected];
    const theme = themes[song.id];
    const track = currentTrack();
    lab.style.setProperty('--accent', theme.accent);
    byId('theme-name').textContent = theme.name;
    byId('song-title').textContent = song.title;
    byId('artist').textContent = song.artist;
    byId('tempo').textContent = Math.round(track.bpm) + ' BPM' +
      (mode !== 'lobby' && song.versions.length > 1 ? ' · ' + track.label : '');
    byId('version-control').hidden = song.versions.length < 2;
    version.textContent = '';
    song.versions.forEach((item, n) => {
      const option = document.createElement('option');
      option.value = String(n);
      option.textContent = item.label;
      version.append(option);
    });
    version.value = String(selectedVersion);
    Array.from(songList.children).forEach((group, index) => {
      const row = group.firstElementChild;
      row.setAttribute('aria-pressed', String(index === selected));
      if (group.children.length < 2) return;
      row.setAttribute('aria-expanded', String(index === expanded));
      group.lastElementChild.hidden = index !== expanded;
    });
  }

  function updateOptions() {
    calm = controls.calm.checked || reduceMotion.matches;
    lab.classList.toggle('calm', calm);
    byId('read-level').textContent = controls.level.value + ' / 5';
    byId('read-speed').textContent = Number(controls.speed.value).toFixed(2) + '×';
    byId('read-window').textContent = '±' + controls.window.value + ' ms';
    byId('read-strength').textContent = controls.strength.value + '%';
    const delay = Number(controls.offset.value);
    byId('read-offset').textContent = (delay > 0 ? '+' : delay < 0 ? '−' : '') + Math.abs(delay) + ' ms';
    byId('play-mode').hidden = mode === 'lobby' || !controls.auto.checked;
  }

  let calm;
  function setOffset(value) {
    controls.offset.value = String(clamp(Math.round(value), -250, 250));
    try {
      localStorage.setItem(offsetStorage, controls.offset.value);
    } catch (error) {
      // Private browsing and file URLs can limit storage.
    }
    updateOptions();
  }

  function timingOffset() {
    return Number(controls.offset.value) / 1000;
  }

  function windowSize() {
    return Number(controls.window.value) / 1000;
  }

  function updateScore() {
    byId('player-score').textContent = round.player.total;
    byId('bot-score').textContent = round.bot.total;
    byId('combo-count').textContent = round.player.combo;
    const sum = round.player.total + round.bot.total;
    const split = sum ? clamp(round.player.total / sum * 100, 3, 97) : 50;
    byId('score-track').style.setProperty('--split', split + '%');
  }

  function resetCallout() {
    clearTimeout(judgmentTimeout);
    callout.textContent = '';
    callout.classList.remove('pop');
  }

  function setMode(value) {
    mode = value;
    const lobby = mode === 'lobby';
    lab.classList.toggle('playing', !lobby);
    for (const id of ['play-panel', 'scoreboard', 'back', 'restart', 'transport']) byId(id).hidden = lobby;
    byId('preview-controls').hidden = !lobby;
    byId('playlist').hidden = !lobby;
    byId('count').hidden = mode !== 'countdown' && mode !== 'starting';
    byId('result').hidden = mode !== 'ended';
    byId('play-gate').hidden = mode !== 'awaiting';
    byId('stage-caption').textContent = lobby ? 'Stage preview' : 'Dance-off';
    byId('message').hidden = mode !== 'blocked';
    updateOptions();
    sizeDirty = true;
  }

  function startRound() {
    stopCalibration();
    openGuide(false);
    const track = currentTrack();
    const level = Number(controls.level.value);
    const seed = seedFor(track.src + ':' + level);
    const random = seeded(seed ^ 0xc0f173f);
    const notes = makeChart(track, level, seed).map(note => {
      const botHits = random() < .8;
      const botError = random();
      const autoError = random();
      return {
        time: note.time,
        lane: note.lane,
        done: false,
        botHits,
        botError,
        autoError
      };
    });

    audio.pause();
    if (audio.getAttribute('src') !== track.src || audio.error) {
      audio.src = track.src;
      audio.load();
    } else {
      audio.currentTime = 0;
    }
    // Prime the same media element directly from the user's gesture for Safari.
    // The audible playback request is made after the countdown.
    const priming = audio.play();
    audio.pause();
    if (priming) priming.catch(() => {});
    round = {
      track,
      notes,
      countUntil: performance.now() + 3000,
      player: emptyScore(),
      bot: emptyScore(),
      firstNote: 0,
      nextBot: 0,
      nextAuto: 0,
      bursts: [],
      receptors: [-Infinity, -Infinity, -Infinity, -Infinity],
      moves: [null, null],
      perfectRun: 0,
      lastPerfect: -Infinity,
      lastBump: -Infinity,
      fxRandom: seeded(seed ^ 0x61b0f213)
    };
    elapsed = -1;
    progressTick = -1;
    progress.max = track.duration;
    progress.value = 0;
    byId('elapsed').textContent = '0:00';
    byId('duration').textContent = timeText(track.duration);
    byId('count').textContent = '3';
    for (const pad of pads) pad.classList.remove('active');
    resetCallout();
    setMode('countdown');
    showSelection();
    updateScore();
    if (document.activeElement && document.activeElement.closest('[hidden]')) {
      byId('restart').focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  function backToSongs() {
    audio.pause();
    round = undefined;
    resetCallout();
    setMode('lobby');
    showSelection();
    songList.children[selected].firstElementChild.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function playbackFailed(owner) {
    if (round !== owner || !['countdown', 'starting', 'awaiting', 'playing'].includes(mode)) return;
    audio.pause();
    setMode('blocked');
    byId('message').textContent = 'The song couldn’t play. Tap Restart to try again.';
  }

  function beginPlaying() {
    setMode('starting');
    byId('count').textContent = '♪';
    const owner = round;
    const playing = audio.play();
    if (!playing) {
      setMode('playing');
      return;
    }
    playing.then(() => {
      if (round === owner && mode === 'starting') setMode('playing');
    }).catch(error => {
      if (round !== owner || mode !== 'starting') return;
      if (error.name === 'NotAllowedError') {
        // Some browsers require a second tap to start sound after the countdown.
        setMode('awaiting');
        byId('resume').focus({ preventScroll: true });
      } else {
        playbackFailed(owner);
      }
    });
  }

  function showResults() {
    if (!round || mode !== 'playing') return;
    advance(round.track.duration, performance.now());
    setMode('ended');
    resetCallout();
    progress.value = progress.max;
    byId('elapsed').textContent = timeText(round.track.duration);
    byId('final-player').textContent = round.player.total;
    byId('final-bot').textContent = round.bot.total;
    byId('final-combo').textContent = round.player.best;
    byId('final-perfect').textContent = round.player.perfect;
    if (guide.hidden) byId('result-title').focus({ preventScroll: true });
  }

  function feedback(lane, result, time, now) {
    round.player = score(round.player, result);
    round.perfectRun = result.key === 'perfect' ? round.perfectRun + 1 : 0;
    const strength = Number(controls.strength.value) / 100;
    if (result.points) {
      round.moves[0] = { lane, at: time };
      if (now - round.receptors[lane] >= 335) round.receptors[lane] = now;
    }
    if (result.key === 'perfect') {
      round.lastPerfect = now;
      if (strength && !calm && now - round.lastBump >= 335) round.lastBump = now;
    }
    if (!calm && strength > 0) {
      const random = round.fxRandom;
      const count = Math.round((result.points ? 11 : 5) * strength);
      const bits = Array.from({ length: count }, () => ({
        angle: random() * Math.PI * 2, speed: .47 + random() * 1.1, size: .055 + random() * .085
      }));
      round.bursts.push({ lane, at: now, miss: !result.points, bits });
      if (round.bursts.length > 14) round.bursts.shift();
    }
    updateScore();
    callout.style.setProperty('--judgment', judgmentColors[result.key]);
    callout.textContent = result.label;
    callout.classList.remove('pop');
    // Keep the copy readable when a pair of notes lands together.
    void callout.offsetWidth;
    if (!calm) callout.classList.add('pop');
    clearTimeout(judgmentTimeout);
    judgmentTimeout = setTimeout(resetCallout, 450);
  }

  function missExpired(time, now) {
    const boundary = time - timingOffset() - windowSize();
    let missed = -1;
    let count = 0;
    while (round.firstNote < round.notes.length) {
      const note = round.notes[round.firstNote];
      if (!note.done) {
        if (note.time >= boundary) break;
        note.done = true;
        missed = note.lane;
        count++;
      }
      round.firstNote++;
    }
    // Several lost frames may expire multiple notes. Show one gentle puff.
    if (count > 0) feedback(missed, judge(Infinity), time, now);
  }

  function autoPress(note, time, now) {
    note.done = true;
    const limit = windowSize();
    const error = note.autoError < .86 ? note.autoError * .06 :
      note.autoError < .96 ? Math.min(.15, limit) : Math.min(.24, limit);
    feedback(note.lane, judge(error, limit), time, now);
  }

  function advance(time, now) {
    const limit = windowSize();
    const offset = timingOffset();
    const notes = round.notes;

    while (round.nextBot < notes.length && notes[round.nextBot].time <= time) {
      const note = notes[round.nextBot++];
      const result = judge(note.botHits ? note.botError * Math.min(.225, limit) : Infinity, limit);
      round.bot = score(round.bot, result);
      if (result.points) round.moves[1] = { lane: note.lane, at: time };
      updateScore();
    }
    if (controls.auto.checked) {
      round.nextAuto = Math.max(round.nextAuto, round.firstNote);
      while (round.nextAuto < notes.length && notes[round.nextAuto].time + offset <= time) {
        const note = notes[round.nextAuto++];
        if (!note.done) autoPress(note, time, now);
      }
    }
    missExpired(time, now);
    while (round.bursts.length && now - round.bursts[0].at >= 440) round.bursts.shift();
  }

  function pressLane(lane) {
    if (mode !== 'playing' || controls.auto.checked) return;
    const time = audio.currentTime;
    const now = performance.now();
    const offset = timingOffset();
    const limit = windowSize();
    missExpired(time, now);
    let closest;
    let error = Infinity;
    for (let i = round.firstNote; i < round.notes.length; i++) {
      const note = round.notes[i];
      const delta = time - note.time - offset;
      if (delta < -limit) break;
      if (!note.done && note.lane === lane && Math.abs(delta) < Math.abs(error)) {
        closest = note;
        error = delta;
      }
    }
    if (closest) closest.done = true;
    feedback(lane, judge(error, limit), time, now);
  }

  function fit(canvas, limit, ratio) {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const density = Math.min(1.5, window.devicePixelRatio || 1, Math.sqrt(limit / (bounds.width * bounds.height)));
    const w = Math.max(1, Math.round(bounds.width * density));
    const h = Math.max(1, Math.round(ratio ? w / ratio : bounds.height * density));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
  }

  function render(now) {
    if (mode === 'countdown') {
      const remaining = Math.ceil((round.countUntil - now) / 1000);
      if (remaining > 0) {
        if (byId('count').textContent !== String(remaining)) byId('count').textContent = remaining;
      } else {
        beginPlaying();
      }
    }
    const track = currentTrack();
    const live = mode === 'playing';
    const time = live ? audio.currentTime : mode === 'ended' ? track.duration : 0;
    if (live) {
      advance(time, now);
      if (elapsed !== Math.floor(time)) {
        elapsed = Math.floor(time);
        byId('elapsed').textContent = timeText(time);
      }
      if (progressTick !== Math.floor(time * 10)) {
        progressTick = Math.floor(time * 10);
        progress.value = time;
      }
    }

    if (sizeDirty) {
      fit(stage, 660000, 1.5);
      fit(arrows, 245000);
      sizeDirty = false;
    }
    const period = 60 / track.bpm;
    const beat = mode === 'lobby' ? now / 1000 / period : (time - track.firstBeat) / period;
    const phase = beat - Math.floor(beat);
    const lightBeat = live ? (time - track.firstBeat) / Math.max(.335, period) : beat;
    const lightPhase = lightBeat - Math.floor(lightBeat);
    const envelope = Math.max(0, time / track.loudStep);
    const lo = Math.floor(envelope);
    const energy = live ? (track.loudness[lo] || 0) * (1 - envelope % 1) +
      (track.loudness[lo + 1] || 0) * (envelope % 1) : .45;
    const strength = Number(controls.strength.value) / 100;
    const intensity = 1 + selectedVersion * .11;
    const pulse = calm ? .08 + .04 * Math.cos(beat * Math.PI * 2) :
      Math.pow(1 - phase, 2.1) * (.45 + energy * .55) * intensity;
    const light = calm ? 0 : Math.pow(1 - lightPhase, 2) * strength * intensity;
    drawStage(themes[songs[selected].id], {
      calm, time, energy, beat: calm ? 0 : beat, phase: calm ? .45 : phase, pulse, light, lightBeat: calm ? 0 : lightBeat,
      motion: calm ? 1.3 + beat * .28 : beat + 1,
      bump: live && !calm ? Math.max(0, 1 - (now - round.lastBump) / 145) * strength : 0,
      streak: live && !calm && round.perfectRun >= 3 ?
        Math.max(0, 1 - (now - round.lastPerfect) / 800) * strength : 0,
      moves: round ? round.moves : [null, null]
    });
    if (round) {
      drawLane({
        calm, time, now, strength, period,
        travel: 1.42 / Number(controls.speed.value),
        offset: timingOffset(),
        firstBeat: track.firstBeat,
        beatGrid: controls.grid.checked,
        notes: round.notes, firstNote: round.firstNote, bursts: round.bursts, receptors: round.receptors
      });
    }
  }

  function animate(now) {
    nextFrame = 0;
    if (document.hidden) return;
    const needsLiveClock = mode === 'playing' || mode === 'countdown' || mode === 'starting';
    if (needsLiveClock || sizeDirty || now - lastDraw >= 32) {
      render(now);
      lastDraw = now;
    }
    nextFrame = requestAnimationFrame(animate);
  }

  function scheduleFrame() {
    if (!nextFrame && !document.hidden) nextFrame = requestAnimationFrame(animate);
  }

  function openGuide(open) {
    if (guide.hidden === !open) return;
    guide.hidden = !open;
    settings.setAttribute('aria-expanded', String(open));
    if (open) byId('close-guide').focus({ preventScroll: true });
    else {
      stopCalibration();
      settings.focus({ preventScroll: true });
    }
  }

  function stopCalibration() {
    if (!calibration) return;
    const session = calibration;
    calibration = undefined;
    clearTimeout(session.timeout);
    for (const oscillator of session.notes) {
      try { oscillator.stop(); } catch (error) { /* Already ended. */ }
    }
    byId('calibrate').textContent = 'Tap to the beat';
    status.textContent = '10-second timing check';
  }

  function finishCalibration(session) {
    if (calibration !== session) return;
    const taps = Array.from(session.taps.values()).sort((a, b) => a - b);
    stopCalibration();
    if (taps.length < 4) {
      status.textContent = 'Try again with at least 4 taps.';
      return;
    }
    const middle = Math.floor(taps.length / 2);
    const median = taps.length % 2 ? taps[middle] : (taps[middle - 1] + taps[middle]) / 2;
    setOffset(median * 1000);
    status.textContent = 'Saved ' + byId('read-offset').textContent + '.';
  }

  function startOrTap(event) {
    if (calibration) {
      const session = calibration;
      if (!session.start) return;
      const eventDelay = Math.max(0, performance.now() - event.timeStamp) / 1000;
      const time = audioContext.currentTime - (eventDelay < .5 ? eventDelay : 0);
      const beat = Math.round((time - session.start) / .5);
      const error = time - session.start - beat * .5;
      if (beat >= 0 && beat < 20 && !session.taps.has(beat)) {
        session.taps.set(beat, error);
        status.textContent = session.taps.size + ' taps recorded';
      }
      return;
    }
    if (['playing', 'countdown', 'starting', 'awaiting'].includes(mode)) {
      status.textContent = 'Return to Songs or finish the round first.';
      return;
    }
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      status.textContent = 'Use the offset slider on this browser.';
      return;
    }
    const session = { start: 0, taps: new Map(), notes: [] };
    calibration = session;
    try {
      if (!audioContext) audioContext = new Context();
      audioContext.resume().then(() => {
        if (calibration !== session) return;
        session.start = audioContext.currentTime + .16;
        for (let i = 0; i < 20; i++) {
          const at = session.start + i * .5;
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.frequency.value = 540;
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(.13, at + .008);
          gain.gain.exponentialRampToValueAtTime(.001, at + .075);
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.onended = () => gain.disconnect();
          osc.start(at);
          osc.stop(at + .08);
          session.notes.push(osc);
        }
        byId('calibrate').textContent = 'Tap';
        status.textContent = 'Tap along with the clicks.';
        session.timeout = setTimeout(() => finishCalibration(session), 10160);
      }).catch(() => {
        if (calibration !== session) return;
        stopCalibration();
        status.textContent = 'Use the offset slider on this browser.';
      });
    } catch (error) {
      stopCalibration();
      status.textContent = 'Use the offset slider on this browser.';
    }
  }

  async function copySettings() {
    const text = [
      'Level ' + byId('read-level').textContent,
      'Arrow speed ' + byId('read-speed').textContent,
      'Hit window ' + byId('read-window').textContent,
      'Effect strength ' + byId('read-strength').textContent,
      'Timing offset ' + byId('read-offset').textContent,
      ...['Calm lights', 'Auto-play', 'Show beat grid'].map((title, i) =>
        title + ' ' + (controls[['calm', 'auto', 'grid'][i]].checked ? 'on' : 'off'))
    ].join('\n');
    const feedback = byId('copy-status');
    const field = byId('copy-text');
    field.hidden = true;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      feedback.textContent = 'Settings copied.';
    } catch (error) {
      field.value = text;
      field.hidden = false;
      field.select();
      feedback.textContent = document.execCommand && document.execCommand('copy') ?
        'Settings copied.' : 'Settings selected for copying.';
    }
    feedback.hidden = false;
  }

  byId('start').addEventListener('click', startRound);
  version.addEventListener('change', () => {
    selectedVersion = Number(version.value);
    startRound();
  });
  byId('restart').addEventListener('click', startRound);
  byId('again').addEventListener('click', startRound);
  byId('resume').addEventListener('click', beginPlaying);
  byId('back').addEventListener('click', backToSongs);
  settings.addEventListener('click', () => openGuide(guide.hidden));
  byId('close-guide').addEventListener('click', () => openGuide(false));
  byId('calibrate').addEventListener('click', startOrTap);
  byId('copy').addEventListener('click', copySettings);
  audio.addEventListener('ended', showResults);
  audio.addEventListener('error', () => playbackFailed(round));
  window.addEventListener('resize', () => { sizeDirty = true; });
  document.addEventListener('visibilitychange', scheduleFrame);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', updateOptions);
  else if (reduceMotion.addListener) reduceMotion.addListener(updateOptions);

  for (const [name, input] of Object.entries(controls)) {
    input.addEventListener('input', () => {
      if (name === 'offset') setOffset(Number(input.value));
      else updateOptions();
    });
  }
  for (const [lane, pad] of pads.entries()) {
    pad.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      pad.setPointerCapture(event.pointerId);
      pad.classList.add('active');
      pressLane(lane);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      pad.addEventListener(type, () => pad.classList.remove('active'));
    }
    pad.addEventListener('click', event => {
      if (event.detail === 0) pressLane(lane);
    });
  }
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guide.hidden) {
      openGuide(false);
      return;
    }
    if (event.target.matches('input, select, textarea') || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.toLowerCase() === 'r' && mode !== 'lobby' && !event.repeat) {
      startRound();
      return;
    }
    const lane = arrowsByKey[event.key];
    if (lane === undefined || mode !== 'playing' || !guide.hidden) return;
    event.preventDefault();
    if (!event.repeat) {
      pads[lane].classList.add('active');
      pressLane(lane);
    }
  });
  window.addEventListener('keyup', event => {
    const lane = arrowsByKey[event.key];
    if (lane !== undefined) pads[lane].classList.remove('active');
  });
  window.addEventListener('blur', () => {
    for (const pad of pads) pad.classList.remove('active');
  });

  try {
    const stored = Number(localStorage.getItem(offsetStorage));
    if (Number.isFinite(stored)) controls.offset.value = String(clamp(stored, -250, 250));
  } catch (error) {
    // Keep the default in browsers that block local storage.
  }
  makeSongList();
  showSelection();
  updateOptions();
  scheduleFrame();
}());
