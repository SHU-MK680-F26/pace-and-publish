/* =====================================================================
   Pace & Publish core helpers (PP.util). Loaded on every page after the
   data files and before layout.js and any feature.
   Plain JavaScript, no modules: works when a page is opened from disk.
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP = window.PP || {};
  var U = PP.util = {};

  /* ---------- DOM ---------- */

  // el("a", { href: "x", className: "y", text: "label" }, [children])
  U.el = function (tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "className") n.className = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return n;
  };

  U.esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  U.$ = function (id) { return document.getElementById(id); };
  U.all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.pad = function (n) { return n < 10 ? "0" + n : String(n); };

  U.outLink = function (href, text, className) {
    return U.el("a", { href: href, target: "_blank", rel: "noopener", className: className || null }, [
      text, U.el("span", { className: "visually-hidden", text: " (opens in a new tab)" })
    ]);
  };

  U.sourceLine = function (url, siteName) {
    if (!url) return null;
    return U.el("p", { className: "src" }, ["Source: ", U.outLink(url, siteName || "official site")]);
  };

  U.param = function (name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  };

  /* ---------- Browser storage (may be blocked; the site never depends on it) ---------- */

  U.load = function (key, fallback) {
    try { var v = window.localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  };
  U.save = function (key, value) {
    try {
      if (value === null || value === undefined) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage blocked */ }
  };

  U.reducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  /* ---------- Series ---------- */

  var seriesById = {};
  (PP.series || []).forEach(function (s) { seriesById[s.id] = s; });
  U.series = function (id) { return seriesById[id] || null; };
  U.seriesIds = function () { return (PP.series || []).map(function (s) { return s.id; }); };

  // A series tag: <span class="tag tag--wec">WEC</span>. "all" and "other" are Ben's guide keys.
  U.tag = function (id, asLink) {
    var s = seriesById[id];
    var label = id === "all" ? "All series" : id === "other" ? "Other" : (s ? s.short : id);
    var title = s ? s.name : label;
    if (asLink && s) return U.el("a", { className: "tag tag--" + id, href: "series.html?id=" + id, title: title, text: label });
    return U.el("span", { className: "tag tag--" + id, title: title, text: label });
  };
  U.tagHtml = function (id) { return U.tag(id).outerHTML; };
  U.tagsHtml = function (ids) { return '<div class="tags">' + (ids || []).map(U.tagHtml).join("") + "</div>"; };

  /* "My series": one saved choice that Home, News, Calendar and the Planner all follow.
     null means "not chosen yet", which every page treats as all series. */
  var MY_KEY = "pp-my-series";
  U.mySeries = function () {
    var v = U.load(MY_KEY, null);
    if (!Array.isArray(v)) return null;
    v = v.filter(function (id) { return seriesById[id]; });
    return v.length ? v : null;
  };
  U.setMySeries = function (ids) {
    var clean = (ids || []).filter(function (id) { return seriesById[id]; });
    U.save(MY_KEY, clean.length && clean.length < U.seriesIds().length ? clean : null);
    document.dispatchEvent(new CustomEvent("pp:myseries", { detail: U.mySeries() }));
  };
  U.followed = function (id) { var m = U.mySeries(); return !m || m.indexOf(id) !== -1; };

  /* A row of series filter buttons bound to "my series", used on Home, News, Calendar and Planner.
     "All" comes first and is selected by default. Picking a series shows just that one; more
     series can be added or removed in any combination. "All" (or removing the last series, or
     picking every series) goes back to everything. onChange(ids) runs after each change. */
  U.seriesPicker = function (onChange) {
    var wrap = U.el("div", { className: "filter", role: "group", "aria-label": "Series you follow" });
    function sync() {
      var m = U.mySeries();
      U.all("button", wrap).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.value === "all" ? !m : !!m && m.indexOf(b.value) !== -1));
      });
    }
    var all = U.el("button", { type: "button", value: "all", "aria-pressed": "true", title: "Show every series", text: "All" });
    all.addEventListener("click", function () { U.setMySeries(null); });
    wrap.appendChild(all);
    (PP.series || []).forEach(function (s) {
      // tag--<id> supplies the series' tag colors, used when the button is selected
      var b = U.el("button", { type: "button", value: s.id, className: "filter-series tag--" + s.id, "aria-pressed": "false", title: s.name, text: s.short });
      b.addEventListener("click", function () {
        var m = U.mySeries();
        if (!m) m = [s.id];                       // from "All": show just this series
        else if (m.indexOf(s.id) === -1) m.push(s.id);
        else m.splice(m.indexOf(s.id), 1);        // none left means "All" again
        U.setMySeries(m);
      });
      wrap.appendChild(b);
    });
    document.addEventListener("pp:myseries", function () { sync(); if (onChange) onChange(U.mySeries()); });
    sync();
    return wrap;
  };

  /* ---------- Photos (data/photos.js) ---------- */

  U.photo = function (id) { return (PP.photos && id && PP.photos[id]) || null; };

  U.creditLine = function (p, className) {
    if (!p) return null;
    var lic = p.licenseUrl ? U.outLink(p.licenseUrl, p.license) : p.license;
    return U.el("p", { className: className || "credit" }, [
      (p.caption ? p.caption + " · " : "") + "Photo: " + p.author + ", ", lic, ", via ",
      U.outLink(p.sourceUrl, p.sourceSite || "Wikimedia Commons")
    ]);
  };

  // <img> for a photo id (or null). opts: { className, lazy, sizes }
  U.img = function (id, opts) {
    var p = U.photo(id); opts = opts || {};
    if (!p) return null;
    return U.el("img", {
      src: p.src, alt: opts.alt === "" ? "" : p.alt, width: p.width, height: p.height,
      loading: opts.lazy === false ? null : "lazy", decoding: "async", className: opts.className || null
    });
  };

  U.figure = function (id, className) {
    var p = U.photo(id);
    if (!p) return null;
    return U.el("figure", { className: className || "figure" }, [U.img(id), U.creditLine(p)]);
  };

  /* ---------- Clock (Miranda): ?now=2026-11-15T14:00Z sets a test time ---------- */

  var testNow = (function () {
    var v = U.param("now"); if (!v) return null;
    var t = Date.parse(v); return isNaN(t) ? null : t;
  })();
  var loadedAt = Date.now();
  U.now = function () { return testNow === null ? Date.now() : testNow; };
  U.liveNow = function () { return testNow === null ? Date.now() : testNow + (Date.now() - loadedAt); };
  U.testTime = testNow !== null;

  /* ---------- Date and time formatting (Miranda) ---------- */

  function parts(ms, tz, opts) {
    var o = Object.assign({}, opts); if (tz) o.timeZone = tz;
    var out = {};
    new Intl.DateTimeFormat("en-GB", o).formatToParts(new Date(ms)).forEach(function (p) { out[p.type] = p.value; });
    return out;
  }
  U.ownZone = function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return "UTC"; } };

  U.tzLabel = function (ms, tz) {
    var zoneName = tz || U.ownZone(), label = null;
    ["en-US", "en-GB"].some(function (loc) {
      var p = new Intl.DateTimeFormat(loc, { timeZone: zoneName, timeZoneName: "short" }).formatToParts(new Date(ms))
        .filter(function (x) { return x.type === "timeZoneName"; })[0];
      if (p && !/^(GMT|UTC)[+\-−]/.test(p.value)) { label = p.value; return true; }
      if (p && !label) label = p.value;
      return false;
    });
    if (/^(GMT|UTC)[+\-−]/.test(label)) label = label + " (" + zoneName.replace(/_/g, " ") + ")";
    return label;
  };
  U.time24 = function (ms, tz) { var p = parts(ms, tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }); return p.hour + ":" + p.minute; };
  U.dayMonth = function (ms, tz) { var p = parts(ms, tz, { weekday: "short", day: "numeric", month: "short" }); return p.weekday + " " + p.day + " " + p.month; };
  U.dateTime = function (iso, tz) { var ms = Date.parse(iso); return U.dayMonth(ms, tz) + ", " + U.time24(ms, tz) + " " + U.tzLabel(ms, tz); };
  U.longDate = function (ymd) {
    if (!ymd) return "";
    var p = parts(Date.parse(ymd.slice(0, 10) + "T12:00:00Z"), "UTC", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return p.weekday + " " + p.day + " " + p.month + " " + p.year;
  };
  U.visitorDateTime = function (iso) {
    var ms = Date.parse(iso), p = parts(ms, null, { day: "numeric", month: "short", year: "numeric" });
    return p.day + " " + p.month + " " + p.year + ", " + U.time24(ms, null) + " " + U.tzLabel(ms, null);
  };
  U.countdownText = function (ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    return (d ? d + "d " : "") + (d || h ? h + "h " : "") + U.pad(m) + "m " + U.pad(s % 60) + "s";
  };

  /* ---------- Weekends and sessions (Miranda's logic, shared by Calendar, Planner, Series, Home) ---------- */

  U.dateOnlyMs = function (ymd) { return ymd ? Date.parse(ymd.slice(0, 10) + "T12:00:00Z") : NaN; };
  U.sessionKey = function (s) {
    if (s.start) return Date.parse(s.start);
    if (s.date) return Date.parse(s.date.slice(0, 10) + "T00:00:00Z");
    return NaN;
  };
  U.sessionsSorted = function (w) {
    return (w.sessions || []).filter(function (s) { return !isNaN(U.sessionKey(s)); })
      .slice().sort(function (a, b) { return U.sessionKey(a) - U.sessionKey(b); });
  };
  U.firstStart = function (w) {
    var s = U.sessionsSorted(w);
    if (s.length) return U.sessionKey(s[0]);
    if (w.startDate) return Date.parse(w.startDate.slice(0, 10) + "T00:00:00Z");
    return null;
  };
  U.sessionWhen = function (s, tz) { return s.start ? U.dateTime(s.start, tz) : U.dayMonth(U.dateOnlyMs(s.date), "UTC"); };
  U.sessionDay = function (s, tz) { return s.start ? U.dayMonth(Date.parse(s.start), tz) : U.dayMonth(U.dateOnlyMs(s.date), "UTC"); };
  U.sessionEnd = function (s) {
    if (!s.start) return Date.parse(s.date.slice(0, 10) + "T23:59:59Z");
    return Date.parse(s.start) + (s.durationMinutes ? s.durationMinutes * 60000 : 0);
  };
  U.sessionEnded = function (s, t) { return t >= U.sessionEnd(s); };
  U.sessionRunning = function (s, t) {
    if (!s.start || !s.durationMinutes) return false;
    var st = Date.parse(s.start);
    return t >= st && t < st + s.durationMinutes * 60000;
  };
  U.hasResults = function (s) {
    return Array.isArray(s.results) && s.results.some(function (g) { return g && g.rows && g.rows.length; });
  };
  U.weekendPast = function (w, t) {
    var ss = U.sessionsSorted(w);
    if (ss.length) return ss.every(function (x) { return U.sessionEnded(x, t); });
    if (w.endDate) return t >= Date.parse(w.endDate.slice(0, 10) + "T23:59:59Z");
    return false;
  };

  // Schedule for one series: generated data merged with hand-entered weekends.
  U.scheduleFor = function (id) {
    var gen = (PP.schedule && PP.schedule.series && PP.schedule.series[id]) || null;
    var manual = (PP.scheduleManual || []).filter(function (w) { return w.series === id; });
    var weekends = (gen ? gen.weekends || [] : []).concat(manual);
    return {
      id: id, season: gen ? gen.season : null, fetchedAt: gen ? gen.fetchedAt : null,
      siteName: gen && gen.siteName ? gen.siteName : (U.series(id) || {}).site, weekends: weekends
    };
  };

  // Every timed session across the given series, sorted: [{ series, weekend, session, ms }]
  U.allSessions = function (ids) {
    var out = [];
    (ids || U.seriesIds()).forEach(function (id) {
      U.scheduleFor(id).weekends.forEach(function (w) {
        (w.sessions || []).forEach(function (s) {
          if (s.start) out.push({ series: id, weekend: w, session: s, ms: Date.parse(s.start) });
        });
      });
    });
    return out.sort(function (a, b) { return a.ms - b.ms; });
  };
  U.nextSessions = function (ids, t, n) {
    return U.allSessions(ids).filter(function (x) { return x.ms > t; }).slice(0, n || 1);
  };

  /* ---------- One shared one-second ticker for countdowns and live badges ---------- */

  var tickers = [], ticking = false;
  U.onTick = function (fn) {
    tickers.push(fn); fn(U.liveNow());
    if (!ticking) {
      ticking = true;
      window.setInterval(function () { var t = U.liveNow(); tickers.forEach(function (f) { f(t); }); }, 1000);
    }
  };

  U.liveBadge = function (s) {
    var b = U.el("span", { className: "badge badge--live", text: "On track now", hidden: true });
    U.onTick(function (t) { b.hidden = !U.sessionRunning(s, t); });
    return b;
  };

  /* ---------- Scroll reveal (Evelin): hidden state added by script only ---------- */

  U.reveal = function (selector) {
    if (U.reducedMotion() || !("IntersectionObserver" in window)) return;
    var targets = U.all(selector || "[data-reveal], main .section-head, main .card, main .series-poster, main .entry, main .term, main .tactic, main .path > li, main .stats > li, main .insta, main .lineup-grid > li");
    if (!targets.length) return;
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    var fold = window.innerHeight || 800, hidden = [];
    targets.forEach(function (node, i) {
      if (node.classList.contains("reveal") || node.getBoundingClientRect().top < fold) return; // never hide the first screen
      node.classList.add("reveal");
      node.style.transitionDelay = (i % 4) * 60 + "ms";
      hidden.push(node); io.observe(node);
    });
    // Failsafe: nothing stays hidden if the observer never fires.
    window.setTimeout(function () { hidden.forEach(function (n) { n.classList.add("is-in"); }); }, 2500);
  };
})();
