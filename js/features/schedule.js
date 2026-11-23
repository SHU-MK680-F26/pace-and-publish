/* =====================================================================
   Schedule features, all on data/generated/schedule.js + schedule-manual.js:
     PP.schedule.nextUp(host, ids)   "Next up" strip with a live countdown (Home, series pages)
     PP.scheduleFeature.renderCalendar()  Calendar page (Miranda's tool)
     PP.scheduleFeature.renderPlanner()   Weekend planner (Sanith's tool)
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util, el = U.el;

  /* ---------- Next up: the next three sessions, live countdown to the first ---------- */
  function nextUp(host, ids, opts) {
    opts = opts || {};
    var list = el("ol", { className: "next-list" });
    var head = el("p", { className: "countdown" });
    host.appendChild(head); host.appendChild(list);
    var shownKey = null;
    function draw(t) {
      var want = ids || U.mySeries() || U.seriesIds();
      var next = U.nextSessions(want, t, 3);
      var key = next.map(function (x) { return x.series + x.ms; }).join("|") + want.join(",");
      if (key !== shownKey) {
        shownKey = key;
        list.textContent = ""; head.textContent = "";
        if (!next.length) {
          head.appendChild(el("span", { className: "countdown-label", text: "Next up" }));
          head.appendChild(el("span", { className: "subtle", text: "No sessions with published times are coming up for these series." }));
          return;
        }
        head.appendChild(el("span", { className: "countdown-label", text: "Next up" }));
        head.appendChild(el("span", { className: "countdown-what", text: (U.series(next[0].series) || {}).short + " " + next[0].session.name + ", " + (next[0].weekend.name || "") }));
        head.appendChild(el("span", { className: "countdown-clock", "aria-live": "off" }));
        next.forEach(function (x) {
          list.appendChild(el("li", null, [
            U.tag(x.series, true),
            el("span", { className: "what", text: x.session.name + " · " + (x.weekend.name || "") }),
            el("span", { className: "when", text: U.dateTime(x.session.start, null) })
          ]));
        });
      }
      var clock = head.querySelector(".countdown-clock");
      if (clock && next.length) clock.textContent = "in " + U.countdownText(next[0].ms - t);
    }
    U.onTick(draw);
    if (!ids) document.addEventListener("pp:myseries", function () { shownKey = null; draw(U.liveNow()); });
  }

  /* ---------- Session list items with live badge, in track time or the visitor's ---------- */
  function sessionsList(w, mine) {
    var ul = el("ul", { className: "cal-times" });
    U.sessionsSorted(w).forEach(function (x) {
      ul.appendChild(el("li", null, [
        el("span", { className: "t", text: U.sessionWhen(x, mine ? null : w.timeZone) + (x.start ? "" : " (time not yet published)") }),
        el("strong", { text: x.name }),
        x.start ? U.liveBadge(x) : null,
        x.sourceUrl ? U.outLink(x.sourceUrl, "Source", "subtle small") : null
      ]));
    });
    return ul;
  }

  /* ---------- Calendar page ---------- */
  function renderCalendar() {
    var host = U.$("calendar-out");
    var opts = U.load("pp-calendar", { upcoming: true });
    var upcoming = U.$("cal-upcoming");
    upcoming.checked = opts.upcoming !== false;
    U.$("cal-series").appendChild(U.seriesPicker(render));
    upcoming.addEventListener("change", function () { U.save("pp-calendar", { upcoming: upcoming.checked }); render(); });

    var lastList = [];
    function thisWeekendRange(t) {
      var start = new Date(t); start.setHours(0, 0, 0, 0);
      var end = new Date(start); end.setDate(end.getDate() + (7 - start.getDay()) % 7 + 1);
      return [start.getTime(), end.getTime()];
    }
    function weekendEntry(sid, w, range, t) {
      var s = U.series(sid), sessions = U.sessionsSorted(w), badge = null;
      var past = U.weekendPast(w, t);
      var inRange = sessions.some(function (x) { var st = U.sessionKey(x); return st >= range[0] && st < range[1]; }) ||
        (!sessions.length && w.startDate && U.dateOnlyMs(w.startDate) < range[1] && U.dateOnlyMs(w.endDate || w.startDate) >= range[0]);
      if (inRange) badge = el("span", { className: "badge badge--accent", text: "This weekend" });
      else if (past) badge = el("span", { className: "badge", text: "Past" });
      var a = sessions.length ? U.sessionDay(sessions[0], w.timeZone) : w.startDate ? U.dayMonth(U.dateOnlyMs(w.startDate), "UTC") : "";
      var b = sessions.length ? U.sessionDay(sessions[sessions.length - 1], w.timeZone) : w.endDate ? U.dayMonth(U.dateOnlyMs(w.endDate), "UTC") : a;
      var box = el("details", { className: "cal-weekend" + (past ? " is-past" : ""), "data-series": sid }, [
        el("summary", null, [
          el("span", { className: "cal-series" }, [U.tag(sid), " ", el("span", { className: "subtle small", text: "Season " + (w.season || "") })]),
          el("span", { className: "cal-name", text: w.name || "" }),
          el("span", { className: "cal-place", text: [w.circuit, w.country].filter(Boolean).join(", ") }),
          el("span", { className: "cal-dates", text: a === b ? a : a + " – " + b }),
          badge
        ])
      ]);
      if (inRange) box.open = true;
      var bodyEl = el("div", { className: "cal-body" });
      box.appendChild(bodyEl);
      if (!sessions.length) {
        bodyEl.appendChild(el("p", { className: "subtle", text: "Session times not yet published by " + s.site + "." }));
        return box;
      }
      var mine = false, list = sessionsList(w, false);
      bodyEl.appendChild(list);
      if (sessions.some(function (x) { return x.start; }) && w.timeZone) {
        var sw = el("button", { type: "button", className: "btn btn--ghost btn--small", "aria-pressed": "false", text: "Show my time zone" });
        sw.addEventListener("click", function () {
          mine = !mine; sw.setAttribute("aria-pressed", String(mine));
          sw.textContent = mine ? "Show track time" : "Show my time zone";
          var fresh = sessionsList(w, mine); bodyEl.replaceChild(fresh, list); list = fresh;
        });
        bodyEl.appendChild(sw);
      }
      return box;
    }
    function render() {
      var ids = U.mySeries() || U.seriesIds();
      var t = U.now(), range = thisWeekendRange(t);
      var list = [];
      host.textContent = "";
      var empty = [];
      ids.forEach(function (sid) {
        var ws = U.scheduleFor(sid).weekends;
        if (!ws.length) { empty.push(sid); return; }
        ws.forEach(function (w) {
          if (upcoming.checked && U.weekendPast(w, t)) return;
          list.push({ sid: sid, w: w, k: U.firstStart(w) });
        });
      });
      list.sort(function (a, b) { return (a.k === null) - (b.k === null) || a.k - b.k; });
      lastList = list;
      U.$("cal-count").textContent = list.length + " race weekends";
      var month = null, group = null;
      list.forEach(function (x) {
        var m = x.k ? new Date(x.k).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : "Date to be confirmed";
        if (m !== month) { month = m; host.appendChild(el("h2", { className: "cal-month", text: m })); group = el("div", { className: "cal-group" }); host.appendChild(group); }
        group.appendChild(weekendEntry(x.sid, x.w, range, t));
      });
      if (empty.length) host.appendChild(el("p", { className: "notice", style: "margin-top:24px", text: "No race weekends in the data yet for " + empty.map(function (id) { return U.series(id).short; }).join(", ") + "." }));
      U.$("add-to-cal").hidden = !list.some(function (x) { return (x.w.sessions || []).some(function (s) { return s.start; }); });
    }

    /* .ics export (Miranda): Apple Calendar, Google Calendar import, or any app */
    function icsTime(ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    function icsText(v) { return String(v).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); }
    function fold(line) { var out = [], cur = ""; for (var i = 0; i < line.length; i++) { if (cur.length >= 73) { out.push(cur); cur = " "; } cur += line[i]; } out.push(cur); return out.join("\r\n"); }
    function buildIcs() {
      var stamp = icsTime(Date.now()), n = 0;
      var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pace and Publish//Race calendar//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Pace & Publish race calendar"];
      lastList.forEach(function (x) {
        U.sessionsSorted(x.w).forEach(function (s) {
          if (!s.start) return;
          var st = Date.parse(s.start), s2 = U.series(x.sid);
          lines.push("BEGIN:VEVENT", "UID:" + x.sid + "-" + icsTime(st) + "-" + (s.name || "").replace(/[^A-Za-z0-9]/g, "") + "@pace-and-publish",
            "DTSTAMP:" + stamp, "DTSTART:" + icsTime(st));
          lines.push("DTEND:" + icsTime(st + (s.durationMinutes || 60) * 60000));
          lines.push(fold("SUMMARY:" + icsText(s2.short + ": " + (x.w.name || "") + " – " + s.name)));
          var where = [x.w.circuit, x.w.country].filter(Boolean).join(", ");
          if (where) lines.push(fold("LOCATION:" + icsText(where)));
          if (s.sourceUrl) lines.push(fold("URL:" + s.sourceUrl));
          lines.push("END:VEVENT"); n++;
        });
      });
      lines.push("END:VCALENDAR");
      return { text: lines.join("\r\n") + "\r\n", count: n };
    }
    var FILE = "pace-and-publish-calendar.ics", GOOGLE = "https://calendar.google.com/calendar/r/settings/export";
    function download() {
      var ics = buildIcs(), url = URL.createObjectURL(new Blob([ics.text], { type: "text/calendar;charset=utf-8" }));
      var a = el("a", { href: url, download: FILE }); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      return ics.count;
    }
    var help = U.$("cal-help");
    U.$("cal-apple").addEventListener("click", function () { help.textContent = download() + " sessions saved as " + FILE + ". Open it from your Downloads and Calendar adds them. On an iPhone or iPad, choose “Add All”."; });
    U.$("cal-google").addEventListener("click", function () {
      var n = download(); window.open(GOOGLE, "_blank", "noopener");
      help.textContent = n + " sessions saved as " + FILE + ". Google Calendar’s import page opened in a new tab: choose the file, pick a calendar and press Import.";
    });
    U.$("cal-other").addEventListener("click", function () { help.textContent = download() + " sessions saved as " + FILE + ". Open it with your calendar app, or use its Import option."; });
    render();
  }

  /* ---------- Weekend planner (Sanith): one week, every session in your time zone, clashes marked ---------- */
  var EST = { race: 120, other: 60 };
  function renderPlanner() {
    var tzSel = U.$("tz"), wkSel = U.$("week"), out = U.$("schedule-out");
    var own = U.ownZone(), saved = U.load("pp-planner", {});
    var zones = [];
    try { zones = Intl.supportedValuesOf("timeZone"); } catch (e) { zones = []; }
    if (zones.indexOf(own) === -1) zones.unshift(own);
    if (zones.indexOf("UTC") === -1) zones.push("UTC");
    zones.forEach(function (z) { tzSel.appendChild(el("option", { value: z, text: z.replace(/_/g, " ") + (z === own ? " (your time zone)" : "") })); });
    tzSel.value = saved.tz && zones.indexOf(saved.tz) !== -1 ? saved.tz : own;
    U.$("planner-series").appendChild(U.seriesPicker(function () { buildWeeks(); render(); }));

    // Every session (timed or date-only) for the chosen series, with its start and an end.
    function sessions() {
      var out2 = [];
      (U.mySeries() || U.seriesIds()).forEach(function (sid) {
        U.scheduleFor(sid).weekends.forEach(function (w) {
          (w.sessions || []).forEach(function (s) {
            var key = U.sessionKey(s); if (isNaN(key)) return;
            var estimated = !s.durationMinutes;
            var mins = s.durationMinutes || (/race/i.test(s.name) ? EST.race : EST.other);
            out2.push({ sid: sid, w: w, s: s, start: key, end: s.start ? key + mins * 60000 : key, timed: !!s.start, estimated: s.start && estimated });
          });
        });
      });
      return out2.sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    }
    // Monday 00:00 (UTC) of the week holding ms.
    function weekStart(ms) { var d = new Date(ms); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7); return d.getTime(); }
    function label(ms) {
      var a = new Date(ms), b = new Date(ms + 6 * 86400000), f = { day: "numeric", month: "short", timeZone: "UTC" };
      return a.toLocaleDateString("en-GB", f) + " – " + b.toLocaleDateString("en-GB", f) + " " + b.getUTCFullYear();
    }
    function buildWeeks() {
      var weeks = {}, t = U.now(), thisWeek = weekStart(t);
      sessions().forEach(function (x) { var k = weekStart(x.start); if (k >= thisWeek - 7 * 86400000) weeks[k] = (weeks[k] || 0) + 1; });
      var keys = Object.keys(weeks).map(Number).sort(function (a, b) { return a - b; });
      var prev = wkSel.value;
      wkSel.textContent = "";
      keys.forEach(function (k) { wkSel.appendChild(el("option", { value: k, text: (k === thisWeek ? "This week · " : "") + label(k) + " · " + weeks[k] + " sessions" })); });
      if (prev && keys.indexOf(Number(prev)) !== -1) wkSel.value = prev;
      else { var next = keys.filter(function (k) { return k >= thisWeek; })[0]; if (next !== undefined) wkSel.value = next; }
    }
    function clashes(list) {
      var pairs = [], timed = list.filter(function (x) { return x.timed; });
      for (var i = 0; i < timed.length; i++) for (var j = i + 1; j < timed.length; j++) {
        var a = timed[i], b = timed[j];
        if (a.start < b.end && b.start < a.end) pairs.push([a, b]);
      }
      return pairs;
    }
    function fmt(ms, tz, o) { return new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: tz }, o)).format(new Date(ms)); }
    function render() {
      var tz = tzSel.value;
      U.save("pp-planner", { tz: tz });
      U.$("tz-line").textContent = "Times in " + tz.replace(/_/g, " ");
      out.textContent = "";
      if (!wkSel.value) { out.appendChild(el("p", { className: "empty", text: "No sessions in the data for these series from this week on." })); U.$("schedule-title").textContent = "Your weekend"; return; }
      var ws = Number(wkSel.value), we = ws + 7 * 86400000;
      U.$("schedule-title").textContent = "Your week: " + label(ws);
      var list = sessions().filter(function (x) { return x.start >= ws && x.start < we; });
      var pairs = clashes(list);
      list.forEach(function (x) { x.clash = false; });
      pairs.forEach(function (p) { p[0].clash = p[1].clash = true; });
      var t = U.now();
      var ol = el("ol", { className: "schedule", id: "schedule" });
      list.forEach(function (x) {
        var past = U.sessionEnded(x.s, t);
        ol.appendChild(el("li", { className: (x.clash ? "is-clash " : "") + (past ? "is-past" : "") }, [
          el("span", { className: "s-day", text: x.timed ? fmt(x.start, tz, { weekday: "short", day: "numeric", month: "short" }) : U.dayMonth(x.start + 12 * 3600000, "UTC") }),
          el("span", { className: "s-time" }, x.timed ? [fmt(x.start, tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
            el("small", { text: (x.estimated ? "length not published" : "to " + fmt(x.end, tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })) + " · " + U.tzLabel(x.start, tz) })] : ["TBA", el("small", { text: "time not yet published" })]),
          el("span", { className: "s-what" }, [
            el("span", { className: "s-line" }, [U.tag(x.sid), el("span", { className: "s-session", text: x.s.name }),
              x.clash ? el("span", { className: "badge badge--clash", text: x.estimated ? "Possible clash" : "Clash" }) : null,
              x.timed ? U.liveBadge(x.s) : null]),
            el("span", { className: "s-event", text: [x.w.name, x.w.circuit].filter(Boolean).join(" · ") + " · Source: " + U.scheduleFor(x.sid).siteName })
          ])
        ]));
      });
      if (!list.length) out.appendChild(el("p", { className: "empty", text: "No sessions this week for these series." }));
      else out.appendChild(ol);
      if (pairs.length) {
        var help = el("div", { className: "clash-help" }, [el("h3", { text: "Clash helper" })]);
        var ul = el("ul");
        pairs.forEach(function (p) {
          var mins = Math.round((Math.min(p[0].end, p[1].end) - Math.max(p[0].start, p[1].start)) / 60000);
          ul.appendChild(el("li", null, [
            el("strong", { text: U.series(p[0].sid).short + " " + p[0].s.name }), " starts at " + fmt(p[0].start, tz, { weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) + "; ",
            el("strong", { text: U.series(p[1].sid).short + " " + p[1].s.name }), " starts at " + fmt(p[1].start, tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) + ". They overlap by about " + mins + " minutes" +
            (p[0].estimated || p[1].estimated ? " (estimated: the official site hasn't published how long one of them runs)." : ".")
          ]));
        });
        help.appendChild(ul); out.appendChild(help);
      }
      tick();
    }
    var nextEl = U.$("next-up");
    function tick() {
      var tz = tzSel.value, ws = Number(wkSel.value), now = U.liveNow();
      var n = sessions().filter(function (x) { return x.timed && x.start > now && x.start >= ws && x.start < ws + 7 * 86400000; })[0];
      nextEl.hidden = !n;
      if (!n) return;
      nextEl.textContent = "";
      nextEl.appendChild(el("span", { className: "countdown-label", text: "Next up" }));
      nextEl.appendChild(el("span", { className: "countdown-what" }, [U.tag(n.sid), " " + n.s.name + ", " + fmt(n.start, tz, { weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })]));
      nextEl.appendChild(el("span", { className: "countdown-clock", text: "in " + U.countdownText(n.start - now) }));
    }
    setInterval(tick, 1000);
    tzSel.addEventListener("change", render);
    wkSel.addEventListener("change", render);
    U.$("print-btn").addEventListener("click", function () { window.print(); });
    buildWeeks(); render();
  }

  PP.scheduleFeature = { nextUp: nextUp, renderCalendar: renderCalendar, renderPlanner: renderPlanner };
})();
