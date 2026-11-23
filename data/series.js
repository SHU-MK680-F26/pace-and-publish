/* =====================================================================
   Pace & Publish data: the series registry.
   ---------------------------------------------------------------------
   The single list of series. The nav, filters, tags, calendar, planner,
   news and series pages all read it. To add a series:
     1. Add an entry below (copy the TEMPLATE).
     2. Add its three tag colors to css/tokens.css (--series-<id>-bg/-fg/-ring)
        and a .tag--<id> line to css/components.css.
     3. Optional: a history entry in data/series-history.js (Legacy page),
        a poster photo in data/photos.js, and a fetcher in scripts/refresh.py.
   It then appears in the Series menu and gets its own page at
   series.html?id=<id> with no other changes.

   TEMPLATE:
   {
     id: "formula-1",          // lowercase-hyphen id used everywhere; never change once published
     short: "F1",              // text on tags and filter buttons
     name: "Formula 1",        // full name
     desc: "One sentence for cards and the series page intro.",
     site: "formula1.com",     // the official source the site cites
     siteUrl: "https://www.formula1.com",
     photo: "f1-zandvoort-2026-cadillac",   // id from data/photos.js (optional)
     fetcher: "formula_1"      // refresh.py fetcher name, or null if schedules are hand-entered
   },
   ===================================================================== */
window.PP = window.PP || {};
window.PP.series = [
  {
    id: "formula-1", short: "F1", name: "Formula 1",
    desc: "The top class of single-seater racing worldwide, run as a world championship since 1950.",
    site: "formula1.com", siteUrl: "https://www.formula1.com",
    photo: "f1-zandvoort-2026-cadillac", fetcher: "formula_1"
  },
  {
    id: "motogp", short: "MotoGP", name: "MotoGP",
    desc: "The premier class of Grand Prix motorcycle racing, the oldest motorsport world championship.",
    site: "motogp.com", siteUrl: "https://www.motogp.com",
    photo: "motogp-silverstone-2014", fetcher: "motogp"
  },
  {
    id: "wec", short: "WEC", name: "FIA World Endurance Championship",
    desc: "A world championship for endurance racing, where several classes of cars share the track at once.",
    site: "fiawec.com", siteUrl: "https://www.fiawec.com",
    photo: "wec-spa-2024-start", fetcher: "wec"
  },
  {
    id: "nascar", short: "NASCAR", name: "NASCAR Cup Series",
    desc: "America's stock car racing organization, founded in Daytona Beach in 1948. Its top division is the Cup Series.",
    site: "nascar.com", siteUrl: "https://www.nascar.com",
    photo: "nascar-bristol-2023", fetcher: "nascar"
  },
  {
    id: "imsa", short: "IMSA", name: "IMSA WeatherTech SportsCar Championship",
    desc: "North America's top sports car series, racing prototypes and GT cars together, including the 12 Hours of Sebring.",
    site: "sportscar365.com", siteUrl: "https://sportscar365.com/category/imsa/iwsc/",
    sourceNote: "imsa.com blocks automated reading, so IMSA news comes from sportscar365.com, the fallback source the team chose.",
    photo: "imsa-sebring-2024", fetcher: "imsa"
  },
  {
    id: "indycar", short: "IndyCar", name: "NTT IndyCar Series",
    desc: "The top level of American single-seater racing. Its biggest event is the Indianapolis 500, first held in 1911.",
    site: "indycar.com", siteUrl: "https://www.indycar.com",
    photo: null, fetcher: "indycar"
  }
];
