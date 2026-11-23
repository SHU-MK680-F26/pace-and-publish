/*
 * Pace & Publish — Explore the Circuits (prd.md Section 11.5 V4, 11.8)
 * Builds the circuit explorer from window.PP_CONTENT.circuits. Selecting a
 * circuit crossfades the track map, photo, name, country, stats, type, fact,
 * description, sources and credits in place, with no reload. Tabs follow the
 * ARIA tabs pattern (click, arrow keys, Home/End, Enter/Space).
 * Maps and photos are local copies of Wikimedia Commons files; each one shows
 * its author, license and source, as the licenses require.
 */
(function () {
  "use strict";

  var PP = window.PP;
  var root = document.getElementById("circuit-explorer");
  if (!PP || !root) return;

  var el = PP.el;
  var circuits = (PP.data.circuits || []).slice();
  if (!circuits.length) {
    root.appendChild(PP.emptyState("Content needed: circuits", "No verified circuit data is in data/content.js yet."));
    return;
  }

  var current = 0;
  var tabs = [];
  var refs = {};
  var panelId = "circuit-panel-body";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Preload every map and photo so switching never flashes an empty frame. */
  /* Preloaded shortly after the page has loaded, so it never competes with the first paint. */
  window.addEventListener("load", function () {
    setTimeout(function () {
      circuits.forEach(function (c) {
        [c.trackMap, c.photo].forEach(function (src) {
          if (src) { var i = new Image(); i.src = src; }
        });
      });
    }, 1200);
  });

  function credit(label, cr) {
    if (!cr) return null;
    return el("span", { className: "cx-credit" }, [
      label + ": " + cr.author + " · ",
      el("a", { href: cr.licenseUrl, target: "_blank", rel: "noopener noreferrer license", text: cr.license }),
      " · ",
      el("a", { href: cr.sourceUrl, target: "_blank", rel: "noopener noreferrer", text: "Wikimedia Commons" }),
      cr.changes ? " · " + cr.changes : "",
      el("span", { className: "visually-hidden", text: " (links open in a new tab)" })
    ]);
  }

  function spec(label, value, big) {
    return el("div", { className: "cx-spec" + (big ? " is-big" : "") }, [
      el("dt", { text: label }),
      value ? el("dd", { text: value }) : el("dd", { className: "missing", text: "Content needed" })
    ]);
  }

  function imageOrPlaceholder(holder, src, alt, cls, label) {
    holder.innerHTML = "";
    if (!src) {
      holder.appendChild(el("div", { className: "media-placeholder" }, [el("strong", { text: label }), el("span", { text: "Content needed" })]));
      return;
    }
    var img = el("img", { className: cls, src: src, alt: alt || "", decoding: "async" });
    img.addEventListener("error", function () {
      holder.innerHTML = "";
      holder.appendChild(el("div", { className: "media-placeholder" }, [el("strong", { text: label }), el("span", { text: "Image unavailable" })]));
    });
    holder.appendChild(img);
  }

  function build() {
    var tablist = el("div", { className: "circuit-tabs", role: "tablist", "aria-label": "Choose a circuit" });
    circuits.forEach(function (c, i) {
      var tab = el("button", {
        type: "button", className: "circuit-tab", role: "tab", id: "circuit-tab-" + c.id,
        "aria-selected": "false", "aria-controls": panelId, tabindex: "-1"
      }, [
        el("span", { className: "tab-num", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }),
        el("span", { text: c.shortName })
      ]);
      tab.addEventListener("click", function () { select(i, false); });
      tab.addEventListener("keydown", onKey);
      tabs.push(tab);
      tablist.appendChild(tab);
    });

    refs.index = el("span", { className: "cx-index" });
    refs.name = el("h3", { className: "circuit-name", id: "circuit-name" });
    refs.location = el("p", { className: "circuit-location" });
    refs.event = el("p", { className: "circuit-event" });
    refs.map = el("div", { className: "cx-map-frame" });
    refs.mapCredit = el("figcaption", { className: "cx-caption" });
    refs.photo = el("div", { className: "cx-photo-frame" });
    refs.photoCredit = el("figcaption", { className: "cx-caption" });
    refs.specs = el("dl", { className: "cx-specs" });
    refs.fact = el("p");
    refs.desc = el("p", { className: "circuit-desc" });
    refs.extra = el("p", { className: "cx-extra" });
    refs.source = el("p", { className: "circuit-source" });

    var stage = el("div", { className: "cx-stage" }, [
      el("div", { className: "cx-head circuit-swap" }, [refs.index, refs.name, refs.location, refs.event]),
      el("figure", { className: "cx-map circuit-swap" }, [refs.map, refs.mapCredit])
    ]);

    var side = el("div", { className: "cx-side circuit-swap" }, [
      el("figure", { className: "cx-photo" }, [refs.photo, refs.photoCredit]),
      refs.specs,
      el("div", { className: "fact-card" }, [
        el("div", { className: "fact-tags" }, [
          el("span", { className: "mini-tag is-yellow", text: "History" }),
          el("span", { className: "mini-tag", text: "Verified" })
        ]),
        refs.fact
      ]),
      refs.desc,
      refs.extra,
      refs.source
    ]);

    root.innerHTML = "";
    root.appendChild(el("div", { className: "cx" }, [
      el("div", { className: "cx-top" }, [tablist, el("p", { className: "cx-hint", text: "Select a circuit · use the arrow keys to switch" })]),
      el("div", { className: "cx-main", id: panelId, role: "tabpanel" }, [stage, side])
    ]));
  }

  function render() {
    var c = circuits[current];

    refs.index.textContent = "Circuit " + String(current + 1).padStart(2, "0") + " / " + String(circuits.length).padStart(2, "0");
    refs.name.textContent = c.name;
    refs.location.innerHTML = "";
    refs.location.appendChild(el("strong", { text: c.country }));
    if (c.location && c.location !== c.country) refs.location.appendChild(document.createTextNode(" · " + c.location));
    refs.event.textContent = c.event;

    imageOrPlaceholder(refs.map, c.trackMap, c.trackMapAlt, "cx-map-img", "Track map");
    refs.mapCredit.innerHTML = "";
    if (c.trackMap) {
      refs.mapCredit.appendChild(el("a", { className: "cx-fullsize", href: c.trackMap, target: "_blank", rel: "noopener", text: "Open full-size map ↗" }));
    }
    if (c.mapCredit) refs.mapCredit.appendChild(credit("Track map", c.mapCredit));
    if (c.mapNote) refs.mapCredit.appendChild(el("span", { className: "cx-note", text: c.mapNote }));

    imageOrPlaceholder(refs.photo, c.photo, c.photoAlt, "cx-photo-img", "Circuit photo");
    refs.photoCredit.innerHTML = "";
    if (c.photoCredit) refs.photoCredit.appendChild(credit("Photo", c.photoCredit));

    refs.specs.innerHTML = "";
    [
      spec("Circuit length", c.length, true),
      spec("Number of turns", c.turns, true),
      spec("Number of laps", c.laps, true),
      spec("Country", c.country),
      spec("Circuit type", c.type),
      spec("First Grand Prix", c.firstGrandPrix)
    ].forEach(function (n) { refs.specs.appendChild(n); });

    refs.fact.textContent = c.fact;
    refs.desc.textContent = c.description;
    refs.extra.textContent = "Race distance " + c.raceDistance + " · Lap record " + c.lapRecord + " (" + c.lapRecordHolder + ")";

    refs.source.innerHTML = "";
    refs.source.appendChild(document.createTextNode("Facts: "));
    refs.source.appendChild(el("a", { href: c.sourceUrl, target: "_blank", rel: "noopener noreferrer", text: c.source }));
    if (c.turnsSourceUrl) {
      refs.source.appendChild(document.createTextNode(" · Turns: "));
      refs.source.appendChild(el("a", { href: c.turnsSourceUrl, target: "_blank", rel: "noopener noreferrer", text: c.turnsSource }));
    }
    refs.source.appendChild(document.createTextNode(" · checked " + PP.formatDate(c.checked)));
    refs.source.appendChild(el("span", { className: "visually-hidden", text: " (links open in a new tab)" }));

    tabs.forEach(function (t, i) {
      var on = i === current;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("tabindex", on ? "0" : "-1");
    });
    document.getElementById(panelId).setAttribute("aria-labelledby", tabs[current].id);
  }

  function select(i, focus) {
    if (focus) tabs[i].focus();
    if (i === current) return;
    current = i;
    if (reduceMotion) { render(); return; }
    root.classList.add("is-switching");
    setTimeout(function () {
      render();
      root.classList.remove("is-switching");
    }, 180);
  }

  function onKey(e) {
    var i = tabs.indexOf(e.currentTarget);
    var next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) { e.preventDefault(); select(next, true); }
  }

  build();
  render();

  /* Exposed for testing only. */
  window.PPCircuits = { select: function (i) { select(i, false); }, current: function () { return circuits[current].id; } };
})();
