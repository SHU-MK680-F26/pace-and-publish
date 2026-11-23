/* =====================================================================
   Pace & Publish layout: header, nav and footer for every page.
   ---------------------------------------------------------------------
   Every page has:
     <body data-page="news">          (the id of its NAV entry below)
     <div id="site-header"></div> <main id="main">…</main> <div id="site-footer"></div>
   To add a page: create the .html file from docs/page-template.html and add
   ONE line to NAV (top level or inside a group's "children").
   Groups with children: "series" fills itself from data/series.js.
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util;

  var NAV = [
    { id: "news", label: "News", href: "news.html" },
    { id: "series", label: "Series", children: "series" },
    { id: "calendar", label: "Calendar", href: "calendar.html" },
    { id: "learn", label: "Learn", children: [
      { id: "terminology", label: "Terminology", href: "terminology.html", note: "Racing terms, A to Z" },
      { id: "tactics", label: "Tactics", href: "tactics.html", note: "How races are won" },
      { id: "tracks", label: "Racetracks", href: "tracks.html", note: "World map of circuits" },
      { id: "legacy", label: "Legacy", href: "legacy.html", note: "Series history and famous races" }
    ] },
    { id: "about", label: "About", href: "about.html" }
  ];
  var CTA = { id: "planner", label: "Weekend planner", href: "planner.html" };
  var INSTAGRAM = "https://www.instagram.com/paceandpublish/";
  PP.layout = { NAV: NAV, CTA: CTA, INSTAGRAM: INSTAGRAM };

  var page = document.body.getAttribute("data-page") || "";
  var pageSeries = page === "series" ? U.param("id") : null;

  function children(item) {
    if (item.children === "series") {
      return (PP.series || []).map(function (s) {
        return { id: "series:" + s.id, label: s.name, href: "series.html?id=" + s.id, tag: s.id };
      });
    }
    return item.children || [];
  }
  function isCurrent(item) {
    if (item.id === page) return true;
    if (item.id.indexOf("series:") === 0) return page === "series" && item.id === "series:" + pageSeries;
    return children(item).some(isCurrent);
  }

  /* ---------- Logo: Sanith's car badge in Ben's colors ---------- */
  var LOGO =
    '<svg viewBox="0 0 268 48" width="224" height="40" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="logo-badge"><rect x="0" y="0" width="76" height="48"/></clipPath></defs>' +
      '<rect x="0" y="0" width="76" height="48" fill="#F4C537"/>' +
      '<g clip-path="url(#logo-badge)">' +
        '<g class="g-lines"><rect x="2" y="16" width="22" height="3" fill="#0C0C12" opacity=".9"/><rect x="8" y="23" width="16" height="3" fill="#0C0C12" opacity=".7"/><rect x="14" y="30" width="10" height="3" fill="#0C0C12" opacity=".5"/></g>' +
        '<g class="g-car"><g transform="translate(18,12) scale(0.46)">' +
          '<polygon points="8,24 16,17 34,14 46,10 58,10 64,15 84,19 112,25 116,30 8,30" fill="#0C0C12"/>' +
          '<rect x="2" y="6" width="16" height="4" fill="#0C0C12"/><rect x="6" y="9" width="4" height="15" fill="#0C0C12"/>' +
          '<circle cx="26" cy="31" r="10" fill="#F64C1C" stroke="#0C0C12" stroke-width="3"/>' +
          '<circle cx="92" cy="32" r="8.5" fill="#F64C1C" stroke="#0C0C12" stroke-width="3"/>' +
        '</g></g>' +
      '</g>' +
      '<text x="88" y="21" font-family="Oswald, Arial Narrow, sans-serif" font-weight="700" font-size="20" letter-spacing="2.5" fill="#EAE6E0">PACE <tspan fill="#F4C537">&amp;</tspan></text>' +
      '<text x="88" y="44" font-family="Oswald, Arial Narrow, sans-serif" font-weight="700" font-size="20" letter-spacing="2.5" fill="#EAE6E0">PUBLISH</text>' +
    '</svg>';

  var CARET = '<svg class="nav-caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  /* ---------- Header ---------- */
  function renderHeader() {
    var host = U.$("site-header");
    if (!host) return;
    var overlay = document.body.hasAttribute("data-header-overlay");

    var ul = U.el("ul");
    NAV.forEach(function (item, i) {
      var li = U.el("li");
      var kids = children(item);
      if (kids.length) {
        var menuId = "nav-menu-" + item.id;
        var btn = U.el("button", { type: "button", className: "nav-link" + (isCurrent(item) ? " is-current" : ""),
          "aria-expanded": "false", "aria-controls": menuId, html: U.esc(item.label) + CARET });
        var menu = U.el("ul", { className: "nav-menu", id: menuId });
        kids.forEach(function (k) {
          var a = U.el("a", { href: k.href, "aria-current": isCurrent(k) ? "page" : null }, [
            U.el("span", null, [k.label, k.note ? U.el("small", { className: "visually-hidden", text: ": " + k.note }) : null]),
            k.tag ? U.tag(k.tag) : null
          ]);
          menu.appendChild(U.el("li", null, [a]));
        });
        li.appendChild(btn); li.appendChild(menu);
      } else {
        li.appendChild(U.el("a", { className: "nav-link", href: item.href, "aria-current": isCurrent(item) ? "page" : null, text: item.label }));
      }
      ul.appendChild(li);
    });
    ul.appendChild(U.el("li", { className: "nav-cta-item" }, [
      U.el("a", { className: "nav-cta", href: CTA.href, "aria-current": page === CTA.id ? "page" : null, text: CTA.label })
    ]));

    var nav = U.el("nav", { className: "main-nav", id: "main-nav", "aria-label": "Main" }, [ul]);
    var toggle = U.el("button", { type: "button", className: "nav-toggle", "aria-expanded": "false", "aria-controls": "main-nav", "aria-label": "Menu",
      html: '<span class="nav-toggle-bars" aria-hidden="true"></span><span class="nav-toggle-label">Menu</span>' });
    var header = U.el("header", { className: "site-header" + (overlay ? " site-header--overlay" : "") }, [
      U.el("div", { className: "wrap header-inner" }, [
        U.el("a", { className: "logo", href: "index.html", "aria-label": "Pace & Publish, home", html: LOGO }),
        toggle, nav
      ])
    ]);
    host.replaceWith(header);
    document.body.insertBefore(U.el("a", { className: "skip-link", href: "#main", text: "Skip to content" }), document.body.firstChild);
    if (U.testTime) header.querySelector(".header-inner").appendChild(U.el("span", { className: "badge badge--accent", text: "Test time" }));

    /* Dropdowns: click or Enter/Space to open; Escape, outside click or opening another closes. */
    function closeAll(except) {
      U.all(".nav-link[aria-expanded]", nav).forEach(function (b) {
        if (b === except) return;
        b.setAttribute("aria-expanded", "false");
        U.$(b.getAttribute("aria-controls")).classList.remove("is-open");
      });
    }
    U.all(".nav-link[aria-expanded]", nav).forEach(function (b) {
      var menu = U.$(b.getAttribute("aria-controls"));
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") !== "true";
        closeAll(b);
        b.setAttribute("aria-expanded", String(open));
        menu.classList.toggle("is-open", open);
      });
      menu.addEventListener("keydown", function (e) {
        var links = U.all("a", menu), i = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); links[(i + 1) % links.length].focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      });
    });
    document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeAll(); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = nav.querySelector('.nav-link[aria-expanded="true"]');
      if (open) { closeAll(); open.focus(); return; }
      if (toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });

    /* Menu button below 1024px */
    function setMenu(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      header.classList.toggle("is-open", open);
      if (!open) closeAll();
    }
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    if (window.matchMedia) window.matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

    /* Overlay header turns solid once the page scrolls (Evelin) */
    if (overlay) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    var host = U.$("site-footer");
    if (!host) return;
    function list(title, items) {
      return U.el("div", null, [U.el("h2", { text: title }), U.el("ul", null, items.map(function (i) {
        return U.el("li", null, [i.external ? U.outLink(i.href, i.label) : U.el("a", { href: i.href, text: i.label })]);
      }))]);
    }
    var learn = children(NAV.filter(function (n) { return n.id === "learn"; })[0]);
    var updated = PP.schedule && PP.schedule.lastUpdated;
    var footer = U.el("footer", { className: "site-footer" }, [
      U.el("div", { className: "wrap footer-inner" }, [
        U.el("div", null, [
          U.el("a", { className: "logo", href: "index.html", "aria-label": "Pace & Publish, home", html: LOGO }),
          U.el("p", { className: "footer-note", html: "<strong>Student project:</strong> Pace &amp; Publish is a fictional brand created by a student marketing team at Sacred Heart University (MK-680). It is not affiliated with any racing series, team or circuit. Every fact cites its official source." })
        ]),
        list("Follow the sport", [
          { label: "News", href: "news.html" }, { label: "Race calendar", href: "calendar.html" },
          { label: "Weekend planner", href: "planner.html" }
        ].concat((PP.series || []).map(function (s) { return { label: s.short, href: "series.html?id=" + s.id }; }))),
        list("Learn and more", learn.map(function (k) { return { label: k.label, href: k.href }; }).concat([
          { label: "About", href: "about.html" }, { label: "Sources & credits", href: "sources.html" },
          { label: "Instagram @paceandpublish", href: INSTAGRAM, external: true }
        ]))
      ]),
      U.el("div", { className: "wrap footer-bottom" }, [
        U.el("span", { text: "© 2026 Pace & Publish · MK-680 student project" }),
        updated ? U.el("span", { text: "Schedules and results last updated: " + U.visitorDateTime(updated) }) : null
      ])
    ]);
    host.replaceWith(footer);
  }

  renderHeader();
  renderFooter();
  // Reveal runs after every page script has rendered its content.
  window.addEventListener("load", function () { U.reveal(); });
})();
