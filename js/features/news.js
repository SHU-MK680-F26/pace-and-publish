/* =====================================================================
   News: official headlines from each series' own news page
   (data/generated/headlines.js, written by scripts/refresh.py), newest first.
   Each card shows our one-line caption and links to the official article.
   PP.newsFeature.items(ids)       -> headlines for the given series
   PP.newsFeature.card(item, opts) -> a card element
   PP.newsFeature.renderPage()     -> the News page (series filter, search)
   (Decision 2026-11-23: team stories in data/news.js are no longer shown.)
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util, el = U.el;
  var TYPE_LABEL = { headline: "Headline", hiring: "Line-up news" };

  function siteOf(id) {
    var sched = PP.schedule && PP.schedule.series && PP.schedule.series[id];
    return (sched && sched.siteName) || (U.series(id) || {}).site;
  }

  function items(ids) {
    var want = ids || U.seriesIds();
    var heads = (PP.headlines && PP.headlines.series) || {};
    var out = [];
    want.forEach(function (id) {
      (heads[id] || []).forEach(function (h, i) {
        var site = siteOf(id);
        out.push({ id: "h-" + id + "-" + i, date: h.date, series: [id], type: h.type === "hiring" ? "hiring" : "headline",
          title: h.caption || "New article on " + site, captioned: !!h.caption, summary: h.caption ? h.summary || "" : "",
          source: { site: site, url: h.sourceUrl } });
      });
    });
    return out.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
  }

  // opts: { headingLevel: "h2"|"h3", summary: true (Home: show the 1-2 sentence summary under the headline) }
  function card(item, opts) {
    opts = opts || {};
    var art = el("article", { className: "card card--text" + (opts.summary ? " card--summary" : ""), "data-series": item.series.join(" ") });
    var body = el("div", { className: "card-body" });
    body.appendChild(el("p", { className: "card-meta" }, [
      U.tag(item.series[0]),
      el("span", { text: TYPE_LABEL[item.type] || "News" }),
      el("time", { datetime: item.date, text: U.longDate(item.date) })
    ]));
    body.appendChild(el(opts.headingLevel || "h3", { className: "card-title" }, [U.outLink(item.source.url, item.title)]));
    if (opts.summary && item.summary) body.appendChild(el("p", { className: "card-text", text: item.summary }));
    var src = U.sourceLine(item.source.url, item.source.site);
    if (src) body.appendChild(src);
    art.appendChild(body);
    return art;
  }

  /* ---------- News page ---------- */
  function renderPage() {
    var host = U.$("news-out"), count = U.$("news-count"), search = U.$("news-search");
    var q = "";
    U.$("news-series").appendChild(U.seriesPicker(render));
    var timer;
    search.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { q = search.value.trim(); render(); }, 120); });

    function matches(item) {
      if (!q) return true;
      var hay = [item.title, item.source.site].concat(item.series.map(function (s) { var x = U.series(s); return x ? x.short + " " + x.name : s; })).join(" ").toLowerCase();
      return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }
    function render() {
      var list = items(U.mySeries()).filter(matches);
      host.textContent = "";
      count.textContent = list.length + (list.length === 1 ? " headline" : " headlines") + (q ? ' matching "' + q + '"' : "");
      if (!list.length) {
        host.appendChild(el("p", { className: "empty", text: q ? 'Nothing matches "' + q + '". Try a driver, team, track or series name.' : "No news for these series yet." }));
        return;
      }
      var grid = el("div", { className: "card-grid" });
      list.forEach(function (item) { grid.appendChild(card(item)); });
      host.appendChild(grid);
      // Series with nothing to show still say so.
      var none = (U.mySeries() || U.seriesIds()).filter(function (id) { return !items([id]).length; });
      if (none.length && !q) host.appendChild(el("p", { className: "notice", style: "margin-top:32px" }, [
        "No headlines yet for " + none.map(function (id) { return U.series(id).short; }).join(", ") + ". We only publish what official sources confirm."
      ]));
      if (q) highlight(host);
    }
    function highlight(root) {
      var words = q.split(/\s+/).filter(Boolean).map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
      if (!words.length) return;
      var re = new RegExp("(" + words.join("|") + ")", "gi");
      U.all(".card-title a", root).forEach(function (n) {
        var walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), texts = [];
        while (walker.nextNode()) texts.push(walker.currentNode);
        texts.forEach(function (t) {
          if (!re.test(t.nodeValue)) return; re.lastIndex = 0;
          var span = document.createElement("span"); span.innerHTML = U.esc(t.nodeValue).replace(re, "<mark>$1</mark>");
          t.parentNode.replaceChild(span, t);
        });
      });
    }
    render();
  }

  PP.newsFeature = { items: items, card: card, renderPage: renderPage, TYPE_LABEL: TYPE_LABEL };
})();
