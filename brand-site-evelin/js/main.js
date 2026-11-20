/*
 * Pace & Publish — shared site script
 * Navigation menu, shared card rendering, and the Home, News and Calendar
 * pages. Reads all content from window.PP_CONTENT (data/content.js).
 * No network requests, no modules, no libraries.
 */
(function () {
  "use strict";

  var DATA = window.PP_CONTENT || { series: [], articles: [], events: [], instagram: null };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- Helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val === null || val === undefined || val === false) return;
        if (key === "className") node.className = val;
        else if (key === "text") node.textContent = val;
        else node.setAttribute(key, val === true ? "" : val);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function parseISO(iso) {
    var p = String(iso).split("-");
    return { y: +p[0], m: +p[1] - 1, d: +p[2] };
  }

  function formatDate(iso, short) {
    var p = parseISO(iso);
    return (short ? MONTHS_SHORT : MONTHS)[p.m] + " " + p.d + ", " + p.y;
  }

  function formatRange(start, end) {
    if (!end || end === start) return formatDate(start, true);
    var a = parseISO(start), b = parseISO(end);
    if (a.y === b.y && a.m === b.m) return MONTHS_SHORT[a.m] + " " + a.d + "–" + b.d + ", " + a.y;
    if (a.y === b.y) return MONTHS_SHORT[a.m] + " " + a.d + " – " + MONTHS_SHORT[b.m] + " " + b.d + ", " + a.y;
    return formatDate(start, true) + " – " + formatDate(end, true);
  }

  function todayISO() {
    var t = new Date();
    var mm = String(t.getMonth() + 1).padStart(2, "0");
    var dd = String(t.getDate()).padStart(2, "0");
    return t.getFullYear() + "-" + mm + "-" + dd;
  }

  /* "F1", "F1 and WEC", "F1, MotoGP and WEC" */
  function joinNames(names) {
    if (names.length <= 1) return names.join("");
    return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
  }

  function seriesOrder(id) {
    for (var i = 0; i < DATA.series.length; i++) if (DATA.series[i].id === id) return i;
    return 99;
  }

  function seriesById(id) {
    for (var i = 0; i < DATA.series.length; i++) if (DATA.series[i].id === id) return DATA.series[i];
    return { id: id, slug: String(id).toLowerCase(), name: id, longName: id };
  }

  /* Newest first; ties keep the fixed series order (F1, MotoGP, NASCAR, WEC). */
  function sortNewest(list) {
    return list.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return seriesOrder(a.series) - seriesOrder(b.series);
    });
  }

  function articlesFor(seriesId) {
    return DATA.articles.filter(function (a) { return a.series === seriesId; });
  }

  /* ---------- Shared pieces ---------- */
  function mediaPlaceholder(seriesName) {
    return el("div", { className: "media-placeholder", role: "img", "aria-label": "Image placeholder: " + seriesName + " image needed" }, [
      el("strong", { text: "Pace & Publish" }),
      el("span", { text: "Image needed" })
    ]);
  }

  /* Image composition used by every card: a blurred, darkened enlargement of
     the team graphic as a backdrop, with the full graphic shown sharp on top.
     The graphic is never cropped, so its own text stays intact. */
  function composeImage(className, src, alt, placeholderName) {
    var wrap = el("div", { className: className });
    if (!src) {
      wrap.appendChild(mediaPlaceholder(placeholderName));
      return wrap;
    }
    var bg = el("img", { className: "media-bg", src: src, alt: "", "aria-hidden": "true", loading: "lazy", width: "1080", height: "1350" });
    var fg = el("img", { className: "media-fg", src: src, alt: alt || "", loading: "lazy", width: "1080", height: "1350" });
    fg.addEventListener("error", function () {
      wrap.innerHTML = "";
      wrap.appendChild(mediaPlaceholder(placeholderName));
    });
    wrap.appendChild(bg);
    wrap.appendChild(fg);
    return wrap;
  }

  /* v7: licensed photography. Returns null when the id is unknown. */
  function photoById(id) {
    return id && DATA.photos && DATA.photos[id] ? DATA.photos[id] : null;
  }

  function photoCredit(ph, compact) {
    return el("span", { className: "photo-credit-line" + (compact ? " is-compact" : "") }, [
      (compact ? "" : ph.caption + " · ") + "Photo: " + ph.author + " · ",
      el("a", { href: ph.licenseUrl, target: "_blank", rel: "noopener noreferrer license", text: ph.license }),
      el("span", { className: "visually-hidden", text: " (opens in a new tab)" })
    ]);
  }

  function photoMedia(className, ph, compact) {
    var wrap = el("div", { className: className + " has-photo" });
    var img = el("img", { className: "media-photo", src: ph.src, alt: ph.alt, loading: "lazy", decoding: "async" });
    img.addEventListener("error", function () { img.remove(); });
    wrap.appendChild(img);
    wrap.appendChild(photoCredit(ph, compact));
    return wrap;
  }

  function createMedia(article) {
    var ph = photoById(article.photo);
    if (ph) return photoMedia("card-media", ph);
    return composeImage("card-media", article.image, article.imageAlt, seriesById(article.series).name);
  }

  /* One card design, used on Home, News and Dashboard. */
  function createCard(article) {
    var series = seriesById(article.series);
    var moreId = "more-" + article.id + "-" + Math.random().toString(36).slice(2, 7);

    var children = [
      el("p", { className: "card-kicker" }, [
        el("span", { className: "tag", text: series.name }),
        el("time", { datetime: article.date, text: formatDate(article.date, true) })
      ]),
      el("h3", { className: "card-title", text: article.title }),
      el("p", { className: "card-summary", text: article.summary }),
      el("p", { className: "card-meta", text: article.source })
    ];

    if (article.body || article.sourceUrl) {
      var moreChildren = [];
      if (article.body) moreChildren.push(el("p", { text: article.body }));
      if (article.sourceUrl) {
        moreChildren.push(el("p", null, [
          "Source: ",
          el("a", { href: article.sourceUrl, target: "_blank", rel: "noopener noreferrer", text: hostOf(article.sourceUrl) }),
          el("span", { className: "visually-hidden", text: " (opens in a new tab)" })
        ]));
      }
      var more = el("div", { className: "card-more", id: moreId, hidden: true }, moreChildren);
      var btn = el("button", { type: "button", className: "card-toggle", "aria-expanded": "false", "aria-controls": moreId }, [
        el("span", { text: "Read more" }),
        el("span", { className: "visually-hidden", text: ": " + article.title })
      ]);
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        btn.firstChild.textContent = open ? "Read more" : "Show less";
        more.hidden = open;
      });
      children.push(more);
      children.push(el("div", { className: "card-actions" }, [btn]));
    }

    return el("article", { className: "card" + (photoById(article.photo) ? " card--photo" : ""), "data-series": article.series, "data-id": article.id }, [
      createMedia(article),
      el("div", { className: "card-body" }, children)
    ]);
  }

  function hostOf(url) {
    var m = String(url).match(/^https?:\/\/(?:www\.)?([^/]+)/i);
    return m ? m[1] : url;
  }

  function createGrid(articles) {
    var grid = el("div", { className: "card-grid" });
    articles.forEach(function (a) { grid.appendChild(createCard(a)); });
    return grid;
  }

  function emptyState(label, message) {
    return el("div", { className: "empty-state", role: "note" }, [
      label ? el("span", { className: "label", text: label }) : null,
      el("p", { text: message })
    ]);
  }

  /* Labeled placeholder for a series with no verified content (PRD 5.2). */
  function seriesEmptyState(series) {
    return emptyState(
      "Content needed: " + series.name + " story",
      "No " + series.name + " stories are available yet. Pace & Publish only publishes news it can confirm on the official " +
      series.name + " website, and the team has not verified a " + series.name + " story so far."
    );
  }

  function eventItem(ev, isPast) {
    var series = seriesById(ev.series);
    var circuit = ev.circuit
      ? el("span", { text: ev.circuit })
      : el("span", { className: "missing", text: "Circuit: content needed" });
    return el("li", { className: "event" + (isPast ? " is-past" : ""), "data-series": ev.series }, [
      el("div", { className: "event-date" }, [
        el("time", { datetime: ev.date, text: formatRange(ev.date, ev.dateEnd) })
      ]),
      el("div", null, [
        el("p", { className: "event-name" }, [el("span", { className: "tag", text: series.name }), " ", ev.name]),
        el("p", { className: "event-meta" }, [
          circuit, " · " + ev.location + " · Source: ",
          el("a", { href: ev.sourceUrl, target: "_blank", rel: "noopener noreferrer", text: ev.source }),
          el("span", { className: "visually-hidden", text: " (opens in a new tab)" })
        ])
      ]),
      el("span", { className: "status", text: isPast ? "Past" : "Upcoming" })
    ]);
  }

  function isPastEvent(ev, today) {
    return (ev.dateEnd || ev.date) < today;
  }

  function sortEvents(list) {
    return list.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return seriesOrder(a.series) - seriesOrder(b.series);
    });
  }

  /* ---------- Navigation (F4) ---------- */
  /* v7: transparent header over the home hero turns solid on scroll. */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header--overlay");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    });
  }

  function fillAsOf() {
    var nodes = document.querySelectorAll("[data-as-of]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = DATA.asOf ? formatDate(DATA.asOf) : "";
    }
  }

  /* ---------- Home (F1, N2) ---------- */
  function renderHome() {
    var featuredWrap = document.getElementById("featured-stories");
    if (featuredWrap) {
      /* Lead story = the most recent featured story by date (a neutral rule,
         PRD 11.5 V3); ties fall back to the fixed series order. */
      var featured = sortNewest(DATA.articles.filter(function (a) { return a.featured === true; })).slice(0, 6);
      featuredWrap.innerHTML = "";
      if (!featured.length) {
        featuredWrap.appendChild(emptyState("Content needed: featured stories", "Mark 3 to 6 articles as featured in data/content.js."));
      } else {
        var grid = el("div", { className: "feature-grid" });
        var lead = createCard(featured[0]);
        lead.classList.add("card--cover", "card--lead");
        grid.appendChild(lead);
        if (featured.length > 1) {
          var side = el("div", { className: "feature-side" });
          featured.slice(1).forEach(function (a) {
            var c = createCard(a);
            c.classList.add("card--cover", "card--side");
            side.appendChild(c);
          });
          grid.appendChild(side);
        }
        featuredWrap.appendChild(grid);
      }
    }

    /* Hero ticker: the three newest verified stories, numbered (v5). */
    var ticker = document.getElementById("hero-ticker");
    if (ticker) {
      ticker.innerHTML = "";
      sortNewest(DATA.articles).slice(0, 3).forEach(function (a, i) {
        var s = seriesById(a.series);
        ticker.appendChild(el("li", { className: "ticker-item" }, [
          el("a", { href: "news.html#" + s.slug }, [
            el("span", { className: "ticker-num", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }),
            el("span", { className: "ticker-meta", text: s.name + " · " + formatDate(a.date, true) }),
            el("span", { className: "ticker-title", text: a.title })
          ])
        ]));
      });
    }

    var moreWrap = document.getElementById("more-stories");
    if (moreWrap) {
      /* v6: asymmetric layout — one wide story with a large image, then a
         numbered headline list (different sizes, no repeated card shapes). */
      var more = sortNewest(DATA.articles.filter(function (a) { return a.featured !== true; })).slice(0, 5);
      moreWrap.innerHTML = "";
      if (more.length) {
        var layout = el("div", { className: "more-layout" });
        var wide = createCard(more[0]);
        wide.classList.add("card--wide");
        layout.appendChild(wide);
        if (more.length > 1) {
          var list = el("ol", { className: "headline-list" });
          more.slice(1).forEach(function (a, i) {
            var s = seriesById(a.series);
            list.appendChild(el("li", null, [
              el("a", { href: "news.html#" + s.slug }, [
                el("span", { className: "hl-num", "aria-hidden": "true", text: String(i + 2).padStart(2, "0") }),
                el("span", { className: "hl-body" }, [
                  el("span", { className: "card-kicker" }, [
                    el("span", { className: "tag", text: s.name }),
                    el("time", { datetime: a.date, text: formatDate(a.date, true) })
                  ]),
                  el("span", { className: "hl-title", text: a.title }),
                  el("span", { className: "hl-source", text: a.source })
                ])
              ])
            ]));
          });
          layout.appendChild(list);
        }
        moreWrap.appendChild(layout);
      }
    }

    var strip = document.getElementById("series-strip");
    if (strip) {
      strip.innerHTML = "";
      DATA.series.forEach(function (s, i) {
        var n = articlesFor(s.id).length;
        strip.appendChild(el("li", null, [
          el("a", { className: "series-card" + (n === 0 ? " is-pending" : ""), href: "news.html#" + s.slug }, [
            photoById(s.photo) ? photoMedia("series-media", photoById(s.photo), true) : composeImage("series-media", s.image, s.imageAlt, s.name),
            el("span", { className: "series-body" }, [
              el("span", { className: "series-index", text: "Series " + String(i + 1).padStart(2, "0") }),
              el("span", { className: "series-card-name", text: s.label || s.name }),
              el("span", { className: "series-card-long", text: s.description || s.longName }),
              el("span", { className: "series-foot" }, [
                el("span", { className: "series-card-count", text: n === 0 ? "Coming soon" : n + (n === 1 ? " story" : " stories") }),
                el("span", { className: "series-arrow", "aria-hidden": "true", text: "→" })
              ])
            ])
          ])
        ]));
      });
    }

    var homeEvents = document.getElementById("home-events");
    if (homeEvents) {
      var today = todayISO();
      var next = sortEvents((DATA.events || []).filter(function (e) { return !isPastEvent(e, today); })).slice(0, 4);
      homeEvents.innerHTML = "";
      if (next.length) {
        var list = el("ol", { className: "event-list" });
        next.forEach(function (e) { list.appendChild(eventItem(e, false)); });
        homeEvents.appendChild(list);
      } else {
        homeEvents.appendChild(emptyState("Content needed: upcoming events", "No upcoming events are in the repository yet."));
      }
    }

    var ig = document.getElementById("instagram-grid");
    if (ig && DATA.instagram) {
      ig.innerHTML = "";
      DATA.instagram.posts.slice(0, 6).forEach(function (p) {
        ig.appendChild(el("li", null, [
          el("figure", { className: "ig-post" }, [
            el("img", { src: p.image, alt: p.imageAlt, loading: "lazy", width: "1080", height: "1350" }),
            el("figcaption", { text: p.caption })
          ])
        ]));
      });
    }
  }

  /* ---------- News (F2) ---------- */
  function renderNews() {
    var tabs = document.getElementById("series-tabs-list");
    var groups = document.getElementById("news-groups");
    if (!tabs || !groups) return;
    tabs.innerHTML = "";
    groups.innerHTML = "";

    DATA.series.forEach(function (s) {
      var list = sortNewest(articlesFor(s.id));

      tabs.appendChild(el("li", null, [
        el("a", { href: "#" + s.slug, "data-slug": s.slug }, [
          s.name,
          el("span", { className: "count", "aria-label": list.length + (list.length === 1 ? " story" : " stories"), text: String(list.length) })
        ])
      ]));

      var headingId = s.slug + "-heading";
      var section = el("section", { className: "news-group", id: s.slug, "aria-labelledby": headingId }, [
        el("h2", { id: headingId }, [
          el("span", { text: s.name }),
          s.longName !== s.name ? el("span", { className: "long", text: s.longName }) : null
        ]),
        list.length ? createGrid(list) : seriesEmptyState(s)
      ]);
      groups.appendChild(section);
    });

    highlightTab();
    window.addEventListener("hashchange", highlightTab);

    /* Sections are built after load, so the browser's own jump to
       news.html#wec (from the Home series cards) has nothing to land on.
       Jump to the requested section once it exists. */
    var slug = (location.hash || "").replace("#", "");
    var target = slug && document.getElementById(slug);
    if (target) {
      target.scrollIntoView({ block: "start", behavior: "instant" });
      /* Again after layout settles (fonts, images), as a backup. */
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }
  }

  function highlightTab() {
    var slug = (location.hash || "").replace("#", "");
    var links = document.querySelectorAll("#series-tabs-list a");
    for (var i = 0; i < links.length; i++) {
      var active = links[i].getAttribute("data-slug") === slug;
      links[i].classList.toggle("is-active", active);
      if (active) links[i].setAttribute("aria-current", "location");
      else links[i].removeAttribute("aria-current");
    }
  }

  /* ---------- Calendar (N1) ---------- */
  function renderCalendar() {
    var wrap = document.getElementById("calendar-list");
    if (!wrap) return;
    var today = todayISO();
    var events = sortEvents(DATA.events || []);
    var past = events.filter(function (e) { return isPastEvent(e, today); });
    var upcoming = events.filter(function (e) { return !isPastEvent(e, today); });

    wrap.innerHTML = "";
    var pastList = el("ol", { className: "event-list", "aria-label": "Past events" });
    past.forEach(function (e) { pastList.appendChild(eventItem(e, true)); });
    var upList = el("ol", { className: "event-list", "aria-label": "Upcoming events" });
    upcoming.forEach(function (e) { upList.appendChild(eventItem(e, false)); });

    if (past.length) wrap.appendChild(el("h2", { className: "visually-hidden", text: "Past events" }));
    if (past.length) wrap.appendChild(pastList);
    wrap.appendChild(el("p", { className: "today-divider", role: "separator" }, ["Today · " + formatDate(today, true)]));
    wrap.appendChild(el("h2", { className: "visually-hidden", text: "Upcoming events" }));
    wrap.appendChild(upcoming.length ? upList : emptyState(null, "No upcoming events are in the repository yet."));

    var nascarNote = document.getElementById("calendar-missing");
    if (nascarNote) {
      var missing = DATA.series.filter(function (s) {
        return !events.some(function (e) { return e.series === s.id; });
      });
      nascarNote.innerHTML = "";
      missing.forEach(function (s) {
        nascarNote.appendChild(emptyState(
          "Content needed: " + s.name + " events",
          "No " + s.name + " event has been verified on the official " + s.name + " website yet, so none is listed."
        ));
      });
    }
  }

  /* ---------- Public API (used by dashboard.js) ---------- */
  window.PP = {
    data: DATA,
    el: el,
    formatDate: formatDate,
    formatRange: formatRange,
    todayISO: todayISO,
    joinNames: joinNames,
    seriesById: seriesById,
    seriesOrder: seriesOrder,
    sortNewest: sortNewest,
    sortEvents: sortEvents,
    isPastEvent: isPastEvent,
    createCard: createCard,
    photoById: photoById,
    photoMedia: photoMedia,
    createGrid: createGrid,
    emptyState: emptyState,
    eventItem: eventItem,
    renderHome: renderHome,
    renderNews: renderNews,
    renderCalendar: renderCalendar
  };

  function init() {
    initNav();
    initHeaderScroll();
    fillAsOf();
    var page = document.body.getAttribute("data-page");
    if (page === "home") renderHome();
    if (page === "news") renderNews();
    if (page === "calendar") renderCalendar();
  }

  /* v6: subtle scroll reveal. Hidden state is added by script only, so
     content is always visible without JavaScript or with reduced motion. */
  function initReveal() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(
      "main .section-head, .feature-grid, .more-layout, .series-strip > li, .standards-statement, .standards-cols > li, .cx, .event-list > li, .about-grid, .ig-grid > li, .news-group > h2, .page-intro .container"
    );
    if (!targets.length) return;
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    var fold = window.innerHeight || 800;
    var hidden = [];
    Array.prototype.forEach.call(targets, function (node, i) {
      /* Never hide anything on the first screen. */
      if (node.getBoundingClientRect().top < fold) return;
      node.classList.add("reveal");
      node.style.transitionDelay = (i % 4) * 60 + "ms";
      hidden.push(node);
      io.observe(node);
    });
    /* Failsafe: nothing stays hidden if the observer never fires. */
    setTimeout(function () {
      hidden.forEach(function (n) { n.classList.add("is-in"); });
    }, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  /* Run after every page script has rendered its content. */
  window.addEventListener("load", initReveal);
})();
