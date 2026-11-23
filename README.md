# Pace & Publish

The website for **Pace & Publish**, a fictional motorsport brand and student project (MK-680, Sacred Heart University). News, schedules, results and a starter guide for **F1, MotoGP, WEC, NASCAR, IMSA and IndyCar**, with the official source on every item.

It merges the four team sites (Ben, Evelin, Miranda, Sanith) into one. The originals are kept unchanged in [`archive/`](archive/).

## Open it

- **Double-click `index.html`.** It's plain HTML, CSS and JavaScript: no installs, no build step, no server, and it works offline. (The Racetracks "Detailed" map style is the only thing that needs a web address.)
- **Online:** GitHub Pages serves the `main` branch (see [docs/decisions.md](docs/decisions.md)).
- **Preview in Claude Code:** `.claude/launch.json` starts a local server at `http://localhost:8780`.

## Pages

| Page | File | Built from |
|---|---|---|
| Home | `index.html` | Hero video (Sanith), next-up countdown (Miranda), latest official headlines, series posters (Evelin), Start-here path and Instagram card (Ben) |
| News | `news.html` | Official headlines from each series' news page, series filter and search |
| Series ▾ | `series.html?id=<id>` | One template for every series: results, news, line-ups, schedule |
| Calendar | `calendar.html` | Miranda's calendar tool with .ics export |
| Weekend planner | `planner.html` | Sanith's planner with clash helper, on real data |
| Learn ▾ | `terminology.html`, `tactics.html`, `tracks.html`, `legacy.html` | Ben's starter guide, with Evelin's circuit detail |
| About, Sources & credits | `about.html`, `sources.html` | |

## Folders

```
css/          tokens.css (design tokens) · base.css (layout, header, nav, footer) · components.css
js/           core.js (helpers) · layout.js (header, nav, footer: the page list lives here)
js/features/  one file per feature: news, schedule, series-page, guide, home
data/         content, one file per type (series, news, terms, tactics, tracks, races, photos, ...)
data/generated/  written only by scripts/refresh.py: schedule, lineups, headlines
assets/       images (photos, team, drivers, tracks, logo), video, fonts
vendor/       Leaflet and the world outline for the track map
scripts/      refresh.py (live data) · check.py (run before committing)
docs/         how to add content, data fields, brand, decisions, page template
archive/      the four original sites, unchanged, for reference
```

## Common jobs

- **Add headlines or captions, a track, term, series, photo or page:** follow [docs/adding-content.md](docs/adding-content.md).
- **Refresh schedules, results, line-ups and headlines:** `python3 scripts/refresh.py` (about four minutes; one request per second). Refresh only some series with `python3 scripts/refresh.py nascar indycar`. Then run **`/caption-headlines`** in Claude Code to write captions for new headlines (free; see [docs/adding-content.md](docs/adding-content.md#news-official-headlines)).
- **Before committing:** `python3 scripts/check.py`, then open a Learn page and check the browser console.

## Where the data comes from

| Series | Source | What we get |
|---|---|---|
| F1 | formula1.com | Schedule, session times, results, line-ups, headlines |
| MotoGP | motogp.com | Weekend dates, line-ups, headlines (session times aren't readable) |
| WEC | fiawec.com | Schedule, results by class, entry list, headlines |
| NASCAR | cf.nascar.com (nascar.com's data host) | Cup schedule, session times, race results |
| IMSA | sportscar365.com (fallback) | Headlines only: imsa.com blocks automated reading |
| IndyCar | indycar.com/Schedule | Race dates (times once published) |

Gaps are labeled on the site, never filled with invented data. Hand-entered weekends go in `data/schedule-manual.js`.

---
Student project: Pace & Publish is a fictional brand. Not affiliated with any racing series, team or circuit.
