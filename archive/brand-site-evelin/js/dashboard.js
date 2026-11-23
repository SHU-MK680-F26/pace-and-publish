/*
 * Pace & Publish — My Racing Dashboard (PRD Section 4)
 * Pick any combination of F1, MotoGP, NASCAR and WEC; stories and upcoming
 * events update instantly (OR logic, newest first). The selection is saved
 * in localStorage when the browser allows it. No network requests.
 */
(function () {
  "use strict";

  var PP = window.PP;
  if (!PP) return;
  var DATA = PP.data;
  var el = PP.el;
  var STORAGE_KEY = "pp-dashboard-series";
  var ALL = DATA.series.map(function (s) { return s.id; });

  var selected = loadSelection();

  var toggles = [];
  var summaryEl, resultsEl, eventsEl, eventsSection;

  /* ---------- Storage (wrapped in try/catch, PRD 4.3 rule 6) ---------- */
  function loadSelection() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) return ALL.slice();           /* first visit: all four */
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return ALL.slice();
      return ALL.filter(function (id) { return parsed.indexOf(id) !== -1; });
    } catch (e) {
      return ALL.slice();
    }
  }

  function saveSelection() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch (e) {
      /* Storage blocked: the dashboard keeps working for this visit. */
    }
  }

  function isSelected(id) { return selected.indexOf(id) !== -1; }

  function setSelection(list) {
    selected = ALL.filter(function (id) { return list.indexOf(id) !== -1; });
    saveSelection();
    update();
  }

  /* ---------- Controls ---------- */
  function buildControls() {
    var group = document.getElementById("series-toggles");
    group.innerHTML = "";
    DATA.series.forEach(function (s) {
      var btn = el("button", {
        type: "button",
        className: "series-toggle",
        "aria-pressed": isSelected(s.id) ? "true" : "false",
        "data-series": s.id
      }, [
        el("span", { className: "check", "aria-hidden": "true" }),
        el("span", { text: s.label || s.name }),
        el("span", { className: "state", "aria-hidden": "true" })
      ]);
      btn.addEventListener("click", function () {
        if (isSelected(s.id)) setSelection(selected.filter(function (id) { return id !== s.id; }));
        else setSelection(selected.concat([s.id]));
      });
      toggles.push(btn);
      group.appendChild(btn);
    });

    document.getElementById("select-all").addEventListener("click", function () { setSelection(ALL); });
    document.getElementById("clear-all").addEventListener("click", function () { setSelection([]); });
  }

  function names(ids) {
    return ids.map(function (id) { return PP.seriesById(id).name; });
  }

  /* ---------- Render ---------- */
  function update() {
    toggles.forEach(function (btn) {
      var on = isSelected(btn.getAttribute("data-series"));
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.querySelector(".state").textContent = on ? "On" : "Off";
    });

    var stories = PP.sortNewest(DATA.articles.filter(function (a) { return isSelected(a.series); }));
    var selectedNames = PP.joinNames(names(selected));

    resultsEl.innerHTML = "";
    summaryEl.innerHTML = "";

    if (selected.length === 0) {
      summaryEl.appendChild(document.createTextNode("Select at least one series to build your dashboard."));
    } else if (stories.length === 0) {
      var msg = "No stories are available yet for " + selectedNames + ". Try adding another series.";
      summaryEl.appendChild(document.createTextNode(msg));
      resultsEl.appendChild(PP.emptyState("Content needed: " + selectedNames + " story", msg));
    } else {
      summaryEl.appendChild(document.createTextNode(
        "Showing " + stories.length + (stories.length === 1 ? " story" : " stories") + " for " + selectedNames + "."
      ));
      var empty = selected.filter(function (id) {
        return !DATA.articles.some(function (a) { return a.series === id; });
      });
      if (empty.length) {
        summaryEl.appendChild(el("span", {
          className: "note",
          text: "No stories are available yet for " + PP.joinNames(names(empty)) + "."
        }));
      }
      /* Home embeds the dashboard with data-limit="6"; the full list is on dashboard.html. */
      var limit = parseInt(resultsEl.getAttribute("data-limit"), 10);
      var shown = limit > 0 ? stories.slice(0, limit) : stories;
      if (resultsEl.getAttribute("data-variant") === "list") {
        /* Home: compact numbered headlines, so story images are not repeated on the page. */
        var list = el("ol", { className: "headline-list" });
        shown.forEach(function (a, i) {
          var s = PP.seriesById(a.series);
          list.appendChild(el("li", null, [
            el("a", { href: "news.html#" + s.slug }, [
              el("span", { className: "hl-num", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }),
              el("span", { className: "hl-body" }, [
                el("span", { className: "card-kicker" }, [
                  el("span", { className: "tag", text: s.name }),
                  el("time", { datetime: a.date, text: PP.formatDate(a.date, true) })
                ]),
                el("span", { className: "hl-title", text: a.title })
              ])
            ])
          ]));
        });
        resultsEl.appendChild(list);
      } else {
        resultsEl.appendChild(PP.createGrid(shown));
      }
      if (shown.length < stories.length) {
        resultsEl.appendChild(el("p", { className: "dash-more" }, [
          el("a", { className: "text-link", href: "dashboard.html", text: "See all " + stories.length + " stories on My Racing Dashboard" })
        ]));
      }
    }

    renderEvents();
  }

  /* Upcoming events, filtered the same way (PRD 4.2). */
  function renderEvents() {
    if (!eventsEl) return;
    var today = PP.todayISO();
    var events = PP.sortEvents((DATA.events || []).filter(function (e) {
      return isSelected(e.series) && !PP.isPastEvent(e, today);
    }));
    eventsEl.innerHTML = "";
    eventsSection.hidden = selected.length === 0;
    if (selected.length === 0) return;
    if (!events.length) {
      eventsEl.appendChild(PP.emptyState(null,
        "No upcoming events are listed yet for " + PP.joinNames(names(selected)) + "."));
      return;
    }
    var list = el("ol", { className: "event-list" });
    events.forEach(function (e) { list.appendChild(PP.eventItem(e, false)); });
    eventsEl.appendChild(list);
  }

  function init() {
    summaryEl = document.getElementById("dash-summary");
    resultsEl = document.getElementById("dash-results");
    eventsEl = document.getElementById("dash-events");
    eventsSection = document.getElementById("dash-events-section");
    if (!summaryEl || !resultsEl) return;
    buildControls();
    update();
  }

  /* Exposed for testing only (e.g. simulating a series with no content). */
  window.PPDashboard = { update: update, getSelection: function () { return selected.slice(); } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
