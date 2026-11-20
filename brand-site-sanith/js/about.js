/* Pace & Publish: About, photo credits list. */
(function () {
  "use strict";
  var PP = window.PP, P = window.PP_PHOTOS || {};
  var el = document.getElementById("credits-list");
  if (!el) return;
  el.innerHTML = PP.SERIES_ORDER.filter(function (s) { return P[s]; }).map(function (s) {
    var p = P[s];
    var lic = p.licenseUrl ? '<a href="' + PP.esc(p.licenseUrl) + '" target="_blank" rel="noopener">' + PP.esc(p.license) + "</a>" : PP.esc(p.license);
    return '<li><img src="' + PP.esc(p.src) + '" alt="' + PP.esc(p.alt) + '" loading="lazy"><span>' + PP.tag(s) + " " + PP.esc(p.caption) +
      "<br>Photo: " + PP.esc(p.credit) + ", " + lic + ', via <a href="' + PP.esc(p.page) + '" target="_blank" rel="noopener">Wikimedia Commons</a>. Resized for this site.</span></li>';
  }).join("");
})();
