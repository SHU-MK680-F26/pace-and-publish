/* Pace & Publish: Race calendar (PRD 6.3). */
(function () {
  "use strict";
  var PP = window.PP;
  var saved = PP.storeGet("pp-planner");
  var tz = (saved && saved.tz) || PP.browserTimeZone();
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); } catch (e) { tz = PP.browserTimeZone(); }

  var weekends = (window.PP_WEEKENDS || []).slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  var sessions = (window.PP_SESSIONS || []).map(function (s) {
    var o = {}; for (var k in s) o[k] = s[k];
    o.start = new Date(s.startUTC);
    o.end = s.endUTC ? new Date(s.endUTC) : new Date(o.start.getTime() + (s.lengthMin || 0) * 60000);
    return o;
  });

  document.getElementById("cal-tz").textContent = "Session times in " + tz.replace(/_/g, " ") + " (" + PP.tzShort(new Date(), tz) + ").";

  var today = PP.ymd(new Date(), tz);
  var thisWeekend = null;
  weekends.forEach(function (w) { if (w.start <= today && today <= w.end) thisWeekend = w.id; });
  window.PPCalendarThisWeekend = thisWeekend;

  /* One race = one series' event on one weekend. */
  function racesFor(wk) {
    var groups = {};
    sessions.filter(function (s) { return s.weekend === wk.id; }).forEach(function (s) {
      var key = s.series + "|" + s.event;
      (groups[key] = groups[key] || []).push(s);
    });
    return Object.keys(groups).map(function (k) {
      var list = groups[k].sort(function (a, b) { return a.start - b.start; });
      return { series: list[0].series, event: list[0].event, track: list[0].track, source: list[0].source,
        sample: list.some(function (s) { return s.sample; }), sessions: list, first: list[0].start, last: list[list.length - 1].end };
    }).sort(function (a, b) { return a.first - b.first; });
  }

  function dateRange(a, b) {
    var d1 = PP.fmt(a, tz, { weekday: "short", month: "short", day: "numeric" });
    var d2 = PP.fmt(b, tz, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    return d1 === PP.fmt(b, tz, { weekday: "short", month: "short", day: "numeric" }) ? d2 : d1 + " to " + d2;
  }

  /* "This weekend" highlight (nice to have): the weekend that includes today goes first */
  var ordered = weekends.slice().sort(function (a, b) {
    return (b.id === thisWeekend) - (a.id === thisWeekend) || (a.start < b.start ? -1 : 1);
  });
  var html = "";
  ordered.forEach(function (w) {
    var races = racesFor(w);
    if (!races.length) return;
    var isThis = w.id === thisWeekend;
    html += '<section class="weekend' + (isThis ? " is-this-weekend" : "") + '" id="weekend-' + PP.esc(w.id) + '" aria-labelledby="wk-' + PP.esc(w.id) + '">' +
      '<div class="weekend-head">' + (isThis ? '<span class="badge this-weekend-badge">This weekend</span>' : "") + (w.sample ? '<span class="badge badge-outline">Sample</span>' : "") +
      '<h2 id="wk-' + PP.esc(w.id) + '">' + PP.esc(w.name) + "</h2>" +
      '<span class="muted small">' + PP.esc(dateRange(races[0].first, races[races.length - 1].last)) + "</span></div>" +
      '<div class="races">';
    races.forEach(function (r) {
      html += '<article class="race" data-series="' + PP.esc(r.series) + '">' +
        '<div class="race-top">' + PP.tag(r.series) + (r.sample ? '<span class="badge">Sample</span>' : "") + "</div>" +
        "<h3>" + PP.esc(r.event) + "</h3>" +
        '<p class="race-meta"><strong>Track:</strong> ' + PP.esc(r.track) + "<br><strong>Dates:</strong> " + PP.esc(dateRange(r.first, r.last)) + "</p>" +
        '<table><thead><tr><th scope="col">Day</th><th scope="col">Time</th><th scope="col">Session</th></tr></thead><tbody>';
      r.sessions.forEach(function (s) {
        html += "<tr><td>" + PP.esc(PP.fmt(s.start, tz, { weekday: "short", month: "short", day: "numeric" })) + "</td>" +
          "<td>" + PP.esc(PP.fmt(s.start, tz, { hour: "numeric", minute: "2-digit" })) + "–" + PP.esc(PP.fmt(s.end, tz, { hour: "numeric", minute: "2-digit" })) + "</td>" +
          "<td>" + PP.esc(s.session) + (s.sample ? ' <span class="badge">Sample</span>' : "") + "</td></tr>";
      });
      html += "</tbody></table>" +
        '<p class="source">Source: <strong>' + PP.esc(r.source) + "</strong></p></article>";
    });
    html += "</div></section>";
  });
  document.getElementById("calendar-out").innerHTML = html || '<p class="empty">No race weekends in the data yet.</p>';
  [].forEach.call(document.querySelectorAll("#calendar-out .races"), function (el) {
    var h = el.closest(".weekend").querySelector("h2");
    PP.carousel(el, (h ? h.textContent : "Race weekend") + " races");
  });
})();
