/* Pace & Publish: helpers shared by every page. No network calls, no libraries. */
(function () {
  "use strict";

  var SERIES = {
    f1: { label: "F1", long: "Formula 1", site: "formula1.com" },
    motogp: { label: "MotoGP", long: "MotoGP", site: "motogp.com" },
    nascar: { label: "NASCAR", long: "NASCAR", site: "nascar.com" },
    wec: { label: "WEC", long: "FIA World Endurance Championship", site: "fiawec.com" }
  };
  var SERIES_ORDER = ["f1", "motogp", "nascar", "wec"];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function tag(seriesId) {
    var s = SERIES[seriesId];
    return '<span class="tag" data-series="' + esc(seriesId) + '">' + esc(s ? s.label : seriesId) + "</span>";
  }

  function tags(list) {
    return '<span class="tags">' + [].concat(list).map(tag).join("") + "</span>";
  }

  function browserTimeZone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) { return "UTC"; }
  }

  function fmt(date, tz, opts) {
    var o = { timeZone: tz };
    for (var k in opts) o[k] = opts[k];
    return new Intl.DateTimeFormat("en-US", o).format(date);
  }

  /* Short time zone name, for example "EST" or "GMT+1", for the chosen zone at that date. */
  function tzShort(date, tz) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(date);
      for (var i = 0; i < parts.length; i++) if (parts[i].type === "timeZoneName") return parts[i].value;
    } catch (e) {}
    return tz;
  }

  /* "YYYY-MM-DD" for a moment, as seen in a time zone */
  function ymd(date, tz) {
    var p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
    return p.slice(0, 10);
  }

  function storeGet(key) {
    try { var v = window.localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }

  /* Back-to-top button (nice to have): appears after scrolling down a long page */
  function backToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.id = "to-top";
    btn.textContent = "↑ Top";
    btn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(btn);
    function onScroll() { btn.classList.toggle("is-visible", window.scrollY > 600); }
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var main = document.getElementById("main");
      if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
    });
    onScroll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", backToTop); else backToTop();

  /* Carousel: turns a container's children into swipeable slides with prev/next arrows and a counter.
     Calling it again on the same container (after a re-render) just refreshes it and returns to slide 1. */
  function carousel(track, label) {
    if (!track) return null;
    var wrap = track.parentNode && track.parentNode.classList && track.parentNode.classList.contains("carousel") ? track.parentNode : null;
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "carousel";
      wrap.setAttribute("role", "region");
      wrap.setAttribute("aria-roledescription", "carousel");
      wrap.setAttribute("aria-label", label || "Carousel");
      track.parentNode.insertBefore(wrap, track);
      wrap.appendChild(track);
      track.classList.add("carousel-track");
      track.setAttribute("tabindex", "0");
      var controls = document.createElement("div");
      controls.className = "carousel-controls";
      controls.innerHTML = '<span class="carousel-count" aria-live="polite"></span>' +
        '<button type="button" class="carousel-btn" data-dir="-1" aria-label="Previous">←</button>' +
        '<button type="button" class="carousel-btn" data-dir="1" aria-label="Next">→</button>';
      wrap.appendChild(controls);
      controls.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest(".carousel-btn") : null;
        if (!b) return;
        var dir = +b.getAttribute("data-dir");
        var first = track.children[0];
        var step = first ? first.getBoundingClientRect().width + gap() : track.clientWidth;
        var from = track.scrollLeft;
        var target = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, from + dir * step * Math.max(1, perView())));
        track.scrollTo({ left: target, behavior: reduceMotion() ? "auto" : "smooth" });
        /* Fallback: some embedded browsers never run smooth scrolling; if nothing moved, jump there */
        setTimeout(function () {
          if (Math.abs(track.scrollLeft - from) < 2 && Math.abs(target - from) >= 2) {
            track.style.scrollBehavior = "auto"; track.scrollLeft = target; track.style.scrollBehavior = ""; update();
          }
        }, 500);
      });
      var t = null;
      track.addEventListener("scroll", function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
      window.addEventListener("resize", update);
    }
    function gap() { return parseFloat(getComputedStyle(track).columnGap) || 0; }
    function perView() {
      var first = track.children[0];
      if (!first) return 1;
      return Math.max(1, Math.round((track.clientWidth + gap()) / (first.getBoundingClientRect().width + gap())));
    }
    function reduceMotion() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    function update() {
      var n = track.children.length;
      var first = track.children[0];
      var count = wrap.querySelector(".carousel-count");
      var prev = wrap.querySelector('[data-dir="-1"]'), next = wrap.querySelector('[data-dir="1"]');
      wrap.classList.toggle("is-empty", !n);
      if (!n || !first) { count.textContent = ""; return; }
      var step = first.getBoundingClientRect().width + gap();
      var idx = Math.round(track.scrollLeft / step);
      var pv = perView();
      var last = Math.min(n, idx + pv);
      count.textContent = (pv > 1 && last > idx + 1 ? (idx + 1) + "–" + last : (idx + 1)) + " of " + n;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      wrap.classList.toggle("no-scroll", prev.disabled && next.disabled);
    }
    track.scrollLeft = 0;
    update();
    return {
      update: update,
      goTo: function (el) {
        if (!el) return;
        track.style.scrollBehavior = "auto";   /* jump straight there, no slide animation */
        track.scrollLeft = el.offsetLeft;      /* the track is position: relative, so offsetLeft is inside it */
        track.style.scrollBehavior = "";
        update();
      }
    };
  }

  window.PP = {
    carousel: carousel,
    SERIES: SERIES, SERIES_ORDER: SERIES_ORDER, esc: esc, tag: tag, tags: tags,
    browserTimeZone: browserTimeZone, fmt: fmt, tzShort: tzShort, ymd: ymd,
    storeGet: storeGet, storeSet: storeSet
  };
})();
