# Pace & Publish: unified site build plan

Status: **draft for approval** · 2026-11-23

This plan merges the four team sites (`brand-site-ben`, `-evelin`, `-miranda`, `-sanith`) into one static site in this repository. It applies the seven decisions agreed on 2026-11-23 (summarized in §1) and covers six series: **F1, MotoGP, WEC, NASCAR, IMSA and IndyCar**.

---

## 1. Decisions this plan applies

| # | Area | Decision |
|---|---|---|
| 1 | Page structure | Separate HTML pages. `js/layout.js` builds the header and footer from one nested page list. Opens by double-click (`file://`), no build step. |
| 2 | Data | One `.js` file per content type in `data/`, all under `window.PP`. `data/series.js` registry with long IDs. `refresh.py` writes only `data/generated/`. |
| 3 | Design tokens | Ben's palette (Lights-Out Black, Starting-Line White, Race-Paint Yellow, Flaming-Hot Orange, Night-Drive Navy). Oswald + Inter, stored in the repo. Two-layer tokens in `css/tokens.css`. Breakpoints 600 / 1024 px. Series marked by text labels, no extra hues. |
| 4 | Header & nav | News · Series ▾ · Calendar · Learn ▾ · About, plus a Planner button. Menu button below 1024 px. Sanith's SVG car logo, recolored to Ben's palette. |
| 5 | Features | One feature per job, each in `js/features/`. Keep countdowns, "on track now", sortable results, news search, hero video (still on phones). Cut carousels, poll. |
| 6 | Media | One `assets/` tree by type. Every photo credited from `data/photos.js`. Duplicates removed, photos ≤ 2000 px wide. |
| 7 | Docs & tooling | Root README, `docs/`, `CLAUDE.md`, originals in `archive/`, GitHub Pages on. |

---

## 2. Target structure

```
/
├── index.html            Home
├── news.html             All news, search, series filter
├── calendar.html         Season calendar (Miranda's tool)
├── planner.html          Race-weekend planner view (Sanith's clash + print)
├── series.html           One template for every series: series.html?id=formula-1
├── terminology.html      Learn ▾ (Ben)
├── tactics.html          Learn ▾ (Ben)
├── tracks.html           Learn ▾ (Ben's map + Evelin's circuit detail)
├── legacy.html           Learn ▾ (Ben: series history, historical races, hall of fame)
├── about.html            Brand, team, student-project statement
├── sources.html          Sources and photo credits (generated from data)
├── css/
│   ├── tokens.css        Palette → semantic tokens, type, spacing, radius, breakpoints
│   ├── base.css          Reset, typography, layout primitives, header/footer
│   └── components.css    Cards, tags, tables, buttons, tabs, forms
├── js/
│   ├── layout.js         Page list, header, nav, footer, menu button
│   ├── core.js           Shared helpers: el(), dates/time zones, storage wrapper, "my series"
│   └── features/         calendar.js, planner.js, countdown.js, results.js, news.js,
│                         search.js, track-map.js, glossary.js, hero-video.js, …
├── data/
│   ├── series.js         Registry (§4)
│   ├── news.js           Team-written stories (hand-edited)
│   ├── tracks.js  terms.js  tactics.js  races.js  photos.js   (hand-edited)
│   ├── schedule-manual.js  Hand-entered weekends for series with no fetcher (§5)
│   └── generated/        Written only by refresh.py
│       ├── schedule.js   Weekends, sessions, results
│       ├── lineups.js
│       └── headlines.js  Official-source headlines with captions
├── assets/
│   ├── images/{photos,team,drivers,tracks,logo}/
│   ├── video/
│   └── fonts/
├── vendor/               Leaflet + world land data (from Ben)
├── scripts/refresh.py
├── docs/                 adding-content.md, data.md, brand.md, decisions.md, this plan
├── archive/              The four original sites, unchanged
├── CLAUDE.md  README.md  _config.yml  .gitignore
└── .claude/launch.json
```

**Why `series.html?id=…`:** Miranda used one shell file per series. A single template that reads the series ID from the address means adding F1 Academy or Formula E later is **one entry in `series.js`**, with no new HTML file and no nav edit. Query strings work when the page is opened from disk.

**Every page** has the same skeleton: `<div id="site-header">`, a `<main>` holding the page's real HTML, `<div id="site-footer">`, then its scripts in a fixed order (`data/…` → `js/core.js` → `js/layout.js` → `js/features/…`).

---

## 3. Content merge map

| Content | Comes from | Notes |
|---|---|---|
| Team news stories | Evelin (14) + Sanith (10) | Both rewrote the same Weeks 1–3 team posts. Merge into one list, keep the better-written version of each, keep each item's official source URL. |
| Official headlines | Miranda (`refresh.py`) | Kept separate from team stories (`kind: "headline"`), shown with source labels as Miranda does. |
| Schedule, results, line-ups | Miranda (`refresh.py`) | Replaces Evelin's 13 hand-entered events and Sanith's SAMPLE sessions, which are retired. |
| Tracks | Ben (30) + Evelin (3 with detail) | Ben's list is the base; Evelin's Monaco, Silverstone, Suzuka detail (map, photo, turns, laps, lap record) becomes the detail format every track can grow into. |
| Terminology, tactics, races, series history | Ben (`script.js`) | Moved out of code into `data/`. |
| Instagram section | Sanith / Evelin | One section on Home, linking `@paceandpublish`, using the current (rebranded) launch posts. |
| Photos | Evelin, Miranda, Sanith | Merged into `assets/images/photos/`, credits into `data/photos.js`. |
| Team post graphics | Evelin, Sanith | 10 byte-identical duplicates found; keep one copy each in `assets/images/team/`. |
| Brand voice | Miranda (`docs/voice.md`) | Moves to `docs/brand.md`. |
| Car Types | Ben ("Soon") | Left out of the nav until it has content; the page list makes adding it one line. |
| Evelin's Dashboard page | Evelin | Becomes the site-wide "my series" setting (on Home and in the header), not a separate page. |

---

## 4. Series registry

`data/series.js` is the single list every page, filter and menu reads:

```js
PP.series = [
  { id: "formula-1", short: "F1",     name: "Formula 1",                        site: "formula1.com",   fetcher: "formula_1" },
  { id: "motogp",    short: "MotoGP", name: "MotoGP World Championship",        site: "motogp.com",     fetcher: "motogp" },
  { id: "wec",       short: "WEC",    name: "FIA World Endurance Championship", site: "fiawec.com",     fetcher: "wec" },
  { id: "nascar",    short: "NASCAR", name: "NASCAR Cup Series",                site: "nascar.com",     fetcher: null },
  { id: "imsa",      short: "IMSA",   name: "IMSA WeatherTech SportsCar Championship", site: "imsa.com", fetcher: "imsa" },
  { id: "indycar",   short: "IndyCar", name: "NTT IndyCar Series",              site: "indycar.com",    fetcher: null }
];
```

`refresh.py` reads the same list of active fetchers, so Miranda's F1 Academy and Formula E fetchers stay in the script, switched off, and come back by adding their registry entries.

---

## 5. Data coverage by series (the main risk)

| Series | Schedule & results | Line-ups | Headlines | Gap |
|---|---|---|---|---|
| F1 | ✅ refresh.py | ✅ | ✅ | none |
| MotoGP | ✅ dates only, no session times or results | ✅ | ✅ | session times (motogp.com doesn't publish them in a readable form) |
| WEC | ✅ | ✅ | ✅ | none |
| IMSA | ❌ | ❌ | ✅ via sportscar365.com | imsa.com blocks scripts (Cloudflare); results host needs TLS 1.3, which this Mac's Python 3.9 can't do |
| NASCAR | ❌ no fetcher | ❌ | ❌ | nascar.com couldn't be read in Evelin's build |
| IndyCar | ❌ no fetcher | ❌ | ❌ | not yet attempted |

**Plan:** in step 5, try writing `fetch_nascar` and `fetch_indycar` (same rules as Miranda's: official site only, one request per second, keep old data on failure). Where a series can't be fetched, its weekends go in `data/schedule-manual.js`, entered by hand from the official site with a source URL, and the calendar merges both files. A series with no data shows the labeled empty state, never invented data.

---

## 6. Build steps

Work happens on a branch, `site-unification`, with **one commit per step** so each can be reviewed. A pull request into `main` at the end.

| Step | What | Done when |
|---|---|---|
| **1. Skeleton & archive** | Move the four sites into `archive/` with `git mv` (history kept). Create the folder tree, `.claude/launch.json` (preview server at the root), `.gitignore`. | Old sites still open from `archive/`; empty tree in place. |
| **2. Tokens & base CSS** | `tokens.css` from Ben's palette (raw → semantic), type scale, spacing, radius, the two breakpoints. Self-host Oswald and Inter (`.woff2`, SIL OFL). `base.css`, `components.css` built from the best pieces of the four stylesheets. Contrast check on every text/background pair. | A style-guide test page shows every token and component, in both widths. |
| **3. Layout** | `layout.js`: nested page list, header with recolored SVG car logo (+ favicon), dropdown nav, menu button below 1024 px, footer with student-project statement. Keyboard and screen-reader behavior for the dropdowns. | Every page in the list shows the same header/footer; adding a page = one line. |
| **4. Data conversion** | `series.js`; `news.js` (merged, deduped); `tracks.js`, `terms.js`, `tactics.js`, `races.js` extracted from Ben's `script.js`; `photos.js` merged. All series IDs converted to the long form. A small `scripts/check.py` that confirms every series ID, photo ID and file path referenced in `data/` exists. | `check.py` passes; no page reads an old global (`PP_CONTENT`, `PP_DATA`, `PP_NEWS`, …). |
| **5. Refresh script** | Move `refresh.py` to `scripts/`, make it read the registry, write `data/generated/*.js`. Attempt NASCAR and IndyCar fetchers; add `schedule-manual.js` for what can't be fetched. | A run updates only `data/generated/`; summary printed per series. |
| **6. Media** | Merge images into `assets/images/…`, rename to `series-place-year`, remove duplicates, resize photos to ≤ 2000 px. Compress the hero video (target 4–6 MB at 1080p). | Every image on the site has a `photos.js` entry; repo media size reported before/after. |
| **7. Pages & features** | Build pages in this order, each reusing `js/features/`: **Home** (hero video/still, next-up countdown, latest news, series strip, Learn "start here", Instagram) → **News** (filter, search) → **Calendar** (Miranda's tool, time-zone toggle, export, "on track now") → **Planner** (clash detection, print) → **Series** template (schedule, results tables, line-ups, headlines) → **Tracks** (map + detail) → **Terminology**, **Tactics**, **Legacy** → **About**, **Sources**. One shared "my series" setting applied across News, Calendar, Planner and Home. | Each page works by double-click and through the preview server, at phone and desktop widths, with reduced motion respected. |
| **8. Docs** | `README.md`, `docs/adding-content.md` (recipes: page, news item, series, track, term, photo), `docs/data.md`, `docs/brand.md`, `docs/decisions.md`, `CLAUDE.md`. | A teammate can add a news item and a track by following the docs alone. |
| **9. GitHub Pages** | `_config.yml` excluding `archive/`, `docs/`, `scripts/` from the published site. Turn on Pages for `main` (root). **Confirm with you before turning it on**: it makes the site public at `shu-mk680-f26.github.io/pace-and-publish`. | Site loads at that address; all links and assets resolve. |
| **10. Final check** | Full pass in a browser: every page, both widths, keyboard only, broken links, console errors, `check.py`. | Results reported; PR opened for review. |

---

## 7. Things needed from you before or during the build

1. **Fonts download (step 2):** permission to download Oswald and Inter `.woff2` files (~150 KB total) from Google Fonts' GitHub repository (SIL Open Font License).
2. **Video compression (step 6):** `ffmpeg` isn't installed on this Mac. Either install it (`brew install ffmpeg`) or skip compression and keep the 17 MB file for now.
3. **Rebranded Instagram graphics:** the repo has the original launch posts. If the last five posts (the new branding) should appear on Home, their image files are needed.
4. **Optional extras:** decide whether to keep Evelin's news ticker and Miranda's start-lights animation (default: leave out; easy to add later as a feature file).
5. **Team sign-off:** this plan retires Evelin's and Sanith's calendars and Sanith's color scheme; worth sharing with the team before step 7.

---

## 8. Not in this build

- F1 Academy and Formula E (fetchers kept, switched off; add later via the registry).
- Scheduled refresh by GitHub Action and a pre-commit check hook (possible follow-ups).
- Any server, accounts, comments or polls.
