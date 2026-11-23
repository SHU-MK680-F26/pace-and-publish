/* Pace and Publish — "Build your own race calendar" tool (Home page only). */
(function () {
  'use strict';
  var d = PP.data();
  var host = document.getElementById('calendar-tool');
  if (!d || !host) return;
  var el = PP.el;

  var EMPTY = 'Choose at least one series.';
  var SAVE_KEY = 'pp-calendar';

  /* ---------- controls ---------- */

  var choices = el('div', { className: 'choices' });
  d.series.forEach(function (s) {
    var box = el('input', { type: 'checkbox', value: s.id, id: 'cal-' + s.id });
    choices.appendChild(el('label', { 'for': 'cal-' + s.id }, [box, PP.chip(s.id), el('span', { text: s.name })]));
  });
  var fieldset = el('fieldset', null, [el('legend', { text: 'Choose series' }), choices]);
  var upcoming = el('input', { type: 'checkbox', id: 'cal-upcoming' });
  var upcomingLabel = el('label', { 'for': 'cal-upcoming', className: 'option' }, [upcoming, el('span', { text: 'Upcoming only' })]);
  var button = el('button', { type: 'button', text: 'Show calendar' });
  var output = el('div', { id: 'calendar-output', 'aria-live': 'polite' }, [el('p', { text: EMPTY })]);

  // "Add to your calendar": Apple Calendar, Google Calendar, or any other app that reads .ics files.
  var appleBtn = el('button', { type: 'button', className: 'secondary', 'data-cal': 'apple', text: 'Apple Calendar' });
  var googleBtn = el('button', { type: 'button', className: 'secondary', 'data-cal': 'google', text: 'Google Calendar' });
  var otherBtn = el('button', { type: 'button', className: 'secondary', 'data-cal': 'other', text: 'Other app (.ics)' });
  var addHelp = el('p', { className: 'add-help', 'aria-live': 'polite' });
  var addBox = el('div', { className: 'add-to-cal', hidden: 'hidden' }, [
    el('p', { className: 'add-title', text: 'Add these sessions to your calendar' }),
    el('div', { className: 'cal-actions' }, [appleBtn, googleBtn, otherBtn]),
    addHelp
  ]);

  host.appendChild(el('div', { className: 'cal-controls' }, [fieldset, el('div', { className: 'cal-actions' }, [upcomingLabel, button])]));
  host.appendChild(addBox);
  host.appendChild(output);

  /* ---------- helpers ---------- */

  // Start of the visitor's today, and end of the coming Sunday (today only, if today is Sunday).
  function thisWeekendRange(t) {
    var start = new Date(t);
    start.setHours(0, 0, 0, 0);
    var daysToSunday = (7 - start.getDay()) % 7;
    var end = new Date(start);
    end.setDate(end.getDate() + daysToSunday + 1);
    return [start.getTime(), end.getTime()];
  }

  function weekendPast(w, t) {
    var sessions = PP.sessionsSorted(w);
    if (sessions.length) return sessions.every(function (x) { return PP.sessionEnded(x, t); });
    if (w.endDate) return t >= Date.parse(w.endDate.slice(0, 10) + 'T23:59:59Z');
    return false;
  }

  function weekendEntry(s, w, range, t) {
    var sessions = PP.sessionsSorted(w);
    var badge = null;
    if (sessions.length) {
      var inRange = sessions.some(function (x) {
        var st = x.start ? Date.parse(x.start) : PP.dateOnlyMs(x.date);
        return st >= range[0] && st < range[1];
      });
      if (inRange) badge = 'This weekend';
      else if (weekendPast(w, t)) badge = 'Past';
    } else if (w.startDate) {
      // Announced weekend with dates but no session times yet.
      var ws = Date.parse(w.startDate.slice(0, 10) + 'T00:00:00Z'), we = Date.parse((w.endDate || w.startDate).slice(0, 10) + 'T23:59:59Z');
      if (ws < range[1] && we >= range[0]) badge = 'This weekend';
      else if (weekendPast(w, t)) badge = 'Past';
    }
    var season = w.season || s.season;

    // Days of the weekend, in track time.
    var a = null, b = null;
    if (sessions.length) {
      a = PP.sessionDay(sessions[0], w.timeZone);
      b = PP.sessionDay(sessions[sessions.length - 1], w.timeZone);
    } else if (w.startDate) {
      a = PP.dayMonth(PP.dateOnlyMs(w.startDate), 'UTC');
      b = w.endDate ? PP.dayMonth(PP.dateOnlyMs(w.endDate), 'UTC') : a;
    }

    // One compact line per weekend; it opens to show the sessions.
    var summary = el('summary', null, [
      el('span', { className: 'cal-series' }, [PP.chip(s.id), s.name + (season ? ' ' + season : '')]),
      el('span', { className: 'cal-name', text: w.name || '' }),
      el('span', { className: 'cal-place', text: [w.circuit, w.country].filter(Boolean).join(', ') }),
      el('span', { className: 'cal-dates', text: a ? (a === b ? a : a + ' – ' + b) : '' }),
      badge ? el('span', { className: 'badge', text: badge }) : null
    ]);
    var box = el('details', { className: 'cal-weekend', 'data-series': s.id }, [summary]);
    if (badge === 'This weekend') box.open = true;

    if (!sessions.length) {
      box.appendChild(el('p', { className: 'cal-note', text: 'Session times not yet published by ' + s.siteName + '.' }));
      return box;
    }

    // The weekend's sessions, in the track's time zone or (switch on) the visitor's own.
    var times = el('ul', { className: 'cal-times' });
    function renderTimes(mine) {
      var tz = mine ? null : w.timeZone;
      times.textContent = '';
      sessions.forEach(function (x) {
        times.appendChild(el('li', null, [PP.sessionWhen(x, tz) + ': ' + x.name, PP.liveBadge(x)]));
      });
    }
    renderTimes(false);
    box.appendChild(times);

    // A switch only where there are clock times to switch.
    if (sessions.some(function (x) { return x.start; })) {
      var mine = false;
      var sw = el('button', { type: 'button', className: 'small-btn tz-switch', 'aria-pressed': 'false', text: 'Show my time zone' });
      sw.addEventListener('click', function () {
        mine = !mine;
        sw.setAttribute('aria-pressed', mine ? 'true' : 'false');
        sw.textContent = mine ? 'Show track time zone' : 'Show my time zone';
        renderTimes(mine);
      });
      box.appendChild(sw);
    }
    return box;
  }

  /* ---------- .ics file ---------- */

  function icsTime(ms) {
    return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function icsText(v) {
    return String(v).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }

  // Lines longer than 75 octets are folded, as the iCalendar format asks.
  function fold(line) {
    var out = [], cur = '';
    for (var i = 0; i < line.length; i++) {
      if (cur.length >= 73) { out.push(cur); cur = ' '; }
      cur += line[i];
    }
    out.push(cur);
    return out.join('\r\n');
  }

  function buildIcs(list) {
    var stamp = icsTime(Date.now());
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pace and Publish//Race calendar//EN', 'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:Pace and Publish race calendar'];
    var n = 0;
    list.forEach(function (x) {
      PP.sessionsSorted(x.w).forEach(function (s) {
        if (!s.start) return;
        var st = Date.parse(s.start);
        lines.push('BEGIN:VEVENT');
        lines.push('UID:' + x.s.id + '-' + icsTime(st) + '-' + (s.name || '').replace(/[^A-Za-z0-9]/g, '') + '@pace-and-publish');
        lines.push('DTSTAMP:' + stamp);
        lines.push('DTSTART:' + icsTime(st));
        if (s.durationMinutes) lines.push('DTEND:' + icsTime(st + s.durationMinutes * 60000));
        lines.push(fold('SUMMARY:' + icsText(x.s.name + ': ' + (x.w.name || '') + ' – ' + s.name)));
        var where = [x.w.circuit, x.w.country].filter(Boolean).join(', ');
        if (where) lines.push(fold('LOCATION:' + icsText(where)));
        if (s.sourceUrl) lines.push(fold('URL:' + s.sourceUrl));
        lines.push('END:VEVENT');
        n++;
      });
    });
    lines.push('END:VCALENDAR');
    return { text: lines.join('\r\n') + '\r\n', count: n };
  }

  var lastList = [];
  var FILE = 'pace-and-publish-calendar.ics';
  var GOOGLE_IMPORT = 'https://calendar.google.com/calendar/r/settings/export';

  function downloadIcs() {
    var ics = buildIcs(lastList);
    var blob = new Blob([ics.text], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: FILE });
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    return ics.count;
  }

  function help(nodes) {
    addHelp.textContent = '';
    nodes.forEach(function (n) { addHelp.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); });
  }

  // Apple Calendar: the .ics file opens straight into Calendar on a Mac, iPhone or iPad.
  appleBtn.addEventListener('click', function () {
    var n = downloadIcs();
    help([n + ' sessions saved as ' + FILE + '. Open it from your Downloads and Calendar adds them. On an iPhone or iPad, choose “Add All”.']);
  });

  // Google Calendar can only take a set of events through its Import page, so we save the
  // file and open that page in a new tab.
  googleBtn.addEventListener('click', function () {
    var n = downloadIcs();
    window.open(GOOGLE_IMPORT, '_blank', 'noopener');
    help([n + ' sessions saved as ' + FILE + '. Google Calendar’s import page has opened in a new tab: choose the file from your Downloads, pick a calendar and press Import. If the tab didn’t open, ',
      el('a', { href: GOOGLE_IMPORT, target: '_blank', rel: 'noopener', text: 'open Google Calendar import' }), '.']);
  });

  // Any other calendar app (Outlook and others) that reads .ics files.
  otherBtn.addEventListener('click', function () {
    var n = downloadIcs();
    help([n + ' sessions saved as ' + FILE + '. Open it with your calendar app, or use its Import option.']);
  });

  /* ---------- render ---------- */

  function picked() {
    return [].slice.call(choices.querySelectorAll('input:checked')).map(function (i) { return i.value; });
  }

  function show() {
    var ids = picked();
    PP.store(SAVE_KEY, ids.length ? JSON.stringify({ series: ids, upcoming: upcoming.checked }) : null);
    output.innerHTML = '';
    lastList = [];
    addBox.hidden = true;
    addHelp.textContent = '';
    if (!ids.length) { output.appendChild(el('p', { text: EMPTY })); return; }
    var t = PP.now();
    var range = thisWeekendRange(t);
    var list = [];
    d.series.forEach(function (s) {
      if (ids.indexOf(s.id) === -1) return;
      var ws = s.weekends || [];
      if (!ws.length) {
        output.appendChild(el('p', { text: 'No race weekends in the data for ' + s.name + '.' }));
        return;
      }
      ws.forEach(function (w) {
        if (upcoming.checked && weekendPast(w, t)) return;
        list.push({ s: s, w: w, k: PP.firstStart(w) });
      });
    });
    list.sort(function (a, b) {
      if (a.k === null && b.k === null) return 0;
      if (a.k === null) return 1;
      if (b.k === null) return -1;
      return a.k - b.k;
    });
    list.forEach(function (x) { output.appendChild(weekendEntry(x.s, x.w, range, t)); });
    lastList = list;
    addBox.hidden = !list.some(function (x) { return (x.w.sessions || []).some(function (s) { return s.start; }); });
  }

  button.addEventListener('click', show);

  // Return visit: tick what was saved and show it straight away.
  try {
    var saved = JSON.parse(PP.store(SAVE_KEY) || 'null');
    if (saved && Array.isArray(saved.series) && saved.series.length) {
      [].forEach.call(choices.querySelectorAll('input'), function (i) { i.checked = saved.series.indexOf(i.value) !== -1; });
      upcoming.checked = !!saved.upcoming;
      show();
    }
  } catch (e) { /* nothing saved, or storage blocked */ }
})();
