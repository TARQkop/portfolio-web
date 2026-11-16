/* ==========================================================================
   script.js — rendering + interactions (vanilla JS, no dependencies)
   --------------------------------------------------------------------------
   1  Helpers                 9  Anchors + smooth scroll     17 Contact form
   2  Content rendering       10 Scroll engine (parallax…)   18 Copy email
   3  Loader                  11 Statement highlight         19 Toast
   4  Theme                   12 Reveal on scroll            20 Boot
   5  Navigation              13 Counters
   6  Mobile menu             14 Projects (filter, list)
   7  Cursor                  15 Project modal
   8  Magnetic buttons        16 Testimonial slider
   ========================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE;
  var Art = window.Art;
  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  if (!SITE || !Art) {
    console.error('[portfolio] content.js / art.js did not load.');
    root.classList.add('is-failsafe');
    return;
  }

  /* ---------- 1. HELPERS ---------- */
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rich(s) { return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  var cartoonAvatars = [
    'https://api.dicebear.com/9.x/notionists/svg?seed=Alex&backgroundColor=e8d8bf',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Emma&backgroundColor=dce5d8',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=f2d5b9',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Sophia&backgroundColor=e8d9c8',
    'https://api.dicebear.com/9.x/notionists/svg?seed=James&backgroundColor=d5dfd5',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Amelia&backgroundColor=f0d9c5',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Noah&backgroundColor=e4d9c5',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Luna&backgroundColor=d8e0d5'
  ];
  function avatarMarkup(name, index) {
    var avatar = cartoonAvatars[index % cartoonAvatars.length];
    return '<img class="quote__avatar" src="' + avatar + '" alt="' + esc(name) + '" loading="lazy" decoding="async">';
  }
  function safe(name, fn) {
    try { fn(); } catch (err) { console.error('[portfolio] ' + name + ' failed:', err); }
  }
  function hydrateIcons(scope) {
    $$('i[data-icon]', scope).forEach(function (el) {
      if (!el.firstChild) el.innerHTML = Art.icon(el.getAttribute('data-icon'));
    });
  }

  var P = SITE.person;

  /* ---------- 2. CONTENT RENDERING ---------- */
  function bindContent() {
    $$('[data-bind]').forEach(function (el) {
      var v = get(SITE, el.getAttribute('data-bind'));
      if (v != null && v !== '') el.textContent = v;
    });
    $$('[data-mailto]').forEach(function (a) { a.setAttribute('href', 'mailto:' + P.email); });
    $$('[data-tel]').forEach(function (a) { a.setAttribute('href', 'tel:' + String(P.phone).replace(/[^\d+]/g, '')); });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var lines = (SITE.hero && SITE.hero.headline) || [];
    $$('[data-line-text]').forEach(function (el) {
      var t = lines[+el.getAttribute('data-line-text')];
      if (t) el.innerHTML = rich(t);
    });

    ['primary', 'secondary'].forEach(function (k) {
      var cta = SITE.hero && SITE.hero[k + 'Cta'];
      var a = $('[data-cta="' + k + '"]');
      if (cta && a) { a.setAttribute('href', cta.href); $('span', a).textContent = cta.label; }
    });

    var img = $('img[data-portrait]');
    if (img && P.portrait) { img.src = P.portrait; img.alt = P.portraitAlt || P.name; }

    var cv = $('[data-resume]');
    if (cv && P.resumeUrl) { cv.hidden = false; cv.href = P.resumeUrl; cv.setAttribute('download', ''); }

    var bt = $('[data-badge-text]');
    if (bt && P.availability) bt.textContent = (P.availability + ' • Let’s talk • ').toUpperCase();
  }

  function socialLinks(list) {
    return list.map(function (s) {
      return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + '<i data-icon="arrowUpRight"></i><span class="sr-only"> (opens in a new tab)</span></a></li>';
    }).join('');
  }

  function render() {
    var map = {
      marquee: function () {
        var set = SITE.hero.marquee.map(function (t) {
          return '<span class="marquee__item">' + esc(t) + '</span><span class="marquee__sep"></span>';
        }).join('');
        return set + set + set + set;
      },
      story: function () {
        return SITE.about.story.map(function (t) { return '<p data-reveal>' + esc(t) + '</p>'; }).join('');
      },
      values: function () {
        return SITE.about.values.map(function (v, i) {
          return '<li class="value" data-reveal><span class="value__no mono">' + pad(i + 1) + '</span><h3 class="value__title">' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></li>';
        }).join('');
      },
      stats: function () {
        var tools = SITE.about.toolkit.reduce(function (n, g) { return n + g.items.length; }, 0);
        var data = [
          [SITE.projects.length, 'Selected projects'],
          [SITE.services.length, 'Disciplines'],
          [tools, 'Skills & tools'],
          [SITE.about.languages.length, 'Languages spoken']
        ];
        return data.map(function (d) {
          return '<li class="stat" data-reveal><span class="stat__num" data-count="' + d[0] + '">0</span><span class="stat__label mono">' + esc(d[1]) + '</span></li>';
        }).join('');
      },
      toolkit: function () {
        return SITE.about.toolkit.map(function (g) {
          return '<div class="tk" data-reveal><h3 class="mono">' + esc(g.group) + '</h3><ul>' +
            g.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
        }).join('');
      },
      services: function () {
        return SITE.services.map(function (s, i) {
          return '<li class="svc" data-reveal><a class="svc__link" href="#contact" data-service="' + esc(s.title) + '">' +
            '<span class="svc__no mono">' + pad(i + 1) + '</span>' +
            '<h3 class="svc__title">' + esc(s.title) + '</h3>' +
            '<p class="svc__text">' + esc(s.text) + '</p>' +
            '<ul class="svc__tags">' + s.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
            '<span class="svc__icon">' + Art.icon(s.icon) + '</span>' +
            '<span class="svc__go"><i data-icon="arrow"></i></span></a></li>';
        }).join('');
      },
      experience: function () {
        return SITE.experience.map(function (e) {
          return '<li class="exp-item" data-reveal><span class="exp-item__period mono">' + esc(e.period) + '</span>' +
            '<div><h3>' + esc(e.role) + '</h3><p class="exp-item__org">' + esc(e.org) + ' · ' + esc(e.place) + '</p></div>' +
            '<p class="exp-item__text">' + esc(e.text) + '</p></li>';
        }).join('');
      },
      process: function () {
        return SITE.process.map(function (s, i) {
          return '<li class="step" data-reveal><span class="step__no">' + pad(i + 1) + '</span><h3 class="step__title">' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
        }).join('');
      },
      testimonials: function () {
        var n = SITE.testimonials.length;
        return SITE.testimonials.map(function (t, i) {
          return '<li class="slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + n + '">' +
            '<figure class="quote"><blockquote><p>' + esc(t.quote) + '</p></blockquote>' +
            '<figcaption>' + avatarMarkup(t.name, i) +
            '<span><strong>' + esc(t.name) + '</strong><span>' + esc(t.role) + '</span></span></figcaption></figure></li>';
        }).join('');
      },
      chips: function () {
        var types = SITE.services.map(function (s) { return s.title; }).concat('Something else');
        return types.map(function (t) {
          return '<label class="chip"><input type="radio" name="interest" value="' + esc(t) + '"><span>' + esc(t) + '</span></label>';
        }).join('');
      },
      socials: function () { return socialLinks(SITE.socials); },
      'footer-socials': function () { return socialLinks(SITE.socials); }
    };

    $$('[data-render]').forEach(function (el) {
      var fn = map[el.getAttribute('data-render')];
      if (fn) el.innerHTML = fn();
    });

    /* stagger children of [data-stagger] */
    $$('[data-stagger]').forEach(function (p) {
      Array.prototype.forEach.call(p.children, function (c, i) {
        c.style.setProperty('--i', i);
        if (!c.hasAttribute('data-reveal')) c.setAttribute('data-reveal', '');
      });
    });
    $$('.svc-list .svc, .exp-list .exp-item').forEach(function (c, i) { c.style.setProperty('--i', i % 5); });

    hydrateIcons();
  }

  /* ---------- 3. LOADER ---------- */
  function initLoader(done) {
    var el = $('.loader');
    if (!el || reduce) { if (el) el.remove(); done(); return; }
    var num = $('.loader__num', el);
    var t0 = performance.now(), dur = 1700, finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      el.classList.add('is-done');
      setTimeout(done, 700);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1500);
    }
    function tick(t) {
      var p = clamp((t - t0) / dur, 0, 1);
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      num.textContent = Math.round(e * 100);
      el.style.setProperty('--p', e.toFixed(3));
      if (p < 1) { requestAnimationFrame(tick); return; }
      var fonts = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
      Promise.race([fonts, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () { setTimeout(finish, 180); });
    }
    requestAnimationFrame(tick);
    setTimeout(finish, 6000);
  }

  /* ---------- 4. THEME ---------- */
  function initTheme() {
    var btn = $('.theme-toggle');
    function label(t) { btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }
    label(root.getAttribute('data-theme'));
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      root.setAttribute('data-theme', next);
      label(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      setTimeout(function () { root.classList.remove('theme-anim'); }, 700);
    });
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (!saved) { var t = e.matches ? 'dark' : 'light'; root.setAttribute('data-theme', t); label(t); }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  }

  /* ---------- 5. NAVIGATION ---------- */
  var navApi = { setActive: function () {}, layout: function () {} };
  function initNav() {
    var links = $$('.nav__links a');
    var ind = $('.nav__ind');
    var current = null;

    function place() {
      var a = links.filter(function (l) { return l.getAttribute('data-nav') === current; })[0];
      if (!a) { ind.classList.remove('is-on'); return; }
      var pr = ind.parentElement.getBoundingClientRect(), r = a.getBoundingClientRect();
      if (!r.width) return;
      ind.style.setProperty('--x', (r.left - pr.left + 15) + 'px');
      ind.style.setProperty('--w', (r.width - 30) + 'px');
      ind.classList.add('is-on');
    }
    function setActive(id) {
      current = id;
      links.forEach(function (l) {
        if (l.getAttribute('data-nav') === id) l.setAttribute('aria-current', 'location');
        else l.removeAttribute('aria-current');
      });
      place();
    }
    navApi.setActive = setActive;
    navApi.layout = place;

    var sections = links.map(function (l) { return doc.getElementById(l.getAttribute('data-nav')); }).filter(Boolean);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
    }
    setActive('home');
    window.addEventListener('resize', place);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
  }

  /* ---------- 6. MOBILE MENU ---------- */
  var menuApi = { close: function () {}, isOpen: function () { return false; } };
  function initMenu() {
    var btn = $('.nav__burger');
    var menu = $('#menu');
    var shell = [$('main'), $('.footer'), $('.to-top')];
    var open = false;

    $$('.menu__nav li', menu).forEach(function (li, i) { li.style.setProperty('--i', i); });

    function set(v) {
      open = v;
      body.classList.toggle('menu-open', v);
      root.classList.toggle('is-locked', v);
      btn.setAttribute('aria-expanded', String(v));
      btn.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
      menu.inert = !v;
      shell.forEach(function (n) { if (n) n.inert = v; });
      if (v) setTimeout(function () { var a = $('a', menu); if (a) a.focus({ preventScroll: true }); }, 350);
    }
    menuApi.close = function () { if (open) set(false); };
    menuApi.isOpen = function () { return open; };

    btn.addEventListener('click', function () { set(!open); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (open && window.innerWidth > 959) set(false); });
  }

  /* ---------- 7. CURSOR ---------- */
  function initCursor() {
    if (!fine || reduce) return;
    root.classList.add('has-cursor');
    var ring = $('.cursor'), dot = $('.cursor-dot'), label = $('.cursor__label');
    var shown = false;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var x = e.clientX, y = e.clientY;
      var position = 'translate3d(' + x + 'px,' + y + 'px,0)';
      ring.style.transform = position + ' scale(var(--cursor-press-scale, 1))';
      dot.style.transform = position;
      if (!shown) { shown = true; ring.classList.add('is-visible'); dot.classList.add('is-visible'); }
    }, { passive: true });
    doc.addEventListener('mouseleave', function () { shown = false; ring.classList.remove('is-visible'); dot.classList.remove('is-visible'); });

    doc.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      var h = e.target.closest ? e.target.closest('a, button, label, summary, [role="button"]') : null;
      if (t) { label.textContent = t.getAttribute('data-cursor'); ring.classList.add('has-label'); }
      else ring.classList.remove('has-label');
      ring.classList.toggle('is-hover', !!h && !t);
    });
    doc.addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
    doc.addEventListener('pointerup', function () { ring.classList.remove('is-down'); });

  }

  /* ---------- 8. MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (!fine || reduce) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        el.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', function () { el.style.translate = ''; });
    });
  }

  /* ---------- 9. ANCHORS + SMOOTH SCROLL ---------- */
  function scrollToEl(target) {
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  function initAnchors() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.hasAttribute('data-modal-contact')) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = doc.getElementById(id);
      if (!target) return;
      e.preventDefault();
      menuApi.close();
      scrollToEl(target);
      try { history.replaceState(null, '', '#' + id); } catch (err) { /* file:// */ }
    });
    $('.to-top').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 10. SCROLL ENGINE ---------- */
  var scrollTasks = [];
  function initScrollEngine() {
    var header = $('.site-header');
    var bar = $('.progress span');
    var toTop = $('.to-top');
    var par = $$('[data-parallax]');
    var parImg = $$('[data-parallax-img]');
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.pageYOffset, vh = window.innerHeight;
      var max = Math.max(1, doc.documentElement.scrollHeight - vh);
      var p = clamp(y / max, 0, 1);

      header.classList.toggle('is-scrolled', y > 24);
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      toTop.classList.toggle('is-visible', y > 700);
      toTop.style.setProperty('--p', p.toFixed(3));

      if (!reduce) {
        par.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var c = r.top + r.height / 2 - vh / 2;
          el.style.translate = '0 ' + (-c * parseFloat(el.getAttribute('data-parallax'))).toFixed(1) + 'px';
        });
        parImg.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var c = r.top + r.height / 2 - vh / 2;
          el.style.translate = '0 ' + (-c * parseFloat(el.getAttribute('data-parallax-img'))).toFixed(1) + 'px';
        });
      }
      scrollTasks.forEach(function (fn) { fn(y, vh); });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* hero mouse parallax (mountain layers) */
  function initHeroMouse() {
    var hero = $('.hero'), art = $('.hero__art');
    if (!hero || !art) return;
    $$('[data-depth]', art).forEach(function (el) { el.style.setProperty('--d', el.getAttribute('data-depth')); });
    if (!fine || reduce) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    function loop() {
      cx = lerp(cx, tx, 0.07); cy = lerp(cy, ty, 0.07);
      art.style.setProperty('--mx', cx.toFixed(3));
      art.style.setProperty('--my', cy.toFixed(3));
      if (Math.abs(cx - tx) > 0.002 || Math.abs(cy - ty) > 0.002) requestAnimationFrame(loop);
      else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }

  /* ---------- 11. STATEMENT HIGHLIGHT ---------- */
  function initStatement() {
    var el = $('[data-statement]');
    if (!el) return;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
    var spans = $$('.w', el);
    if (reduce) { spans.forEach(function (s) { s.classList.add('is-lit'); }); return; }
    scrollTasks.push(function (y, vh) {
      var r = el.getBoundingClientRect();
      var p = clamp((vh * 0.9 - r.top) / (vh * 0.42 + r.height * 0.7), 0, 1);
      var n = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle('is-lit', i < n); });
    });
  }

  /* ---------- 12. REVEAL ON SCROLL ---------- */
  var revealIO = null;
  function initReveal() {
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { revealIO.observe(e); });
  }

  /* ---------- 13. COUNTERS ---------- */
  function initCounters() {
    var els = $$('[data-count]');
    if (reduce) { els.forEach(function (e) { e.textContent = e.getAttribute('data-count'); }); return; }
    function run(el) {
      var to = +el.getAttribute('data-count');
      if (reduce) { el.textContent = to; return; }
      var t0 = performance.now(), d = 1700;
      (function f(t) {
        var p = clamp((t - t0) / d, 0, 1);
        var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.textContent = e.getAttribute('data-count'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 14. PROJECTS ---------- */
  var openProject = function () {};
  function initProjects() {
    var grid = $('#work-grid');
    var projects = SITE.projects;
    var filtersEl = $('[data-render="filters"]');

    grid.innerHTML = projects.map(function (p, i) {
      return '<article class="work" data-reveal data-id="' + esc(p.id) + '" data-category="' + esc(p.category) + '">' +
        '<button class="work__btn" type="button" data-cursor="View" aria-haspopup="dialog" aria-label="View project: ' + esc(p.title) + '">' +
        '<span class="work__media"><span class="work__cover">' + Art.cover(p, { alt: '' }) + '</span>' +
        '<span class="work__over"><span class="work__sum">' + esc(p.summary) + '</span></span></span>' +
        '<span class="work__info"><span class="work__no mono">' + pad(i + 1) + '</span>' +
        '<span class="work__title">' + esc(p.title) + '</span>' +
        '<span class="work__cat mono">' + esc(p.category) + '</span>' +
        '<span class="work__year mono">' + esc(p.year) + '</span></span></button></article>';
    }).join('');

    /* filters */
    var cats = ['All'];
    projects.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
    filtersEl.innerHTML = cats.map(function (c, i) {
      var n = c === 'All' ? projects.length : projects.filter(function (p) { return p.category === c; }).length;
      return '<button type="button" class="chip-filter' + (i === 0 ? ' is-active' : '') + '" data-filter="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '<sup>' + n + '</sup></button>';
    }).join('');

    var items = $$('.work', grid);
    var beltClones = items.map(function (el) {
      var clone = el.cloneNode(true);
      clone.classList.add('work--clone', 'is-in');
      clone.removeAttribute('data-reveal');
      clone.setAttribute('aria-hidden', 'true');
      var button = $('.work__btn', clone);
      if (button) button.setAttribute('tabindex', '-1');
      grid.appendChild(clone);
      return clone;
    });

    function layout() {
      var v = 0;
      items.forEach(function (el) { if (!el.hidden) el.setAttribute('data-pos', v++ % 4); });
    }
    function syncBelt() {
      var visible = 0;
      items.forEach(function (el, i) {
        beltClones[i].hidden = el.hidden;
        if (!el.hidden) visible++;
      });
      grid.style.setProperty('--belt-duration', Math.max(14, visible * 4.5) + 's');
    }
    layout();
    syncBelt();

    function applyFilter(cat) {
      var first = new Map();
      items.forEach(function (el) { first.set(el, el.getBoundingClientRect()); });
      items.forEach(function (el) {
        var show = cat === 'All' || el.getAttribute('data-category') === cat;
        el.hidden = !show;
        if (show) { el.classList.add('is-in'); if (revealIO) revealIO.unobserve(el); }
      });
      layout();
      syncBelt();
      if (reduce || !el_animate()) return;
      var k = 0;
      items.forEach(function (el) {
        if (el.hidden) return;
        var a = first.get(el), b = el.getBoundingClientRect();
        var frames = a.width
          ? [{ transform: 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)', opacity: 0.5 }, { transform: 'none', opacity: 1 }]
          : [{ transform: 'translateY(40px) scale(0.96)', opacity: 0 }, { transform: 'none', opacity: 1 }];
        el.animate(frames, { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)', delay: (k++) * 50, fill: 'backwards' });
      });
    }
    function el_animate() { return typeof Element !== 'undefined' && !!Element.prototype.animate; }

    filtersEl.addEventListener('click', function (e) {
      var b = e.target.closest('.chip-filter');
      if (!b) return;
      $$('.chip-filter', filtersEl).forEach(function (x) {
        var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on));
      });
      applyFilter(b.getAttribute('data-filter'));
    });

    /* grid / list toggle */
    var toggles = $$('.view-toggle__btn');
    toggles.forEach(function (b) {
      b.addEventListener('click', function () {
        var list = b.getAttribute('data-view') === 'list';
        toggles.forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
        grid.classList.toggle('is-list', list);
        items.forEach(function (el) { el.classList.add('is-in'); });
        hidePreview();
        if (el_animate() && !reduce) grid.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
      });
    });

    /* floating preview in list view */
    var preview = $('.work-preview');
    var px = 0, py = 0, tx = 0, ty = 0, pOn = false, pRun = false;
    function pLoop() {
      px = lerp(px, tx, 0.16); py = lerp(py, ty, 0.16);
      preview.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) translate(-50%,-50%)';
      if (pOn || Math.abs(px - tx) > 0.5 || Math.abs(py - ty) > 0.5) requestAnimationFrame(pLoop); else pRun = false;
    }
    function showPreview(el) {
      preview.innerHTML = $('.work__cover', el).innerHTML;
      preview.classList.add('is-on'); pOn = true;
      if (!pRun) { pRun = true; requestAnimationFrame(pLoop); }
    }
    function hidePreview() { pOn = false; preview.classList.remove('is-on'); }
    if (fine) {
      grid.addEventListener('pointermove', function (e) {
        if (!grid.classList.contains('is-list')) return;
        tx = e.clientX + 40; ty = e.clientY;
        if (!pOn) { px = tx; py = ty; }
        var w = e.target.closest('.work');
        if (w && !w.hidden) { if (preview.getAttribute('data-id') !== w.getAttribute('data-id')) { preview.setAttribute('data-id', w.getAttribute('data-id')); showPreview(w); } else if (!pOn) showPreview(w); }
        else { preview.removeAttribute('data-id'); hidePreview(); }
      });
      grid.addEventListener('pointerleave', function () { preview.removeAttribute('data-id'); hidePreview(); });
    }

    /* open modal */
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.work__btn');
      if (!b) return;
      var id = b.closest('.work').getAttribute('data-id');
      var idx = projects.findIndex(function (p) { return p.id === id; });
      hidePreview();
      openProject(idx, b);
    });
  }

  /* ---------- 15. PROJECT MODAL ---------- */
  function initModal() {
    var dlg = $('#project-modal');
    if (!dlg || typeof dlg.showModal !== 'function') {
      openProject = function () { var c = $('#contact'); if (c) scrollToEl(c); };
      return;
    }
    var projects = SITE.projects;
    var bodyEl = $('[data-modal-body]', dlg);
    var sheet = $('.modal__sheet', dlg);
    var cursor = $('.cursor'), cursorDot = $('.cursor-dot');
    var cursorHome = cursor.parentNode, cursorReturnBefore = cursorDot.nextSibling;
    var cur = 0, closing = false;
    $('[data-modal-total]', dlg).textContent = pad(projects.length);

    function restoreCursor() {
      if (cursorReturnBefore && cursorReturnBefore.parentNode === cursorHome) {
        cursorHome.insertBefore(cursor, cursorReturnBefore);
        cursorHome.insertBefore(cursorDot, cursorReturnBefore);
      } else {
        cursorHome.appendChild(cursor);
        cursorHome.appendChild(cursorDot);
      }
    }

    function render(i, swap) {
      var p = projects[i]; cur = i;
      var meta = [['Role', p.role], ['Year', p.year], ['Client', p.client], ['Tools', (p.tools || []).join(', ')]];
      bodyEl.innerHTML =
        '<div class="pm' + (swap ? ' is-swap' : '') + '">' +
        '<div class="pm__media">' + Art.cover(p, { alt: p.title + ' — project cover' }) + '</div>' +
        '<div class="pm__info"><p class="pm__cat mono">' + esc(p.category) + ' · ' + esc(p.year) + '</p>' +
        '<h2 class="pm__title" id="modal-title">' + esc(p.title) + '</h2>' +
        '<p class="pm__sum">' + esc(p.summary) + '</p>' +
        '<dl class="pm__meta">' + meta.map(function (m) { return '<div><dt class="mono">' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="pm__text">' + (p.details || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
        '<a class="btn btn--primary" href="#contact" data-modal-contact><span>Start a similar project</span><i data-icon="arrow"></i></a>' +
        '</div></div>';
      $('[data-modal-index]', dlg).textContent = pad(i + 1);
      hydrateIcons(bodyEl);
      sheet.scrollTop = 0;
    }

    function lock(v) {
      root.classList.toggle('is-locked', v);
      root.classList.toggle('modal-open', v);
    }
    openProject = function (i) {
      closing = false;
      render(i, false);
      lock(true);
      dlg.showModal();
      dlg.appendChild(cursor);
      dlg.appendChild(cursorDot);
      requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add('is-open'); }); });
    };
    function close(after) {
      if (closing || !dlg.open) return;
      closing = true;
      dlg.classList.remove('is-open');
      setTimeout(function () { dlg.close(); restoreCursor(); lock(false); closing = false; if (after) after(); }, reduce ? 0 : 700);
    }
    function step(d) { render((cur + d + projects.length) % projects.length, true); }

    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    $('[data-modal-close]', dlg).addEventListener('click', function () { close(); });
    $('[data-modal-prev]', dlg).addEventListener('click', function () { step(-1); });
    $('[data-modal-next]', dlg).addEventListener('click', function () { step(1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    dlg.addEventListener('click', function (e) {
      var a = e.target.closest('[data-modal-contact]');
      if (!a) return;
      e.preventDefault();
      var title = projects[cur].title;
      close(function () {
        var msg = $('#f-msg');
        if (msg && !msg.value.trim()) msg.value = 'Hi ' + P.firstName + ', I’d love to talk about a project similar to “' + title + '”. ';
        var c = $('#contact'); if (c) scrollToEl(c);
      });
    });
  }

  /* ---------- 16. TESTIMONIAL SLIDER ---------- */
  function initSlider() {
    var vp = $('.slider__viewport');
    var track = $('.slider__track');
    var slides = $$('.slide', track);
    var n = slides.length;
    if (!n) return;
    var i = 0, startX = 0, dx = 0, drag = false;
    var cnt = $('[data-slide-current]'), prog = $('.slider__progress');
    $('[data-slide-total]').textContent = pad(n);

    function go(k) {
      i = (k + n) % n;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      slides.forEach(function (s, j) { s.setAttribute('aria-hidden', String(j !== i)); s.inert = j !== i; });
      cnt.textContent = pad(i + 1);
      prog.style.setProperty('--p', ((i + 1) / n).toFixed(3));
    }
    go(0);
    $('[data-slide-prev]').addEventListener('click', function () { go(i - 1); });
    $('[data-slide-next]').addEventListener('click', function () { go(i + 1); });
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });

    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = true; startX = e.clientX; dx = 0;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      dx = e.clientX - startX;
      track.style.transform = 'translateX(calc(' + (-i * 100) + '% + ' + dx + 'px))';
    });
    function end() {
      if (!drag) return;
      drag = false;
      track.classList.remove('is-dragging');
      if (Math.abs(dx) > 60) go(dx < 0 ? i + 1 : i - 1); else go(i);
    }
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  }

  /* ---------- 17. CONTACT FORM ---------- */
  function initForm() {
    var form = $('#contact-form');
    var ok = $('.form-success');
    if (!form) return;
    var fields = ['name', 'email', 'message'].map(function (n) { return form.elements[n]; });
    var rules = {
      name: function (v) { return v.trim().length < 2 ? 'Please tell me your name.' : ''; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
      message: function (v) { return v.trim().length < 20 ? 'A little more detail, please — at least 20 characters.' : ''; }
    };
    function check(input) {
      var msg = rules[input.name](input.value);
      var wrap = input.closest('.field');
      wrap.classList.toggle('is-invalid', !!msg);
      input.setAttribute('aria-invalid', String(!!msg));
      $('.field__error', wrap).textContent = msg;
      return !msg;
    }
    fields.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value || input.closest('.field').classList.contains('is-invalid')) check(input); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('is-invalid')) check(input); });
    });

    function selectInterest(v) {
      $$('input[name="interest"]', form).forEach(function (r) { r.checked = r.value === v; });
    }
    $$('.svc__link').forEach(function (a) {
      a.addEventListener('click', function () { selectInterest(a.getAttribute('data-service')); });
    });

    function mailto(data) {
      var subject = 'Project enquiry from ' + data.name;
      var text = data.message + '\n\n— ' + data.name + ' (' + data.email + ')' + (data.interest ? '\nInterested in: ' + data.interest : '');
      return 'mailto:' + P.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
    }
    function showSuccess(data, sent) {
      form.hidden = true;
      ok.hidden = false;
      $('[data-success-title]', ok).textContent = 'Thank you, ' + data.name.trim().split(/\s+/)[0] + '.';
      $('[data-success-text]', ok).textContent = sent
        ? 'Your message has been sent. I’ll reply within a couple of working days.'
        : 'This demo isn’t connected to a mail service yet, so nothing has been sent. Use the button below to send your message from your email app instead.';
      var compose = $('[data-mailto-compose]', ok);
      compose.hidden = sent;
      compose.setAttribute('href', mailto(data));
      ok.focus();
    }
    function showError(msg) {
      var f = $('.form__fine', form);
      f.textContent = msg; f.style.color = '#8c1c08'; f.style.fontWeight = '600';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.company.value) return; // honeypot
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { bad[0].focus(); return; }
      var checked = $('input[name="interest"]:checked', form);
      var data = { name: form.elements.name.value, email: form.elements.email.value, message: form.elements.message.value, interest: checked ? checked.value : '' };
      var endpoint = SITE.contact && SITE.contact.formEndpoint;
      if (!endpoint) { showSuccess(data, false); return; }
      var btn = $('button[type="submit"]', form); btn.disabled = true;
      fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('bad status'); showSuccess(data, true); })
        .catch(function () { showError('Sorry, that didn’t go through. Please try again or email me directly.'); })
        .then(function () { btn.disabled = false; });
    });

    $('[data-form-reset]', ok).addEventListener('click', function () {
      form.reset();
      fields.forEach(function (f) { f.closest('.field').classList.remove('is-invalid'); f.removeAttribute('aria-invalid'); });
      ok.hidden = true; form.hidden = false;
      form.elements.name.focus();
    });
  }

  /* ---------- 18. COPY EMAIL ---------- */
  function initCopy() {
    var btn = $('[data-copy-email]');
    if (!btn) return;
    var label = $('span', btn);
    function fallback(text) {
      var ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      doc.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
      doc.body.removeChild(ta);
      return ok ? Promise.resolve() : Promise.reject();
    }
    btn.addEventListener('click', function () {
      var p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(P.email).catch(function () { return fallback(P.email); }) : fallback(P.email);
      p.then(function () {
        toast('Email address copied');
        btn.classList.add('is-done'); label.textContent = 'Copied';
        setTimeout(function () { btn.classList.remove('is-done'); label.textContent = 'Copy'; }, 2200);
      }).catch(function () { toast('Press Ctrl/Cmd + C to copy: ' + P.email); });
    });
  }

  /* ---------- 19. TOAST ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('.toast');
    t.textContent = msg; t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 2600);
  }

  /* ---------- clock ---------- */
  function initClock() {
    var els = $$('[data-clock]');
    if (!els.length) return;
    var opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    var fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: P.timezone }, opts)); }
    catch (e) { fmt = new Intl.DateTimeFormat('en-GB', opts); }
    function tick() { var s = fmt.format(new Date()); els.forEach(function (el) { el.textContent = s; }); }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 20. BOOT ---------- */
  safe('bind', bindContent);
  safe('render', render);
  safe('theme', initTheme);
  safe('nav', initNav);
  safe('menu', initMenu);
  safe('anchors', initAnchors);
  safe('cursor', initCursor);
  safe('magnetic', initMagnetic);
  safe('projects', initProjects);
  safe('modal', initModal);
  safe('slider', initSlider);
  safe('form', initForm);
  safe('copy', initCopy);
  safe('clock', initClock);
  safe('statement', initStatement);
  safe('hero-mouse', initHeroMouse);
  safe('scroll', initScrollEngine);
  safe('reveal', initReveal);
  safe('counters', initCounters);

  hydrateIcons();
  initLoader(function () {
    body.classList.add('is-ready');
    if (location.hash && location.hash.length > 1) {
      var t = doc.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView();
    }
  });
})();
