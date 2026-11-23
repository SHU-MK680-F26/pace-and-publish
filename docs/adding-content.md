# Adding content

Every kind of content lives in one file in `data/`. Each file starts with a commented **TEMPLATE**: copy it, fill it in, save. No page or layout code needs to change.

After any change:

1. Run `python3 scripts/check.py`. It lists anything that points at a missing file, photo or series.
2. Open the page you changed (double-click it), then open the browser console (Cmd+Option+J in Chrome, Cmd+Option+C in Safari). The Learn pages print a warning for any broken guide entry.

Rules for all content: our own words, a named official source for every fact, no rumors stated as facts, no predictions, no favorites (see [brand.md](brand.md)).

---

## News (official headlines)

The News page, Home's "Latest news" and each series page show only official headlines, read from each series' own news page by `scripts/refresh.py` into `data/generated/headlines.js`. Each item has two fields in our own words (see [brand.md](brand.md)), and every card links to the full article:
- **`caption`:** our short headline, 6 to 14 words. Shown on every news card.
- **`summary`:** one or two sentences, at most 45 words, adding the key details. Shown under the headline on Home's six featured cards.

- **Get new headlines:** `python3 scripts/refresh.py` (or name series ids to refresh only those).
- **Write captions after each refresh:** in Claude Code, in this project, run **`/caption-headlines`**. Claude reads each new official article and writes the missing headline and summary in the brand voice. This is the same way Miranda's site worked, with no API key and no extra cost (it uses your Claude plan). The refresh ends by saying how many headlines are waiting. Review the captions it shows you before committing.
  - Under the hood: `python3 scripts/captions.py todo` lists items missing a headline or summary, with their article text and the rules; `python3 scripts/captions.py apply` saves them (JSON `{"<sourceUrl>": {"caption": "...", "summary": "..."}}` on stdin), filling only missing fields. Saved captions carry `captionBy: "Claude Code"` and `captionedAt`.
  - Until a headline is captioned, its card shows "New article on <site>". Never show the source's own headline (Miranda's PRD rule).
  - To fix a caption by hand, edit its `caption` in `data/generated/headlines.js` (and its `captionBy`). Every refresh keeps it, matched by `sourceUrl`.
- **Optional, paid:** `scripts/refresh.py` can write captions itself through the Anthropic API (`claude-opus-5-5`). It runs only when `ANTHROPIC_API_KEY` is set or with `--api-captions`, and needs `python3 -m pip install anthropic`. `--captions-only` captions existing headlines that way without refetching; `--no-captions` turns it off.

`data/news.js` still holds the team's 14 stories written from the Week 1-3 Instagram posts, but no page shows them (decision of 2026-11-23).

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
