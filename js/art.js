/* ==========================================================================
   art.js — procedural artwork + icon set
   Draws the project covers (SVG) from each project's `style` and `palette`,
   so the site has zero broken images. Replace any cover by giving a project
   an `image` path in content.js.
   ========================================================================== */
(function (root) {
  'use strict';

  /* ---------- tiny helpers ---------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var f = function (n) { return Math.round(n * 10) / 10; };

  /* ---------- ridge lines (mountains / dunes) ---------- */
  function ridge(seed, o) {
    var r = rng(seed);
    var octaves = o.octaves || 4;
    var comps = [];
    for (var i = 0; i < octaves; i++) {
      comps.push({
        f: (o.freq || 0.012) * Math.pow(2.05, i) * (0.85 + r() * 0.3),
        p: r() * Math.PI * 2,
        a: Math.pow(0.52, i)
      });
    }
    var norm = comps.reduce(function (s, c) { return s + c.a; }, 0);
    var soft = o.soft || 0; // 0 = sharp peaks, 1 = rounded dunes
    function y(x) {
      var s = 0;
      for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        var v = Math.abs(Math.sin(c.f * x + c.p));
        if (soft) v = v * (1 - soft) + Math.pow(v, 1.8) * 0 + (1 - Math.cos(v * Math.PI)) / 2 * soft;
        s += c.a * (1 - v);
      }
      return o.base - o.amp * (s / norm);
    }
    function path(x0, x1, bottom, step) {
      step = step || 6;
      var d = 'M' + x0 + ' ' + bottom + 'L' + x0 + ' ' + f(y(x0));
      for (var x = x0 + step; x < x1; x += step) d += 'L' + f(x) + ' ' + f(y(x));
      d += 'L' + x1 + ' ' + f(y(x1)) + 'L' + x1 + ' ' + bottom + 'Z';
      return d;
    }
    return { y: y, path: path };
  }

  /* ---------- cover generators (viewBox 0 0 800 1000, centre-safe) ---------- */
  function arch(cx, bottom, w, h) {
    var r = w / 2, top = bottom - h;
    return 'M' + f(cx - r) + ' ' + bottom + 'V' + f(top + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + f(cx + r) + ' ' + f(top + r) + 'V' + bottom + 'Z';
  }

  var generators = {
    arches: function (p, r) {
      var bottom = 840, cx = 400;
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      s += '<circle cx="' + f(cx + 190 + r() * 40) + '" cy="262" r="62" fill="' + p[2] + '"/>';
      var widths = [600, 470, 340, 210], heights = [640, 520, 400, 280], fills = [p[1], p[3], p[2], p[4]];
      for (var i = 0; i < 4; i++) s += '<path d="' + arch(cx, bottom, widths[i], heights[i]) + '" fill="' + fills[i] + '"/>';
      s += '<rect x="0" y="' + bottom + '" width="800" height="160" fill="' + p[4] + '"/>';
      return s;
    },

    dunes: function (p, r) {
      var s = '<defs><linearGradient id="dn' + p.uid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs>';
      s += '<rect width="800" height="1000" fill="url(#dn' + p.uid + ')"/>';
      s += '<circle cx="' + f(300 + r() * 200) + '" cy="360" r="96" fill="' + p[2] + '" opacity=".9"/>';
      var cols = [p[2], p[3], p[4]], bases = [620, 720, 830, 920];
      var fills = [p[1], p[2], p[3], p[4]];
      for (var i = 0; i < 4; i++) {
        var rd = ridge(r() * 1e6, { base: bases[i], amp: 120 - i * 14, freq: 0.006 + i * 0.002, octaves: 3, soft: 0.8 });
        s += '<path d="' + rd.path(-10, 810, 1000, 8) + '" fill="' + fills[i] + '" opacity="' + (i === 0 ? 0.85 : 1) + '"/>';
      }
      return s;
    },

    rings: function (p, r) {
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      var cx = 400, cy = 500, dx = 46 + r() * 20;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="300" fill="' + p[3] + '"/>';
      s += '<circle cx="' + (cx + dx) + '" cy="' + cy + '" r="236" fill="' + p[2] + '"/>';
      s += '<circle cx="' + (cx + dx * 2) + '" cy="' + cy + '" r="168" fill="' + p[1] + '"/>';
      s += '<circle cx="' + (cx + dx * 3) + '" cy="' + cy + '" r="96" fill="' + p[4] + '"/>';
      for (var i = 0; i < 3; i++) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (340 + i * 34) + '" fill="none" stroke="' + p[4] + '" stroke-opacity="' + (0.5 - i * 0.14) + '" stroke-width="1.5"/>';
      return s;
    },

    lines: function (p, r) {
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      var n = 34, phase = r() * 6;
      for (var i = 0; i < n; i++) {
        var t = i / (n - 1), y0 = 170 + t * 660, amp = 20 + Math.sin(t * Math.PI) * 120;
        var d = '';
        for (var x = -20; x <= 820; x += 10) {
          var yy = y0 + Math.sin(x * 0.011 + phase + t * 5.2) * amp * (0.35 + 0.65 * Math.sin(x * 0.004 + t * 3 + phase));
          d += (x === -20 ? 'M' : 'L') + x + ' ' + f(yy);
        }
        var col = [p[1], p[2], p[3], p[4]][i % 4];
        s += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (2 + t * 3.5).toFixed(1) + '" stroke-linecap="round" opacity="' + (0.55 + t * 0.45).toFixed(2) + '"/>';
      }
      return s;
    },

    blocks: function (p, r) {
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      var cell = 160, ox = 80, oy = 180, cols = [p[1], p[2], p[3], p[4]];
      for (var gy = 0; gy < 4; gy++) {
        for (var gx = 0; gx < 4; gx++) {
          var x = ox + gx * cell, y = oy + gy * cell, c = cols[Math.floor(r() * cols.length)];
          var c2 = cols[Math.floor(r() * cols.length)];
          var kind = Math.floor(r() * 6);
          var rot = Math.floor(r() * 4) * 90;
          var g = '<g transform="rotate(' + rot + ' ' + (x + cell / 2) + ' ' + (y + cell / 2) + ')">';
          if (kind === 0) g += '<path d="M' + x + ' ' + (y + cell) + 'V' + y + 'A' + cell + ' ' + cell + ' 0 0 1 ' + (x + cell) + ' ' + (y + cell) + 'Z" fill="' + c + '"/>';
          else if (kind === 1) g += '<circle cx="' + (x + cell / 2) + '" cy="' + (y + cell / 2) + '" r="' + (cell / 2) + '" fill="' + c + '"/>';
          else if (kind === 2) g += '<path d="M' + x + ' ' + (y + cell) + 'A' + (cell / 2) + ' ' + (cell / 2) + ' 0 0 1 ' + (x + cell) + ' ' + (y + cell) + 'Z" fill="' + c + '" transform="translate(0,' + (-cell / 2) + ')"/><rect x="' + x + '" y="' + (y + cell / 2) + '" width="' + cell + '" height="' + (cell / 2) + '" fill="' + c2 + '"/>';
          else if (kind === 3) g += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" fill="' + c + '"/><circle cx="' + (x + cell / 2) + '" cy="' + (y + cell / 2) + '" r="' + (cell / 4) + '" fill="' + c2 + '"/>';
          else if (kind === 4) g += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" fill="' + c + '"/><path d="M' + x + ' ' + y + 'H' + (x + cell) + 'A' + cell + ' ' + cell + ' 0 0 1 ' + x + ' ' + (y + cell) + 'Z" fill="' + c2 + '"/>';
          g += '</g>';
          s += g;
        }
      }
      return s;
    },

    burst: function (p, r) {
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      var cx = 400, cy = 640, n = 21, R = 520;
      for (var i = 0; i < n; i++) {
        var a0 = Math.PI + (i / n) * Math.PI, a1 = Math.PI + ((i + 1) / n) * Math.PI;
        var x0 = cx + Math.cos(a0) * R, y0 = cy + Math.sin(a0) * R, x1 = cx + Math.cos(a1) * R, y1 = cy + Math.sin(a1) * R;
        s += '<path d="M' + cx + ' ' + cy + 'L' + f(x0) + ' ' + f(y0) + 'L' + f(x1) + ' ' + f(y1) + 'Z" fill="' + (i % 2 ? p[1] : p[2]) + '" opacity="' + (i % 2 ? 0.95 : 0.9) + '"/>';
      }
      s += '<path d="M' + (cx - 150) + ' ' + cy + 'A150 150 0 0 1 ' + (cx + 150) + ' ' + cy + 'Z" fill="' + p[3] + '"/>';
      s += '<path d="M' + (cx - 84) + ' ' + cy + 'A84 84 0 0 1 ' + (cx + 84) + ' ' + cy + 'Z" fill="' + p[1] + '"/>';
      s += '<rect x="0" y="' + cy + '" width="800" height="400" fill="' + p[4] + '"/>';
      s += '<rect x="' + (cx - 150) + '" y="' + (cy + 40) + '" width="300" height="2" fill="' + p[1] + '" opacity=".6"/><rect x="' + (cx - 90) + '" y="' + (cy + 70) + '" width="180" height="2" fill="' + p[1] + '" opacity=".4"/>';
      return s;
    },

    halftone: function (p, r) {
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      s += '<circle cx="' + f(480 + r() * 40) + '" cy="440" r="200" fill="' + p[3] + '"/>';
      var cols = 14, rows = 18, gap = 46, ox = (800 - (cols - 1) * gap) / 2, oy = (1000 - (rows - 1) * gap) / 2;
      var cx = 340, cy = 560, R = 330;
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          var x = ox + i * gap, y = oy + j * gap;
          var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
          var t = Math.max(0, 1 - d / R);
          var rad = 3 + t * 19;
          s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(rad) + '" fill="' + (t > 0.55 ? p[2] : p[1]) + '"/>';
        }
      }
      return s;
    },

    type: function (p, r) {
      var s = '<rect width="800" height="1000" fill="' + p[0] + '"/>';
      var ch = (p.title || 'E').charAt(0).toUpperCase();
      var font = "font-family=\"Fraunces, 'Iowan Old Style', Georgia, serif\" font-weight=\"600\" font-size=\"820\" text-anchor=\"middle\"";
      s += '<circle cx="560" cy="330" r="110" fill="' + p[3] + '"/>';
      for (var i = 4; i >= 1; i--) {
        s += '<text x="' + (400 + i * 22) + '" y="' + (780 + i * 16) + '" ' + font + ' fill="none" stroke="' + p[2] + '" stroke-width="2" opacity="' + (0.9 - i * 0.18).toFixed(2) + '">' + ch + '</text>';
      }
      s += '<text x="400" y="780" ' + font + ' fill="' + p[1] + '">' + ch + '</text>';
      s += '<rect x="80" y="880" width="640" height="3" fill="' + p[1] + '"/>';
      return s;
    }
  };

  function cover(project, opts) {
    opts = opts || {};
    if (project.image) {
      return '<img src="' + project.image + '" alt="' + (opts.alt || '').replace(/"/g, '&quot;') + '" loading="lazy" decoding="async">';
    }
    var style = generators[project.style] ? project.style : 'arches';
    var p = (project.palette || ['#f3eee4', '#e4421a', '#f2b134', '#17382f', '#0e1512']).slice();
    p.uid = hash(project.id || project.title || style) % 100000;
    p.title = project.title;
    var r = rng(hash((project.id || project.title || '') + style));
    var inner = generators[style](p, r);
    return '<svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      (opts.alt || project.title || 'Project cover').replace(/"/g, '&quot;') + '" focusable="false">' + inner + '</svg>';
  }

  /* ---------- icon set (24px UI icons + 48px service icons) ---------- */
  var S = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  var icons = {
    // services (48 grid)
    brand: '<svg viewBox="0 0 48 48" ' + S + ' aria-hidden="true" focusable="false"><path d="M8 42V22a16 16 0 0 1 32 0v20z"/><path d="M15 42V23a9 9 0 0 1 18 0v19"/><circle cx="24" cy="21" r="2.6"/></svg>',
    web: '<svg viewBox="0 0 48 48" ' + S + ' aria-hidden="true" focusable="false"><rect x="5" y="9" width="38" height="30" rx="4"/><path d="M5 17h38"/><circle cx="10.5" cy="13" r=".8"/><circle cx="14.5" cy="13" r=".8"/><path d="M21 24l9 4-4 1.6L24.4 34z"/></svg>',
    motion: '<svg viewBox="0 0 48 48" ' + S + ' aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="17"/><path d="M20 17.5l11 6.5-11 6.5z"/><path d="M4 24h2M2 18h3M2 30h3" opacity=".6"/></svg>',
    art: '<svg viewBox="0 0 48 48" ' + S + ' aria-hidden="true" focusable="false"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><circle cx="24" cy="24" r="6"/><path d="M24 4v4M24 40v4"/></svg>',
    photo: '<svg viewBox="0 0 48 48" ' + S + ' aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="5"/><path d="M24 6l7 12M40.6 15.5L27 18.5M40.6 32.5L29 24M24 42l-7-12M7.4 32.5L21 29.5M7.4 15.5L19 24"/></svg>',
    // ui (24 grid)
    arrow: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowUpRight: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><path d="M7 17L17 7M8 7h9v9"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><rect x="8" y="8" width="11" height="11" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/></svg>',
    check: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  var Art = { cover: cover, icon: function (n) { return icons[n] || ''; }, ridge: ridge, rng: rng, hash: hash, generators: generators };
  if (typeof module !== 'undefined' && module.exports) module.exports = Art;
  else root.Art = Art;
})(typeof window !== 'undefined' ? window : this);
