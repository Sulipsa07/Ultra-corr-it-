/* UltraCorr IT — canvas visuals (no libraries).
   1. Hero: a rotating 3D network sphere with travelling "data packets",
      drifting particles and mouse-driven tilt/parallax.
   2. Contact: a flat, slow particle network.
   Both pause when off-screen or when the tab is hidden, and draw a single
   still frame when the visitor prefers reduced motion. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CREAM = '255, 255, 255';
  var ORANGE = '245, 158, 11'; // amber
  var INK = '17, 24, 39';

  function setupCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var state = { ctx: ctx, w: 0, h: 0, dpr: 1 };
    state.resize = function () {
      var rect = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    };
    state.resize();
    return state;
  }

  // Runs `draw` every frame only while `el` is on screen and the tab is visible.
  function loop(el, draw) {
    if (reduceMotion) { draw(0, 0); return; }
    var visible = false, raf = 0, last = performance.now();
    function frame(now) {
      var dt = Math.min(now - last, 50);
      last = now;
      draw(now, dt);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    }
    function start() { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      start();
    }).observe(el);
    document.addEventListener('visibilitychange', start);
    draw(performance.now(), 16);
  }

  /* ---------- Hero network sphere ---------- */
  function heroNetwork() {
    var stage = document.getElementById('stage');
    var canvas = document.getElementById('stageCanvas');
    if (!stage || !canvas || !canvas.getContext) return;
    var c = setupCanvas(canvas);
    var ctx = c.ctx;
    // Colours can be set per page with data-line / data-hot / data-dot on #stage
    // (the light hero uses sky-blue lines instead of white).
    var CREAM = stage.dataset.line || '255, 255, 255';
    var ORANGE = stage.dataset.hot || '245, 158, 11';
    var INK = stage.dataset.dot || '17, 24, 39';

    var small = window.innerWidth < 700;
    var COUNT = small ? 90 : 150;
    var nodes = [], edges = [], packets = [], dust = [];

    // Evenly spread points on a sphere (Fibonacci lattice)
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < COUNT; i++) {
      var y = 1 - (i / (COUNT - 1)) * 2;
      var r = Math.sqrt(1 - y * y);
      var t = golden * i;
      nodes.push({ x: Math.cos(t) * r, y: y, z: Math.sin(t) * r, hot: i % 11 === 0 });
    }
    // Connect each point to its nearest neighbours
    for (var a = 0; a < COUNT; a++) {
      var near = [];
      for (var b = 0; b < COUNT; b++) {
        if (a === b) continue;
        var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
        near.push([dx * dx + dy * dy + dz * dz, b]);
      }
      near.sort(function (p, q) { return p[0] - q[0]; });
      for (var k = 0; k < 3; k++) if (near[k][1] > a) edges.push([a, near[k][1]]);
    }
    function newPacket() {
      return { edge: edges[(Math.random() * edges.length) | 0], t: 0, speed: 0.004 + Math.random() * 0.006 };
    }
    for (var p = 0; p < (small ? 10 : 18); p++) { var pk = newPacket(); pk.t = Math.random(); packets.push(pk); }
    function makeDust() {
      dust = [];
      var n = Math.round(c.w * c.h / 9000);
      for (var d = 0; d < n; d++) {
        dust.push({ x: Math.random() * c.w, y: Math.random() * c.h, vx: (Math.random() - 0.5) * 0.12, vy: -0.05 - Math.random() * 0.15, r: Math.random() * 1.6 + 0.4, ph: Math.random() * 6.28 });
      }
    }
    makeDust();

    // Pointer tilt, smoothed. Also feeds CSS variables for the layered parallax.
    var target = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
    if (!reduceMotion) {
      stage.addEventListener('pointermove', function (e) {
        var rect = stage.getBoundingClientRect();
        target.x = (e.clientX - rect.left) / rect.width - 0.5;
        target.y = (e.clientY - rect.top) / rect.height - 0.5;
      });
      stage.addEventListener('pointerleave', function () { target.x = 0; target.y = 0; });
    }

    var angle = 0;
    var projected = new Array(COUNT);

    function draw(now, dt) {
      var w = c.w, h = c.h;
      ctx.clearRect(0, 0, w, h);

      tilt.x += (target.x - tilt.x) * 0.06;
      tilt.y += (target.y - tilt.y) * 0.06;
      stage.style.setProperty('--px', tilt.x.toFixed(4));
      stage.style.setProperty('--py', tilt.y.toFixed(4));

      // Drifting dust in the background
      for (var i = 0; i < dust.length; i++) {
        var d = dust[i];
        d.x += d.vx * dt * 0.06; d.y += d.vy * dt * 0.06;
        if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
        if (d.x < -4) d.x = w + 4; else if (d.x > w + 4) d.x = -4;
        var tw = 0.35 + 0.35 * Math.sin(now * 0.0015 + d.ph);
        ctx.fillStyle = 'rgba(' + CREAM + ',' + tw.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(d.x - tilt.x * 10, d.y - tilt.y * 10, d.r, 0, 6.283); ctx.fill();
      }

      angle += dt * 0.00012;
      var ry = angle + tilt.x * 0.9;
      var rx = -0.35 + tilt.y * 0.7;
      var cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      var radius = Math.min(w, h) * (w < 600 ? 0.36 : 0.4);
      var ox = w / 2 + tilt.x * 24, oy = h / 2 + tilt.y * 18;
      var focal = 2.6;

      for (var n = 0; n < COUNT; n++) {
        var v = nodes[n];
        var x1 = v.x * cy - v.z * sy, z1 = v.x * sy + v.z * cy;
        var y2 = v.y * cx - z1 * sx, z2 = v.y * sx + z1 * cx;
        var s = focal / (focal + z2);
        projected[n] = { x: ox + x1 * radius * s, y: oy + y2 * radius * s, z: z2, s: s };
      }

      // Edges: brighter at the front, faint at the back
      ctx.lineWidth = 1;
      for (var e = 0; e < edges.length; e++) {
        var A = projected[edges[e][0]], B = projected[edges[e][1]];
        var depth = 1 - ((A.z + B.z) / 2 + 1) / 2;
        ctx.strokeStyle = 'rgba(' + CREAM + ',' + (0.06 + depth * 0.32).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }

      // Nodes
      for (var m = 0; m < COUNT; m++) {
        var P = projected[m];
        var front = 1 - (P.z + 1) / 2;
        var size = (nodes[m].hot ? 3.2 : 1.8) * P.s;
        ctx.fillStyle = nodes[m].hot ? 'rgba(' + ORANGE + ',' + (0.5 + front * 0.5).toFixed(3) + ')' : 'rgba(' + CREAM + ',' + (0.25 + front * 0.7).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(P.x, P.y, size, 0, 6.283); ctx.fill();
        if (nodes[m].hot && front > 0.55) {
          ctx.strokeStyle = 'rgba(' + ORANGE + ',' + ((front - 0.55) * 0.9).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(P.x, P.y, size + 5 + 3 * Math.sin(now * 0.004 + m), 0, 6.283); ctx.stroke();
        }
      }

      // Data packets travelling along edges
      for (var q = 0; q < packets.length; q++) {
        var pk = packets[q];
        pk.t += pk.speed * dt * 0.06;
        if (pk.t >= 1) { packets[q] = newPacket(); continue; }
        var S = projected[pk.edge[0]], T = projected[pk.edge[1]];
        var px = S.x + (T.x - S.x) * pk.t, py = S.y + (T.y - S.y) * pk.t;
        var pf = 1 - ((S.z + T.z) / 2 + 1) / 2;
        ctx.fillStyle = 'rgba(' + INK + ',' + (0.35 + pf * 0.6).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(px, py, 2.6 * S.s, 0, 6.283); ctx.fill();
      }
    }

    window.addEventListener('resize', function () { c.resize(); makeDust(); if (reduceMotion) draw(0, 0); }, { passive: true });
    loop(stage, draw);
  }

  /* ---------- Contact particle network ---------- */
  function contactField() {
    var section = document.getElementById('contact');
    var canvas = document.getElementById('contactCanvas');
    if (!section || !canvas || !canvas.getContext) return;
    var c = setupCanvas(canvas);
    var ctx = c.ctx;
    var pts = [];
    var mouse = { x: -999, y: -999 };

    function seed() {
      pts = [];
      var n = Math.min(70, Math.round(c.w * c.h / 16000));
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * c.w, y: Math.random() * c.h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, hot: i % 6 === 0 });
      }
    }
    seed();

    if (!reduceMotion) {
      section.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      });
      section.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
    }

    var LINK = 120;
    function draw(now, dt) {
      ctx.clearRect(0, 0, c.w, c.h);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.06;
        if (p.x < 0 || p.x > c.w) p.vx *= -1;
        if (p.y < 0 || p.y > c.h) p.vy *= -1;
        // Gentle pull towards the pointer
        var mx = mouse.x - p.x, my = mouse.y - p.y, md = Math.hypot(mx, my);
        if (md < 160 && md > 1) { p.x += mx / md * 0.35; p.y += my / md * 0.35; }
      }
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            ctx.strokeStyle = 'rgba(' + CREAM + ',' + ((1 - dist / LINK) * 0.16).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < pts.length; k++) {
        ctx.fillStyle = pts[k].hot ? 'rgba(' + ORANGE + ',.85)' : 'rgba(' + CREAM + ',.5)';
        ctx.beginPath(); ctx.arc(pts[k].x, pts[k].y, pts[k].hot ? 2.2 : 1.4, 0, 6.283); ctx.fill();
      }
    }

    window.addEventListener('resize', function () { c.resize(); seed(); if (reduceMotion) draw(0, 0); }, { passive: true });
    loop(section, draw);
  }

  function init() { heroNetwork(); contactField(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
