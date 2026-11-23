# Data files

All data are plain `.js` files that add to one global, `window.PP`. (A page opened by double-click can load `.js` files but not `.json`.) Pages load only the files they use, in this order: data → `js/core.js` → `js/layout.js` → `js/features/*`.

| File | Global | Written by | Used on |
|---|---|---|---|
| `data/series.js` | `PP.series` | hand | every page (nav, tags, filters) |
| `data/photos.js` | `PP.photos` | hand | any page with a photo; Sources |
| `data/news.js` | `PP.news` | hand | not shown (kept for reference; see decisions.md) |
| `data/schedule-manual.js` | `PP.scheduleManual` | hand | Calendar, Planner, Home, series pages |
| `data/sources.js` | `PP.sources` | hand | helpers for the guide files below |
| `data/series-history.js` | `PP.seriesHistory` | hand | Legacy, series pages |
| `data/terms.js` | `PP.topics`, `PP.terms` | hand | Terminology (+ auto-links everywhere in the guide) |
| `data/tactics.js` | `PP.tactics` | hand | Tactics |
| `data/tracks.js` | `PP.tracks` | hand | Racetracks |
| `data/races.js` | `PP.races` | hand | Legacy |
| `data/generated/schedule.js` | `PP.schedule` | `scripts/refresh.py` | Calendar, Planner, Home, series pages |
| `data/generated/lineups.js` | `PP.lineups` | `scripts/refresh.py` (team colors kept from the last run) | series pages |
| `data/generated/headlines.js` | `PP.headlines` | `scripts/refresh.py` (captions kept by `sourceUrl`) | News, Home, series pages |

Each hand-written file starts with a commented TEMPLATE showing every field.

## Series ids

Always the long ids from `data/series.js`: `formula-1`, `motogp`, `wec`, `nascar`, `imsa`, `indycar`. The guide also uses `all` (applies to every series) and `other`.

## Generated schedule shape

```js
PP.schedule = {
  schemaVersion: 2, lastUpdated: "2026-11-23T11:43:00-05:00",
  series: {
    "formula-1": {
      name, siteName, season, fetchedAt,
      weekends: [{
        name, circuit, country, timeZone, season, startDate?, endDate?,
        raceLength: { laps, distanceKm, duration },
        sessions: [{
          name, start: "ISO time" | null, date?: "YYYY-MM-DD",   // date-only when no time is published
          durationMinutes, sourceUrl,
          results: [{ class: null | "Hypercar", rows: [{ pos, name, team, number, timeOrGap }] }]
        }]
      }]
    }
  }
}
PP.lineups   = { teamColours: [{ series, team, colour }], series: { id: [{ class, team, drivers: [], sourceUrl }] } }
PP.headlines = { series: { id: [{ date, type: "news" | "hiring", caption, summary?, captionBy?, captionedAt?, sourceUrl }] } }
```

A headline's `caption` is our own short headline (6–14 words) for the official article, shown on every card; its `summary` is one or two sentences of detail, shown under the headline on Home. Captions are written with `/caption-headlines` in Claude Code (or, optionally, by `refresh.py` through the paid API), recording `captionBy` and `captionedAt`; see docs/adding-content.md. Until then the card shows "New article on <site>". **Captions are the one field you may edit by hand in `data/generated/headlines.js`:** every caption carries over to the next run, matched by `sourceUrl`, and is never rewritten.

## Browser storage

Only conveniences are saved, in the visitor's own browser: `pp-my-series` (series you follow), `pp-calendar` (upcoming-only), `pp-planner` (time zone). The site works fully without them.

## Test time

Add `?now=2026-11-28T14:00:00Z` to any page address to see the site as it would look at that moment (countdowns, "On track now", "This weekend"). A "Test time" badge shows in the header.
