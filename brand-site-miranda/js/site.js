/* Pace and Publish — shared code for all seven pages:
   header, footer, test clock, date and time formatting, result states, page rendering,
   and the interactive features in prd.md section 13.
   Plain JavaScript, no modules, works from a file:// address. */

var TOP_N = 10; // WEC and IMSA show at most this many rows per class

var PP = (function () {
  'use strict';

  var CAPPED_SERIES = ['wec', 'imsa'];
  var DATA_ERROR = 'The data file could not be loaded. Run the refresh script.';

  /* ---------- browser storage (may be blocked; never required) ---------- */

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch (e) { /* storage blocked: the site works without it */ }
    return null;
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ---------- data and clock ---------- */

  function data() {
    var d = window.PP_DATA;
    if (!d || typeof d !== 'object' || !Array.isArray(d.series)) return null;
    return d;
  }

  var testNow = (function () {
    try {
      var v = new URLSearchParams(window.location.search).get('now');
      if (!v) return null;
      var t = Date.parse(v);
      return isNaN(t) ? null : t;
    } catch (e) { return null; }
  })();

  var loadedAt = Date.now();

  // The moment the page treats as "now" when it was opened.
  function now() { return testNow === null ? Date.now() : testNow; }

  // A clock that keeps running from that moment, for countdowns and live badges.
  function liveNow() { return testNow === null ? Date.now() : testNow + (Date.now() - loadedAt); }

  // Times show in the track's time zone. Passing no zone (null) shows the visitor's own,
  // which the switch on each calendar weekend uses.
  function zone(trackTz) { return trackTz; }

  /* ---------- small DOM helper ---------- */

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        if (k === 'text') n.textContent = attrs[k];
        else if (k === 'className') n.className = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function outLink(href, text) {
    return el('a', { href: href, target: '_blank', rel: 'noopener', text: text });
  }

  // Series colour boxes were removed at the client's request (13 Nov 2026); kept as a no-op so callers stay simple.
  function chip() { return null; }

  /* ---------- date and time formatting ---------- */

  function parts(ms, tz, opts) {
    var o = Object.assign({}, opts);
    if (tz) o.timeZone = tz;
    var out = {};
    new Intl.DateTimeFormat('en-GB', o).formatToParts(new Date(ms)).forEach(function (p) {
      out[p.type] = p.value;
    });
    return out;
  }

  // The timezone label the browser gives; an offset-only label gets the IANA name after it.
  function tzLabel(ms, tz) {
    var zoneName = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    var label = null;
    ['en-US', 'en-GB'].some(function (loc) {
      var p = new Intl.DateTimeFormat(loc, { timeZone: zoneName, timeZoneName: 'short' })
        .formatToParts(new Date(ms)).filter(function (x) { return x.type === 'timeZoneName'; })[0];
      if (p && !/^(GMT|UTC)[+\-−]/.test(p.value)) { label = p.value; return true; }
      if (p && !label) label = p.value;
      return false;
    });
    if (/^(GMT|UTC)[+\-−]/.test(label)) label = label + ' (' + zoneName + ')';
    return label;
  }

  function time24(ms, tz) {
    var p = parts(ms, tz, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    return p.hour + ':' + p.minute;
  }

  // "Sat 14 Jun"
  function dayMonth(ms, tz) {
    var p = parts(ms, tz, { weekday: 'short', day: 'numeric', month: 'short' });
    return p.weekday + ' ' + p.day + ' ' + p.month;
  }

  // "Sat 14 Jun, 14:00 CEST" in the track's timezone (or the visitor's, when tz is null)
  function trackDateTime(iso, tz) {
    var ms = Date.parse(iso), z = zone(tz);
    return dayMonth(ms, z) + ', ' + time24(ms, z) + ' ' + tzLabel(ms, z);
  }

  // "12 Nov 2026, 14:05 EST" in the visitor's own timezone
  function visitorDateTime(iso) {
    var ms = Date.parse(iso);
    var p = parts(ms, null, { day: 'numeric', month: 'short', year: 'numeric' });
    return p.day + ' ' + p.month + ' ' + p.year + ', ' + time24(ms, null) + ' ' + tzLabel(ms, null);
  }

  // News dates are calendar dates ("2026-11-10") -> "Tue 10 Nov 2026"
  function newsDate(ymd) {
    if (!ymd) return '';
    var ms = Date.parse(ymd + 'T12:00:00Z');
    var p = parts(ms, 'UTC', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    return p.weekday + ' ' + p.day + ' ' + p.month + ' ' + p.year;
  }

  // "4d 3h 12m 5s"
  function countdownText(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    return (d ? d + 'd ' : '') + (d || h ? h + 'h ' : '') + m + 'm ' + (s % 60) + 's';
  }

  /* ---------- weekend and session logic ---------- */

  // A calendar date with no time ("2027-01-16"), read as midday UTC so the day never shifts.
  function dateOnlyMs(ymd) { return ymd ? Date.parse(ymd.slice(0, 10) + 'T12:00:00Z') : NaN; }

  // Sort key for a session: its start, or its date when the official site gives no time.
  function sessionKey(s) {
    if (s.start) return Date.parse(s.start);
    if (s.date) return Date.parse(s.date.slice(0, 10) + 'T00:00:00Z');
    return NaN;
  }

  function sessionsSorted(w) {
    return (w.sessions || []).filter(function (s) { return !isNaN(sessionKey(s)); })
      .slice().sort(function (a, b) { return sessionKey(a) - sessionKey(b); });
  }

  function firstStart(w) {
    var s = sessionsSorted(w);
    if (s.length) return sessionKey(s[0]);
    if (w.startDate) return Date.parse(w.startDate.slice(0, 10) + 'T00:00:00Z');
    return null;
  }

  // "Sat 14 Jun, 14:00 CEST", or "Sat 14 Jun" when the site gives only the date.
  function sessionWhen(s, tz) {
    if (s.start) return trackDateTime(s.start, tz);
    return dayMonth(dateOnlyMs(s.date), 'UTC');
  }

  // A session's day ("Sat 14 Jun"), following the time switch.
  function sessionDay(s, tz) {
    return s.start ? dayMonth(Date.parse(s.start), zone(tz)) : dayMonth(dateOnlyMs(s.date), 'UTC');
  }

  function sessionEnded(s, t) {
    if (!s.start) return t >= Date.parse(s.date.slice(0, 10) + 'T23:59:59Z');
    var end = Date.parse(s.start) + (s.durationMinutes ? s.durationMinutes * 60000 : 0);
    return t >= end;
  }

  // Started and not yet ended. Needs a duration: without one a session is never "on track".
  function sessionRunning(s, t) {
    if (!s.start || !s.durationMinutes) return false;
    var st = Date.parse(s.start);
    return t >= st && t < st + s.durationMinutes * 60000;
  }

  function hasResults(s) {
    return Array.isArray(s.results) && s.results.some(function (g) { return g && g.rows && g.rows.length; });
  }

  // Latest weekend whose first session starts no later than 24 hours from now.
  function shownWeekend(series) {
    var limit = now() + 24 * 3600 * 1000;
    var best = null, bestStart = null;
    (series.weekends || []).forEach(function (w) {
      var f = firstStart(w);
      if (f === null || f > limit) return;
      if (bestStart === null || f > bestStart) { best = w; bestStart = f; }
    });
    return best;
  }

  // The next timed session after t, across every weekend of a series.
  function nextSession(series, t) {
    var best = null;
    (series.weekends || []).forEach(function (w) {
      (w.sessions || []).forEach(function (s) {
        if (!s.start) return;
        var st = Date.parse(s.start);
        if (st > t && (!best || st < best.ms)) best = { s: s, w: w, ms: st };
      });
    });
    return best;
  }

  function findPhoto(d, page) {
    return (d.photos || []).filter(function (p) { return p.page === page; })[0] || null;
  }

  /* ---------- live countdowns and badges (one shared ticker) ---------- */

  var tickers = [];
  function startTicker() {
    var tick = function () { var t = liveNow(); tickers.forEach(function (f) { f(t); }); };
    tick();
    window.setInterval(tick, 1000);
  }

  function countdownLine(series) {
    var line = el('p', { className: 'countdown' });
    var current = null;
    tickers.push(function (t) {
      var n = nextSession(series, t);
      if (!n) { line.hidden = true; return; }
      line.hidden = false;
      if (!current || current.s !== n.s) {
        current = n;
        line.textContent = '';
        line.appendChild(el('span', { className: 'countdown-label', text: 'Next up: ' }));
        line.appendChild(document.createTextNode(
          n.s.name + (n.w.name ? ' (' + n.w.name + ')' : '') + ', ' + trackDateTime(n.s.start, n.w.timeZone) + ' · in '));
        line.appendChild(el('span', { className: 'countdown-clock' }));
      }
      line.querySelector('.countdown-clock').textContent = countdownText(n.ms - t);
    });
    return line;
  }

  function liveBadge(s) {
    var b = el('span', { className: 'badge live', text: 'On track now', hidden: 'hidden' });
    tickers.push(function (t) { if (b.isConnected) b.hidden = !sessionRunning(s, t); });
    return b;
  }

  /* ---------- shared blocks ---------- */

  function photoFigure(photo) {
    if (!photo) return null;
    var img = el('img', {
      src: photo.file, alt: photo.alt, width: photo.width, height: photo.height, loading: 'lazy'
    });
    var cap = el('figcaption', null, [
      'Photo: ' + photo.credit + (photo.licence ? ', ' + photo.licence : '') + ', via ',
      outLink(photo.creditUrl, photo.sourceSite || 'source'),
    ]);
    return el('figure', null, [img, cap]);
  }

  function sourceLine(url, siteName) {
    if (!url) return null;
    return el('p', { className: 'src' }, ['Source: ', outLink(url, siteName)]);
  }

  function newsCaption(item, series) {
    return item.caption ? item.caption : 'New article on ' + series.siteName + '.';
  }

  function sortedNews(series) {
    return (series.news || []).slice().sort(function (a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
  }

  /* ---------- header, footer, notices ---------- */

  // Animated strip under the header: a race car with its driver (green team suit, original helmet) drives across above the chequered line.
  // Drawn here (original artwork, no team or brand), so it works offline. Decoration only.
  function raceStrip() {
    var strip = el('div', { className: 'race-strip', 'aria-hidden': 'true' });
    strip.innerHTML =
      '<div class="racer">' +
        '<svg class="car" viewBox="0 0 120 34" width="124" height="35">' +
          '<path d="M6 14 h10 v-6 h6 v8 z" fill="currentColor"/>' +                                    // rear wing
          // Driver: green race suit with lime trim (team colours only, no logos)
          '<path d="M58.5 16 C58.5 11 61.5 9.4 66 9.4 L76 9.4 C79 9.4 81 11.2 81 16 Z" fill="#0b5d45"/>' + // shoulders
          '<path d="M61 11 C63.5 10 66 9.8 69 9.8" stroke="#c6f432" stroke-width="0.9" fill="none"/>' + // lime trim
          '<path d="M74 11.2 L85 13.4" stroke="#0b5d45" stroke-width="2.6" stroke-linecap="round"/>' +  // arm to the wheel
          '<circle cx="85.4" cy="13.5" r="1.5" fill="#1a1a1a"/>' +                                     // glove
          '<path d="M14 22 C14 16 26 14 40 14 L57 14 C60 16.4 79 16.4 83 14.6 L100 16 C108 17 114 19 116 23 L116 25 L14 25 Z" fill="currentColor"/>' + // body
          // Helmet: white shell, green and lime stripes, tinted visor, chin bar, air vent (original design)
          '<path d="M62 10.4 C62 2.6 65.6 0.4 70.2 0.4 C75.4 0.4 78.4 3.6 78.4 8.2 L78.4 10.6 C75 11.8 65.5 11.8 62 10.4 Z" fill="#f4f4f4"/>' +
          '<path d="M62.3 6.4 C66 4.7 72.5 4.4 78.4 5.2 L78.4 7 C72.6 6.3 66.3 6.6 62.5 8.2 Z" fill="#0b5d45"/>' +
          '<path d="M62.6 8.6 C66.4 7.1 72.6 6.9 78.4 7.5" stroke="#c6f432" stroke-width="0.6" fill="none"/>' +
          '<path d="M70.6 3.4 h7.6 v3.4 h-8.2 z" fill="#111"/>' +                                      // visor
          '<path d="M71.6 4.2 l4.6 -0.2 M72.2 5.4 l2.4 -0.1" stroke="#7fc4ff" stroke-width="0.6" opacity=".8"/>' + // visor reflection
          '<path d="M70.2 7.2 h8.2 v2.4 c-2.8 0.7 -5.6 0.7 -8.2 0 z" fill="#d9d9d9"/>' +                  // chin bar
          '<rect x="65.4" y="0.9" width="3.4" height="1.3" rx="0.6" fill="#0b5d45"/>' +                // air vent
          '<path d="M58 14 C61 9.5 67 9 70 9.5 M70 9.5 C74 10 77.5 11.5 79 13" fill="none" stroke="#111" stroke-width="2"/>' + // halo
          '<path d="M104 23 h14 v3 h-16 z" fill="currentColor"/>' +                                     // front wing
          '<circle cx="28" cy="25" r="7.5" fill="#111"/><circle cx="28" cy="25" r="3" fill="#777"/>' +  // rear wheel
          '<circle cx="96" cy="25" r="6.5" fill="#111"/><circle cx="96" cy="25" r="2.6" fill="#777"/>' + // front wheel
          '<path class="speed" d="M0 18 h8 M2 22 h7 M0 26 h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>' +
        '</svg>' +
      '</div>';
    return strip;
  }

  // Instagram button: opens our Instagram profile in a new tab. Simple camera outline drawn here.
  var INSTAGRAM_URL = 'https://www.instagram.com/paceandpublish/';
  function instagramButton(extraClass, label) {
    var a = el('a', { className: 'ig-button' + (extraClass ? ' ' + extraClass : ''), href: INSTAGRAM_URL,
      target: '_blank', rel: 'noopener', 'aria-label': 'Follow Pace and Publish on Instagram (opens in a new tab)' });
    a.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">' +
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' +
      (label === '' ? '' : '<span>' + (label || 'Follow us on Instagram') + '</span>');
    return a;
  }

  function renderHeader(d, page) {
    var host = document.getElementById('site-header');
    if (!host) return;
    var links = [{ href: 'index.html', text: 'Home', id: 'home' }];
    if (d) d.series.forEach(function (s) { links.push({ href: s.id + '.html', text: s.name, id: s.id, series: true }); });
    links.push({ href: 'index.html#calendar', text: 'Race calendar', id: 'calendar' });
    var ul = el('ul');
    links.forEach(function (l) {
      var a = el('a', { href: l.href }, [l.series ? chip(l.id) : null, l.text]);
      if (l.id === page) a.setAttribute('aria-current', 'page');
      ul.appendChild(el('li', null, [a]));
    });
    // Small icon-only Instagram button, kept in the same item as Race calendar so the two never split across lines.
    ul.lastChild.classList.add('ig-item');
    ul.lastChild.appendChild(instagramButton('ig-icon', ''));

    var lights = el('span', { className: 'lights', 'aria-hidden': 'true' },
      [0, 1, 2, 3, 4].map(function () { return el('span', { className: 'light' }); }));

    var header = el('header', { className: 'site-header' }, [
      el('div', { className: 'wrap' }, [
        el('span', { className: 'brand' }, [
          lights,
          el('a', { className: 'wordmark', href: 'index.html', text: 'Pace and Publish' })
        ]),
        el('nav', { className: 'site-nav', 'aria-label': 'Main' }, [ul])
      ])
    ]);
    header.appendChild(raceStrip());
    host.appendChild(header);

    // Home: the intro sentence sits right under the title, on its own line in the header.
    var intro = document.querySelector('main .intro');
    if (intro) {
      intro.classList.add('header-intro');
      header.querySelector('.wrap').insertBefore(intro, header.querySelector('.site-nav'));
    }
    if (testNow !== null) host.appendChild(el('p', { className: 'test-time', text: 'Test time in use' }));

    // Start lights: light one by one, then all out, on every page load. Never with reduced motion.
    if (!reducedMotion()) window.setTimeout(function () { lights.classList.add('go'); }, 60);
  }

  function renderFooter(d) {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var inner = el('div', { className: 'wrap' });
    inner.appendChild(el('p', { className: 'ig-footer' }, ['Pace and Publish is also on Instagram. ', instagramButton('ig-small')]));
    if (d && d.lastUpdated) inner.appendChild(el('p', { text: 'Last updated: ' + visitorDateTime(d.lastUpdated) }));
    host.appendChild(el('footer', { className: 'site-footer' }, [inner]));
  }

  function showDataError(main) {
    main.innerHTML = '';
    main.appendChild(el('p', { className: 'notice', text: DATA_ERROR }));
  }

  /* ---------- result tables: sort and highlight ---------- */

  var COLS = [
    ['pos', 'Pos'], ['name', 'Name'], ['team', 'Team'], ['number', 'No.'], ['timeOrGap', 'Time or gap']
  ];

  function posKey(r) {
    var n = parseInt(r.pos, 10);
    return isNaN(n) ? Infinity : n;
  }

  var highlighted = null;
  function applyHighlight() {
    [].forEach.call(document.querySelectorAll('.name-pick'), function (b) {
      var on = highlighted !== null && b.textContent === highlighted;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.closest('tr').classList.toggle('hl', on);
    });
  }

  function sortTable(table, col, th) {
    var dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
    [].forEach.call(table.querySelectorAll('th'), function (h) { h.removeAttribute('aria-sort'); });
    th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
    var tbody = table.tBodies[0];
    var rows = [].slice.call(tbody.rows);
    rows.sort(function (a, b) {
      var ra = a._row, rb = b._row;
      if (col === 'pos') return dir * ((posKey(ra) - posKey(rb)) || (a._i - b._i));
      var x = ra[col] === null || ra[col] === undefined ? '' : String(ra[col]);
      var y = rb[col] === null || rb[col] === undefined ? '' : String(rb[col]);
      if (x === '' && y !== '') return 1;
      if (y === '' && x !== '') return -1;
      return dir * x.localeCompare(y, 'en', { numeric: true }) || (a._i - b._i);
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  }

  function resultTable(rows) {
    var table = el('table');
    var headRow = el('tr');
    COLS.forEach(function (c) {
      var th = el('th', { scope: 'col' });
      var btn = el('button', { type: 'button', className: 'sort', text: c[1] });
      btn.addEventListener('click', function () { sortTable(table, c[0], th); });
      th.appendChild(btn);
      headRow.appendChild(th);
    });
    var tbody = el('tbody');
    rows.forEach(function (r, i) {
      var tr = el('tr', null, COLS.map(function (c) {
        var v = r[c[0]];
        var text = v === null || v === undefined ? '' : String(v);
        if (c[0] === 'name' && text) {
          var pick = el('button', { type: 'button', className: 'name-pick', 'aria-pressed': 'false', text: text });
          pick.addEventListener('click', function () {
            highlighted = highlighted === text ? null : text;
            applyHighlight();
          });
          return el('td', { 'data-label': c[1] }, [pick]);
        }
        return el('td', { 'data-label': c[1], text: text });
      }));
      tr._row = r; tr._i = i;
      tbody.appendChild(tr);
    });
    table.appendChild(el('thead', null, [headRow]));
    table.appendChild(tbody);
    return table;
  }

  /* ---------- session panels ---------- */

  function sessionBlock(series, w, s, open) {
    var summary = el('summary', null, [
      el('h3', null, [s.name, liveBadge(s)]),
      el('p', { className: 'when', text: sessionWhen(s, w.timeZone) })
    ]);
    var block = el('details', { className: 'session' }, [summary]);
    if (open) block.open = true;
    var capped = CAPPED_SERIES.indexOf(series.id) !== -1;
    if (hasResults(s)) {
      s.results.forEach(function (g) {
        if (!g || !g.rows || !g.rows.length) return;
        var rows = g.rows.map(function (r, i) { return { r: r, i: i }; })
          .sort(function (a, b) { return (posKey(a.r) - posKey(b.r)) || (a.i - b.i); })
          .map(function (x) { return x.r; });
        if (capped) rows = rows.slice(0, TOP_N);
        if (g['class']) block.appendChild(el('h4', { className: 'class-name', text: g['class'] }));
        block.appendChild(resultTable(rows));
      });
    } else if (!sessionEnded(s, now())) {
      block.appendChild(el('p', { text: 'Results not available until ' + sessionWhen(s, w.timeZone) }));
    } else {
      block.appendChild(el('p', { text: 'Results not yet added.' }));
    }
    block.appendChild(sourceLine(s.sourceUrl, series.siteName));
    return block;
  }

  // Which session starts open: the running one, else the latest with results, else the next one.
  function focusSession(sessions, t) {
    var running = sessions.filter(function (s) { return sessionRunning(s, t); })[0];
    if (running) return running;
    var withResults = sessions.filter(hasResults);
    if (withResults.length) return withResults[withResults.length - 1];
    return sessions.filter(function (s) { return !sessionEnded(s, t); })[0] || sessions[sessions.length - 1];
  }

  /* ---------- driver cards ---------- */

  function driverPhoto(d, seriesId, name) {
    var key = function (x) { return (x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
    return (d.photos || []).filter(function (p) {
      return p.page === 'driver' && p.series === seriesId && p.file && key(p.driver) === key(name);
    })[0] || null;
  }

  var pageCredits = [];   // driver photo credits, listed at the bottom of the page

  function teamColour(d, seriesId, team) {
    var t = (d.teamColours || []).filter(function (x) { return x.series === seriesId && x.team === team; })[0];
    return t ? t.colour : null;
  }

  function teamBlock(d, series, entry, sharedSource) {
    var drivers = entry.drivers || [];
    var colour = teamColour(d, series.id, entry.team);
    var block = el('article', { className: 'team-block' });
    if (colour) block.style.setProperty('--team', colour);

    var faces = el('div', { className: 'team-faces' });
    var credits = [];
    drivers.forEach(function (name, i) {
      var ph = driverPhoto(d, series.id, name);
      var face;
      if (ph) {
        face = el('img', { className: 'face', src: ph.file, alt: ph.alt, width: ph.width, height: ph.height, loading: 'lazy' });
        face.style.objectPosition = '50% ' + (ph.focusY === undefined || ph.focusY === null ? 25 : ph.focusY) + '%';
        credits.push({ name: name, ph: ph });
      } else {
        face = el('div', { className: 'face none', role: 'img', 'aria-label': name + ': photo not yet added' });
      }
      faces.appendChild(face);
      if (i === 0) faces.appendChild(el('p', { className: 'team-mark', text: entry.team || '' }));
    });
    block.appendChild(faces);

    var banner = el('div', { className: 'team-banner' });
    drivers.forEach(function (name) {
      var parts = name.split(' ');
      banner.appendChild(el('p', { className: 'surname', title: name }, [
        el('span', { className: 'sr-only', text: parts.slice(0, -1).join(' ') + ' ' }),
        el('span', { className: 'upright', text: parts[parts.length - 1] })
      ]));
    });
    block.appendChild(banner);

    // Photo credits are listed together at the bottom of the page (client's request).
    credits.forEach(function (c) { pageCredits.push(c); });
    if (!sharedSource) block.appendChild(el('div', { className: 'team-foot' }, [sourceLine(entry.sourceUrl, series.siteName)]));
    return block;
  }

  /* ---------- series page ---------- */

  function renderSeries(d, id, main) {
    var series = d.series.filter(function (s) { return s.id === id; })[0];
    if (!series) { showDataError(main); return; }
    document.title = series.name + ' | Pace and Publish';

    main.appendChild(el('h1', null, [chip(series.id), series.name]));
    if (series.season) main.appendChild(el('p', { className: 'season', text: 'Season ' + series.season }));
    main.appendChild(countdownLine(series));

    if (series.fetchedAt && d.lastUpdated && Date.parse(series.fetchedAt) < Date.parse(d.lastUpdated)) {
      main.appendChild(el('p', { className: 'notice',
        text: 'Some items could not be refreshed. Last successful refresh: ' + visitorDateTime(series.fetchedAt) }));
    }

    main.appendChild(photoFigure(findPhoto(d, id)));
    if (SERIES_NEWS_FIRST) main.appendChild(seriesNews(d, series));

    // Latest results
    var w = shownWeekend(series);
    var res = el('section', { 'aria-labelledby': 'results-h' });
    if (w) {
      var where = [w.name, w.circuit, w.country].filter(Boolean).join(', ');
      res.appendChild(el('h2', { id: 'results-h', text: 'Latest results: ' + where }));
      var sessions = sessionsSorted(w);
      if (!sessions.length && w.startDate) {
        // The official site gives this weekend's dates but no sessions yet.
        var a = dayMonth(dateOnlyMs(w.startDate), 'UTC'), b = w.endDate ? dayMonth(dateOnlyMs(w.endDate), 'UTC') : a;
        res.appendChild(el('p', { className: 'when', text: a === b ? a : a + ' – ' + b }));
      }
      var focus = focusSession(sessions, now());
      var openAll = el('button', { type: 'button', className: 'small-btn', text: 'Open all' });
      var closeAll = el('button', { type: 'button', className: 'small-btn', text: 'Close all' });
      if (sessions.length) res.appendChild(el('div', { className: 'panel-controls' }, [openAll, closeAll]));
      if (sessions.some(hasResults)) {
        res.appendChild(el('p', { className: 'hint', text: 'Select a name to highlight that driver in every session. Select a column heading to sort.' }));
      }
      var blocks = sessions.map(function (s) { return sessionBlock(series, w, s, s === focus); });
      blocks.forEach(function (b) { res.appendChild(b); });
      openAll.addEventListener('click', function () { blocks.forEach(function (b) { b.open = true; }); });
      closeAll.addEventListener('click', function () { blocks.forEach(function (b) { b.open = false; }); });
    } else {
      res.appendChild(el('h2', { id: 'results-h', text: 'Latest results' }));
      res.appendChild(el('p', { text: 'No race weekend has started yet.' }));
    }
    main.appendChild(res);

    if (!SERIES_NEWS_FIRST) main.appendChild(seriesNews(d, series));

    // Line-ups
    var lu = el('section', { 'aria-labelledby': 'lineups-h' }, [el('h2', { id: 'lineups-h', text: 'Line-ups' })]);
    var entries = series.lineups || [];
    if (!entries.length) {
      lu.appendChild(el('p', { text: 'Line-up not yet added.' }));
    } else {
      var classes = [];
      entries.forEach(function (e) { if (classes.indexOf(e['class'] || '') === -1) classes.push(e['class'] || ''); });
      classes.forEach(function (c) {
        var group = entries.filter(function (e) { return (e['class'] || '') === c; });
        if (c) lu.appendChild(el('h3', { className: 'class-name', text: c }));
        // One source line under the block when every entry came from the same page;
        // otherwise each team carries the line for its own page.
        var urls = [];
        group.forEach(function (e) { if (e.sourceUrl && urls.indexOf(e.sourceUrl) === -1) urls.push(e.sourceUrl); });
        var shared = urls.length <= 1;
        // Driver cards (photo, credit, name, team) when this series has driver photos;
        // otherwise the plain team-and-drivers list.
        var withPhotos = (d.photos || []).some(function (p) { return p.page === 'driver' && p.series === series.id; });
        if (withPhotos) {
          // Team pairs, like a driver line-up graphic: two photos, the team between them,
          // a slanted banner in the team's colour with both surnames, then the photo credits.
          var board = el('div', { className: 'team-board' });
          group.forEach(function (e) { board.appendChild(teamBlock(d, series, e, shared)); });
          lu.appendChild(board);
          if (shared && urls.length) lu.appendChild(sourceLine(urls[0], series.siteName));
          return;
        } else {
          var list = el('ul', { className: 'lineup' });
          group.forEach(function (e) {
            list.appendChild(el('li', null, [
              el('span', { text: e.team || '' }), el('br'), (e.drivers || []).join(', '),
              shared ? null : sourceLine(e.sourceUrl, series.siteName)
            ]));
          });
          lu.appendChild(list);
        }
        if (shared && urls.length) lu.appendChild(sourceLine(urls[0], series.siteName));
      });
    }
    main.appendChild(lu);

    // Track facts
    var tf = el('section', { 'aria-labelledby': 'facts-h' }, [el('h2', { id: 'facts-h', text: 'Track facts' })]);
    if (!w) {
      tf.appendChild(el('p', { text: 'No race weekend has started yet.' }));
    } else {
      var rl = w.raceLength || {};
      var bits = [];
      if (rl.laps !== null && rl.laps !== undefined) bits.push(rl.laps + ' laps');
      if (rl.distanceKm !== null && rl.distanceKm !== undefined) bits.push(rl.distanceKm + ' km');
      if (rl.duration) bits.push(rl.duration);
      tf.appendChild(el('p', { text: bits.length ? 'Race length: ' + bits.join(', ') : 'Race length not yet added.' }));
      var fl = el('ul', { className: 'facts' });
      sessionsSorted(w).forEach(function (s) {
        var t = s.name + ': ' + sessionWhen(s, w.timeZone);
        if (s.durationMinutes) t += ', scheduled for ' + s.durationMinutes + ' minutes';
        fl.appendChild(el('li', { text: t }));
      });
      tf.appendChild(fl);
    }
    main.appendChild(tf);

    // Driver photo credits, together at the bottom of the page.
    if (pageCredits.length) {
      var pc = el('section', { 'aria-labelledby': 'credits-h', className: 'photo-credits' }, [el('h2', { id: 'credits-h', text: 'Photo credits' })]);
      var cl = el('ul');
      pageCredits.forEach(function (c) {
        cl.appendChild(el('li', null, [
          el('span', { className: 'who', text: c.name + ': ' }),
          'Photo: ' + c.ph.credit + (c.ph.licence ? ', ' + c.ph.licence : '') + ', via ',
          outLink(c.ph.creditUrl, c.ph.sourceSite || 'source')
        ]));
      });
      pc.appendChild(cl);
      main.appendChild(pc);
    }
  }

  /* ---------- home page ---------- */

  function renderHome(d) {
    var photoHost = document.getElementById('home-photo');
    if (photoHost) photoHost.appendChild(photoFigure(findPhoto(d, 'home')));


    var grid = document.getElementById('news-cards');
    if (grid) renderNewsPages(d, grid);
  }

  /* ---------- Series page news: Home-style cards ---------- */

  // true = news right under the page photo, before Latest results; false = after Latest results.
  var SERIES_NEWS_FIRST = true;

  // The series' five latest stories: the newest as a large card with the series photo,
  // the other four as text cards (so the same photo isn't repeated five times).
  function seriesNews(d, series) {
    var section = el('section', { 'aria-labelledby': 'news-h', className: 'series-news' }, [el('h2', { id: 'news-h', text: 'Breaking news' })]);
    var items = sortedNews(series).slice(0, NEWS_PER_SERIES);
    if (!items.length) { section.appendChild(el('p', { text: 'No news items yet.' })); return section; }
    var grid = el('div', { className: 'news-grid' });
    items.forEach(function (n, i) {
      var card = el('article', { className: 'card' + (i === 0 ? ' lead' : ' text-card'), 'data-series': series.id });
      if (i === 0) card.appendChild(photoFigure(findPhoto(d, series.id)));
      var body = el('div', { className: 'card-body' });
      body.appendChild(el('p', { className: 'kicker', text: (n.type === 'hiring' ? 'Hiring' : 'News') + ' · ' + newsDate(n.date) }));
      body.appendChild(el('h3', { text: newsCaption(n, series) }));
      body.appendChild(sourceLine(n.sourceUrl, series.siteName));
      card.appendChild(body);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    return section;
  }

  /* ---------- Home news: lead story plus four, five to a page ---------- */

  var NEWS_PER_SERIES = 5;   // the same five items each series page shows
  var NEWS_PER_PAGE = 5;     // one lead story and four smaller ones

  // Pages of five, newest first, with no series twice on a page while another series still has items.
  function newsPages(d) {
    var queues = d.series.map(function (s) {
      return { s: s, items: sortedNews(s).slice(0, NEWS_PER_SERIES) };
    }).filter(function (q) { return q.items.length; });
    var pages = [];
    while (queues.some(function (q) { return q.items.length; })) {
      var page = [], used = [];
      while (page.length < NEWS_PER_PAGE && queues.some(function (q) { return q.items.length; })) {
        var open = queues.filter(function (q) { return q.items.length && used.indexOf(q) === -1; });
        if (!open.length) open = queues.filter(function (q) { return q.items.length; });
        open.sort(function (x, y) { return (y.items[0].date || '').localeCompare(x.items[0].date || ''); });
        var q = open[0];
        page.push({ s: q.s, n: q.items.shift() });
        used.push(q);
      }
      pages.push(page);
    }
    return pages;
  }

  function newsCard(d, item, lead) {
    var card = el('article', { className: 'card' + (lead ? ' lead' : ''), 'data-series': item.s.id });
    card.appendChild(photoFigure(findPhoto(d, item.s.id)));
    var body = el('div', { className: 'card-body' });
    body.appendChild(el('p', { className: 'kicker' }, [chip(item.s.id), item.s.name +
      (item.s.season ? ', Season ' + item.s.season : ''), el('span', { className: 'when-ago', text: ' · ' + newsDate(item.n.date) })]));
    body.appendChild(el(lead ? 'h3' : 'h3', { text: newsCaption(item.n, item.s) }));
    body.appendChild(sourceLine(item.n.sourceUrl, item.s.siteName));
    card.appendChild(body);
    return card;
  }

  function renderNewsPages(d, grid) {
    var pages = newsPages(d);
    var section = grid.parentNode;
    // Series with no news still say so, as section 5 asks.
    d.series.forEach(function (s) {
      if (!(s.news || []).length) section.appendChild(el('p', { className: 'no-news' }, [chip(s.id), s.name + ': No news items yet.']));
    });
    if (!pages.length) return;
    var current = 0;
    var prev = el('button', { type: 'button', className: 'arrow', 'aria-label': 'Newer stories', text: '←' });
    var next = el('button', { type: 'button', className: 'arrow', 'aria-label': 'Older stories', text: '→' });
    var where = el('p', { className: 'page-count', 'aria-live': 'polite' });
    function show(i) {
      current = Math.max(0, Math.min(pages.length - 1, i));
      grid.textContent = '';
      pages[current].forEach(function (item, k) { grid.appendChild(newsCard(d, item, k === 0)); });
      where.textContent = 'Page ' + (current + 1) + ' of ' + pages.length;
      prev.disabled = current === 0;
      next.disabled = current === pages.length - 1;
    }
    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });
    section.insertBefore(el('div', { className: 'news-nav' }, [where, prev, next]), grid.nextSibling);
    show(0);
  }

  /* ---------- fade-in on scroll ---------- */

  function revealOnScroll() {
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll('main section, main .card, main figure');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -5% 0px' });
    [].forEach.call(targets, function (t) {
      // Anything already on screen shows at once; only what is below the fold fades in.
      if (t.getBoundingClientRect().top < window.innerHeight) return;
      t.classList.add('reveal');
      io.observe(t);
    });
  }

  /* ---------- boot ---------- */

  function boot() {
    var page = document.body.getAttribute('data-page');
    var d = data();
    renderHeader(d, page);
    renderFooter(d);
    var main = document.getElementById('main');
    if (!d) { showDataError(main); return; }
    if (page === 'home') renderHome(d);
    else renderSeries(d, page, main);
  }

  function afterAll() {
    startTicker();
    revealOnScroll();
  }

  return {
    boot: boot, afterAll: afterAll, data: data, now: now, liveNow: liveNow, el: el, chip: chip, store: store,
    trackDateTime: trackDateTime, dayMonth: dayMonth, zone: zone, sessionsSorted: sessionsSorted,
    firstStart: firstStart, sessionEnded: sessionEnded, sessionRunning: sessionRunning, sessionWhen: sessionWhen,
    sessionDay: sessionDay, sessionKey: sessionKey, dateOnlyMs: dateOnlyMs, tzLabel: tzLabel, liveBadge: liveBadge,
    reducedMotion: reducedMotion
  };
})();

PP.boot();
// Start the clock and fade-ins once every script on the page (calendar.js too) has run.
document.addEventListener('DOMContentLoaded', PP.afterAll);
