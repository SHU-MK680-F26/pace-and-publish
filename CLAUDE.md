# Pace & Publish site: working rules

Static site, no build step: plain HTML, CSS and classic `<script>` JavaScript (no modules, no `fetch` of local files) so every page works when opened by double-click (`file://`). Preview server: `.claude/launch.json` (port 8780). Read `docs/decisions.md` before changing structure; record new decisions there.

## Conventions

- **Pages:** one `.html` per page at the root, built from `docs/page-template.html`. Header/nav/footer come from `js/layout.js`; register every page in its `NAV` list. Don't hand-write a header or footer.
- **Data:** content lives in `data/*.js`, one file per type, assigned to `window.PP.<name>`. Never put content in feature code. Never edit `data/generated/` (written by `scripts/refresh.py`), except headline `caption` fields, which the refresh keeps. Hand-entered schedules go in `data/schedule-manual.js`.
- **Series:** always the long ids from `data/series.js` (`formula-1`, `motogp`, `wec`, `nascar`, `imsa`, `indycar`). A new series = registry entry + tag tokens in `css/tokens.css` + `.tag--<id>` in `css/components.css`.
- **Styles:** components use semantic tokens only (`--color-*`, `--space-*`, `--text-*`, `--speed`, `--ease`), never raw hex or `--raw-*`. Breakpoints: `max-width: 599px` and `max-width: 1023px`. Every animation must stop under `prefers-reduced-motion`.
- **Photos:** every image is an entry in `data/photos.js` with author, license and source; reference it by id. Files go in `assets/images/<photos|tracks|drivers|team>/`, named `series-place-year`, ≤ 2000 px.
- **Features:** one file per feature in `js/features/`, exposing one object on `PP`; use helpers from `js/core.js` (`PP.util`).
- **Archive:** `archive/` holds the four original sites unchanged. Read from it; don't edit it.

## Content rules (docs/brand.md)

Our own words; every fact cites an official source; no rumors as facts, predictions, opinions or favorites; never invent schedules, results or quotes. Where data is missing, show a labeled empty state.

## Before committing

1. `python3 scripts/check.py` must pass.
2. Open the changed pages in the preview: no console errors, nothing overflowing at 375 px wide, keyboard focus visible.
