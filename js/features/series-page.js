/* =====================================================================
   Series page template: series.html?id=<id from data/series.js>.
   Header, next up, latest results (Miranda's sortable tables), news,
   upcoming weekends, line-ups, history link. A new series in the
   registry gets this page with no other changes.
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util, el = U.el;
  var TOP_N = 10;               // WEC and IMSA show at most this many rows per class
  var CAPPED = ["wec", "imsa"];

  /* ---------- Result tables: sort by column, click a name to highlight it everywhere ---------- */
  var COLS = [["pos", "Pos"], ["name", "Name"], ["team", "Team"], ["number", "No."], ["timeOrGap", "Time or gap"]];
  function posKey(r) { var n = parseInt(r.pos, 10); return isNaN(n) ? Infinity : n; }
  var highlighted = null;
  function applyHighlight() {
    U.all(".name-pick").forEach(function (b) {
      var on = highlighted !== null && b.textContent === highlighted;
      b.setAttribute("aria-pressed", String(on));
      b.closest("tr").classList.toggle("hl", on);
    });
  }
  function sortTable(table, col, th) {
    var dir = th.getAttribute("aria-sort") === "ascending" ? -1 : 1;
    U.all("th", table).forEach(function (h) { h.removeAttribute("aria-sort"); });
    th.setAttribute("aria-sort", dir === 1 ? "ascending" : "descending");
    var tbody = table.tBodies[0], rows = [].slice.call(tbody.rows);
    rows.sort(function (a, b) {
      var ra = a._row, rb = b._row;
      if (col === "pos") return dir * ((posKey(ra) - posKey(rb)) || (a._i - b._i));
      var x = ra[col] == null ? "" : String(ra[col]), y = rb[col] == null ? "" : String(rb[col]);
      if (x === "" && y !== "") return 1;
      if (y === "" && x !== "") return -1;
      return dir * x.localeCompare(y, "en", { numeric: true }) || (a._i - b._i);
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  }
  function resultTable(rows) {
    var table = el("table"), headRow = el("tr");
    COLS.forEach(function (c) {
      var th = el("th", { scope: "col" });
      th.appendChild(el("button", { type: "button", className: "sort", text: c[1], onclick: function () { sortTable(table, c[0], th); } }));
      headRow.appendChild(th);
    });
    var tbody = el("tbody");
    rows.forEach(function (r, i) {
      var tr = el("tr", null, COLS.map(function (c) {
        var v = r[c[0]], text = v == null ? "" : String(v);
        if (c[0] === "name" && text) {
          return el("td", null, [el("button", { type: "button", className: "name-pick", "aria-pressed": "false", text: text,
            onclick: function () { highlighted = highlighted === text ? null : text; applyHighlight(); } })]);
        }
        return el("td", { text: text });
      }));
      tr._row = r; tr._i = i;
      tbody.appendChild(tr);
    });
    table.appendChild(el("thead", null, [headRow])); table.appendChild(tbody);
    return el("div", { className: "table-wrap" }, [table]);
  }
  function sessionBlock(s, sid, w, siteName, open) {
    var block = el("details", { className: "session" }, [el("summary", null, [
      el("h3", null, [s.name, s.start ? U.liveBadge(s) : null]),
      el("p", { className: "when", text: U.sessionWhen(s, w.timeZone) })
    ])]);
    if (open) block.open = true;
    var body = el("div", { className: "session-body" });
    block.appendChild(body);
    if (U.hasResults(s)) {
      s.results.forEach(function (g) {
        if (!g || !g.rows || !g.rows.length) return;
        var rows = g.rows.map(function (r, i) { return { r: r, i: i }; }).sort(function (a, b) { return (posKey(a.r) - posKey(b.r)) || (a.i - b.i); }).map(function (x) { return x.r; });
        if (CAPPED.indexOf(sid) !== -1) rows = rows.slice(0, TOP_N);
        if (g["class"]) body.appendChild(el("h4", { className: "class-name", text: g["class"] }));
        body.appendChild(resultTable(rows));
      });
    } else {
      body.appendChild(el("p", { className: "subtle", text: U.sessionEnded(s, U.now()) ? "Results not yet added." : "Results appear here after the session." }));
    }
    var src = U.sourceLine(s.sourceUrl, siteName); if (src) body.appendChild(src);
    return block;
  }
  // Latest weekend whose first session starts no later than 24 hours from now (Miranda).
  function shownWeekend(weekends) {
    var limit = U.now() + 24 * 3600 * 1000, best = null, bestStart = null;
    weekends.forEach(function (w) {
      var f = U.firstStart(w);
      if (f === null || f > limit) return;
      if (bestStart === null || f > bestStart) { best = w; bestStart = f; }
    });
    return best;
  }
  function focusSession(sessions, t) {
    var running = sessions.filter(function (s) { return U.sessionRunning(s, t); })[0];
    if (running) return running;
    var withResults = sessions.filter(U.hasResults);
    if (withResults.length) return withResults[withResults.length - 1];
    return sessions.filter(function (s) { return !U.sessionEnded(s, t); })[0] || sessions[sessions.length - 1];
  }

  function section(id, title, intro) {
    var s = el("section", { className: "section", id: id, "aria-labelledby": id + "-h" }, [
      el("div", { className: "section-head" }, [el("h2", { id: id + "-h", text: title }), intro ? el("p", { text: intro }) : null])
    ]);
    return s;
  }

  function render() {
    var main = U.$("series-main"), id = U.param("id"), s = U.series(id);
    if (!s) {
      document.title = "Series | Pace & Publish";
      var ov0 = document.querySelector(".site-header--overlay"); if (ov0) ov0.classList.remove("site-header--overlay");
      main.appendChild(el("header", { className: "page-head" }, [el("h1", { text: "Series" }),
        el("p", { className: "page-intro", text: "Choose a series:" })]));
      main.appendChild(el("div", { className: "tags" }, (PP.series || []).map(function (x) { return U.tag(x.id, true); })));
      return;
    }
    document.title = s.name + " | Pace & Publish";
    var sched = U.scheduleFor(id);
    var history = (PP.seriesHistory || []).filter(function (h) { return h.key === id && h.body; })[0];

    /* Header: photo head (Evelin) or stripe head when there's no photo */
    var photo = U.photo(s.photo);
    if (!photo) { var ov = document.querySelector(".site-header--overlay"); if (ov) ov.classList.remove("site-header--overlay"); }
    var head = el("header", { className: photo ? "page-head page-head--photo" : "page-head wrap" });
    if (photo) head.appendChild(U.img(s.photo, { lazy: false, alt: "" }));
    head.appendChild(el("div", { className: photo ? "wrap" : "" }, [
      photo ? null : el("div", { className: "stripe", "aria-hidden": "true", html: "<span></span>" }),
      el("p", { className: "kicker", text: (sched.season ? "Season " + sched.season + " · " : "") + "Source: " + sched.siteName }),
      el("h1", { tabindex: "-1", text: s.name }),
      el("p", { className: "page-intro", text: s.desc }),
      photo ? U.creditLine(photo) : null
    ]));
    U.$("series-head").appendChild(head);
    if (s.sourceNote) main.appendChild(el("p", { className: "notice", style: "margin-top:24px", text: s.sourceNote }));

    /* Next up */
    var next = el("div", { className: "section", style: "padding-bottom:0" });
    main.appendChild(next);
    PP.scheduleFeature.nextUp(next, [id]);

    /* Latest results */
    var res = section("results", "Latest results");
    var w = shownWeekend(sched.weekends);
    if (w) {
      var sessions = U.sessionsSorted(w);
      res.querySelector(".section-head").appendChild(el("p", { text: [w.name, w.circuit, w.country].filter(Boolean).join(", ") }));
      if (!sessions.length) {
        res.appendChild(el("p", { className: "subtle", text: "Session times and results for this weekend are not published by " + sched.siteName + " in a form we can read." }));
      } else {
        var focus = focusSession(sessions, U.now());
        var blocks = sessions.map(function (x) { return sessionBlock(x, id, w, sched.siteName, x === focus); });
        res.appendChild(el("div", { className: "panel-controls" }, [
          el("button", { type: "button", className: "btn btn--ghost btn--small", text: "Open all", onclick: function () { blocks.forEach(function (b) { b.open = true; }); } }),
          el("button", { type: "button", className: "btn btn--ghost btn--small", text: "Close all", onclick: function () { blocks.forEach(function (b) { b.open = false; }); } })
        ]));
        if (sessions.some(U.hasResults)) res.appendChild(el("p", { className: "hint", text: "Select a name to highlight that driver in every session. Select a column heading to sort." }));
        blocks.forEach(function (b) { res.appendChild(b); });
      }
    } else {
      res.appendChild(el("p", { className: "subtle", text: "No race weekend has started yet." }));
    }
    main.appendChild(res);

    /* News: our stories, then official headlines */
    var news = section("news", "News");
    var items = PP.newsFeature.items([id]).slice(0, 6);
    if (items.length) {
      var grid = el("div", { className: "card-grid" });
      items.forEach(function (it) { grid.appendChild(PP.newsFeature.card(it, {})); });
      news.appendChild(grid);
      news.appendChild(el("p", { style: "margin-top:24px" }, [el("a", { className: "text-link", href: "news.html", text: "All news" })]));
    } else {
      news.appendChild(el("p", { className: "subtle", text: "No news yet. We only publish what " + s.site + " confirms." }));
    }
    main.appendChild(news);

    /* Upcoming weekends */
    var up = section("upcoming", "Coming up");
    var t = U.now();
    var future = sched.weekends.filter(function (x) { return !U.weekendPast(x, t); })
      .sort(function (a, b) { return (U.firstStart(a) || Infinity) - (U.firstStart(b) || Infinity); }).slice(0, 5);
    if (future.length) {
      var ul = el("ul", { className: "lineup-grid" });
      future.forEach(function (x) {
        var f = U.firstStart(x);
        ul.appendChild(el("li", null, [
          el("span", { className: "lineup-team", text: f ? U.dayMonth(f, x.timeZone || "UTC") + (x.season ? " · " + x.season : "") : "Date to be confirmed" }),
          el("span", { className: "lineup-drivers", text: x.name || "" }),
          el("span", { className: "subtle small", style: "display:block", text: [x.circuit, x.country].filter(Boolean).join(", ") })
        ]));
      });
      up.appendChild(ul);
    } else {
      up.appendChild(el("p", { className: "subtle", text: sched.weekends.length ? "The season is over. The next calendar appears here once " + sched.siteName + " publishes it." : "No schedule in the data yet for this series." }));
    }
    up.appendChild(el("p", { style: "margin-top:24px" }, [el("a", { className: "text-link", href: "calendar.html", text: "Full race calendar" }), " ", el("a", { className: "text-link", href: "planner.html", style: "margin-left:24px", text: "Plan your weekend" })]));
    main.appendChild(up);

    /* Line-ups with driver portraits */
    var lineups = (PP.lineups && PP.lineups.series && PP.lineups.series[id]) || [];
    var credits = [];
    if (lineups.length) {
      var lu = section("lineups", "Line-ups");
      var colours = (PP.lineups.teamColours || []).filter(function (c) { return c.series === id; });
      var classes = [];
      lineups.forEach(function (e) { if (classes.indexOf(e["class"] || "") === -1) classes.push(e["class"] || ""); });
      classes.forEach(function (c) {
        if (c) lu.appendChild(el("h3", { className: "class-name", text: c }));
        var list = el("ul", { className: "lineup-grid" });
        lineups.filter(function (e) { return (e["class"] || "") === c; }).forEach(function (e) {
          var colour = colours.filter(function (x) { return x.team === e.team; })[0];
          var faces = el("div", { className: "lineup-faces" });
          (e.drivers || []).forEach(function (name) {
            var pid = Object.keys(PP.photos || {}).filter(function (k) { var p = PP.photos[k]; return p.series === id && p.driver === name; })[0];
            if (pid) {
              var img = U.img(pid); img.style.objectPosition = "50% " + (PP.photos[pid].focusY || 25) + "%";
              faces.appendChild(img); credits.push({ name: name, p: PP.photos[pid] });
            }
          });
          var li = el("li", null, [faces.children.length ? faces : null, el("span", { className: "lineup-team", text: e.team || "" }),
            el("span", { className: "lineup-drivers", text: (e.drivers || []).join(" · ") })]);
          if (colour) li.style.setProperty("--team", colour.colour);
          list.appendChild(li);
        });
        lu.appendChild(list);
      });
      var urls = lineups.map(function (e) { return e.sourceUrl; }).filter(Boolean);
      if (urls.length) lu.appendChild(U.sourceLine(urls[0], sched.siteName));
      main.appendChild(lu);
    }

    /* History */
    if (history) {
      var hist = section("history", "The story so far", history.summary);
      hist.appendChild(el("p", null, [el("a", { className: "btn", href: "legacy.html#series-" + id, text: "Read the " + s.short + " history" })]));
      main.appendChild(hist);
    }

    /* Driver photo credits */
    if (credits.length) {
      var pc = section("photo-credits", "Photo credits");
      pc.appendChild(el("ul", { className: "credit", style: "padding-left:18px" }, credits.map(function (c) {
        var line = U.creditLine(c.p);
        return el("li", null, [el("strong", { text: c.name + ": " })].concat([].slice.call(line.childNodes)));
      })));
      main.appendChild(pc);
    }
  }

  PP.seriesPage = { render: render };
})();
