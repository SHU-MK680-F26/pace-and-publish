/* =====================================================================
   Guide pages (Ben's starter guide): Terminology, Tactics, Racetracks,
   Legacy, Sources. Each page calls the renderer it needs, e.g.
     PP.guide.renderTerms()
   Data: data/terms.js, tactics.js, tracks.js, races.js, series-history.js.
   Adding content never needs changes here (see docs/adding-content.md).
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util, esc = U.esc, $ = U.$;
  var TERMS = PP.terms || [], TACTICS = PP.tactics || [], TRACKS = PP.tracks || [], RACES = PP.races || [];
  var HISTORY = PP.seriesHistory || [], TOPICS = PP.topics || [];

  var TYPE_LABELS = { permanent: "Road course", street: "Street circuit", oval: "Oval" };
  var TYPE_TERMS = { permanent: "road-course", street: "street-circuit", oval: "oval" };
  var LIST_LABELS = { terms: "term", tactics: "tactic", tracks: "track", races: "race" };
  // Where each kind of entry lives, so links work from any page.
  var PAGE = { term: "terminology.html", tactic: "tactics.html", track: "tracks.html", race: "legacy.html", series: "legacy.html" };
  function href(kind, id) { return PAGE[kind] + "#" + kind + "-" + id; }

  function indexById(list, key) {
    var m = Object.create(null);
    list.forEach(function (x) { if (x && x[key || "id"]) m[x[key || "id"]] = x; });
    return m;
  }
  var LEGACY_SERIES = HISTORY.filter(function (s) { return s.body && s.body.length; });
  var BY = { term: indexById(TERMS), tactic: indexById(TACTICS), track: indexById(TRACKS), race: indexById(RACES), series: indexById(LEGACY_SERIES, "key") };
  var historyByKey = indexById(HISTORY, "key");
  function seriesLabel(k) { var s = U.series(k) || historyByKey[k]; return s ? (s.short || s.label) : k; }
  function seriesName(k) { var s = U.series(k) || historyByKey[k]; return s ? s.name : k; }
  function seriesExtras(keys) { return (keys || []).filter(function (k) { return BY.series[k]; }).map(function (k) { return ["series", k]; }); }
  function byName(a, b) { return a.name.localeCompare(b.name, "en", { sensitivity: "base" }); }

  /* ---------- Built-in content checks: warnings in the browser console ---------- */
  function validate() {
    var problems = 0;
    function warn(list, item, msg) { problems++; console.warn("[Pace & Publish content] " + list + ' "' + ((item && (item.id || item.key)) || "?") + '": ' + msg); }
    var idPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    var known = U.seriesIds().concat(HISTORY.map(function (s) { return s.key; }), ["all"]);
    function check(listName, list, required) {
      var seen = Object.create(null);
      list.forEach(function (item) {
        required.forEach(function (f) {
          var v = item[f];
          if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) warn(listName, item, 'missing required field "' + f + '"');
        });
        if (item.id) {
          if (!idPattern.test(item.id)) warn(listName, item, "id should use lowercase letters, numbers and hyphens only");
          if (seen[item.id]) warn(listName, item, "duplicate id");
          seen[item.id] = true;
        }
        (item.series || []).forEach(function (k) { if (known.indexOf(k) === -1) warn(listName, item, 'unknown series "' + k + '" (add it to data/series.js)'); });
        var rel = item.related || {};
        Object.keys(rel).forEach(function (kind) {
          var singular = LIST_LABELS[kind];
          if (!singular) { warn(listName, item, 'unknown related list "' + kind + '"'); return; }
          (rel[kind] || []).forEach(function (rid) { if (!BY[singular][rid]) warn(listName, item, "related " + singular + ' "' + rid + '" does not exist'); });
        });
        (item.sources || []).forEach(function (s) { if (!s || !s.title || !s.url) warn(listName, item, "a source is missing its title or url"); });
        ["photo", "map"].forEach(function (f) { if (item[f] && !U.photo(item[f])) warn(listName, item, f + ' "' + item[f] + '" is not in data/photos.js'); });
      });
    }
    check("terms", TERMS, ["id", "name", "series", "text", "sources"]);
    check("tactics", TACTICS, ["id", "name", "series", "body", "sources"]);
    check("tracks", TRACKS, ["id", "name", "country", "lat", "lng", "series", "type", "summary", "body", "sources"]);
    check("races", RACES, ["id", "name", "date", "dateLabel", "series", "track", "body", "sources"]);
    var topicKeys = TOPICS.map(function (tp) { return tp.key; });
    TERMS.forEach(function (t) { (t.topics || []).forEach(function (k) { if (topicKeys.indexOf(k) === -1) warn("terms", t, 'unknown topic "' + k + '"'); }); });
    TRACKS.forEach(function (t) {
      if (typeof t.lat !== "number" || t.lat < -90 || t.lat > 90) warn("tracks", t, "lat must be a number between -90 and 90");
      if (typeof t.lng !== "number" || t.lng < -180 || t.lng > 180) warn("tracks", t, "lng must be a number between -180 and 180");
      if (t.type && !TYPE_LABELS[t.type]) warn("tracks", t, 'type must be "permanent", "street" or "oval"');
    });
    RACES.forEach(function (r) {
      if (r.track && !BY.track[r.track]) warn("races", r, 'track "' + r.track + '" does not exist in data/tracks.js');
      if (r.date && !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) warn("races", r, "date should look like YYYY-MM-DD");
    });
    if (!problems) console.info("[Pace & Publish content] All guide entries passed the checks (" + TERMS.length + " terms, " + TACTICS.length + " tactics, " + TRACKS.length + " tracks, " + RACES.length + " races).");
  }

  /* ---------- Automatic links to Terminology (first mention of each term) ---------- */
  var termLookup = Object.create(null), phrases = [];
  TERMS.forEach(function (t) {
    if (t.autolink === false) return;
    [t.name].concat(t.aka || [], t.forms || []).forEach(function (p) {
      var key = p.toLowerCase();
      if (!termLookup[key]) { termLookup[key] = t.id; phrases.push(p); }
    });
  });
  phrases.sort(function (a, b) { return b.length - a.length; });
  var termRegex = phrases.length ? new RegExp("(?<![\\w-])(" + phrases.map(function (p) {
    return esc(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("|") + ")(?![\\w-])", "gi") : null;

  function linkify(text, selfTermId, used) {
    var html = esc(text);
    if (!termRegex) return html;
    used = used || Object.create(null);
    return html.replace(termRegex, function (m) {
      var id = termLookup[m.toLowerCase()];
      if (!id || id === selfTermId || used[id]) return m;
      used[id] = true;
      return '<a class="term-link" href="' + href("term", id) + '">' + m + "</a>";
    });
  }
  function paragraphs(list, selfTermId) {
    var used = Object.create(null);
    return (list || []).map(function (p) { return "<p>" + linkify(p, selfTermId, used) + "</p>"; }).join("");
  }

  /* ---------- Shared entry parts ---------- */
  function relatedHtml(item, extra, kindOfItem) {
    var rel = item.related || {}, links = [], seen = Object.create(null);
    function add(kind, id) {
      var obj = BY[kind][id], key = kind + ":" + id;
      if (!obj || seen[key] || (kind === kindOfItem && id === item.id)) return;
      seen[key] = true;
      links.push('<li><a href="' + href(kind, id) + '">' + esc(obj.name) + "</a></li>");
    }
    ["terms", "tactics", "tracks", "races"].forEach(function (k) { (rel[k] || []).forEach(function (id) { add(LIST_LABELS[k], id); }); });
    (extra || []).forEach(function (e) { add(e[0], e[1]); });
    return links.length ? '<div class="related"><strong>Related</strong><ul>' + links.join("") + "</ul></div>" : "";
  }
  function sourcesHtml(list) {
    if (!list || !list.length) return "";
    return '<div class="sources"><strong>Sources</strong><ul>' + list.map(function (src) {
      return '<li><a href="' + esc(src.url) + '" rel="noopener" target="_blank">' + esc(src.title) + "</a></li>";
    }).join("") + "</ul></div>";
  }
  function factsHtml(rows) {
    if (!rows.length) return "";
    return '<dl class="facts">' + rows.map(function (r) {
      return "<div><dt>" + esc(r.label) + "</dt><dd>" + (r.html || esc(r.value)) + "</dd></div>";
    }).join("") + "</dl>";
  }
  function figureHtml(id, extraClass) {
    var p = U.photo(id);
    if (!p) return "";
    return '<figure class="media' + (extraClass ? " " + extraClass : "") + '">' + U.img(id).outerHTML +
      "<figcaption>" + U.creditLine(p).innerHTML + (p.changes ? " (" + esc(p.changes) + ")" : "") + "</figcaption></figure>";
  }
  function tagsHtml(keys) { return U.tagsHtml(keys); }
  function entryNum(i) { return '<span class="entry-num" aria-hidden="true">' + U.pad(i + 1) + "</span>"; }

  /* ---------- Terminology ---------- */
  var termFilter = "all", termTopic = null;
  var topicByKey = indexById(TOPICS, "key");

  function renderTerms() {
    var groups = {};
    TERMS.slice().sort(byName).forEach(function (t) {
      var L = t.name.charAt(0).toUpperCase();
      (groups[L] = groups[L] || []).push(t);
    });
    $("terms-list").innerHTML = Object.keys(groups).sort().map(function (L) {
      return '<section class="letter-group" id="letter-' + L.toLowerCase() + '" aria-label="' + L + '"><h2 aria-hidden="true">' + L + '</h2><div class="term-grid">' +
        groups[L].map(function (t) {
          return '<article class="term" id="term-' + t.id + '" tabindex="-1" data-series="' + esc(t.series.join(" ")) + '" data-topics="' + esc((t.topics || []).join(" ")) + '">' +
            '<div class="term-head"><h3>' + esc(t.name) + "</h3>" + tagsHtml(t.series) + "</div>" +
            (t.aka && t.aka.length ? '<p class="aka">Also called: ' + t.aka.map(esc).join(", ") + "</p>" : "") +
            '<div class="prose">' + paragraphs([t.text], t.id) + "</div>" + relatedHtml(t, null, "term") + sourcesHtml(t.sources) + "</article>";
        }).join("") + "</div></section>";
    }).join("");
    var keys = U.seriesIds().concat(HISTORY.map(function (s) { return s.key; })).filter(function (k, i, a) {
      return a.indexOf(k) === i && k !== "other" && TERMS.some(function (t) { return t.series.indexOf(k) !== -1; });
    });
    $("term-filter").innerHTML = '<button type="button" data-term-filter="all" aria-pressed="true">All series</button>' +
      keys.map(function (k) { return '<button type="button" data-term-filter="' + k + '" aria-pressed="false">' + esc(seriesLabel(k)) + "</button>"; }).join("");
    $("term-topics").innerHTML = TOPICS.map(function (tp) {
      return '<button type="button" data-term-topic="' + tp.key + '" aria-pressed="false">' + esc(tp.label) + "</button>";
    }).join("");
    document.addEventListener("click", function (e) {
      var tt = e.target.closest("[data-term-topic]");
      if (tt) { termTopic = termTopic === tt.getAttribute("data-term-topic") ? null : tt.getAttribute("data-term-topic"); applyTermFilter(); return; }
      var tf = e.target.closest("[data-term-filter]");
      if (tf) applyTermFilter(tf.getAttribute("data-term-filter"));
    });
    $("term-shared").addEventListener("change", function () { applyTermFilter(); });
    applyTermFilter();
    beforeJump = function (target) {
      if (target.closest("#terms-list") && (target.hidden || target.closest("[hidden]"))) { termTopic = null; applyTermFilter("all"); }
    };
  }

  function applyTermFilter(key) {
    if (key) termFilter = key;
    var shared = $("term-shared").checked;
    $("term-shared").disabled = termFilter === "all";
    U.all("[data-term-filter]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-term-filter") === termFilter)); });
    U.all("[data-term-topic]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-term-topic") === termTopic)); });
    var shown = 0;
    U.all("#terms-list .term").forEach(function (el) {
      var tags = el.getAttribute("data-series").split(" ");
      var visible = termFilter === "all" || tags.indexOf(termFilter) !== -1 || (shared && tags.indexOf("all") !== -1);
      if (visible && termTopic) visible = el.getAttribute("data-topics").split(" ").indexOf(termTopic) !== -1;
      el.hidden = !visible;
      if (visible) shown++;
    });
    var az = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (L) {
      var group = $("letter-" + L.toLowerCase());
      var has = group && group.querySelector(".term:not([hidden])");
      if (group) group.hidden = !has;
      az += has ? '<a href="#letter-' + L.toLowerCase() + '" aria-label="Terms starting with ' + L + '">' + L + "</a>" : '<span aria-hidden="true">' + L + "</span>";
    });
    $("az-bar").innerHTML = az;
    $("term-count").textContent = "Showing " + shown + " of " + TERMS.length + " terms" +
      (termTopic ? " in " + topicByKey[termTopic].name : "") + (termFilter === "all" ? "" : " for " + seriesName(termFilter)) + ".";
  }

  /* ---------- Tactics ---------- */
  function renderTactics() {
    var sorted = TACTICS.slice().sort(function (a, b) { return (a.order || 999) - (b.order || 999) || byName(a, b); });
    $("tactics-list").innerHTML = sorted.map(function (t, i) {
      return '<article class="tactic" id="tactic-' + t.id + '" tabindex="-1">' +
        '<div class="tactic-num" aria-hidden="true">' + U.pad(i + 1) + "</div>" +
        '<div class="tactic-body">' + tagsHtml(t.series) + "<h2>" + esc(t.name) + "</h2>" +
        '<div class="prose">' + paragraphs(t.body) + "</div>" + relatedHtml(t, null, "tactic") + sourcesHtml(t.sources) + "</div></article>";
    }).join("");
  }

  /* ---------- Racetracks: list, entries (with Evelin's circuit detail), Leaflet map ---------- */
  var sortedTracks = TRACKS.slice().sort(byName);
  var map = null, markers = {}, currentFilter = "all";

  function trackFacts(t) {
    var d = t.detail || {};
    var rows = [
      { label: "Country", value: t.country },
      { label: "Track type", html: '<a href="' + href("term", TYPE_TERMS[t.type]) + '">' + esc(TYPE_LABELS[t.type] || t.type) + "</a>" }
    ].concat(t.facts || []);
    if (d.turns) rows.push({ label: "Turns", value: d.turns });
    if (d.laps) rows.push({ label: "Race laps", value: d.laps });
    if (d.raceDistance) rows.push({ label: "Race distance", value: d.raceDistance });
    if (d.lapRecord) rows.push({ label: "Lap record", html: esc(d.lapRecord) + '<span class="subtle small" style="display:block;text-transform:none;font-family:var(--font-body)">' + esc(d.lapRecordHolder || "") + "</span>" });
    if (d.firstGrandPrix && !rows.some(function (r) { return /First/.test(r.label); })) rows.push({ label: "First Grand Prix", value: d.firstGrandPrix });
    return rows;
  }

  function renderTracks() {
    $("tracks-list").innerHTML = sortedTracks.map(function (t, i) {
      var d = t.detail || {};
      var racesHere = RACES.filter(function (r) { return r.track === t.id; }).map(function (r) { return ["race", r.id]; });
      var media = (t.photo ? figureHtml(t.photo) : "") + (t.map ? figureHtml(t.map, "media--map") : "");
      var detailSources = [];
      if (d.source) detailSources.push({ title: d.source.title + (d.event ? ": " + d.event : ""), url: d.source.url });
      if (d.turnsSource) detailSources.push({ title: "Turn count: " + d.turnsSource.title, url: d.turnsSource.url });
      return '<article class="entry" id="track-' + t.id + '" tabindex="-1">' +
        '<div class="entry-top"><div>' + tagsHtml(t.series) +
        '<h2 class="entry-title">' + esc(t.name) + '</h2><p class="entry-sub">' + esc(t.summary) + "</p></div>" + entryNum(i) + "</div>" +
        factsHtml(trackFacts(t)) +
        '<div class="entry-body' + (media ? "" : " no-media") + '">' + (media ? '<div class="media-stack">' + media + "</div>" : "") +
        '<div><div class="prose">' + paragraphs(t.body) + (d.fact ? "<p>" + linkify(d.fact) + "</p>" : "") + "</div>" +
        (d.mapNote ? '<p class="subtle small">' + esc(d.mapNote) + "</p>" : "") +
        relatedHtml(t, racesHere.concat(seriesExtras(t.series)), "track") + sourcesHtml((t.sources || []).concat(detailSources)) +
        '<p><a class="back-to-map text-link" href="#map-top">Back to the map</a></p></div></div></article>';
    }).join("");

    $("track-list").innerHTML = sortedTracks.map(function (t) {
      return '<li data-id="' + t.id + '"><a href="#track-' + t.id + '">' + esc(t.name) + "<small>" + esc(t.country) + " · " +
        t.series.map(seriesLabel).join(", ") + "</small></a>" +
        '<button type="button" data-locate="' + t.id + '" aria-label="Show ' + esc(t.name) + ' on the map">Map</button></li>';
    }).join("");
    var used = U.seriesIds().concat(HISTORY.map(function (s) { return s.key; })).filter(function (k, i, a) {
      return a.indexOf(k) === i && TRACKS.some(function (t) { return t.series.indexOf(k) !== -1; });
    });
    $("track-filter").innerHTML = '<button type="button" data-filter="all" aria-pressed="true">All</button>' +
      used.map(function (k) { return '<button type="button" data-filter="' + k + '" aria-pressed="false">' + esc(seriesLabel(k)) + "</button>"; }).join("");

    if (window.matchMedia && window.matchMedia("(hover: none)").matches && $("map-intro")) {
      $("map-intro").textContent = "Tap a marker for a summary, or use the list beside the map.";
    }
    document.addEventListener("click", function (e) {
      var loc = e.target.closest("[data-locate]");
      if (loc) { locate(loc.getAttribute("data-locate")); return; }
      var f = e.target.closest("[data-filter]");
      if (f) applyFilter(f.getAttribute("data-filter"));
    });
    document.addEventListener("mouseover", function (e) {
      var li = e.target.closest && e.target.closest("#track-list li");
      if (li && map && markers[li.getAttribute("data-id")]) { markers[li.getAttribute("data-id")].setStyle({ fillColor: "#F4C537", radius: 10 }).bringToFront(); }
    });
    document.addEventListener("mouseout", function (e) {
      var li = e.target.closest && e.target.closest("#track-list li");
      if (li && map && markers[li.getAttribute("data-id")]) markers[li.getAttribute("data-id")].setStyle({ fillColor: "#F64C1C", radius: 8 });
    });
    initMap();
  }

  function popupHtml(t) {
    return '<div class="pop"><h3>' + esc(t.name) + '</h3><p class="pop-country">' + esc(t.country) + "</p>" +
      tagsHtml(t.series) + "<p>" + esc(t.summary) + "</p>" + '<a class="btn" href="#track-' + t.id + '">Learn more</a></div>';
  }

  function initMap() {
    if (typeof L === "undefined") { $("map-wrap").classList.add("is-offline"); return; }
    var narrow = $("track-map").clientWidth < 600;
    map = L.map("track-map", { scrollWheelZoom: false, minZoom: narrow ? 0 : 2, zoomSnap: 0.5, maxBounds: [[-85, -200], [85, 200]] });
    // Click-to-focus scroll zoom, so the page scrolls past the map normally.
    map.on("focus click", function () { map.scrollWheelZoom.enable(); });
    map.on("blur mouseout", function () { map.scrollWheelZoom.disable(); });
    if (typeof WORLD_LAND !== "undefined") {
      map.createPane("basicPane").style.zIndex = 150;
      L.geoJSON(WORLD_LAND, {
        pane: "basicPane", renderer: L.canvas({ padding: 0.5, pane: "basicPane" }), interactive: false,
        style: { fillColor: "#0C0C12", fillOpacity: 1, color: "#EAE6E0", opacity: 0.35, weight: 0.8 },
        attribution: 'Land outline: <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
      }).addTo(map);
    } else { $("map-wrap").classList.add("is-offline"); }
    setupMapStyleToggle();
    var bounds = [];
    TRACKS.forEach(function (t) {
      var m = L.circleMarker([t.lat, t.lng], { radius: 8, weight: 2, color: "#0C0C12", fillColor: "#F64C1C", fillOpacity: 1 });
      m.bindTooltip(t.name, { className: "track-tip", direction: "top", offset: [0, -8] });
      m.bindPopup(popupHtml(t), narrow
        ? { maxWidth: Math.min(300, $("track-map").clientWidth - 130), autoPanPaddingTopLeft: [56, 16], autoPanPaddingBottomRight: [16, 16] }
        : { maxWidth: 300 });
      m.on("mouseover", function () { m.setStyle({ fillColor: "#F4C537", radius: 10 }); highlightRow(t.id, true); });
      m.on("mouseout", function () { m.setStyle({ fillColor: "#F64C1C", radius: 8 }); highlightRow(t.id, false); });
      m.addTo(map); markers[t.id] = m; bounds.push([t.lat, t.lng]);
    });
    map.fitBounds(bounds, { padding: [30, 30] });
    applyFilter(currentFilter);
  }

  /* Basic (built-in outline, works offline and from file://) or Detailed (OpenStreetMap tiles, needs a web address). */
  var BASIC_MAX_ZOOM = 8, osmTiles = null, detailedAvailable = true, toggleEl = null;
  function setupMapStyleToggle() {
    map.setMaxZoom(BASIC_MAX_ZOOM);
    var Toggle = L.Control.extend({
      options: { position: "bottomleft" },
      onAdd: function () {
        var div = L.DomUtil.create("div", "map-style-toggle");
        div.setAttribute("role", "group"); div.setAttribute("aria-label", "Map style");
        div.innerHTML = '<button type="button" data-style="basic" aria-pressed="true">Basic</button><button type="button" data-style="detailed" aria-pressed="false">Detailed</button>';
        L.DomEvent.disableClickPropagation(div); L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.on(div, "click", function (e) { var b = e.target.closest("button[data-style]"); if (b && !b.disabled) setMapStyle(b.getAttribute("data-style")); });
        return div;
      }
    });
    map.addControl(new Toggle());
    toggleEl = $("map-wrap").querySelector(".map-style-toggle");
    if (location.protocol !== "http:" && location.protocol !== "https:") { disableDetailed("The Detailed map needs the site to be opened from a web address, such as once it is hosted online."); return; }
    if (navigator.onLine === false) { disableDetailed("The Detailed map needs an internet connection."); return; }
    var probe = new Image();
    probe.onerror = function () { disableDetailed("The Detailed map could not be loaded."); };
    probe.src = "https://tile.openstreetmap.org/2/2/1.png";
  }
  function setMapStyle(style) {
    if (style === "detailed" && !detailedAvailable) style = "basic";
    if (style === "detailed") {
      if (!osmTiles) {
        osmTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
        var loaded = 0, failed = 0;
        osmTiles.on("tileload", function () { loaded++; });
        osmTiles.on("tileerror", function () { failed++; if (failed >= 4 && !loaded) disableDetailed("The Detailed map could not be loaded."); });
      }
      map.setMaxZoom(18);
      if (!map.hasLayer(osmTiles)) osmTiles.addTo(map);
    } else {
      if (osmTiles && map.hasLayer(osmTiles)) map.removeLayer(osmTiles);
      if (map.getZoom() > BASIC_MAX_ZOOM) map.setZoom(BASIC_MAX_ZOOM);
      map.setMaxZoom(BASIC_MAX_ZOOM);
    }
    if (toggleEl) U.all("button", toggleEl).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-style") === style)); });
  }
  function disableDetailed(reason) {
    detailedAvailable = false; setMapStyle("basic");
    if (!toggleEl) return;
    var b = toggleEl.querySelector('[data-style="detailed"]');
    b.disabled = true; b.title = reason; b.setAttribute("aria-label", "Detailed (unavailable). " + reason);
  }
  function highlightRow(id, on) { var li = document.querySelector('#track-list li[data-id="' + id + '"]'); if (li) li.classList.toggle("is-active", on); }
  function applyFilter(key) {
    currentFilter = key;
    U.all("#track-filter button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === key)); });
    var shown = 0;
    TRACKS.forEach(function (t) {
      var visible = key === "all" || t.series.indexOf(key) !== -1;
      if (visible) shown++;
      var li = document.querySelector('#track-list li[data-id="' + t.id + '"]');
      if (li) li.hidden = !visible;
      if (map && markers[t.id]) {
        if (visible && !map.hasLayer(markers[t.id])) markers[t.id].addTo(map);
        if (!visible && map.hasLayer(markers[t.id])) map.removeLayer(markers[t.id]);
      }
    });
    $("track-list-title").textContent = (key === "all" ? "All tracks" : seriesLabel(key) + " tracks") + " (" + shown + ")";
  }
  function locate(id) {
    var t = BY.track[id];
    if (!t || !map) { location.hash = "#track-" + id; return; }
    if (currentFilter !== "all" && t.series.indexOf(currentFilter) === -1) applyFilter("all");
    map.setView([t.lat, t.lng], 7);
    markers[id].openPopup();
    $("map-top").scrollIntoView({ block: "start" });
  }

  /* ---------- Legacy: series history and famous races ---------- */
  function renderLegacy() {
    $("series-list").innerHTML = LEGACY_SERIES.map(function (s, i) {
      var racesIn = RACES.filter(function (r) { return r.series.indexOf(s.key) !== -1; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; }).map(function (r) { return ["race", r.id]; });
      var live = U.series(s.key);
      return '<article class="entry" id="series-' + s.key + '" tabindex="-1">' +
        '<div class="entry-top"><div>' + tagsHtml([s.key]) + '<h3 class="entry-title">' + esc(s.name) + "</h3>" +
        (s.summary ? '<p class="entry-sub">' + esc(s.summary) + "</p>" : "") + "</div>" + entryNum(i) + "</div>" +
        factsHtml(s.facts || []) +
        '<div class="entry-body no-media"><div><div class="prose">' + paragraphs(s.body) + "</div>" +
        relatedHtml(s, racesIn, "series") + sourcesHtml(s.sources) +
        (live ? '<p><a class="text-link" href="series.html?id=' + s.key + '">' + esc(live.short) + " schedule, results and news</a></p>" : "") +
        "</div></div></article>";
    }).join("");
    var sorted = RACES.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    $("race-index").innerHTML = sorted.map(function (r, i) {
      return '<li><a href="#race-' + r.id + '"><b>' + U.pad(i + 1) + "</b><span><strong>" + esc(r.name) + "</strong><small>" + esc(r.dateLabel) + "</small></span></a></li>";
    }).join("");
    $("races-list").innerHTML = sorted.map(function (r, i) {
      var t = BY.track[r.track];
      var facts = [{ label: "Date", value: r.dateLabel },
        { label: "Track", html: t ? '<a href="' + href("track", t.id) + '">' + esc(t.shortName || t.name) + "</a>" : esc(r.track) }].concat(r.facts || []);
      return '<article class="entry" id="race-' + r.id + '" tabindex="-1">' +
        '<div class="entry-top"><div>' + tagsHtml(r.series) + '<h3 class="entry-title">' + esc(r.name) + "</h3></div>" + entryNum(i) + "</div>" +
        factsHtml(facts) + '<div class="entry-body no-media"><div><div class="prose">' + paragraphs(r.body) + "</div>" +
        relatedHtml(r, (t ? [["track", t.id]] : []).concat(seriesExtras(r.series)), "race") + sourcesHtml(r.sources) + "</div></div></article>";
    }).join("");
    var counts = { series: LEGACY_SERIES.length, races: RACES.length };
    U.all("[data-legacy-count]").forEach(function (el) { el.textContent = counts[el.getAttribute("data-legacy-count")]; });
  }

  /* ---------- Sources & credits ---------- */
  function renderSources() {
    function collect(groups) {
      var m = Object.create(null), order = [];
      groups.forEach(function (g) {
        g.list.forEach(function (item) {
          (g.sources ? g.sources(item) : item.sources || []).forEach(function (s) {
            if (!s || !s.url) return;
            if (!m[s.url]) { m[s.url] = { title: s.title, url: s.url, used: [] }; order.push(s.url); }
            var label = g.label(item);
            if (m[s.url].used.indexOf(label) === -1) m[s.url].used.push(label);
          });
        });
      });
      return order.map(function (u) { return m[u]; }).sort(function (a, b) { return a.title.localeCompare(b.title); });
    }
    function list(items) {
      return "<ol>" + items.map(function (s) {
        return '<li><a href="' + esc(s.url) + '" rel="noopener" target="_blank">' + esc(s.title) + '</a> <span class="used-in">Used in: ' + esc(s.used.slice(0, 8).join(", ")) + (s.used.length > 8 ? " and " + (s.used.length - 8) + " more" : "") + "</span></li>";
      }).join("") + "</ol>";
    }
    var news = collect([{ list: PP.news || [], label: function (n) { return n.title; }, sources: function (n) { return n.source ? [{ title: n.source.site, url: n.source.url }] : []; } }]);
    var tracks = collect([{ list: TRACKS, label: function (t) { return t.shortName || t.name; }, sources: function (t) {
      var d = t.detail || {}, s = (t.sources || []).slice();
      if (d.source) s.push({ title: d.source.title, url: d.source.url });
      if (d.turnsSource) s.push({ title: d.turnsSource.title, url: d.turnsSource.url });
      return s;
    } }]);
    var races = collect([{ list: RACES, label: function (r) { return r.name; } }]);
    var learn = collect([{ list: TERMS, label: function (t) { return t.name; } }, { list: TACTICS, label: function (t) { return t.name; } }, { list: HISTORY, label: function (s) { return s.name; } }]);
    var live = (PP.series || []).map(function (s) {
      return '<li><a href="' + esc(s.siteUrl) + '" rel="noopener" target="_blank">' + esc(s.site) + '</a> <span class="used-in">' + esc(s.name) + ": schedules, results, line-ups and headlines" + (s.sourceNote ? ". " + esc(s.sourceNote) : "") + "</span></li>";
    }).join("");
    var photos = Object.keys(PP.photos || {}).sort().map(function (id) {
      var p = PP.photos[id];
      return "<li>" + U.creditLine(p, "x").innerHTML + (p.changes ? ' <span class="used-in">(' + esc(p.changes) + ")</span>" : "") + "</li>";
    }).join("");
    $("credits").innerHTML =
      "<section><h2>Live data</h2><ul>" + live + "</ul></section>" +
      "<section><h2>News stories</h2>" + list(news) + "</section>" +
      "<section><h2>Racetracks</h2>" + list(tracks) + "</section>" +
      "<section><h2>Historical races</h2>" + list(races) + "</section>" +
      "<section><h2>Terms, tactics and series</h2>" + list(learn) + "</section>" +
      "<section><h2>Photos and track maps</h2><ul>" + photos + "</ul></section>" +
      "<section><h2>Video, map, fonts and code</h2><ul>" +
      '<li>Home video: "Exciting Race Circuit with City Skyline Backdrop" by Abhilash Venkat, via <a href="https://www.pexels.com/video/exciting-race-circuit-with-city-skyline-backdrop-38076413/" rel="noopener" target="_blank">Pexels</a> (Pexels License).</li>' +
      '<li>Map data &copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener" target="_blank">OpenStreetMap</a> contributors (Open Database License).</li>' +
      '<li>Built-in world outline: <a href="https://www.naturalearthdata.com/" rel="noopener" target="_blank">Natural Earth</a> 1:50m land (public domain), via world-atlas 2.0.2, in vendor/world.</li>' +
      '<li>Map library: <a href="https://leafletjs.com" rel="noopener" target="_blank">Leaflet</a> 1.9.4 (BSD 2-Clause License), in vendor/leaflet.</li>' +
      '<li>Fonts: <a href="https://fonts.google.com/specimen/Oswald" rel="noopener" target="_blank">Oswald</a> and <a href="https://fonts.google.com/specimen/Inter" rel="noopener" target="_blank">Inter</a> (SIL Open Font License), stored in assets/fonts.</li>' +
      '</ul><p class="used-in" style="margin-top:24px">Guide sources were checked on ' + esc((PP.sources || {}).SOURCES_CHECKED || "") + ".</p></section>";
  }

  /* ---------- #anchor arrival: scroll, focus and flash the entry (Ben) ---------- */
  var beforeJump = null;
  function jumpToHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    var target = id && document.getElementById(id);
    if (!target) return;
    if (beforeJump) beforeJump(target);
    requestAnimationFrame(function () {
      target.scrollIntoView({ block: "start" });
      if (target.hasAttribute("tabindex")) {
        target.focus({ preventScroll: true });
        target.classList.remove("entry-flash"); void target.offsetWidth; target.classList.add("entry-flash");
      }
    });
  }
  function start(render) {
    validate();
    render();
    window.addEventListener("hashchange", jumpToHash);
    if (location.hash) window.addEventListener("load", jumpToHash);
  }

  PP.guide = {
    renderTerms: function () { start(renderTerms); },
    renderTactics: function () { start(renderTactics); },
    renderTracks: function () { start(renderTracks); },
    renderLegacy: function () { start(renderLegacy); },
    renderSources: function () { start(renderSources); },
    counts: function () { return { terms: TERMS.length, tactics: TACTICS.length, tracks: TRACKS.length, races: RACES.length, series: LEGACY_SERIES.length }; },
    href: href
  };
})();
