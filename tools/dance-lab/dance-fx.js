(function (root) {
  'use strict';

  const W = 900;
  const H = 600;
  const TAU = Math.PI * 2;
  const ARROWS = ['#ff7aa8', '#7cc8ff', '#7fdcb5', '#ffd45c'];
  const rotations = [-Math.PI / 2, Math.PI, 0, Math.PI / 2];
  const themes = {
    'alley-cat': { name: 'Midnight Alley', icon: '☾', accent: '#ffab80', tile: '#472b46', sky: ['#26193d', '#713e6b'], floor: ['#542f53', '#1b182d'], lights: ['#ff8bab', '#75dceb'], draw: alleyCat },
    'heart-shaped': { name: 'The Heart Garden', icon: '♥', accent: '#ff9ebf', tile: '#4a2a46', sky: ['#532657', '#bd647d'], floor: ['#9a5275', '#402449'], lights: ['#ffc4cd', '#cf99fa'], draw: heartShaped },
    'crushing-it': { name: 'Sunburst Arena', icon: 'ϟ', accent: '#ffd08a', tile: '#50403b', sky: ['#31275a', '#c16e60'], floor: ['#bd6659', '#542d48'], lights: ['#ffbc69', '#b8acfb'], draw: crushingIt },
    'piecemeal': { name: 'Puzzle Workshop', icon: '✥', accent: '#f9c588', tile: '#4f3b41', sky: ['#302848', '#966362'], floor: ['#806267', '#443144'], lights: ['#ffd08e', '#8fe1d8'], draw: piecemeal },
    'never-miss': { name: 'Lantern Range', icon: '◎', accent: '#abe4ad', tile: '#2c4947', sky: ['#173044', '#41665d'], floor: ['#466354', '#222f45'], lights: ['#fdd491', '#8ff1c2'], draw: neverMiss },
    'cloak-of-darkness': { name: 'Twilight Library', icon: '✦', accent: '#d5abff', tile: '#46345b', sky: ['#261b43', '#635084'], floor: ['#503965', '#271c45'], lights: ['#daa3ff', '#ffce91'], draw: cloak },
    'penguin-town': { name: 'Aurora Ice Rink', icon: '❄', accent: '#a9ebf3', tile: '#28475a', sky: ['#1c3058', '#679cad'], floor: ['#88c5d7', '#355582'], lights: ['#a4ffdf', '#a1c9ff'], draw: penguinTown },
    'ludum-dare-30-04': { name: 'Between Two Worlds', icon: '✧', accent: '#c3b9ff', tile: '#363454', sky: ['#161834', '#4f3970'], floor: ['#4a466e', '#23213e'], lights: ['#a8beff', '#ffa8d8'], draw: ludum },
    'talking-cute': { name: 'The Chiptune Club', icon: '▦', accent: '#a9efd1', tile: '#2c4a49', sky: ['#22294b', '#69568d'], floor: ['#6a547d', '#282c4c'], lights: ['#82e9d9', '#ffaed7'], draw: talkingCute },
    'dance-field': { name: 'Pixel Meadow', icon: '✿', accent: '#e5e898', tile: '#414b40', sky: ['#233963', '#cf8d9e'], floor: ['#527b6d', '#263b53'], lights: ['#f7e08a', '#a9efb8'], draw: danceField },
    'hella-bumps': { name: 'Corner Block Party', icon: '♫', accent: '#ffba8c', tile: '#4d3549', sky: ['#302447', '#a35f69'], floor: ['#784c69', '#342842'], lights: ['#ffc481', '#f298c5'], draw: hellaBumps }
  };

  function box(g, x, y, w, h, color) {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  }

  function round(g, x, y, w, h, r, color, edge, weight = 2) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
    g.fillStyle = color;
    g.fill();
    if (edge) {
      g.strokeStyle = edge;
      g.lineWidth = weight;
      g.stroke();
    }
  }

  function oval(g, x, y, rx, ry, color, edge, weight = 2, tilt = 0) {
    g.beginPath();
    g.ellipse(x, y, rx, ry, tilt, 0, TAU);
    if (color) {
      g.fillStyle = color;
      g.fill();
    }
    if (edge) {
      g.strokeStyle = edge;
      g.lineWidth = weight;
      g.stroke();
    }
  }

  function poly(g, points, color, edge, weight = 2, closed = true) {
    g.beginPath();
    g.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) g.lineTo(points[i], points[i + 1]);
    if (closed) g.closePath();
    if (color) {
      g.fillStyle = color;
      g.fill();
    }
    if (edge) {
      g.strokeStyle = edge;
      g.lineWidth = weight;
      g.stroke();
    }
  }

  function grad(g, y0, y1, a, b) {
    const paint = g.createLinearGradient(0, y0, 0, y1);
    paint.addColorStop(0, a);
    paint.addColorStop(1, b);
    return paint;
  }

  function glow(g, x, y, r, color, strength) {
    const paint = g.createRadialGradient(x, y, 0, x, y, r);
    paint.addColorStop(0, color);
    paint.addColorStop(1, color + '00');
    g.save();
    g.globalAlpha *= strength;
    box(g, x - r, y - r, r * 2, r * 2, paint);
    g.restore();
  }

  function text(g, word, x, y, size, color, weight = 800) {
    g.font = weight + ' ' + size + 'px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = color;
    g.fillText(word, x, y);
  }

  function repeat(n, seed, draw) {
    const rng = root.DanceChart.seeded(seed);
    for (let i = 0; i < n; i++) draw(rng(), rng(), rng(), i);
  }

  function star(g, x, y, r, color) {
    poly(g, [x, y - r, x + r * .22, y - r * .22, x + r, y, x + r * .22, y + r * .22,
      x, y + r, x - r * .22, y + r * .22, x - r, y, x - r * .22, y - r * .22], color);
  }

  function heart(g, x, y, size, color, edge) {
    g.save();
    g.translate(x, y);
    g.scale(size / 40, size / 40);
    g.beginPath();
    g.moveTo(0, 18);
    g.bezierCurveTo(-6, 14, -26, 1, -22, -10);
    g.bezierCurveTo(-19, -22, -5, -21, 0, -11);
    g.bezierCurveTo(5, -21, 19, -22, 22, -10);
    g.bezierCurveTo(26, 1, 6, 14, 0, 18);
    g.closePath();
    g.fillStyle = color;
    g.fill();
    if (edge) {
      g.strokeStyle = edge;
      g.lineWidth = 2.7;
      g.stroke();
    }
    g.restore();
  }

  function arch(g, x, y, w, h, color, edge, width = 4) {
    g.beginPath();
    g.moveTo(x, y + h);
    g.lineTo(x, y + w / 2);
    g.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
    g.lineTo(x + w, y + h);
    g.closePath();
    g.fillStyle = color;
    g.fill();
    if (edge) {
      g.strokeStyle = edge;
      g.lineWidth = width;
      g.stroke();
    }
  }

  function skyline(g, low, high, ground, color, seed, windows) {
    repeat(22, seed, (a, b, c, i) => {
      const x = i * 43 - 9;
      const w = 28 + 30 * c;
      const y = low + (high - low) * b;
      box(g, x, y, w, ground - y, color);
      if (a > .7) box(g, x + 8, y - 7, w - 16, 10, color);
      if (!windows) return;
      for (let k = 0; k < 4 && y + 10 + k * 14 < ground; k++) {
        if ((i + 2 * k) % 5 > 0) box(g, x + 8, y + 10 + k * 14, 4, 6, windows);
        if ((i + k) % 3 === 0) box(g, x + 18, y + 10 + k * 14, 4, 6, windows);
      }
    });
  }

  function pennants(g, x, y, endX, endY, sag, colors) {
    const n = 13;
    const points = [];
    for (let i = 0; i <= n; i++) {
      const q = i / n;
      points.push(x + (endX - x) * q, y + (endY - y) * q + Math.sin(q * Math.PI) * sag);
    }
    poly(g, points, null, '#291e3b', 2, false);
    for (let i = 1; i < n; i++) {
      const px = points[i * 2], py = points[i * 2 + 1];
      poly(g, [px - 9, py - 1, px + 9, py, px + 1, py + 20], colors[i % colors.length]);
    }
  }

  function cat(g, x, y, size, body, eyes, lift) {
    g.save();
    g.translate(x, y - lift);
    g.scale(size, size);
    const edge = '#241b33';
    g.beginPath();
    g.moveTo(16, 1);
    g.bezierCurveTo(37, 5, 40, -17 - lift / 2, 30, -19 - lift / 2);
    g.lineWidth = 7;
    g.lineCap = 'round';
    g.strokeStyle = edge;
    g.stroke();
    g.lineWidth = 3;
    g.strokeStyle = body;
    g.stroke();
    oval(g, 1, -5, 22, 15, body, edge, 3);
    poly(g, [-21, -24, -20, -49, -4, -39, 9, -39, 23, -49, 25, -22], body, edge, 3);
    poly(g, [-18, -37, -18, -44, -10, -39], '#ec9ab3');
    poly(g, [17, -39, 22, -44, 22, -36], '#ec9ab3');
    oval(g, 2, -25, 25, 17, body, edge, 3);
    oval(g, -7, -27, 3.5, eyes, '#ffe6a1');
    oval(g, 11, -27, 3.5, eyes, '#ffe6a1');
    oval(g, 1, -20, 3, 2, '#ff9eb0');
    g.restore();
  }

  function alleyCat(g, f) {
    if (!f) {
      glow(g, 451, 230, 330, '#f387ae', .47);
      skyline(g, 137, 304, 385, '#4b3158', 9, '#b9818d');
      const brick = grad(g, 80, 380, '#3d2549', '#5d3454');
      poly(g, [0, 43, 317, 125, 317, 373, 0, 440], brick);
      poly(g, [900, 34, 650, 132, 650, 380, 900, 432], grad(g, 40, 440, '#31223f', '#58344f'));
      for (let i = 0; i < 7; i++) {
        const y = 89 + i * 47;
        poly(g, [0, y, 317, 150 + i * 30], null, '#9e607146', 2, false);
        poly(g, [900, y, 650, 155 + i * 29], null, '#a8647348', 2, false);
        for (let j = 0; j < 4; j++) {
          const x = 48 + j * 71 - (i % 2) * 22;
          poly(g, [x, y + (150 + i * 30 - y) * x / 317, x, y + (150 + i * 30 - y) * x / 317 + 34], null, '#8c57624d', 2, false);
        }
      }
      arch(g, 46, 180, 93, 232, '#2a223c', '#76485e', 6);
      round(g, 67, 237, 48, 82, 6, '#77476a', '#9c687b');
      for (let k = 0; k < 4; k++) box(g, 71, 245 + 17 * k, 40, 2, '#4e3456');
      round(g, 754, 155, 72, 119, 8, '#30233f', '#875867', 5);
      box(g, 761, 163, 58, 85, '#985d73');
      box(g, 788, 163, 5, 85, '#4d324c');
      box(g, 761, 204, 58, 5, '#4d324c');
      poly(g, [219, 98, 392, 139, 519, 149, 707, 94], null, '#322139', 4, false);
      for (let i = 0; i < 7; i++) {
        const x = 268 + i * 56;
        const y = 134 + 25 * Math.sin(i * .53);
        oval(g, x, y, 4, 6, i % 2 ? '#f7ae95' : '#e992ae');
      }
      round(g, 341, 177, 236, 115, 19, '#3c2349', '#805470', 4);
      round(g, 352, 188, 214, 93, 13, '#45274e', '#fb93b8', 2.5);
      for (const [x, y, color] of [[131, 411, '#39656a'], [766, 405, '#527574'], [812, 460, '#426874']]) {
        oval(g, x, y + 40, 61, 11, '#30233987');
        round(g, x - 42, y - 35, 85, 73, 10, color, '#2e2844', 4);
        round(g, x - 46, y - 41, 92, 14, 5, '#76a197', '#342a43', 3);
        for (let k = -2; k <= 2; k++) round(g, x + k * 12 - 2, y - 18, 4, 40, 3, '#3236498c');
      }
      return;
    }
    const pulse = f.pulse;
    glow(g, 459, 235, 150, '#ff7fc1', .10 + pulse * .14);
    text(g, 'ALLEY CAT', 459, 239, 30, '#ffd0d6', 850);
    star(g, 370, 219, 8 + pulse * 3, '#ffac8d');
    star(g, 548, 255, 8 + pulse * 3, '#ffd3a5');
    const blink = f.calm || Math.sin(f.beat * 1.3) > -.91 ? 4 : 1.1;
    cat(g, 132, 378, 1.22, '#c084af', blink, pulse * 17);
    cat(g, 767, 371, 1.10, '#a4cfba', blink, (1 - f.phase) * pulse * 13);
    cat(g, 815, 426, .84, '#e0a67b', blink, pulse * 8);
    for (let i = 0; i < 4; i++) star(g, 138 + i * 16, 291 - i * 8 - pulse * 9, 2 + pulse * 2, '#ffc78faa');
  }

  function heartShaped(g, f) {
    if (!f) {
      glow(g, 450, 239, 327, '#ffb4af', .72);
      repeat(81, 117, (a, b, c) => {
        const x = a * W, y = b * 367;
        if (c < .25) star(g, x, y, 2 + c * 13, '#ffe1d2a8');
        else oval(g, x, y, 1.8, 1.8, '#ffded16e');
      });
      for (const [x, width, color] of [[4, 155, '#7d4573'], [742, 156, '#7d4573'], [152, 87, '#a65c88'], [661, 87, '#a65c88']]) {
        arch(g, x, 121 + (x % 34), width, 277, color, '#eea1a8', 5);
        arch(g, x + 12, 134 + (x % 34), width - 24, 261, '#ac628586', '#e6a0ad', 2);
        for (let i = 1; i <= 4; i++) box(g, x + i * width / 5, 224, 2, 171, '#f6bac070');
      }
      heart(g, 450, 251, 162, '#c986ab', '#ffd6bd');
      heart(g, 450, 251, 124, '#e894ac', '#ffbdc6');
      heart(g, 450, 251, 78, '#f3a1ae', '#ffd1c3');
      for (const [x, y] of [[87, 377], [189, 400], [716, 395], [815, 366]]) {
        round(g, x - 26, y, 52, 65, 11, '#9c5979', '#e8a0ad', 3);
        oval(g, x, y, 31, 10, '#683b60', '#efb2a6', 3);
        for (let i = 0; i < 5; i++) {
          const dx = (i - 2) * 12;
          poly(g, [x, y, x + dx, y - 45 - (i % 3) * 9], null, '#8ac4a9', 4, false);
          oval(g, x + dx, y - 18, 9, 4, '#9dbba3', null, 1, dx * -.04);
          heart(g, x + dx, y - 46 - (i % 3) * 9, 18, i % 2 ? '#ffc0b7' : '#ff9ebf', '#d8709d');
        }
      }
      return;
    }
    for (let i = 0; i < 18; i++) {
      const x = 26 + (i * 131 % 852) + Math.sin(f.motion * .74 + i) * 13;
      const y = 65 + i * 69 % 252 - Math.sin(f.motion + i * 1.4) * 16 - f.pulse * 10;
      const size = 7 + i * 23 % 23;
      heart(g, x, y, size + f.pulse * 3, ['#ffe0cdba', '#ffacd0c9', '#fac2e4a8'][i % 3]);
    }
    glow(g, 450, 242, 140, '#ffcbdb', .12 + f.pulse * .2);
    heart(g, 450, 250, 36 + f.pulse * 8, '#ffd5c1', '#fff1cf');
  }

  function crushingIt(g, f) {
    if (!f) {
      glow(g, 450, 160, 294, '#ffb78b', .52);
      for (let i = 0; i < 16; i++) {
        const angle = i * TAU / 16;
        poly(g, [450, 206, 450 + Math.cos(angle) * 635, 206 + Math.sin(angle) * 635,
          450 + Math.cos(angle + .12) * 635, 206 + Math.sin(angle + .12) * 635], '#ffc28a17');
      }
      for (let tier = 0; tier < 4; tier++) {
        const y = 221 + tier * 35;
        box(g, 0, y, 900, 30, ['#5e4168', '#7b4a69', '#94596e', '#aa6671'][tier]);
        box(g, 0, y, 900, 3, '#ffc7a250');
        for (let i = 0; i < 38; i++) {
          const x = i * 25 + (tier % 2) * 6;
          oval(g, x, y + 16, 6, 7, ['#b487a2', '#a56d9e', '#e19382', '#75769f'][(i * 3 + tier) % 4]);
          round(g, x - 9, y + 20, 18, 9, 4, ['#966c9b', '#c17b90', '#ae667a'][i % 3]);
        }
      }
      round(g, 321, 118, 258, 185, 26, '#563654', '#f4a884', 7);
      round(g, 335, 130, 230, 158, 18, '#3b294e', '#a66b83', 3);
      oval(g, 450, 196, 65, 49, '#744a6e', '#ef9f85', 3);
      poly(g, [465, 149, 417, 205, 448, 205, 435, 242, 483, 185, 453, 185], '#ffce84', '#fff2aa', 2);
      text(g, 'SUNBURST', 450, 264, 20, '#ffd6aa', 850);
      for (const side of [-1, 1]) {
        const x = 450 + side * 343;
        poly(g, [x - 48, 226, x + 48, 226, x + 48, 300, x, 325, x - 48, 300], '#f5a371', '#794464', 4);
        star(g, x, 273, 27, '#ffe7a3');
        oval(g, x, 427, 44, 14, '#43294485');
        round(g, x - 34, 391, 68, 29, 8, '#3b2b50', '#dea087', 3);
        g.save();
        g.translate(x, 394);
        g.rotate(side * .36);
        round(g, -15, -51, 30, 54, 6, '#ae6180', '#592b51', 3);
        round(g, -18, -53, 36, 12, 4, '#ffbc88', '#6f425d', 3);
        g.restore();
      }
      return;
    }
    for (let i = 0; i < 52; i++) {
      const side = i % 2 ? 1 : -1;
      const age = (f.motion * .47 + i * .137) % 1;
      const x = 450 + side * (343 - age * (40 + i % 9 * 10)) + Math.sin(i * 8) * 15 * age;
      const y = 348 - age * (525 + i % 9 * 22) + age * age * 485 - f.pulse * 12;
      g.save();
      g.translate(x, y);
      g.rotate(age * 6 + i);
      g.globalAlpha = (1 - age * .68) * (.55 + f.energy * .45);
      box(g, -4, -2, 6 + i % 4, 4, ['#ffdb8a', '#ff94a6', '#a9dfea', '#c4acfb'][i % 4]);
      g.restore();
    }
  }

  function puzzle(g, x, y, size, color, edge, rotation) {
    g.save();
    g.translate(x, y);
    g.rotate(rotation);
    g.scale(size / 80, size / 80);
    g.beginPath();
    g.moveTo(-40, -40);
    g.lineTo(-11, -40);
    g.bezierCurveTo(-23, -63, 23, -63, 11, -40);
    g.lineTo(40, -40);
    g.lineTo(40, -11);
    g.bezierCurveTo(18, -19, 18, 19, 40, 11);
    g.lineTo(40, 40);
    g.lineTo(11, 40);
    g.bezierCurveTo(22, 60, -22, 60, -11, 40);
    g.lineTo(-40, 40);
    g.lineTo(-40, 11);
    g.bezierCurveTo(-61, 21, -61, -21, -40, -11);
    g.closePath();
    g.fillStyle = color;
    g.fill();
    g.strokeStyle = edge;
    g.lineWidth = 3.5;
    g.stroke();
    g.restore();
  }

  function piecemeal(g, f) {
    if (!f) {
      glow(g, 450, 211, 315, '#ffc592', .53);
      round(g, 248, 101, 404, 260, 20, '#59435e', '#e2a687', 6);
      round(g, 261, 114, 378, 233, 14, '#8f656c', '#aa7d75', 2);
      for (let y = 126; y < 350; y += 13) {
        for (let x = 275; x < 630; x += 13) oval(g, x, y, 1.45, 1.45, '#593d5a7a');
      }
      for (const [x, base] of [[26, 102], [720, 140]]) {
        round(g, x, base, 154, 252, 10, '#4d3d57', '#a47776', 4);
        for (let r = 0; r < 3; r++) {
          const y = base + 26 + r * 72;
          box(g, x + 10, y + 48, 134, 6, '#ba8979');
          puzzle(g, x + 36, y + 24, 32, ['#cc8d9e', '#88baac', '#f2bf80'][r], '#47384f', -.19);
          puzzle(g, x + 94, y + 25, 34, ['#acd1bc', '#efad89', '#b2a3cd'][r], '#47384f', .23);
        }
      }
      for (const [x, y, color, spin] of [[145, 436, '#e7af89', -.22], [783, 425, '#8dbfb2', .2], [205, 401, '#c488ae', -.38]]) {
        oval(g, x, y + 19, 35, 8, '#392b418a');
        puzzle(g, x, y, 56, color, '#694e68', spin);
      }
      return;
    }
    const colors = ['#f4ad9a', '#98d3bc', '#d3a6db', '#f4d18d', '#80aebe', '#e18eaf'];
    for (let i = 0; i < 6; i++) {
      const pull = f.calm ? 3 : 5 + 16 * f.phase * (i % 2 ? -1 : 1);
      const x = 380 + i % 3 * 70 + (i % 3 - 1) * pull;
      const y = 194 + Math.floor(i / 3) * 70 + (i < 3 ? -1 : 1) * pull * .4;
      puzzle(g, x, y, 69, colors[i], '#5e465f', 0);
    }
    for (let i = 0; i < 6; i++) {
      const x = 286 + i * 67;
      star(g, x, 305 + Math.sin(f.motion + i) * 11, 3 + (i % 3) * 2 + f.pulse * 4, '#ffdeb0c5');
    }
  }

  function target(g, x, y, radius, pulse) {
    oval(g, x, y, radius, radius, '#ebad7a', '#3a3448', 5);
    oval(g, x, y, radius * .82, radius * .82, '#f2d999', '#91586b', 3);
    oval(g, x, y, radius * .62, radius * .62, '#b97287');
    oval(g, x, y, radius * .43, radius * .43, '#ffe7aa');
    oval(g, x, y, radius * .26, radius * .26, '#74b49f');
    oval(g, x, y, radius * .106 + pulse * 2, radius * .106 + pulse * 2, '#ffefae');
  }

  function neverMiss(g, f) {
    if (!f) {
      glow(g, 450, 230, 340, '#acd2a0', .52);
      oval(g, 450, 178, 80, 80, '#e9d59c1c');
      oval(g, 450, 178, 59, 59, '#e9d59c77');
      repeat(34, 43, (a, b, c, i) => {
        const x = a * 900, y = 221 + b * 40, h = 42 + c * 120;
        const color = ['#416861', '#315555', '#28454f'][i % 3];
        poly(g, [x, y - h, x - 28, y - h * .24, x - 18, y - h * .28, x - 42, y + 28,
          x + 42, y + 28, x + 18, y - h * .28, x + 28, y - h * .24], color);
        box(g, x - 4, y + 20, 8, 105 - b * 40, color);
      });
      pennants(g, 12, 115, 889, 122, 64, ['#ffd891', '#b688b4', '#94c8a2', '#d98f90']);
      for (const [x, y, r] of [[152, 304, 74], [450, 270, 58], [748, 304, 74]]) {
        poly(g, [x - 9, y + 34, x - 48, y + 132, x - 35, y + 132, x + 10, y + 41], '#b78a72', '#394553', 3);
        poly(g, [x + 9, y + 34, x + 48, y + 132, x + 35, y + 132, x - 10, y + 41], '#b78a72', '#394553', 3);
        target(g, x, y, r, 0);
      }
      for (const x of [57, 844]) {
        round(g, x - 15, 354, 30, 69, 7, '#536368', '#a18280', 3);
        glow(g, x, 351, 62, '#ffc78b', .52);
        round(g, x - 15, 332, 30, 32, 5, '#ffd998', '#8b696f', 4);
        box(g, x - 2, 334, 4, 28, '#aa7671');
      }
      return;
    }
    const positions = [[152, 304], [450, 270], [748, 304]];
    const [x, y] = positions[((Math.floor(f.beat) % 3) + 3) % 3];
    oval(g, x, y, 11 + f.pulse * 8, 11 + f.pulse * 8, '#fff1bdaa', '#fff3ae', 2);
    for (let i = 0; i < 4; i++) {
      const slide = (f.motion * .5 + i * .23) % 1;
      const px = 24 + slide * 852;
      const py = 218 + i * 19;
      const alpha = Math.sin(slide * Math.PI);
      g.save();
      g.globalAlpha = alpha * (.46 + f.energy * .3);
      poly(g, [px - 44, py, px, py, px - 10, py - 6, px, py, px - 10, py + 6], null, '#ffe3a0', 2.5, false);
      g.restore();
    }
  }

  function bat(g, x, y, size, wing) {
    g.save();
    g.translate(x, y);
    g.scale(size, size);
    const wings = -14 + wing * 14;
    poly(g, [-8, -3, -25, wings, -45, wings - 4, -33, 11, -27, 6, -18, 15, -7, 10,
      7, 10, 18, 15, 27, 6, 33, 11, 45, wings - 4, 25, wings, 8, -3], '#9c83b8', '#4c3a68', 2);
    poly(g, [-12, -3, -12, -18, -3, -10, 3, -10, 12, -18, 12, -3], '#ba9ad1', '#554472', 2);
    oval(g, 0, 1, 13, 12, '#bd9dd6', '#554472', 2);
    oval(g, -4, -1, 1.7, 2.2, '#352748');
    oval(g, 4, -1, 1.7, 2.2, '#352748');
    g.restore();
  }

  function cloak(g, f) {
    if (!f) {
      for (const [x, width] of [[18, 189], [240, 142], [395, 110], [518, 142], [694, 189]]) {
        arch(g, x, x === 395 ? 66 : 91, width, x === 395 ? 326 : 306, '#34254f', '#9c78a9', 5);
        arch(g, x + 9, x === 395 ? 81 : 105, width - 18, x === 395 ? 308 : 289, '#493560', '#67527f', 2);
        if (x === 395) {
          oval(g, 450, 166, 35, 35, '#8e82b0');
          oval(g, 462, 156, 33, 35, '#493560');
          star(g, 428, 134, 6, '#eed4d4');
          star(g, 468, 204, 7, '#bfa2e0');
          continue;
        }
        for (let i = 0; i < 3; i++) {
          const y = 200 + i * 62;
          for (let j = 0; j < (width - 40) / 11; j++) {
            const color = ['#8c638e', '#7c5b91', '#64728f', '#b78397', '#aa7d91'][(i + j * 7) % 5];
            const h = 25 + (i * 17 + j * 13) % 28;
            round(g, x + 18 + j * 11, y + 47 - h, 8, h, 2, color);
            box(g, x + 19 + j * 11, y + 51 - h, 6, 2, '#e1acbb74');
          }
          box(g, x + 10, y + 46, width - 20, 6, '#a27d9c');
        }
      }
      for (const [x, y, h] of [[99, 414, 34], [123, 414, 62], [152, 416, 42], [752, 415, 54], [779, 419, 37], [807, 416, 69]]) {
        oval(g, x, y + 4, 14, 5, '#342344');
        round(g, x - 8, y - h, 16, h, 4, '#d7a7b0', '#735785', 2.5);
        box(g, x + 1, y - h + 3, 3, h / 2, '#f4c7b5');
      }
      return;
    }
    for (let i = 0; i < 4; i++) {
      const x = 40 + i * 252 + Math.sin(f.motion * .33 + i) * 94;
      oval(g, x, 320 + i % 2 * 32, 178, 18 + i * 3, '#bc9ad711');
      oval(g, x - 52, 335 + i % 2 * 30, 125, 12, '#bb9cda15');
    }
    for (const [x, y] of [[99, 374], [123, 346], [152, 368], [752, 355], [779, 376], [807, 341]]) {
      glow(g, x, y, 42, '#ffbf92', .26 + f.pulse * .08);
      oval(g, x, y, 4 + f.pulse * 1.2, 8, '#ffd798', null, 1, Math.sin(f.motion * 2 + x) * .2);
      oval(g, x, y + 2, 2, 4, '#fff4c1');
    }
    for (let i = 0; i < 3; i++) bat(g, 245 + i * 205 + Math.cos(f.motion * .55 + i) * 35,
      151 + i % 2 * 63 + Math.sin(f.motion * .9 + i) * 23, .68 + i * .07, Math.sin(f.motion * 3 + i));
  }

  function penguin(g, x, y, size, tilt, color) {
    g.save();
    g.translate(x, y);
    g.scale(size, size);
    g.rotate(tilt);
    const edge = '#253452';
    oval(g, -15, -3, 16, 6, '#fbbb7e', edge, 3, -.12);
    oval(g, 15, -3, 16, 6, '#fbbb7e', edge, 3, .12);
    oval(g, -25, -25, 8, 19, color, edge, 3, .51);
    oval(g, 25, -25, 8, 19, color, edge, 3, -.51);
    oval(g, 0, -34, 27, 32, color, edge, 3);
    oval(g, 0, -27, 19, 21, '#fff2d8');
    oval(g, -10, -44, 4.8, 5.6, '#fff4df');
    oval(g, 10, -44, 4.8, 5.6, '#fff4df');
    oval(g, -8, -44, 2.4, 3.2, edge);
    oval(g, 8, -44, 2.4, 3.2, edge);
    poly(g, [-6, -36, 6, -36, 0, -29], '#f5ac71', '#c58271', 1.5);
    round(g, -22, -20, 44, 7, 4, '#e98caa', '#a05e90', 1.2);
    round(g, 11, -17, 7, 17, 3, '#e98caa', '#a05e90', 1.2);
    g.restore();
  }

  function penguinTown(g, f) {
    if (!f) {
      glow(g, 435, 142, 378, '#82eaca', .49);
      for (let i = 0; i < 7; i++) {
        g.beginPath();
        g.moveTo(-36, 206 - i * 14);
        g.bezierCurveTo(234, 52 - i * 5, 446, 232 - i * 21, 901, 92 - i * 13);
        g.strokeStyle = ['#9bffe329', '#a5ffec32', '#b5fff032'][i % 3];
        g.lineWidth = 13;
        g.stroke();
      }
      repeat(56, 20, (a, b, c) => star(g, a * 900, 28 + b * 223, 1 + c * 3, '#d2fff39a'));
      oval(g, 737, 116, 40, 40, '#e1edf6ac');
      oval(g, 748, 110, 37, 38, '#497490');
      for (const [x, y, s] of [[26, 180, 1.08], [180, 203, .82], [333, 212, .8],
        [496, 204, 1.06], [640, 186, 1.07], [822, 211, .91]]) {
        poly(g, [x, y, x - 156 * s, 383, x + 157 * s, 383], '#6088a7', '#96bcd0', 2);
        poly(g, [x, y, x + 68 * s, y + 91 * s, x + 22 * s, y + 71 * s,
          x - 14 * s, y + 99 * s, x - 32 * s, y + 68 * s, x - 65 * s, y + 91 * s], '#c4dae2');
      }
      oval(g, 450, 410, 460, 59, '#b0d5de', '#d4ebee', 3);
      poly(g, [15, 413, 204, 398, 351, 417, 554, 400, 700, 420, 888, 409], null, '#ebf5f3a8', 3, false);
      for (const x of [67, 156, 743, 826]) {
        const y = 369 + x % 27;
        round(g, x - 15, y, 30, 28, 5, '#fff2ae', '#7d8b97', 3);
        poly(g, [x - 20, y + 3, x, y - 10, x + 20, y + 3], '#8099b7', '#57748e', 3);
      }
      return;
    }
    const flashers = 23;
    for (let i = 0; i < flashers; i++) {
      const x = ((i * 137 + f.motion * (7 + i % 3)) % 932) - 10;
      const y = (i * 67 + f.motion * (9 + i % 4)) % 393;
      oval(g, x, y, 1.4 + i % 3 * .6, 1.4 + i % 3 * .6, '#e6faf4ae');
    }
    for (let i = 0; i < 4; i++) {
      const progress = f.motion * .63 + i * 1.57;
      const center = i < 2 ? 130 : 764;
      const x = center + Math.sin(progress) * (43 + i % 2 * 13) + i % 2 * 27;
      const y = 418 + i % 2 * 43 - f.pulse * (i % 2 ? 4 : 2);
      oval(g, x, y + 1, 30, 6, '#5582a37d');
      penguin(g, x, y, .92 + i % 2 * .16, Math.cos(progress) * .18, i % 2 ? '#726295' : '#426685');
    }
  }

  function planet(g, x, y, r, a, b, ring) {
    if (ring) oval(g, x, y, r * 1.65, r * .28, null, ring, 7, -.24);
    oval(g, x, y, r, r, grad(g, y - r, y + r, a, b), '#dbc4e8', 3);
    g.save();
    g.beginPath();
    g.arc(x, y, r - 2, 0, TAU);
    g.clip();
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(x - r - 15, y - r + i * r * .51);
      g.bezierCurveTo(x - r * .4, y - r * .26 + i * r * .54, x + r * .55, y - r * .65 + i * r * .58,
        x + r + 4, y - r * .76 + i * r * .55);
      g.strokeStyle = ['#f6d5ed52', '#5a427852', '#f7cfff39', '#432e6546'][i];
      g.lineWidth = 8 + i * 2;
      g.stroke();
    }
    oval(g, x - r * .29, y - r * .33, r * .2, r * .1, '#fff1e050', null, 1, -.25);
    g.restore();
    if (ring) {
      g.beginPath();
      g.ellipse(x, y, r * 1.65, r * .28, -.24, 0.07, Math.PI - .07);
      g.strokeStyle = ring;
      g.lineWidth = 7;
      g.stroke();
    }
  }

  function ludum(g, f) {
    if (!f) {
      glow(g, 263, 170, 290, '#966fae', .44);
      glow(g, 663, 257, 280, '#86a5e6', .46);
      for (let i = 0; i < 4; i++) {
        oval(g, 460, 225, 330 + i * 41, 57 + i * 12, null, '#b793d424', 2, .31);
      }
      repeat(127, 491, (a, b, c) => {
        const x = a * W, y = b * 405;
        if (c > .89) star(g, x, y, c * 6, '#fff5dba2');
        else oval(g, x, y, .6 + c * 1.3, .6 + c * 1.3, '#e7ddec72');
      });
      planet(g, 223, 210, 86, '#ffc3a9', '#a565a6', '#efcbb89e');
      planet(g, 688, 245, 106, '#b9e6ee', '#6267ae');
      planet(g, 507, 111, 19, '#eea7ca', '#a86ba6');
      for (const x of [64, 836]) {
        round(g, x - 33, 372, 66, 38, 7, '#393d67', '#ac95c6', 3);
        for (let j = -1; j <= 1; j++) oval(g, x + 16 * j, 390, 3, 3, j ? '#a6dfec' : '#f5a7ce');
      }
      return;
    }
    const start = [304, 224], end = [586, 238];
    poly(g, [start[0], start[1], end[0], end[1]], null, '#ecd9fc32', 10 + f.pulse * 6, false);
    poly(g, [start[0], start[1], end[0], end[1]], null, '#ecdaff96', 2, false);
    for (let i = 0; i < 9; i++) {
      const q = (f.motion * .55 + i * .137) % 1;
      star(g, 305 + q * 281, 225 + q * 14 + Math.sin(q * Math.PI) * Math.sin(i) * 19,
        3 + i % 3 * 2 + f.pulse * 2, i % 2 ? '#ffd2e9' : '#ccedf9');
    }
    for (let i = 0; i < 7; i++) {
      const angle = f.motion * .46 + i * .88;
      const x = 453 + Math.cos(angle) * (335 + i % 3 * 28);
      const y = 206 + Math.sin(angle) * 101 + Math.cos(angle) * 50;
      oval(g, x, y, 2 + i % 3, 2 + i % 3, '#f9dcedb6');
    }
  }

  function pixel(g, pattern, x, y, unit, palette) {
    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        const color = palette[pattern[row][col]];
        if (color) box(g, x + col * unit, y + row * unit, unit, unit, color);
      }
    }
  }

  const pixelFace = ['..11111..', '.1222221.', '122222221', '123232321', '122222221', '124222421',
    '122333221', '.1222221.', '..11111..'];
  const pixelSmile = ['..11111..', '.1222221.', '122222221', '123232321', '122222221', '124323421',
    '122232221', '.1222221.', '..11111..'];
  const pixelHeart = ['.11.11.', '1111111', '1111111', '.11111.', '..111..', '...1...'];
  const pixelNote = ['..111.', '..1.11', '..1...', '..1...', '111...', '111...'];
  const pixelFlower = ['..11...', '.1221..', '122221.', '.1221..', '..11...', '...3.3.', '.3.33..', '..33...',
    '...3...', '...3...'];

  function talkingCute(g, f) {
    if (!f) {
      glow(g, 450, 193, 357, '#d9a3d5', .47);
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 20; col++) {
          if ((row * 13 + col * 7) % 11 > 4) box(g, col * 47, 42 + row * 44, 39, 35, '#d1a5d315');
        }
      }
      poly(g, [0, 345, 178, 345, 178, 363, 271, 363, 271, 381, 629, 381, 629, 363, 722, 363, 722, 345, 900, 345],
        null, '#ba95c8', 8, false);
      round(g, 269, 91, 362, 250, 14, '#453a65', '#e3a9c7', 6);
      round(g, 283, 104, 334, 220, 7, '#2c3d63', '#8179b7', 4);
      box(g, 297, 117, 306, 195, '#384f79');
      for (let i = 0; i < 22; i++) box(g, 297, 119 + i * 9, 306, 1, '#8a9fc333');
      for (const [x, color] of [[101, '#9de9c8'], [749, '#f5a7cf']]) {
        box(g, x - 17, 254, 70, 154, '#473b6d');
        box(g, x - 10, 261, 56, 137, '#66618d');
        box(g, x - 3, 270, 42, 101, '#344963');
        oval(g, x + 18, 387, 6, 5, color);
      }
      return;
    }
    pixel(g, f.phase > .56 ? pixelFace : pixelSmile, 369, 133 - Math.round(f.pulse * 9), 18,
      { 1: '#ffafd3', 2: '#ffc7d8', 3: '#4f416c', 4: '#f393bc' });
    for (let i = 0; i < 9; i++) {
      const x = 54 + i * 97;
      const y = 144 + i * 83 % 171 + Math.round(Math.sin(f.motion + i) * 2) * 6;
      if (i > 2 && i < 6 && y < 305) continue;
      pixel(g, i % 2 ? pixelHeart : pixelNote, x, y, 5 + i % 2 * 2, { 1: i % 2 ? '#f9aed3' : '#a9e6d8' });
    }
    for (let n = 0; n < 2; n++) {
      for (let i = 0; i < 8; i++) {
        const level = 1 + Math.round((.4 + f.energy * .6) * (3 + (i * 13 + n * 17) % 5) * (.42 + f.pulse * .58));
        box(g, (n ? 731 : 83) + i * 7, 380 - level * 10, 5, level * 10, n ? '#ffc2da' : '#a7eed5');
      }
    }
  }

  function pixelHill(g, x, y, size, color) {
    for (let i = 0; i < 6; i++) {
      box(g, x + i * size, y + (5 - i) * size, ((6 - i) * 2 - 1) * size, (i + 1) * size, color);
    }
  }

  function danceField(g, f) {
    if (!f) {
      glow(g, 454, 211, 308, '#ffc49b', .6);
      pixel(g, ['..1111..', '.111111.', '11111111', '11111111', '11111111', '11111111', '.111111.', '..1111..'],
        382, 110, 17, { 1: '#ffe0a0' });
      const cloud = ['....1111....', '...111111...', '.111111111..', '111111111111', '.1111111111.'];
      for (const [x, y, size] of [[86, 141, 9], [232, 94, 7], [580, 121, 10], [751, 91, 8], [762, 194, 6]]) {
        pixel(g, cloud, x + 5, y + 8, size, { 1: '#dca2b5' });
        pixel(g, cloud, x, y, size, { 1: '#f3c2c2' });
      }
      for (const [x, y, size, color] of [[-44, 218, 29, '#6f8b99'], [215, 233, 25, '#73989b'],
        [443, 224, 29, '#749196'], [670, 239, 27, '#729397'], [48, 281, 20, '#599388'],
        [253, 284, 20, '#61998c'], [483, 278, 20, '#599487'], [701, 276, 22, '#599083']]) {
        pixelHill(g, x, y, size, color);
      }
      for (let i = 0; i < 73; i++) {
        const x = i * 137 % 888, y = 376 + i * 41 % 180;
        box(g, x, y, 10, 3, ['#91c19b54', '#afcb9363', '#93ba9452'][i % 3]);
        if (i % 4 === 0) box(g, x + 4, y - 4, 3, 5, '#99bc9059');
      }
      return;
    }
    for (let i = 0; i < 15; i++) {
      const side = i < 8 ? 0 : 1;
      const x = (side ? 654 : 11) + (i * 83 % 178);
      const y = 350 + (i * 41 % 122);
      const d = 4 + i % 4;
      const sway = Math.round(Math.sin(f.motion + i) + f.pulse) * 2;
      pixel(g, pixelFlower, x + sway, y - (i % 4) * 3, d, {
        1: ['#fad18a', '#f8abc0', '#d4b4eb'][i % 3], 2: '#ffe0a5', 3: '#90be9b'
      });
    }
    for (let i = 0; i < 10; i++) {
      const x = Math.round(42 + i * 87 + Math.sin(f.motion * .6 + i * 2) * 24);
      const y = 260 + i * 29 % 109 - Math.round(f.pulse * 5);
      star(g, x, y, 2 + i % 2 + f.pulse * 2, '#fff0adbe');
    }
  }

  function speaker(g, x, y, scale, pulse, accent) {
    g.save();
    g.translate(x, y);
    g.scale(scale, scale);
    oval(g, 0, 7, 62, 13, '#30213d99');
    round(g, -60, -155, 120, 159, 13, '#372b4b', '#755374', 5);
    round(g, -49, -144, 97, 138, 9, '#554168', '#a57288', 3);
    oval(g, 0, -101, 25, 25, '#382a50', '#a7789b', 3);
    oval(g, 0, -45, 33, 33, '#332747', '#b98da2', 3);
    oval(g, 0, -101, 13 + pulse * 3, 13 + pulse * 3, '#71567f', accent, 2.5);
    oval(g, 0, -45, 21 + pulse * 4, 21 + pulse * 4, '#71567f', accent, 2.5);
    oval(g, 0, -45, 7 + pulse * 4, 7 + pulse * 4, accent);
    oval(g, 0, -101, 5 + pulse * 2, 5 + pulse * 2, accent);
    g.restore();
  }

  function hellaBumps(g, f) {
    if (!f) {
      glow(g, 450, 205, 303, '#ffc290', .65);
      skyline(g, 157, 308, 386, '#794e6e', 49, '#d28e87');
      for (const [x, y, width, height, paint] of [[6, 102, 226, 291, '#70536e'], [669, 98, 231, 303, '#745170']]) {
        round(g, x, y, width, height, 5, paint, '#9c687f', 3);
        box(g, x, y + 13, width, 6, '#aa7487');
        for (let j = 0; j < 2; j++) {
          for (let i = 0; i < 3; i++) {
            const wx = x + 21 + i * 67, wy = y + 38 + j * 58;
            round(g, wx, wy, 47, 39, 5, '#c18a8c', '#51446a', 4);
            box(g, wx + 20, wy + 1, 4, 37, '#7e526e');
            box(g, wx + 1, wy + 14, 44, 3, '#7e526e');
          }
        }
        const awning = y + 181;
        for (let i = 0; i < 9; i++) {
          const px = x + 5 + i * (width - 10) / 9;
          const color = i % 2 ? '#e6ab89' : '#9c6484';
          poly(g, [px + 3, awning, px + (width - 10) / 9 + 3, awning, px + (width - 10) / 9,
            awning + 39, px, awning + 39], color);
        }
      }
      pennants(g, 1, 104, 900, 113, 64, ['#f8bc92', '#f6a4bb', '#c0a2dc', '#a5d9ce']);
      round(g, 301, 185, 298, 142, 18, '#553759', '#b7788a', 5);
      const wall = ['#af7692', '#8a6596', '#bf8294', '#eba987'];
      for (let i = 0; i < 8; i++) {
        oval(g, 339 + i * 31, 252 + Math.sin(i * .64) * 24, 29, 24 + i % 4 * 4, wall[i % 4]);
      }
      oval(g, 450, 254, 53, 47, '#e9ab91', '#ffcaaa', 3);
      oval(g, 450, 254, 36, 33, '#9c6484', '#6d4d7b', 3);
      oval(g, 450, 254, 23, 21, null, '#d68b99', 2);
      oval(g, 450, 254, 8, 8, '#ffc39c');
      return;
    }
    for (const [x, y, scale, accent] of [[130, 441, 1.11, '#fab992'], [772, 440, 1.11, '#f2a4cc'],
      [219, 425, .61, '#ecc9a2'], [688, 425, .61, '#c8addc']]) {
      speaker(g, x, y - f.pulse * 10, scale, f.pulse * (.8 + f.energy * .2), accent);
    }
    for (let i = 0; i < 6; i++) {
      const x = (i < 3 ? 70 : 718) + i % 3 * 53 + Math.sin(f.motion * .5 + i) * 11;
      const y = 200 + (i * 57) % 55 - f.pulse * 15;
      pixel(g, pixelNote, x, y, 4, { 1: ['#ffcf9bbf', '#ffb1bcbf', '#c8d9dcbf'][i % 3] });
    }
  }

  function backdrop(g, theme) {
    box(g, 0, 0, W, H, grad(g, 0, 380, ...theme.sky));
    box(g, 0, 365, W, 235, grad(g, 365, H, ...theme.floor));
    for (let i = 0; i < 14; i++) {
      poly(g, [450 + (i - 6.5) * 42, 383, 450 + (i - 6.5) * 133, H], null, '#d8b3ba26', 1.5, false);
    }
    for (const y of [397, 430, 477, 539]) box(g, 0, y, W, 1.7, '#ebc4c027');
    theme.draw(g);
    repeat(422, 19, (a, b, c) => {
      const ink = c < .65 ? '#ffe0dc13' : '#35214320';
      box(g, a * W, b * H, 1 + c * 2.1, 1.4, ink);
    });
    const shade = g.createRadialGradient(450, 280, 176, 450, 280, 526);
    shade.addColorStop(0, '#21132b00');
    shade.addColorStop(1, '#1d143d6b');
    box(g, 0, 0, W, H, shade);
  }

  function spotlight(g, x, at, extent, tone, opacity, down = 484, top = 64) {
    const shade = g.createLinearGradient(0, top, 0, down);
    shade.addColorStop(0, tone + 'df');
    shade.addColorStop(1, tone + '2b');
    g.save();
    g.globalAlpha = opacity;
    poly(g, [x - 7, top, x + 7, top, at + extent, down, at - extent, down], shade);
    oval(g, at, down, extent, 14, tone + '80');
    g.restore();
    oval(g, x, top - 1, 12, 7, '#382b4e', '#98839f', 1.8);
    oval(g, x, top + 3, 7, 3, tone);
  }

  function mirrorBall(g, f, theme) {
    const radius = 30;
    const shade = grad(g, 23, 91, '#f1d6e4', '#6f688e');
    poly(g, [450, 0, 450, 25], null, '#f2c4d77c', 2, false);
    oval(g, 450, 57, radius, radius, shade, '#3a3052', 2.6);
    for (let row = -2; row <= 2; row++) {
      for (let col = -2; col <= 2; col++) {
        if (Math.abs(col * row) === 4) continue;
        const q = .5 + .5 * Math.sin(f.motion + col * 1.9 + row * .7);
        box(g, 446 + col * 10, 53 + row * 9, 8, 7,
          [theme.lights[0], '#7b739a', theme.lights[1], '#e4c7df'][Math.floor(q * 3.999)]);
      }
    }
    star(g, 431, 41, 8, '#fff2dc');
    for (let i = 0; i < 11; i++) {
      const x = 37 + i * 83 + Math.sin(f.motion * .68 + i) * 31;
      const y = 105 + i * 67 % 294 + Math.cos(f.motion * .6 + i) * 16;
      const sparkle = 1.5 + i % 3 + f.light * 2;
      star(g, x, y, sparkle, i % 2 ? theme.lights[0] + '98' : theme.lights[1] + '9b');
    }
  }

  function platform(g, f, theme) {
    oval(g, 450, 530, 270, 62, '#21163177');
    round(g, 233, 447, 435, 90, 33, '#4c3b60', '#372949', 5);
    oval(g, 450, 505, 222, 45, '#523b63', '#342941', 4);
    oval(g, 450, 485, 222, 51, '#695473', '#c09ca0', 3);
    oval(g, 450, 485, 211, 45, '#4c4766');
    const depths = [446, 464, 484, 510, 533];
    const widths = [134, 188, 211, 180, 122];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        const at = row * 8 + col;
        const x1 = (-1 + col / 4), x2 = x1 + .25;
        const lit = ((at + Math.floor(f.lightBeat)) % 7 + 7) % 7 < 2;
        const ink = lit ? theme.lights[(row + col) % 2] + (f.light > .39 ? 'a8' : '75') :
          (row + col) % 2 ? '#8a6f92' : '#615875';
        poly(g, [
          450 + x1 * widths[row] + 2, depths[row] + 2, 450 + x2 * widths[row] - 2, depths[row] + 2,
          450 + x2 * widths[row + 1] - 2, depths[row + 1] - 2, 450 + x1 * widths[row + 1] + 2, depths[row + 1] - 2
        ], ink);
      }
    }
    for (let i = 0; i < 13; i++) {
      const x = 294 + i * 26;
      const y = 533 + 12 * Math.sin(Math.PI * i / 12);
      oval(g, x, y, 3, 2.1, i % 2 ? theme.lights[0] : theme.lights[1]);
    }
  }

  const people = [
    { skin: '#f2b994', cheek: '#e18893', hair: '#5f3d58', hairLight: '#a66c80', top: '#efa0bb',
      light: '#ffc7cd', pants: '#7b668e', shoes: '#f6dbc6', pin: '#fff4bf' },
    { skin: '#ba806d', cheek: '#da8d8b', hair: '#2f394e', hairLight: '#586687', top: '#84c9d0',
      light: '#b7ece5', pants: '#4f678c', shoes: '#f8cf9b', pin: '#e5fff0' }
  ];

  function limb(g, points, color, width) {
    poly(g, points, null, '#392940', width + 5, false);
    poly(g, points, null, color, width, false);
  }

  function dancer(g, x, y, index, move, f) {
    const skin = people[index];
    const edge = '#392940';
    const decay = move ? Math.max(0, 1 - (f.time - move.at) / .36) : 0;
    const pose = Math.sin(decay * Math.PI / 2) * (f.calm ? .65 : 1);
    const lane = move ? move.lane : -1;
    const lean = lane === 0 ? pose * -.28 : lane === 3 ? pose * .28 : Math.sin(f.motion * 1.7 + index) * .055;
    const crouch = lane === 1 ? pose * 23 : 0;
    const jump = lane === 2 ? pose * 13 : 0;
    const bounce = f.pulse * (5 + f.energy * 6);
    oval(g, x, y + 7, 45 - jump / 2, 10 - jump * .22, '#3020396e');
    g.save();
    g.translate(x, y - jump);
    g.rotate(lean);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    limb(g, [-15, -46 + crouch + bounce, -24 - crouch * .4, -24, -24, -5], skin.pants, 19);
    limb(g, [15, -46 + crouch + bounce, 24 + crouch * .4, -25, 25, -5], skin.pants, 19);
    oval(g, -29, -4, 17, 8, skin.shoes, edge, 3, -.11);
    oval(g, 30, -4, 17, 8, skin.shoes, edge, 3, .11);
    const body = -71 + crouch - bounce;
    const raise = lane === 2 ? pose : 0;
    const sway = Math.sin(f.motion * 1.7 + index) * 7;
    for (const side of [-1, 1]) {
      const handX = side * (47 + raise * 6 - crouch * .21);
      const handY = body + 14 + side * sway - raise * 72 - crouch * .35;
      limb(g, [side * 21, body - 10, side * (36 + raise * 11), body + 12 - raise * 30, handX, handY], skin.top, 14);
      oval(g, handX, handY, 8, 8, skin.skin, edge, 3);
    }
    round(g, -30, body - 25, 60, 57, 19, skin.top, edge, 4);
    round(g, -26, body + 15, 52, 9, 4, skin.light);
    star(g, index ? 10 : -8, body + 1, 8, skin.pin);
    const head = body - 51;
    oval(g, -31, head + 6, 8, 9, skin.skin, edge, 3);
    oval(g, 31, head + 6, 8, 9, skin.skin, edge, 3);
    oval(g, 0, head, 33, 34, skin.skin, edge, 4);
    if (index === 0) {
      oval(g, -28, head - 29, 13, 12, skin.hair, edge, 3);
      oval(g, 28, head - 29, 13, 12, skin.hair, edge, 3);
      g.beginPath();
      g.moveTo(-32, head + 1);
      g.bezierCurveTo(-41, head - 28, -21, head - 40, 0, head - 36);
      g.bezierCurveTo(28, head - 39, 40, head - 17, 30, head - 1);
      g.bezierCurveTo(16, head - 5, 13, head - 13, 13, head - 20);
      g.bezierCurveTo(4, head - 6, -17, head - 3, -32, head + 1);
      g.fillStyle = skin.hair;
      g.fill();
      g.lineWidth = 3;
      g.strokeStyle = edge;
      g.stroke();
      oval(g, -10, head - 26, 16, 4, skin.hairLight, null, 2, -.32);
      star(g, 26, head - 17, 8, skin.pin);
    } else {
      round(g, -34, head - 35, 68, 35, 15, skin.hair, edge, 3);
      round(g, -33, head - 15, 66, 13, 5, '#6389a5', edge, 3);
      round(g, -10, head - 30, 20, 11, 4, skin.top);
      box(g, -6, head - 26, 12, 2, '#e9ffe9');
    }
    const blink = Math.sin(f.motion * .83 + index * 3) < -.97 ? 1.25 : 4.5;
    oval(g, -11, head + 5, 3.3, blink, edge);
    oval(g, 11, head + 5, 3.3, blink, edge);
    oval(g, -19, head + 13, 5, 2.9, skin.cheek);
    oval(g, 19, head + 13, 5, 2.9, skin.cheek);
    g.beginPath();
    g.arc(0, head + 13, 6.2, .12, Math.PI - .12);
    g.strokeStyle = edge;
    g.lineWidth = 2;
    g.stroke();
    g.restore();
  }

  function stagePainter(canvas) {
    const g = canvas.getContext('2d', { alpha: false });
    const scene = document.createElement('canvas');
    scene.width = W;
    scene.height = H;
    const base = scene.getContext('2d', { alpha: false });
    let cachedTheme;
    return function drawStage(theme, f) {
      if (theme !== cachedTheme) {
        backdrop(base, theme);
        cachedTheme = theme;
      }
      g.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      const bump = f.bump;
      g.save();
      if (bump > 0) {
        g.translate(W / 2, H / 2 + bump * 2);
        g.scale(1 + bump * .009, 1 + bump * .009);
        g.translate(-W / 2, -H / 2);
        // A solid base covers the few pixels exposed by the bump.
        g.fillStyle = theme.floor[1];
        g.fillRect(-6, -6, W + 12, H + 12);
      }
      g.drawImage(scene, 0, 0);
      const sweep = Math.sin(f.motion * .5);
      const light = .12 + f.light * .14;
      spotlight(g, 152, 394 + sweep * 187, 91, theme.lights[0], light);
      spotlight(g, 748, 502 + sweep * 178, 90, theme.lights[1], light);
      theme.draw(g, f);
      mirrorBall(g, f, theme);
      platform(g, f, theme);
      if (f.streak > 0) {
        const alpha = f.streak * .26;
        spotlight(g, 353, 350, 68, theme.lights[0], alpha, 508, 120);
        spotlight(g, 547, 551, 68, theme.lights[1], alpha, 508, 120);
      }
      dancer(g, 350, 511, 0, f.moves[0], f);
      dancer(g, 550, 511, 1, f.moves[1], f);
      g.restore();
    };
  }

  function arrow(g, x, y, size, lane, color, edge) {
    g.save();
    g.translate(x, y);
    g.rotate(rotations[lane]);
    g.scale(size, size);
    poly(g, [0, -.48, .46, -.04, .23, -.04, .23, .40, -.23, .40, -.23, -.04, -.46, -.04], color, edge,
      .055);
    g.restore();
  }

  function lanePainter(canvas) {
    const g = canvas.getContext('2d', { alpha: false });
    let background, w, h, column, hit, size;
    return function drawLane(f) {
      if (!background || w !== canvas.width || h !== canvas.height) {
        w = canvas.width;
        h = canvas.height;
        column = w / 4;
        hit = h - Math.min(h * .17, column * .64);
        size = Math.min(column * .42, h * .18);
        background = document.createElement('canvas');
        background.width = w;
        background.height = h;
        const b = background.getContext('2d', { alpha: false });
        box(b, 0, 0, w, h, grad(b, 0, h, '#201932', '#151023'));
        for (let lane = 0; lane < 4; lane++) {
          if (lane % 2) box(b, lane * column, 0, column, h, '#0b081738');
          if (lane) box(b, lane * column, 0, 1, h, '#e3c8f529');
        }
        box(b, 0, hit - 1, w, 2, '#f8deed49');
      }
      g.drawImage(background, 0, 0);
      const speed = hit / f.travel;
      if (f.beatGrid) {
        const first = Math.ceil((f.time - f.offset - f.firstBeat - (h - hit) / speed) / f.period);
        const last = Math.floor((f.time - f.offset - f.firstBeat + f.travel) / f.period);
        for (let i = first; i <= last; i++) {
          const y = hit - (f.firstBeat + i * f.period + f.offset - f.time) * speed;
          box(g, 0, y, w, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? '#f7cbe97d' : '#d3b5dd2d');
        }
      }
      for (let lane = 0; lane < 4; lane++) {
        const x = (lane + .5) * column;
        const color = ARROWS[lane];
        const flash = f.calm ? 0 : Math.max(0, 1 - (f.now - f.receptors[lane]) / 280) * f.strength;
        if (flash > 0) glow(g, x, hit, size * 1.32, color, flash * .63);
        oval(g, x, hit, size * (.74 + flash * .10), size * (.74 + flash * .10), '#251a38', color + 'df', Math.max(1.6, size * .055));
        arrow(g, x, hit, size * .76, lane, color + '74');
      }
      for (let i = f.firstNote; i < f.notes.length; i++) {
        const note = f.notes[i];
        const y = hit - (note.time + f.offset - f.time) * speed;
        if (y < -size) break;
        if (note.done || y > h + size) continue;
        const x = (note.lane + .5) * column;
        arrow(g, x, y + size * .07, size, note.lane, '#0f0c20');
        arrow(g, x, y, size, note.lane, ARROWS[note.lane], '#fff5ebc7');
      }
      if (f.calm) return;
      for (const burst of f.bursts) {
        const age = (f.now - burst.at) / 440;
        if (age >= 1) continue;
        const color = burst.miss ? '#c2bed0' : ARROWS[burst.lane];
        const x = (burst.lane + .5) * column;
        for (const p of burst.bits) {
          g.globalAlpha = (1 - age) * (burst.miss ? .32 : .95);
          const px = x + Math.cos(p.angle) * age * p.speed * size;
          const py = hit + Math.sin(p.angle) * age * p.speed * size + age * age * size * .36;
          const r = p.size * size * (1 - age * .55);
          if (burst.miss) oval(g, px, py, r * 1.5, r * 1.5, color);
          else if (p.angle % 2 < 1) star(g, px, py, r, color);
          else oval(g, px, py, r * .7, r * .7, color);
        }
      }
      g.globalAlpha = 1;
    };
  }

  root.DanceFX = { themes, stagePainter, lanePainter };
}(window));
