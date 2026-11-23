/* Pace & Publish: Home, latest news (the 6 newest items, newest first).
   The first item is shown as the lead story. Cards use the series photo. */
(function () {
  "use strict";
  var PP = window.PP;
  var PHOTOS = window.PP_PHOTOS || {};
  var items = (window.PP_NEWS || []).slice().sort(function (a, b) {
    return new Date(b.updated) - new Date(a.updated);
  }).slice(0, 6);

  var TYPE = { results: "Results", update: "Race update", story: "Story" };

  function card(n, lead) {
    var d = PP.fmt(new Date(n.date + "T12:00:00Z"), "UTC", { month: "short", day: "numeric", year: "numeric" });
    var ph = PHOTOS[n.series[0]];
    var href = "news.html#" + encodeURIComponent(n.id);
    var h = '<article class="card' + (lead ? " card-lead" : "") + '">';
    if (ph) h += '<a class="card-img" href="' + href + '"><img src="' + PP.esc(ph.src) + '" alt="' + PP.esc(ph.alt) + '" loading="lazy"></a>';
    h += '<div class="card-body"><div class="meta">' + PP.tags(n.series) + '<span class="type">' + PP.esc(TYPE[n.type] || n.type) + "</span>" +
      '<time datetime="' + PP.esc(n.date) + '">' + PP.esc(d) + "</time></div>" +
      (lead ? "<h3 class=\"lead-title\">" : "<h3>") + '<a href="' + href + '">' + PP.esc(n.headline) + "</a></h3>";
    if (lead) h += '<p class="muted">' + PP.esc(n.text) + "</p>";
    h += '<p class="source">Source: <strong>' + PP.esc(n.source) + "</strong></p></div></article>";
    return h;
  }

  var latest = document.getElementById("latest-news");
  latest.innerHTML = items.map(function (n) { return card(n, false); }).join("");
  PP.carousel(latest, "Latest news");
})();
