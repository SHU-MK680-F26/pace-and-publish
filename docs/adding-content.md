# Adding content

Every kind of content lives in one file in `data/`. Each file starts with a commented **TEMPLATE**: copy it, fill it in, save. No page or layout code needs to change.

After any change:

1. Run `python3 scripts/check.py`. It lists anything that points at a missing file, photo or series.
2. Open the page you changed (double-click it), then open the browser console (Cmd+Option+J in Chrome, Cmd+Option+C in Safari). The Learn pages print a warning for any broken guide entry.

Rules for all content: our own words, a named official source for every fact, no rumors stated as facts, no predictions, no favorites (see [brand.md](brand.md)).

---

## A news story

File: `data/news.js`. Copy the template at the top and fill in:

- `id`: unique, lowercase with hyphens (e.g. `f1-009`). Never change it once published: links use it (`news.html#f1-009`).
- `date`: the day the team post went out, `YYYY-MM-DD`.
- `series`: one or more ids from `data/series.js`, e.g. `["formula-1"]`.
- `type`: `results`, `recap`, `preview` or `feature`.
- `title`, `summary`, `body` (a list of paragraphs).
- `source`: `{ site: "formula1.com", url: "https://..." }`, the official page the facts come from.
- Optional: `podium` (results), `graphic` (our Instagram image in `assets/images/team/`) with `graphicAlt`, `photo` (a photo id), `featured: true` (lead story on Home).

It then appears on News, Home (newest first) and that series' page.

## Race weekends a script can't read

File: `data/schedule-manual.js`. Copy the template: `series`, `name`, `circuit`, `country`, `timeZone`, `season`, `startDate`/`endDate` and `sessions`. A session has either a `start` time (ISO with offset) or just a `date`. Add `durationMinutes` when the official site gives it: it turns on the "On track now" badge and exact clash checks in the planner.

These weekends show up in the Calendar, Planner, Home and series pages next to the generated ones. Never edit `data/generated/`: `scripts/refresh.py` rewrites it.

## A series

1. `data/series.js`: copy the template. `id` (lowercase-hyphen, never changes), `short` (tag text), `name`, `desc`, `site`/`siteUrl`, optional `photo` and `fetcher`.
2. `css/tokens.css`: add `--series-<id>-bg`, `-fg` and `-ring` using palette colors only.
3. `css/components.css`: add a `.tag--<id>` line next to the others (copy one and change the id).
4. Optional: a history entry in `data/series-history.js` (Legacy page), and a fetcher in `scripts/refresh.py` (its name goes in `fetcher`).

The series then appears in the Series menu, the footer, every filter and on Home, and gets its own page at `series.html?id=<id>`. F1 Academy and Formula E fetchers already exist: add `fetcher: "f1_academy"` or `fetcher: "formula_e"` entries to bring them back.

## A racetrack

File: `data/tracks.js`. Copy the template: `id`, `name`, `country`, `lat`/`lng` (decimal degrees), `series`, `type` (`permanent`, `street` or `oval`), `summary`, `body`, `sources`. Optional: `photo` and `map` (photo ids), `facts`, `related`, and a `detail` object like Monaco's (turns, laps, lap record).

The track gets a map marker, a list row, an entry on Racetracks and a count on Home automatically.

## A term, tactic or historical race

Files: `data/terms.js`, `data/tactics.js`, `data/races.js`. Same idea: copy the template. Mentions of a term's name anywhere in the guide link to it automatically. Use `related: { terms: [], tactics: [], tracks: [], races: [] }` to cross-link. Sources use the helpers in `data/sources.js`: `wiki("Page_title")` or `official("Title", "https://...")`.

## A photo

1. Save it in `assets/images/photos/` (or `tracks/`, `drivers/`, `team/`), named `series-place-year.jpg`, at most 2000 px wide (`sips --resampleWidth 2000 file.jpg` on a Mac).
2. Add an entry to `data/photos.js` with `src`, `width`, `height`, `alt`, `author`, `license`, `licenseUrl`, `sourceUrl`. Credits are required for Creative Commons photos, and the site shows them automatically wherever the photo appears.
3. Use its id anywhere: `photo: "wec-spa-2024-start"`.

## A page

1. Copy `docs/page-template.html` to the site root (e.g. `car-types.html`) and set its `<title>`, `data-page` and content.
2. Add one line to `NAV` in `js/layout.js`, either at the top level or inside a group's `children`, e.g. `{ id: "car-types", label: "Car types", href: "car-types.html" }` under Learn.

The header, nav (desktop and phone), footer and current-page highlight come with it.

## A feature

Put it in its own file in `js/features/`, expose one function on `PP` (e.g. `PP.myFeature.render()`), and call it from the pages that need it. Use the helpers in `js/core.js` (`U.el`, `U.tag`, `U.photo`, `U.scheduleFor`, `U.mySeries`, `U.onTick`, ...) and the classes in `css/components.css`.
