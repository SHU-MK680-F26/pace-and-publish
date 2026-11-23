/* =====================================================================
   News: team stories (data/news.js) + official headlines
   (data/generated/headlines.js) as one list, newest first.
   PP.newsFeature.items(ids)       -> unified items for the given series
   PP.newsFeature.card(item, opts) -> a card element
   PP.newsFeature.renderPage()     -> the News page (filters, search)
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util, el = U.el;
  var TYPE_LABEL = { results: "Results", recap: "Recap", preview: "Race week", feature: "Feature", headline: "Headline", hiring: "Line-up news" };

  function siteOf(id) {
    var sched = PP.schedule && PP.schedule.series && PP.schedule.series[id];
    return (sched && sched.siteName) || (U.series(id) || {}).site;
  }

  function items(ids) {
    var want = ids || U.seriesIds();
    var out = [];
    (PP.news || []).forEach(function (n) {
      if (!n.series.some(function (s) { return want.indexOf(s) !== -1; })) return;
      out.push({ kind: "story", id: n.id, date: n.date, series: n.series, type: n.type, title: n.title, summary: n.summary,
        body: n.body || [], podium: n.podium, source: n.source, graphic: n.graphic, graphicAlt: n.graphicAlt, photo: n.photo, featured: n.featured });
    });
    var heads = (PP.headlines && PP.headlines.series) || {};
    want.forEach(function (id) {
      (heads[id] || []).forEach(function (h, i) {
        var site = siteOf(id);
        out.push({ kind: "headline", id: "h-" + id + "-" + i, date: h.date, series: [id], type: h.type === "hiring" ? "hiring" : "headline",
          title: h.caption || "New article on " + site, source: { site: site, url: h.sourceUrl } });
      });
    });
    return out.sort(function (a, b) { return (b.date || "").localeCompare(a.date || "") || (a.kind === "story" ? -1 : 1); });
  }

  function media(item) {
    if (item.graphic) {
      // Evelin's composition: the whole team graphic, sharp, over a blurred copy of itself.
      return el("div", { className: "card-media card-media--graphic" }, [
        el("img", { className: "media-bg", src: item.graphic, alt: "", loading: "lazy", decoding: "async" }),
        el("img", { className: "media-fg", src: item.graphic, alt: item.graphicAlt || "", loading: "lazy", decoding: "async" }),
        U.tag(item.series[0])
      ]);
    }
    var pid = item.photo || (U.series(item.series[0]) || {}).photo;
    var img = U.img(pid);
    if (!img) return null;
    return el("div", { className: "card-media" }, [img, U.tag(item.series[0])]);
  }

  function podium(list) {
    if (!list || !list.length) return null;
    return el("ol", { className: "podium", "aria-label": "Podium" }, list.map(function (p) {
      return el("li", null, [el("b", { text: "P" + p.pos }), el("span", null, [el("strong", { text: p.name }), el("small", { text: p.team })])]);
    }));
  }

  // opts: { lead: bool, text: bool (no image), headingLevel: "h2"|"h3" }
  function card(item, opts) {
    opts = opts || {};
    var isStory = item.kind === "story";
    var withMedia = isStory && !opts.text;
    var m = withMedia ? media(item) : null;
    var art = el("article", { className: "card" + (opts.lead ? " card--lead" : "") + (m ? "" : " card--text"), id: isStory ? item.id : null, tabindex: isStory ? "-1" : null, "data-series": item.series.join(" ") });
    if (m) art.appendChild(m);
    var body = el("div", { className: "card-body" });
    body.appendChild(el("p", { className: "card-meta" }, [
      m ? null : U.tag(item.series[0]),
      el("span", { text: TYPE_LABEL[item.type] || "News" }),
      el("time", { datetime: item.date, text: U.longDate(item.date) })
    ]));
    var h = el(opts.headingLevel || "h3", { className: "card-title" });
    if (isStory) h.appendChild(el("a", { href: "news.html#" + item.id, text: item.title }));
    else h.appendChild(U.outLink(item.source.url, item.title));
    body.appendChild(h);
    if (item.summary) body.appendChild(el("p", { className: "card-text", text: item.summary }));
    if (isStory && (opts.lead || opts.full) && item.podium) body.appendChild(podium(item.podium));
    if (isStory && opts.full && item.body && item.body.length) {
      var more = el("details", null, [el("summary", { text: "Read the full story" })].concat(item.body.map(function (p) { return el("p", { className: "card-text", text: p }); })));
      if (item.graphic) more.appendChild(el("p", { className: "src" }, [el("a", { href: item.graphic, target: "_blank", rel: "noopener", text: "See our Instagram graphic" })]));
      body.appendChild(more);
    }
    var src = U.sourceLine(item.source && item.source.url, item.source && item.source.site);
    if (src) body.appendChild(src);
    art.appendChild(body);
    return art;
  }

  /* ---------- News page ---------- */
  function renderPage() {
    var host = U.$("news-out"), count = U.$("news-count"), search = U.$("news-search");
    var state = { kind: "all", q: "" };
    var kinds = [["all", "Everything"], ["story", "Our stories"], ["headline", "Official headlines"]];
    var kindBar = el("div", { className: "filter filter--orange", role: "group", "aria-label": "Type of news" }, kinds.map(function (k) {
      return el("button", { type: "button", "aria-pressed": String(k[0] === "all"), "data-kind": k[0], text: k[1] });
    }));
    kindBar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-kind]"); if (!b) return;
      state.kind = b.getAttribute("data-kind");
      U.all("[data-kind]", kindBar).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      render();
    });
    U.$("news-series").appendChild(U.seriesPicker(render));
    U.$("news-kind").appendChild(kindBar);
    var timer;
    search.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { state.q = search.value.trim(); render(); }, 120); });

    function matches(item, q) {
      if (!q) return true;
      var hay = [item.title, item.summary || ""].concat(item.body || [], (item.podium || []).map(function (p) { return p.name + " " + p.team; }),
        item.series.map(function (s) { var x = U.series(s); return x ? x.short + " " + x.name : s; })).join(" ").toLowerCase();
      return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }
    function render() {
      var list = items(U.mySeries()).filter(function (i) { return (state.kind === "all" || i.kind === state.kind) && matches(i, state.q); });
      host.textContent = "";
      count.textContent = list.length + (list.length === 1 ? " item" : " items") + (state.q ? ' matching "' + state.q + '"' : "");
      if (!list.length) {
        host.appendChild(el("p", { className: "empty", text: state.q ? 'Nothing matches "' + state.q + '". Try a driver, team, track or series name.' : "No news for these series yet." }));
        return;
      }
      var grid = el("div", { className: "card-grid" });
      list.forEach(function (item) { grid.appendChild(card(item, { full: true })); });
      host.appendChild(grid);
      // Series with nothing to show still say so.
      var none = (U.mySeries() || U.seriesIds()).filter(function (id) { return !items([id]).length; });
      if (none.length && !state.q) host.appendChild(el("p", { className: "notice", style: "margin-top:32px" }, [
        "No news yet for " + none.map(function (id) { return U.series(id).short; }).join(", ") + ". We only publish what official sources confirm."
      ]));
      if (state.q) highlight(host, state.q);
    }
    function highlight(root, q) {
      var words = q.split(/\s+/).filter(Boolean).map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
      if (!words.length) return;
      var re = new RegExp("(" + words.join("|") + ")", "gi");
      U.all(".card-title a, .card-text", root).forEach(function (n) {
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
    // Deep link to a story: news.html#f1-001 opens it.
    function open() {
      var t = location.hash && document.getElementById(location.hash.slice(1));
      if (!t) return;
      var d = t.querySelector("details"); if (d) d.open = true;
      t.scrollIntoView({ block: "start" }); t.focus({ preventScroll: true });
    }
    window.addEventListener("hashchange", open);
    window.addEventListener("load", open);
  }

  PP.newsFeature = { items: items, card: card, renderPage: renderPage, TYPE_LABEL: TYPE_LABEL };
})();
