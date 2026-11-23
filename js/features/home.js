/* =====================================================================
   Home page: hero video, next up, latest news, series posters, Learn
   path counts. Everything follows the shared "my series" setting.
   ===================================================================== */
(function () {
  "use strict";
  var PP = window.PP, U = PP.util, el = U.el;

  /* Hero video (Sanith): only on large screens, without reduced motion or
     data-saver. Phones and everyone else keep the still photo. */
  function heroVideo() {
    var hero = U.$("hero"), credit = U.$("video-credit");
    var big = window.matchMedia && window.matchMedia("(min-width: 1024px)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!hero || !big || saveData || U.reducedMotion()) return;
    var v = el("video", { className: "hero-video", muted: true, autoplay: true, loop: true, playsinline: true, preload: "auto",
      poster: hero.querySelector(".hero-media").getAttribute("src"), "aria-hidden": "true" });
    v.muted = true; // property too, so autoplay is allowed
    v.appendChild(el("source", { src: hero.getAttribute("data-video"), type: "video/mp4" }));
    v.addEventListener("playing", function () { if (credit) credit.hidden = false; });
    hero.insertBefore(v, hero.querySelector(".hero-media").nextSibling);
  }

  function latestNews() {
    var host = U.$("home-news");
    function draw() {
      host.textContent = "";
      // The six newest official headlines for the series you follow.
      var grid = el("div", { className: "card-grid" });
      // Featured cards: our short headline with its summary underneath.
      PP.newsFeature.items(U.mySeries()).slice(0, 6).forEach(function (i) { grid.appendChild(PP.newsFeature.card(i, { summary: true })); });
      if (!grid.children.length) host.appendChild(el("p", { className: "empty", text: "No news yet for the series you follow." }));
      else host.appendChild(grid);
    }
    document.addEventListener("pp:myseries", draw);
    draw();
  }

  function posters() {
    var host = U.$("series-posters");
    (PP.series || []).forEach(function (s, i) {
      var sched = U.scheduleFor(s.id), t = U.now();
      var next = sched.weekends.filter(function (w) { return !U.weekendPast(w, t); }).length;
      var img = U.img(s.photo, { alt: "" });
      host.appendChild(el("li", null, [el("a", { className: "series-poster" + (img ? "" : " is-empty"), href: "series.html?id=" + s.id }, [
        img,
        el("div", { className: "series-poster-body" }, [
          U.tag(s.id),
          el("span", { className: "series-poster-name", text: s.short }),
          el("span", { className: "series-poster-long", text: s.name }),
          el("span", { className: "series-poster-foot" }, [
            el("span", { text: next ? next + " weekends ahead" : "Season complete" }),
            el("span", { className: "series-arrow", "aria-hidden": "true", text: "→" })
          ])
        ])
      ])]));
    });
  }

  function learnCounts() {
    var c = PP.guide ? PP.guide.counts() : {};
    var words = { terms: "terms", tactics: "tactics", tracks: "tracks", races: "races" };
    U.all("[data-count]").forEach(function (n) {
      var k = n.getAttribute("data-count");
      n.textContent = k === "legacy" ? c.series + " series · " + c.races + " races" : c[k] + " " + words[k];
    });
    U.all("[data-num]").forEach(function (n) { n.textContent = c[n.getAttribute("data-num")]; });
  }

  function render() {
    heroVideo();
    PP.scheduleFeature.nextUp(U.$("home-next"));
    U.$("home-series").appendChild(U.seriesPicker());
    latestNews();
    posters();
    learnCounts();
  }
  PP.home = { render: render };
})();
