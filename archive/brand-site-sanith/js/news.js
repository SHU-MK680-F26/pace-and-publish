/* Pace & Publish: News page (PRD 6.4). Nothing here is sent anywhere. */
(function () {
  "use strict";
  var PP = window.PP;
  var PHOTOS = window.PP_PHOTOS || {};
  var ITEMS = (window.PP_NEWS || []).slice().sort(function (a, b) {
    return new Date(b.updated) - new Date(a.updated);
  });

  var out = document.getElementById("news-out");
  var count = document.getElementById("result-count");
  var seriesBtns = document.querySelectorAll("button[data-series]");
  var typeBtns = document.querySelectorAll("button[data-type]");
  var search = document.getElementById("news-search");
  var state = { series: "all", type: "all", q: "" };
  var TYPE_LABEL = { results: "Results", story: "Driver and team story", update: "Update" };
  var VOTES = ["Yes", "Somewhat", "No"];

  /* Read ?series= from the Home strip, for example news.html?series=motogp */
  try {
    var q = new URLSearchParams(window.location.search).get("series");
    if (q && (q.toLowerCase() === "all" || PP.SERIES[q.toLowerCase()])) state.series = q.toLowerCase();
  } catch (e) {}

  function dateLabel(iso) {
    return PP.fmt(new Date(iso + "T12:00:00Z"), "UTC", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
  }
  /* "Updated [date], [time] ET" */
  function updatedLabel(iso) {
    var d = new Date(iso);
    return "Updated " + PP.fmt(d, "America/New_York", { month: "long", day: "numeric", year: "numeric" }) + ", " +
      PP.fmt(d, "America/New_York", { hour: "numeric", minute: "2-digit" }) + " ET";
  }

  var votes = PP.storeGet("pp-poll") || {};

  function pollHTML(n) {
    var mine = votes[n.id];
    var h = '<div class="poll" role="group" aria-labelledby="poll-' + PP.esc(n.id) + '"><p id="poll-' + PP.esc(n.id) + '">Your take: Was this update useful?</p><div class="poll-buttons">';
    VOTES.forEach(function (v) {
      h += '<button type="button" class="btn" data-vote="' + v + '" data-item="' + PP.esc(n.id) + '" aria-pressed="' + (mine === v) + '">' + v + "</button>";
    });
    h += '</div><p class="poll-note">' + (mine ? "You voted " + PP.esc(mine) + ". " : "") + "Your vote is saved only in this browser and never sent anywhere.</p></div>";
    return h;
  }

  function itemHTML(n) {
    var h = '<article class="news-item" id="' + PP.esc(n.id) + '" data-series="' + PP.esc(n.series.join(" ")) + '" data-type="' + PP.esc(n.type) + '">';
    var ph = PHOTOS[n.series[0]];
    h += '<div class="item-media">';
    if (ph) {
      h += '<figure><img src="' + PP.esc(ph.src) + '" alt="' + PP.esc(ph.alt) + '" loading="lazy">' +
        "<figcaption>Series photo: " + PP.esc(ph.caption) + " · " + PP.esc(ph.credit) + ", " + PP.esc(ph.license) + ", via Wikimedia Commons. Not from this event.</figcaption></figure>";
    }
    if (n.image) {
      h += '<details class="post-graphic"><summary>Our Instagram post</summary>' +
        '<img src="' + PP.esc(n.image) + '" alt="' + PP.esc(n.alt) + '" loading="lazy" width="1080" height="1350"></details>';
    }
    h += "</div>";
    h += '<div class="body"><div class="meta">' + PP.tags(n.series) +
      '<span class="type">' + PP.esc(TYPE_LABEL[n.type] || n.type) + "</span>" +
      '<time datetime="' + PP.esc(n.date) + '">' + PP.esc(dateLabel(n.date)) + "</time></div>" +
      "<h2>" + PP.esc(n.headline) + "</h2>" +
      "<p>" + PP.esc(n.text) + "</p>";
    if (n.podium && n.podium.length) {
      h += '<ol class="podium" aria-label="Top three">';
      n.podium.forEach(function (p) {
        h += '<li><span class="pos" aria-label="Position ' + p.pos + '">' + p.pos + "</span>" +
          '<span class="who"><strong>' + PP.esc(p.name) + "</strong><span>" + PP.esc(p.team) + "</span></span></li>";
      });
      h += "</ol>";
    }
    h += '<p class="source">Source: <strong>' + PP.esc(n.source) + "</strong></p>";
    h += '<p class="updated"><time datetime="' + PP.esc(n.updated) + '">' + PP.esc(updatedLabel(n.updated)) + "</time></p>";
    h += pollHTML(n);
    h += "</div></article>";
    return h;
  }

  function haystack(n) {
    var parts = [n.headline, n.text];
    (n.podium || []).forEach(function (p) { parts.push(p.name, p.team); });
    return parts.join(" ").toLowerCase();
  }

  function matches(n) {
    if (state.series !== "all" && n.series.indexOf(state.series) === -1) return false;
    if (state.type !== "all" && n.type !== state.type) return false;
    if (state.q) {
      var text = haystack(n);
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) if (text.indexOf(words[i]) === -1) return false;
    }
    return true;
  }

  function render() {
    [].forEach.call(seriesBtns, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-series") === state.series)); });
    [].forEach.call(typeBtns, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-type") === state.type)); });
    var list = ITEMS.filter(matches);
    var label = state.series === "all" ? "all series" : PP.SERIES[state.series].label;
    count.textContent = "Showing " + list.length + " of " + ITEMS.length + " items (" + label +
      (state.type !== "all" ? ", " + TYPE_LABEL[state.type].toLowerCase() : "") + (state.q ? ', matching "' + state.q + '"' : "") + ").";
    if (!list.length) {
      var msg = "No news items match.";
      if (state.q) msg = 'No news items mention "' + state.q + '". Clear the search box to see everything.';
      else if (state.series !== "all" && state.type === "all") msg = "No " + PP.SERIES[state.series].label + " news yet. Our Weeks 1–3 posts covered F1, MotoGP and WEC only; " + PP.SERIES[state.series].label + " news will appear here once it is confirmed on " + PP.SERIES[state.series].site + ".";
      out.innerHTML = '<p class="empty">' + PP.esc(msg) + "</p>";
      slider = PP.carousel(out, "News");
      return;
    }
    out.innerHTML = list.map(itemHTML).join("");
    slider = PP.carousel(out, "News");
  }
  var slider = null;

  [].forEach.call(seriesBtns, function (b) {
    b.addEventListener("click", function () {
      state.series = b.getAttribute("data-series");
      try {
        var url = new URL(window.location.href);
        if (state.series === "all") url.searchParams.delete("series"); else url.searchParams.set("series", state.series);
        window.history.replaceState(null, "", url.toString());
      } catch (e) {}
      render();
    });
  });
  [].forEach.call(typeBtns, function (b) {
    b.addEventListener("click", function () { state.type = b.getAttribute("data-type"); render(); });
  });
  if (search) search.addEventListener("input", function () { state.q = search.value.trim(); render(); });

  /* "Your take" poll: stored only in this browser (localStorage) */
  out.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("button[data-vote]") : null;
    if (!btn) return;
    var id = btn.getAttribute("data-item");
    votes[id] = btn.getAttribute("data-vote");
    PP.storeSet("pp-poll", votes);
    var art = document.getElementById(id);
    var poll = art && art.querySelector(".poll");
    var item = ITEMS.filter(function (n) { return n.id === id; })[0];
    if (poll && item) poll.outerHTML = pollHTML(item);
  });

  render();

  /* Links from Home (news.html#item-id) open the carousel at that story */
  function openHash() {
    var id = decodeURIComponent((window.location.hash || "").slice(1));
    var el = id && document.getElementById(id);
    if (el && slider && el.parentNode === out) {
      slider.goTo(el);
      out.closest(".carousel").scrollIntoView({ block: "start" });
    }
  }
  openHash();
  window.addEventListener("hashchange", openHash);
})();
