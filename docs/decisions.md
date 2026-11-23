# Decisions

Agreed on 2026-11-23 when the four team sites were merged. Change them on purpose, not by accident: if you need to, add a dated note here explaining why.

| # | Area | Decision | Why |
|---|---|---|---|
| 1 | Page structure | Separate HTML pages; `js/layout.js` builds the header and footer from one page list. No build step. | Every original site opens by double-click; a single nav list means adding a page is one line. A static site generator (Eleventy) is the upgrade path if the site outgrows this. |
| 2 | Data | One `.js` file per content type under `window.PP`; `data/series.js` registry with long ids; `refresh.py` writes only `data/generated/`. | `.json` can't load from a double-clicked page; separate files avoid merge conflicts and keep generated and hand-written data apart. |
| 3 | Design tokens | Ben's palette (it matches the rebranded Instagram), Oswald + Inter stored locally, two-layer tokens, breakpoints 600 / 1024 px, series as text tags. | One place to rebrand; consistent look offline. |
| 4 | Header and nav | News · Series ▾ · Calendar · Learn ▾ · About + Weekend planner button; menu button below 1024 px; Sanith's car logo recolored. | Fifteen-plus pages need groups; the Series menu fills itself from the registry. |
| 5 | Features | One feature per job: Miranda's calendar + Sanith's planner on real data; Ben's track map + Evelin's circuit detail; one shared "my series" setting. Kept countdowns, live badges, sortable results, news search, hero video (still on phones). Cut carousels and the poll. Left out (for now) Evelin's ticker and Miranda's start lights. | Three calendars with different data would contradict each other. |
| 6 | Media | One `assets/` tree by type; every photo credited from `data/photos.js`; duplicates removed; ≤ 2000 px. | CC BY / BY-SA photos require a credit wherever they appear. |
| 7 | Docs and tooling | Root README, `docs/`, `CLAUDE.md`, originals in `archive/`, GitHub Pages. | |

## Scope (2026-11-23)

Series covered: **F1, MotoGP, WEC, NASCAR, IMSA, IndyCar.** F1 Academy and Formula E fetchers are kept in `scripts/refresh.py`, switched off; adding them back is a registry entry.

## Open items

- **Hero video size:** 17 MB, not yet compressed (needs `ffmpeg`). It only loads on large screens.
- **Instagram feed:** Ben's follow card ships; the Behold feed slot is in `index.html`, commented out, with setup steps.
- **IMSA:** news only (imsa.com blocks scripts). Schedules can be hand-entered in `data/schedule-manual.js`.
- **Two track photos** (Spa, Laguna Seca) still load from Wikimedia (`remote: true` in `data/photos.js`).
- **IndyCar** has no poster photo yet, and no results (dates only until times are published).
- **Brand docs:** the `brand/` files in the team repo still describe the old green-and-asphalt brand.

## Publishing

GitHub Pages serves `main` from the repository root. `_config.yml` keeps `archive/`, `docs/` and `scripts/` out of the published site.
