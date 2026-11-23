/* Pace & Publish data: source helpers for the guide content (terms, tactics, tracks, races, series history).
   wiki("Page_title") and official("Title", "https://...") build a { title, url } source.
   SOURCES_CHECKED is the date the guide facts were last checked against their sources. */
window.PP = window.PP || {};
window.PP.sources = (function () {
  "use strict";
  var SOURCES_CHECKED = "13 November 2026";
  
  /* Small helpers for writing sources. */
  function wiki(title) {
    return { title: "Wikipedia: " + title.replace(/_/g, " ").replace(/%27/g, "'"), url: "https://en.wikipedia.org/wiki/" + title };
  }
  var GLOSSARY = wiki("Glossary_of_motorsport_terms");
  
  /* Official series sources (checked 13 November 2026; nascar.com blocked automated access). */
  function official(title, url) { return { title: title, url: url }; }
  var F1_GLOSSARY_AE = official("Formula 1: F1 Glossary, A to E", "https://www.formula1.com/en/latest/article/f1-glossary-a-e.1MFONigMlQSbSQtpP7YCy2");
  var F1_GLOSSARY_FJ = official("Formula 1: F1 Glossary, F to J", "https://www.formula1.com/en/latest/article/f1-glossary-f-j.2g6grJVxT6dFCDpSmgoCQX");
  var F1_GLOSSARY_KO = official("Formula 1: F1 Glossary, K to O", "https://www.formula1.com/en/latest/article/f1-glossary-k-o.6g2hrWHA2pyxbXoe8FT9Db");
  var F1_GLOSSARY_PT = official("Formula 1: F1 Glossary, P to T", "https://www.formula1.com/en/latest/article/f1-glossary-p-t.GBhLQtpeu9b8LrK5VM0F1");
  var F1_GLOSSARY_UZ = official("Formula 1: F1 Glossary, U to Z", "https://www.formula1.com/en/latest/article/f1-glossary-u-z.5JSlDsnyvYmbK0TCjTs7KB");
  function f1Circuit(slug, title) { return official("Formula 1: " + title, "https://www.formula1.com/en/racing/2026/" + slug); }
  var MOTOGP_GLOSSARY = official("MotoGP: MotoGP Glossary", "https://www.motogp.com/en/glossary");
  var WEC_ABOUT = official("FIA WEC: What is FIAWEC?", "https://www.fiawec.com/en/page/le-wec-cest-quoi-1");
  var WEC_LE_MANS = official("FIA WEC: 24 Hours of Le Mans (track information)", "https://www.fiawec.com/en/race/24-hours-of-le-mans-2026");
  var INDYCAR_BASICS = official("IndyCar: The Basics of INDYCAR", "http://www.indycar.com/Fan-Info/INDYCAR-101/Basics");
  var FLAGS = wiki("Racing_flags");
  function racingCircuits(path, name) { return official("RacingCircuits.info: " + name, "https://www.racingcircuits.info/" + path); }
  var INDYCAR_GLOSSARY = official("IndyCar: INDYCAR 101 Glossary", "http://www.indycar.com/Fan-Info/INDYCAR-101/Glossary");
  var INDYCAR_LAGUNA = official("IndyCar: WeatherTech Raceway Laguna Seca", "http://www.indycar.com/Schedule/2027/Laguna-Seca");
  var INDYCAR_INDY500 = official("IndyCar: Indianapolis 500 (track information and previous winners)", "http://www.indycar.com/Schedule/2027/Indianapolis-500");
  return { SOURCES_CHECKED: SOURCES_CHECKED, wiki: wiki, GLOSSARY: GLOSSARY, official: official, F1_GLOSSARY_AE: F1_GLOSSARY_AE, F1_GLOSSARY_FJ: F1_GLOSSARY_FJ, F1_GLOSSARY_KO: F1_GLOSSARY_KO, F1_GLOSSARY_PT: F1_GLOSSARY_PT, F1_GLOSSARY_UZ: F1_GLOSSARY_UZ, f1Circuit: f1Circuit, MOTOGP_GLOSSARY: MOTOGP_GLOSSARY, WEC_ABOUT: WEC_ABOUT, WEC_LE_MANS: WEC_LE_MANS, INDYCAR_BASICS: INDYCAR_BASICS, FLAGS: FLAGS, racingCircuits: racingCircuits, INDYCAR_GLOSSARY: INDYCAR_GLOSSARY, INDYCAR_LAGUNA: INDYCAR_LAGUNA, INDYCAR_INDY500: INDYCAR_INDY500 };
})();
