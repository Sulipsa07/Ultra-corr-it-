/* UltraCorr IT — page interactions: navigation, scroll effects, reveals,
   card tilt, process timeline, counters, cursor, modal and contact forms. */
(function () {
  'use strict';

  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var CONFIG = window.ULTRACORR_CONFIG || {};
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Menu panel (hamburger) ---------- */
  var menu = $('#menu'), panel = $('#menuPanel');
  function setMenu(open) {
    panel.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false); menu.focus(); } });
  document.addEventListener('click', function (e) { if (panel.classList.contains('is-open') && !panel.contains(e.target) && !menu.contains(e.target)) setMenu(false); });

  /* ---------- "View All Services" shows the remaining five services ---------- */
  var toggle = $('#toggleServices'), more = $('#moreServices');
  if (toggle && more) {
    toggle.addEventListener('click', function () {
      var open = more.hidden;
      more.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.firstChild.textContent = open ? 'Show Fewer Services ' : 'View All Services ';
    });
  }

  /* ---------- Kinetic hero headline ---------- */
  $$('.kinetic .word').forEach(function (w, i) { w.style.setProperty('--i', i); });

  // Shrink the headline until every line fits its container, whatever the
  // screen width or installed fonts.
  var headline = $('.kinetic');
  var hero = $('.hero, .page-hero');
  function fitHeadline() {
    if (!headline) return;
    headline.style.fontSize = '';
    // Measure with the entrance animation's offsets switched off, so tilted
    // words don't count as overflow.
    headline.classList.add('is-measuring');
    var base = parseFloat(getComputedStyle(headline).fontSize);
    var ratio = 1;
    $$('.line', headline).forEach(function (line) {
      if (line.scrollWidth > line.clientWidth + 1) ratio = Math.min(ratio, line.clientWidth / line.scrollWidth);
    });
    headline.classList.remove('is-measuring');
    if (ratio < 1) headline.style.fontSize = Math.floor(base * ratio * 0.98) + 'px';
  }
  fitHeadline();
  if (!headline) { /* page without a kinetic headline */ }
  else if ('ResizeObserver' in window) {
    var lastWidth = 0;
    new ResizeObserver(function (entries) {
      var w = Math.round(entries[0].contentRect.width);
      if (w !== lastWidth) { lastWidth = w; fitHeadline(); }
    }).observe(headline);
  } else {
    window.addEventListener('resize', fitHeadline, { passive: true });
  }
  window.addEventListener('load', fitHeadline);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeadline);

  // Play the hero entrance now, or once the loading screen has opened.
  function playHero() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (headline) headline.classList.add('is-in');
        if (hero) hero.classList.add('is-in');
      });
    });
  }
  if (document.documentElement.classList.contains('intro')) document.addEventListener('uc:intro-done', playHero, { once: true });
  else playHero();

  /* ---------- Rotating hero line (the original site's three headlines) ---------- */
  var rots = $$('.rotator .rot');
  if (rots.length > 1 && !reduceMotion) {
    var current = 0;
    setInterval(function () {
      var prev = rots[current];
      current = (current + 1) % rots.length;
      prev.classList.remove('is-on');
      prev.classList.add('is-out');
      rots[current].classList.remove('is-out');
      rots[current].classList.add('is-on');
      setTimeout(function () { prev.classList.remove('is-out'); }, 650);
    }, 3200);
  }

  /* ---------- Section headings: wrap each line so it can rise from a mask ---------- */
  $$('.split-heading').forEach(function (h) {
    $$('.line', h).forEach(function (line, i) {
      var inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.style.setProperty('--i', i);
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
    });
  });

  /* ---------- Reveal on scroll (with a small stagger inside each group) ---------- */
  $$('.service-grid, .tick-list, .stats, .contact-details').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--delay', (i * 90) + 'ms'); });
  });
  var revealTargets = $$('.reveal, .split-heading');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Scroll-driven effects ---------- */
  var header = $('.site-header');
  var timeline = $('#timeline');
  var steps = $$('.step', timeline);
  var curtains = $$('[data-curtain]'); // dark sections use curved edges instead of the curtain clip
  curtains.forEach(function (el) { el.classList.add('curtain'); });
  var ticking = false;

  function onScroll() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--progress', (window.scrollY / Math.max(1, docH)).toFixed(4));
    header.classList.toggle('is-scrolled', window.scrollY > 8);

    if (!reduceMotion && timeline) {
      // Process line fills as the timeline crosses the middle of the screen
      var r = timeline.getBoundingClientRect();
      var vertical = window.innerWidth <= 900;
      var p = vertical
        ? clamp((window.innerHeight * 0.6 - r.top) / r.height, 0, 1)
        : clamp((window.innerHeight * 0.75 - r.top) / (window.innerHeight * 0.45), 0, 1);
      timeline.style.setProperty('--tp', p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle('is-active', p >= (i / steps.length) + 0.02 || p >= 0.999); });

      // Dark sections open like a curtain as they arrive
      curtains.forEach(function (el) {
        var top = el.getBoundingClientRect().top;
        var c = clamp((top - window.innerHeight * 0.25) / (window.innerHeight * 0.6), 0, 1);
        el.style.setProperty('--curtain', c.toFixed(3));
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  if (reduceMotion) steps.forEach(function (s) { s.classList.add('is-active'); });

  /* ---------- Highlight the current section in the nav ---------- */
  var navLinks = $$('.links a');
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) sectionObserver.observe(t); });
  }

  /* ---------- Counters ---------- */
  function runCount(el) {
    var to = parseFloat(el.dataset.to);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var from = el.dataset.plain ? to - 15 : 0;
    var fmt = function (v) { return el.dataset.plain ? String(Math.round(v)) : v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); };
    if (reduceMotion) { el.textContent = fmt(to); return; }
    var start = performance.now(), dur = 1800;
    (function tick(now) {
      var k = clamp((now - start) / dur, 0, 1);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); countObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    $$('.count').forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Pointer effects: card tilt, cube tilt, cursor ---------- */
  if (finePointer && !reduceMotion) {
    $$('.service-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    var visual = $('#featureVisual');
    if (visual) visual.addEventListener('pointermove', function (e) {
      var r = visual.getBoundingClientRect();
      visual.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      visual.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    if (visual) visual.addEventListener('pointerleave', function () { visual.style.setProperty('--tx', 0); visual.style.setProperty('--ty', 0); });

    document.documentElement.classList.add('has-cursor');
    var cursor = $('.cursor');
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, moving = false;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.classList.toggle('is-active', !!(e.target.closest && e.target.closest('a, button, .service-card, .mini-card, input, select, textarea')));
      if (!moving) { moving = true; requestAnimationFrame(follow); }
    }, { passive: true });
    function follow() {
      cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22;
      cursor.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (Math.abs(mx - cx) + Math.abs(my - cy) > 0.3) requestAnimationFrame(follow); else moving = false;
    }
    document.addEventListener('pointerleave', function () { cursor.style.opacity = '0'; });
    document.addEventListener('pointerenter', function () { cursor.style.opacity = '1'; });
  }

  /* ---------- Service cards pre-select the matching topic in the form ---------- */
  function preselect(wanted) {
    var select = $('#interest');
    if (!select || !wanted) return;
    $$('option', select).forEach(function (o) { if (o.textContent === wanted) select.value = o.value; });
  }
  $$('.service-card[data-interest]').forEach(function (card) {
    card.addEventListener('click', function () { preselect(card.dataset.interest); });
  });
  // Links from other pages arrive as contact.html?service=...#message
  try { preselect(new URLSearchParams(location.search).get('service')); } catch (e) {}

  /* ---------- Tabs: [data-tabs] groups of role="tab" buttons ---------- */
  $$('[data-tabs]').forEach(function (group) {
    var tabs = $$('[role="tab"]', group);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
      });
    });
  });

  /* ---------- Filters: .filter-btn[data-filter] show .filter-item[data-category] ---------- */
  var filterBtns = $$('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      $$('.filter-item').forEach(function (item) { item.hidden = v !== 'all' && item.dataset.category !== v; });
    });
  });

  /* ---------- About page: 3D scene follows the pointer ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt-scene]').forEach(function (scene) {
      scene.addEventListener('pointermove', function (e) {
        var r = scene.getBoundingClientRect();
        scene.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        scene.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      scene.addEventListener('pointerleave', function () { scene.style.setProperty('--tx', 0); scene.style.setProperty('--ty', 0); });
    });
  }

  /* ---------- About page: team cards reveal each bio ---------- */
  $$('.person-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.person');
      var open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Portfolio: category strip applies the matching filter ---------- */
  $$('[data-jump]').forEach(function (a) {
    a.addEventListener('click', function () {
      var btn = $('.filter-btn[data-filter="' + a.dataset.jump + '"]');
      if (btn) btn.click();
    });
  });

  /* ---------- Legal pages: highlight the section being read ---------- */
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.legal-card[id]').forEach(function (s) { tocObserver.observe(s); });
  }

  /* ---------- Modal ---------- */
  var modal = $('#modal');
  var lastFocus = null;
  function focusables() { return $$('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea', modal); }
  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#mFirstName').focus(); }, 30);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-open-modal]').forEach(function (b) { b.addEventListener('click', openModal); });
  $$('[data-close-modal]').forEach(function (b) { b.addEventListener('click', closeModal); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Contact forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+()\d\s.-]{7,20}$/;

  function setupForm(form) {
    var msg = $('.form-msg', form);
    var button = $('button[type="submit"]', form);
    var label = $('.btn-label', button);
    var fields = {
      firstName: form.elements.firstName,
      lastName: form.elements.lastName,
      email: form.elements.email,
      message: form.elements.message
    };
    if (form.elements.phone) fields.phone = form.elements.phone;
    var tried = false;

    function errorFor(key) {
      var el = fields[key], v = el.value.trim();
      if (key === 'firstName') return !v ? 'Please enter your first name.' : '';
      if (key === 'lastName') return !v ? 'Please enter your last name.' : '';
      if (key === 'phone') return v && !PHONE_RE.test(v) ? 'Please enter a valid phone number, or leave it empty.' : '';
      if (key === 'email') return !v ? 'Please enter your work email.' : (!EMAIL_RE.test(v) ? 'That email address doesn’t look right.' : '');
      if (key === 'message') return v.length < 10 ? 'Please tell us a little about your project (at least 10 characters).' : '';
      return '';
    }
    function show(key, text) {
      var el = fields[key];
      var holder = el.closest('.field');
      var out = $('#' + el.id + '-error');
      holder.classList.toggle('is-invalid', !!text);
      el.setAttribute('aria-invalid', text ? 'true' : 'false');
      if (out) { out.textContent = text; el.setAttribute('aria-describedby', out.id); }
    }
    function validate() {
      var firstBad = null;
      Object.keys(fields).forEach(function (key) {
        var text = errorFor(key);
        show(key, text);
        if (text && !firstBad) firstBad = fields[key];
      });
      return firstBad;
    }
    Object.keys(fields).forEach(function (key) {
      fields[key].addEventListener('input', function () { if (tried) show(key, errorFor(key)); });
      fields[key].addEventListener('blur', function () { if (tried || fields[key].value) show(key, errorFor(key)); });
    });

    function status(kind, html) {
      msg.className = 'form-msg' + (kind ? ' is-' + kind : '');
      msg.innerHTML = html;
    }
    function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function mailtoLink(data) {
      var body = 'Name: ' + data.name + '\nEmail: ' + data.email +
        (data.phone ? '\nPhone: ' + data.phone : '') +
        (data.organization ? '\nOrganization: ' + data.organization : '') +
        '\nService interest: ' + (data.interest || 'Not specified') + '\n\n' + data.message;
      return 'mailto:' + (CONFIG.contactEmail || 'info@ultracorrit.com') + '?subject=' + encodeURIComponent(CONFIG.emailSubject || 'Website enquiry') + '&body=' + encodeURIComponent(body);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      var bad = validate();
      if (bad) {
        status('error', 'Please check the highlighted fields.');
        bad.focus();
        return;
      }
      if (form.elements._honey && form.elements._honey.value) return; // bot trap

      var get = function (n) { return form.elements[n] ? form.elements[n].value.trim() : ''; };
      var data = {
        firstName: get('firstName'),
        lastName: get('lastName'),
        name: get('firstName') + ' ' + get('lastName'),
        email: get('email'),
        phone: get('phone'),
        organization: get('organization'),
        interest: get('interest'),
        message: get('message'),
        newsletter: form.elements.newsletter && form.elements.newsletter.checked ? 'Yes' : 'No'
      };
      var fallback = '<a href="' + mailtoLink(data) + '">email us directly</a> or call <a href="tel:+919458888499">+91 94588 88499</a>';

      if (!CONFIG.formEndpoint) {
        status('error', 'Online sending isn’t switched on for this site yet, so nothing has been sent. Please ' + fallback + '.');
        return;
      }
      if (location.protocol === 'file:') {
        status('error', 'Nothing was sent: the form only works when the site is opened through a web server (see README). Please ' + fallback + '.');
        return;
      }

      button.disabled = true;
      label.textContent = 'Sending…';
      status('', '');

      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          'First Name': data.firstName,
          'Last Name': data.lastName,
          'Email': data.email,
          'Phone': data.phone || 'Not provided',
          'Organization': data.organization || 'Not provided',
          'Service Interest': data.interest || 'Not specified',
          'Message': data.message,
          'Send Compliance Checklist': data.newsletter,
          _subject: CONFIG.emailSubject || 'Website enquiry',
          _replyto: data.email,
          _template: 'table',
          _captcha: 'false'
        })
      })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (r) {
          var success = r.ok && (r.body.success === true || r.body.success === 'true');
          if (success) {
            status('success', 'Thank you, ' + escapeHtml(data.firstName) + '. Your enquiry has been sent to the UltraCorr IT team and we’ll reply to ' + escapeHtml(data.email) + '.');
            form.reset();
            tried = false;
            Object.keys(fields).forEach(function (k) { show(k, ''); });
          } else {
            var reason = r.body && r.body.message ? ' (' + escapeHtml(String(r.body.message)) + ')' : '';
            status('error', 'Your enquiry could not be sent' + reason + '. Please ' + fallback + '.');
          }
        })
        .catch(function () {
          status('error', 'We couldn’t reach the mail service, so nothing was sent. Please check your connection, or ' + fallback + '.');
        })
        .then(function () {
          button.disabled = false;
          label.textContent = 'Send Message';
        });
    });
  }
  $$('.contact-form').forEach(setupForm);
})();
