/* Pace & Publish: Race weekend planner (PRD 6.2). Runs entirely in the browser. */
(function () {
  "use strict";
  var PP = window.PP;
  var SESSIONS = (window.PP_SESSIONS || []).map(function (s) {
    var o = {}; for (var k in s) o[k] = s[k];
    o.start = new Date(s.startUTC);
    o.end = s.endUTC ? new Date(s.endUTC) : new Date(o.start.getTime() + (s.lengthMin || 0) * 60000);
    return o;
  });
  var WEEKENDS = (window.PP_WEEKENDS || []).slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });

  var form = document.getElementById("planner-form");
  var tzSel = document.getElementById("tz");
  var wkSel = document.getElementById("weekend");
  var out = document.getElementById("schedule-out");
  var tzLine = document.getElementById("tz-line");
  var boxes = form.querySelectorAll('input[name="series"]');

  /* ---- Time zone list: every zone the browser knows ---- */
  var zones = [];
  try { zones = Intl.supportedValuesOf("timeZone"); } catch (e) { zones = []; }
  var own = PP.browserTimeZone();
  if (zones.indexOf(own) === -1) zones.unshift(own);
  if (zones.indexOf("UTC") === -1) zones.push("UTC");
  tzSel.innerHTML = zones.map(function (z) {
    return '<option value="' + PP.esc(z) + '">' + PP.esc(z.replace(/_/g, " ")) + (z === own ? " (your time zone)" : "") + "</option>";
  }).join("");
  tzSel.value = own;

  /* ---- Weekend list: default to the next weekend that hasn't ended, else the first ---- */
  function shortRange(w) {
    var a = new Date(w.start + "T12:00:00Z"), b = new Date(w.end + "T12:00:00Z");
    return PP.fmt(a, "UTC", { month: "short", day: "numeric" }) + "–" + PP.fmt(b, "UTC", { month: "short", day: "numeric" });
  }
  wkSel.innerHTML = WEEKENDS.map(function (w) {
    return '<option value="' + PP.esc(w.id) + '">' + PP.esc(w.name) + " · " + shortRange(w) + "</option>";
  }).join("");
  var today = PP.ymd(new Date(), own);
  var next = WEEKENDS.filter(function (w) { return w.end >= today; })[0] || WEEKENDS[0];
  if (next) wkSel.value = next.id;

  /* ---- Remember my series (nice to have): series and time zone, this browser only ---- */
  var saved = PP.storeGet("pp-planner");
  if (saved) {
    if (Array.isArray(saved.series)) [].forEach.call(boxes, function (b) { b.checked = saved.series.indexOf(b.value) !== -1; });
    if (saved.tz && zones.indexOf(saved.tz) !== -1) tzSel.value = saved.tz;
  }
  function save() { PP.storeSet("pp-planner", { series: chosenSeries(), tz: tzSel.value }); }

  function chosenSeries() {
    return [].filter.call(boxes, function (b) { return b.checked; }).map(function (b) { return b.value; });
  }

  /* Two sessions clash when their time ranges overlap (touching end-to-start is not a clash). */
  function findClashes(list) {
    var pairs = [];
    for (var i = 0; i < list.length; i++) {
      for (var j = i + 1; j < list.length; j++) {
        var a = list[i], b = list[j];
        if (a.start < b.end && b.start < a.end) pairs.push([a, b]);
      }
    }
    return pairs;
  }

  function render() {
    var tz = tzSel.value;
    var series = chosenSeries();
    var wk = wkSel.value;
    lastList = [];
    var wkObj = WEEKENDS.filter(function (w) { return w.id === wk; })[0];
    document.getElementById("schedule-title").textContent = "Your weekend" + (wkObj ? ": " + wkObj.name + " · " + shortRange(wkObj) : "");
    tzLine.textContent = "Times in " + tz.replace(/_/g, " ");

    if (!series.length) {
      out.innerHTML = '<p class="notice" id="nothing-picked">Choose at least one series to see your weekend.</p>';
      return;
    }

    var list = SESSIONS.filter(function (s) { return s.weekend === wk && series.indexOf(s.series) !== -1; })
      .sort(function (a, b) { return a.start - b.start || a.end - b.end; });

    if (!list.length) {
      out.innerHTML = '<p class="notice">No sessions for these series on this weekend.</p>';
      return;
    }

    var pairs = findClashes(list);
    list.forEach(function (s) { s.clash = false; });
    pairs.forEach(function (p) { p[0].clash = true; p[1].clash = true; });

    var html = '<ol class="schedule" id="schedule">';
    list.forEach(function (s) {
      var day = PP.fmt(s.start, tz, { weekday: "short", month: "short", day: "numeric" });
      var t1 = PP.fmt(s.start, tz, { hour: "numeric", minute: "2-digit" });
      var t2 = PP.fmt(s.end, tz, { hour: "numeric", minute: "2-digit" });
      html += '<li class="' + (s.clash ? "is-clash" : "") + '" data-series="' + PP.esc(s.series) + '" data-start="' + PP.esc(s.startUTC) + '">' +
        '<span class="s-day">' + PP.esc(day) + "</span>" +
        '<span class="s-time">' + PP.esc(t1) + "<small>to " + PP.esc(t2) + " " + PP.esc(PP.tzShort(s.end, tz)) + "</small></span>" +
        '<span class="s-what"><span class="s-line">' + PP.tag(s.series) +
        '<span class="s-session">' + PP.esc(s.session) + "</span>" +
        (s.clash ? '<span class="badge clash-badge">Clash</span>' : "") +
        (s.sample ? '<span class="badge badge-outline">Sample</span>' : "") +
        '</span><span class="s-event">' + PP.esc(s.event) + " · " + PP.esc(s.track) + " · Source: " + PP.esc(s.source) + "</span></span></li>";
    });
    html += "</ol>";

    /* Clash helper (nice to have): which session starts first, and by how many minutes they overlap */
    if (pairs.length) {
      html += '<div class="clash-help" id="clash-help"><h3>Clash helper</h3><ul>';
      pairs.forEach(function (p) {
        var first = p[0].start <= p[1].start ? p[0] : p[1], second = first === p[0] ? p[1] : p[0];
        var mins = Math.round((Math.min(p[0].end, p[1].end) - Math.max(p[0].start, p[1].start)) / 60000);
        html += "<li><strong>" + PP.esc(PP.SERIES[first.series].label + " " + first.session) + "</strong> starts first (" +
          PP.esc(PP.fmt(first.start, tz, { weekday: "short", hour: "numeric", minute: "2-digit" })) + "); <strong>" +
          PP.esc(PP.SERIES[second.series].label + " " + second.session) + "</strong> starts at " +
          PP.esc(PP.fmt(second.start, tz, { hour: "numeric", minute: "2-digit" })) + ". They overlap by <strong>" + mins + " minutes</strong>.</li>";
      });
      html += "</ul></div>";
    }
    out.innerHTML = html;
    lastList = list;
    tick();
  }

  /* "Next up" countdown (nice to have), from this computer's clock */
  var lastList = [];
  var nextEl = document.getElementById("next-up");
  function tick() {
    if (!nextEl) return;
    var now = new Date();
    var series = chosenSeries();
    if (!series.length) { nextEl.hidden = true; return; }
    var upcoming = lastList.filter(function (s) { return s.start > now; })[0];
    nextEl.hidden = false;
    if (!upcoming) { nextEl.innerHTML = "<strong>Next up:</strong> no more sessions in this weekend's list."; return; }
    var mins = Math.floor((upcoming.start - now) / 60000);
    var d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
    var left = (d ? d + (d === 1 ? " day " : " days ") : "") + (d || h ? h + (h === 1 ? " hour " : " hours ") : "") + m + (m === 1 ? " minute" : " minutes");
    nextEl.innerHTML = "<strong>Next up:</strong> " + PP.tag(upcoming.series) + " " + PP.esc(upcoming.session) +
      (upcoming.sample ? ' <span class="badge badge-outline">Sample</span>' : "") +
      ' starts in <strong id="next-up-time" data-minutes="' + mins + '">' + PP.esc(left) + "</strong>" +
      ' <span class="muted small">(' + PP.esc(PP.fmt(upcoming.start, tzSel.value, { weekday: "short", hour: "numeric", minute: "2-digit" })) + ")</span>";
  }
  setInterval(tick, 20000);

  form.addEventListener("change", function () { save(); render(); });
  var printBtn = document.getElementById("print-btn");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  render();

  window.PPPlanner = { render: render, findClashes: findClashes };
})();
