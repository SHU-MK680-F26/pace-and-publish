# Pace & Publish — website (MK-680, Week 10)

A static motorsport news site for Pace & Publish, Team B's fictional brand, built from `prd.md`. Plain HTML, CSS and JavaScript, with no frameworks, installs or server.

## How to open it

Double-click `index.html`. It opens in any current browser straight from disk (`file://`) and works offline.

**Viewing it in the Claude desktop app's Browser pane:** don't open `index.html` there as a `file://` link. The pane shows local files as a text-only snapshot, without the CSS, scripts or images next to them, so the site looks like plain white HTML with broken images. Instead, start the preview (`.claude/launch.json`, served from `http://127.0.0.1:8765/`), which shows the same files from this folder normally. Chrome, Safari, Edge and Firefox open `index.html` from disk correctly.

## Where to edit

| What | File |
| --- | --- |
| All articles, calendar events and Instagram posts | `data/content.js` (one file; Home, News, Dashboard and Calendar all read from it) |
| Brand colors and fonts | the token block at the top of `css/styles.css` (`:root`) |
| Header, footer and page text | the `.html` files |
| Navigation and shared card rendering | `js/main.js` |
| My Racing Dashboard logic | `js/dashboard.js` |

To feature an article on Home, set `featured: true` on it (keep 3 to 6 featured). To add a NASCAR story, add an article with `series: "NASCAR"`; the placeholder disappears by itself.

## Files

```
index.html  news.html  dashboard.html  calendar.html  about.html
css/styles.css
js/main.js  js/dashboard.js
data/content.js
assets/images/   (copied from mk680-team-b/content/images)
assets/logo/     (empty: see Content needed)
assets/fonts/    (empty: see Content needed)
```

## Where the content comes from

Everything is taken from Team B's repository (`mk680-team-b`), which was read but not changed.

| Site content | Source in mk680-team-b |
| --- | --- |
| Colors, font, wordmark | `content/launch.md` image plans and `brand/templates/` (Asphalt `#1E2228`, Chequered white `#F7F7F4`, British racing green `#1B5E3A`, Montserrat) |
| Tagline "Every series. One feed." | Headline of approved launch post 1, `content/launch.md` |
| Brand introduction, About page, voice | `brand/brief.md`, `brand/voice.md`, `brand/search.md`, `content/launch.md` |
| 14 news articles (F1 8, MotoGP 3, WEC 3) | Approved posts `content/2026-43-*.md`, `2026-44-*.md`, `2026-45-*.md`, with the official source URL each one cites |
| Article images | `content/images/week-1`, `week-2`, `week-3` (team post graphics) |
| Race Calendar (13 events) | `strategy/calendar-2026-43.md` to `calendar-2026-45.md` and the approved posts, each with its official source |
| Instagram section | Approved launch posts 1–3 in `content/launch.md` and `content/images/miranda-launch-*.png`; handle from `brand/brief.md` |
| Team names and roles | `README.md` roster |

No racing news, results, schedules or driver details were written from memory.

## Content needed

Every placeholder on the site, and every open item from PRD Section 10.1:

1. **NASCAR stories** (News page, Dashboard, Home series card). The repository has no verified NASCAR post: nascar.com could not be opened to confirm any race (`strategy/calendar-2026-45.md`). The site shows "Content needed: NASCAR story".
2. **NASCAR events** (Race Calendar). Same reason. The calendar shows "Content needed: NASCAR events".
3. **Hero racing photo** (Home). The repository holds text graphics only, no racing photos. The hero uses the team's launch graphic and a labeled placeholder chip.
4. **Circuit names for six calendar events** (6 Hours of Barcelona, 6 Hours of Monza, Las Vegas, Portugal, Valencia, Qatar 1812km). The repository does not name these circuits; each shows "Circuit: content needed". The F1 Las Vegas and MotoGP Portugal and Valencia entries also use the short names the repository records, not full event names.
5. **Audience demographics and personas** (About). The brand files give the audience's habits but no age range, location or personas.
6. **Logo files** (`assets/logo/`). No logo file is in the repository; the header uses the "Pace & Publish" wordmark in Montserrat with a green rule, as in the team templates.
7. **Montserrat font files** (`assets/fonts/`). No font files are in the repository. The site uses Montserrat if it is installed on the computer, otherwise the system font. Adding `.woff2` files and pointing the `@font-face` rules at them would make it identical everywhere.
8. **Image rights confirmation.** All images are Team B's own graphics; the PRD asks the team to confirm this.
9. **MotoGP Qatar dates.** Taken from `content/2026-44-race-preview.md` (6–8 November); `strategy/calendar-2026-45.md` notes the motogp.com event page no longer states them. Worth re-checking.

## Decisions made where the PRD was silent or open

- **Brand palette:** the team palette from the approved launch posts and templates, not the yellow and Space Mono look of individual launch drafts. `--color-secondary` is the grey outline from the results template (`#A3A7AD`). Supporting tokens (a darker green for hover, a raised dark surface, white card surface, muted text grey, yellow focus ring) are derived and marked in `styles.css`.
- **Dark Racing theme (Week 10 redesign):** near-black page (`--color-bg`) and charcoal sections (`--color-bg-2`) with Asphalt cards, Chequered white text, bold uppercase headlines, slanted green "speed" stripes and short hover animations (all switched off when the visitor's system asks for reduced motion). In the dark theme `--color-light` and `--color-text` are the text colors and `--color-bg` is the page background.
- **No red accent:** red was considered and left out. The brand's only accent is British racing green, and the team avoids any team's livery color (red is strongly tied to one F1 team) so no team or driver looks favored (`brand/voice.md` "Professional", `strategy/calendar-evelin.md`). A lighter tint of the green (`--color-accent`) is used only for thin lines, links and small labels so they stay readable on black (8.8:1).
- **Hero imagery:** the repository has no racing photos, so the hero shows three team graphics large, in a fanned spread: the F1 and MotoGP race-week preview, the "Every series. One feed." launch graphic in front, and the WEC fun fact. The hero-photo placeholder stays until the team supplies a photo.
- **Fonts:** local only, no hosted font link, so the site works offline (PRD 6.1).
- **Series accent colors:** one green accent for all four series. The brand has one accent color, and a single color keeps the series neutral.
- **Article view:** "Read more" expands the full text and source link on the same page (no modal).
- **Remembered preferences:** kept. The dashboard saves the selection in `localStorage` (key `pp-dashboard-series`); if storage is blocked it still works for the visit.
- **About page:** built.
- **Article dates:** each article's date is the day the team's post went out; the race date is in the summary.
- **Featured stories:** the most recent post for each series that has content (F1, MotoGP, WEC), shown in the fixed series order.
- **Multi-series posts** (for example the October 25 roundup) are split into one article per series so each sits under its own series. Two articles may share the same graphic.
- **Card images:** team graphics are 4:5 portrait; cards keep a 16:9 frame and show the whole graphic on the asphalt background rather than cropping text.
- **Event dates:** events store a first day and an optional last day (`dateEnd`). An event counts as past once its last day is before today.
- **Content date range:** posts from October 25 to November 11, 2026; the site shows "Content as of November 12, 2026" (`asOf` in `data/content.js`).
- **`.claude/launch.json`:** only used so Claude's browser pane could preview the site during testing. The site itself does not need it or any server.
- **Folder:** files sit directly in `my-brand-site/` rather than a `pace-and-publish/` subfolder, so `index.html` is at the top level.

## Version 2: Dark Racing editorial redesign (Nov 12, 2026)

The full specification and acceptance criteria are in `prd.md` Section 11.

**New and changed files**
- `circuits.html` and `js/circuits.js`: the Explore the Circuits section, which also appears on Home.
- `data/content.js`: adds `circuits` (Monaco, Silverstone, Suzuka) and a `label` for each series.
- `css/styles.css`: rewritten for the v2 design system. All colors and fonts are still defined as tokens in `:root`.
- `js/main.js`: the editorial featured layout (lead plus supporting cards), "More stories", the series bar and the upcoming-events preview on Home.
- `js/dashboard.js`: series labels, plus an optional `data-limit` attribute. Home shows the 6 newest matches and links to `dashboard.html`. Filtering and saved selections are unchanged.

**Where the circuit facts come from:** each value comes from the official formula1.com circuit page, checked on Nov 12, 2026. The source URL is stored with each circuit. The descriptions and facts are written in our own words.

**Design decisions**
- **Color:** Timing yellow `#F2B705` (already in the repository as a neutral highlight) is used for buttons, active states and stat values. Brand green marks the wordmark, series tags and accent rules. The proposed orange `#FF4D24` and navy `#162B68` are not used because they sit close to current team liveries.
- **Hero:** the repository has no racing photograph. The hero uses a CSS-built "long-exposure" background (blurred chequered line and motion streaks) with a fanned stack of three real team post graphics, one each for F1, MotoGP and WEC, plus a visible "Photo pending" label.
- **Lead story:** the most recent featured story by date leads, so no series is favored.
- **Navigation:** it collapses into the menu button below 1024 px, because six links don't fit at tablet width.

### Content needed (v2 additions)
1. **Track maps** for Monaco, Silverstone and Suzuka. No verified layout asset is in the repository, so the explorer shows "Track map pending".
2. **Number of turns** for each circuit. formula1.com's circuit pages do not list it, so it shows "Content needed".
3. **Hero racing photograph:** a team-owned landscape photo, about 1600 × 900 px or larger and under 500 KB, would replace the CSS background.

## Version 3: editorial card system (Nov 12, 2026)

- **Hero:** a full-bleed photograph, `assets/images/hero-road-sunrise.jpg`. It is cropped and compressed (150 KB) from the Canva stock photo in Ben's launch post (`content/images/ben-launch-2.png`). The crop sits above the post's baked-in text and below its carousel dots, so none of that text appears. The image is credited on the page. It replaces the three small cards and the "photo pending" label.
- **Image composition (every card):** a blurred, darkened enlargement of the team graphic as the backdrop, a soft spotlight and corner glow, and the full graphic shown sharp on top like a print. The graphics are never cropped, so their own text stays intact.
- **Featured news:** cover cards. The lead takes about 60% of the grid width, with an uppercase headline and a yellow rule. Two supporting covers are stacked beside it. Text and print sit in separate columns at every width (checked from 375 to 1920 px).
- **More stories, News and Dashboard results:** borderless image-first cards with the text on the page, as in the "Latest News" reference.
- **Category cards:** four poster cards in a "Browse by series" section under the hero, each showing that series' latest results graphic. NASCAR has no verified content, so it uses the team's generic "Lights Out" launch graphic and says "Coming soon". Layout: 4 columns from 1200 px, 2×2 from 768 px, and one row per card on phones.
- **New images copied:** `hero-road-sunrise.jpg` (derived from `ben-launch-2.png`) and `ben-launch-1.png`.
- **Colors unchanged:** no orange or navy accent, because both are close to current team liveries (see v2).

## Version 4: Explore the Circuits completed (Nov 12, 2026)

The track maps and circuit photos come from Wikimedia Commons, approved by Evelin on Nov 12, 2026, because the team repository has none (`pace-publish-image-pack/circuits/` is empty and marked NEEDED). Local copies are in `assets/images/circuits/`. Each image shows its credit on the page, as its license requires.

### Image credits

| File | Author | License | Source | Changes |
| --- | --- | --- | --- | --- |
| `circuits/monaco-track.svg` | Will Pittenger | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Monte_Carlo_Formula_1_track_map.svg) | File unchanged; colors inverted in CSS for display |
| `circuits/silverstone-track.svg` | AlexJ | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Circuit_Silverstone_2011.svg) | File unchanged; colors inverted in CSS for display |
| `circuits/suzuka-track.svg` | Will Pittenger | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Suzuka_circuit_map--2005.svg) | File unchanged; colors inverted in CSS for display. The map was drawn in 2005 and prints 5.8153 km; the site shows the official 5.807 km. |
| `circuits/monaco.jpg` | Planet Labs, Inc. | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Circuit_de_Monaco,_April_1,_2018_SkySat_(cropped).jpg) | File unchanged; cropped on screen |
| `circuits/silverstone.jpg` | Planet Labs, Inc. | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Silverstone_Circuit,_July_2,_2018_SkySat_(cropped).jpg) | Resized to 1440 px wide (421 KB); cropped on screen |
| `circuits/suzuka.jpg` | BWard 1997 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Suzuka_Circuit_21-09-2024.jpg) | Resized to 1600 px wide (338 KB), camera metadata removed; cropped on screen |

The adapted Silverstone and Suzuka photos remain under their original licenses.

### Circuit facts and sources
- **Length, first Grand Prix, lap record:** the formula1.com 2026 circuit pages.
- **Turns:** Monaco 19 and Silverstone 18 from the formula1.com 2026 circuit guides; Suzuka 18 from the [official Suzuka Circuit course guide](https://www.suzukacircuit.jp/eng/course_s/) (four-wheel course).
- **Circuit type, historical fact and description:** written in our own words from the formula1.com circuit pages.

### Content needed (updated)
- The track maps, circuit photos and turn counts are no longer needed; they are all in place.
- The images listed in `pace-publish-image-pack/IMAGE-SOURCING.csv` for other sections are still NEEDED.

## Version 5: Premium F1 editorial identity (Nov 18, 2026)

**Brief:** sections 1–3 of the v5 brief (references, creative direction, visual identity). The message was cut off at section 4 ("Homepage"), so no further homepage requirements were applied. Full details are in `prd.md` Section 11.9.

- **Racing red accents, chosen by Evelin.** This overrides the brand neutrality rule:
  - deep red `#C8102E` for fills (buttons, active tabs, selected series), with white text at 5.9:1
  - brighter red `#FF5E6A` for red text and hairlines, at 6.5:1 on black and at least 4.8:1 on every surface
- **Brand green** appears only in the wordmark rule.
- **Metallic gray** `#8B929C` is used for tags, rules, secondary labels and the second line of the hero headline.
- **Headline font:** condensed display type, in this order: DIN Condensed, Avenir Next Condensed, Bahnschrift Condensed, Roboto Condensed, Arial Narrow. These are system fonts, so the site works offline and needs no font files. Faux bold is switched off.
- **Square geometry:** no corner rounder than 2 px. Pills, cards and toggles are square, and the colored glows are gone.
- **Two-tier navigation:** a slim utility row (series quick links and the content date) sits above the main navigation. It is hidden below 1024 px.
- **Hero:** the headline reads "EVERY SERIES. / ONE FEED." in off-white and metallic gray. A numbered ticker of the three newest verified stories runs along the bottom of the hero (two on phones).
- **Reference sites studied:** formula1.com, mclaren.com/racing and mercedesamgf1.com (ferrari.com did not load). Only their qualities were borrowed, never their logos, layouts or team colors.
- **Page generator:** the scratch script used to generate the pages is gone, so the HTML files are now the source and are edited directly.

## Version 6: Homepage and experience refinement (Nov 18, 2026)

Built from sections 4–10 of the v5 brief. Full details are in `prd.md` Section 11.10.

- **More stories:** an asymmetric layout with one wide 16:9 story and a numbered headline list (02–05) that links to each series on News. No repeated card shapes.
- **Editorial standards band:** a new full-width typographic section ("Confirmed facts. Our own words. No favorites."). It has three numbered principles taken from `brand/voice.md` and `strategy/sources.md`, a thin chequered strip and an angled red slash. The About paragraph that repeated it was rewritten.
- **Home dashboard:** a compact two-column headline list instead of image cards, so story images aren't repeated on the page. `dashboard.html` keeps its cards.
- **Category cards:** each now uses the series' *other* verified results graphic (F1 United States GP, MotoGP Indonesia, WEC Barcelona), so none repeats a Featured image.
- **Circuits:** the spec sheet shows length, turns **and laps** (Monaco 78, Silverstone 52, Suzuka 53, from formula1.com), plus country, type and first Grand Prix. Race distance and lap record are in the line below.
- **Scroll reveal:** short fade-ups added by script only, so content stays visible without JavaScript and with reduced motion.
- **Search and performance:** Open Graph and Twitter tags on every page, `color-scheme`, a preloaded hero image with `fetchpriority="high"`, and circuit images preloaded only after the page has loaded.
- **Accessibility:** heading order fixed on `dashboard.html`. Every page has one `h1`, named links and buttons, unique IDs and `lang="en"`.
- **Photography:** the F1 photography the brief asks for (cars, night races, pit lanes, drivers) is not in the team repository and was not inserted. See `IMAGES-NEEDED.md` for the 8 slots, their placement and their licensing rules.

## Version 7: Direction A "Grand Prix" redesign (Nov 18, 2026)

Evelin chose Direction A from three mockups (`mockups/`, kept for reference; these files are design comps only and load candidate photos from Wikimedia Commons). Evelin approved the five photos below on Nov 18, 2026, including a hero that centers on one team (Mercedes), with the brand's no-favorites rule noted.

### What changed
- **Home:**
  - A transparent navigation over a full-screen car hero turns solid on scroll; the red "My Dashboard" button sits last.
  - The hero has a two-tone condensed headline, an outlined "01" and a numbered ticker of the three newest stories.
  - A red diagonal "Latest from the paddock" band leads into a tight photo mosaic, then More stories, the editorial standards band, photo posters for the four series, and oversized outlined section numbers (02–07).
- **Inner pages:** News, Dashboard, Calendar and About open on a cinematic photo header with a credit. Circuits keeps a technical-grid header so its maps lead. Every page has the same navigation and red button.
- **Photos:** each photo is labeled "file photo" in its caption, because it illustrates a series, not the specific event in a story. No photo repeats on the homepage.
- **Mobile:** the hero stacks (photo band first, then the headline on carbon), and the series posters get a stronger shade so their text stays readable.
- **Fixes found in testing:**
  - The hero height is capped (it used to stretch on very tall windows).
  - The mobile credit offset is corrected.
  - The red button moved to the end of the navigation.

### Photo credits (`assets/images/photos/`, all via Wikimedia Commons)

| File | Shows | Photographer | License | Changes |
| --- | --- | --- | --- | --- |
| `f1-dutch-gp-2024-sparks.jpg` | Mercedes-AMG Petronas, 2024 Dutch GP (homepage hero) | Steffen Prößdorf | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Compressed (417 KB), metadata removed |
| `f1-dutch-gp-2024-track.jpg` | F1 car on track, 2024 Dutch GP (F1 poster, About header) | Steffen Prößdorf | CC BY-SA 4.0 | Resized to 1400 px (257 KB) |
| `f1-dutch-gp-2024-tyres.jpg` | F1 tyres, 2024 Dutch GP (F1 story photo, Dashboard header) | Steffen Prößdorf | CC BY-SA 4.0 | Resized to 1400 px (271 KB) |
| `wec-spa-2024-start.jpg` | Hypercar field, 2024 6 Hours of Spa (WEC poster, News header) | MarcelX42 | CC BY-SA 4.0 | Resized to 1600 px (342 KB) |
| `nascar-bristol-2023-restart.jpg` | Restart at Bristol, 2023 (NASCAR poster, Calendar header) | Zach Catanzareti Photo | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | Resized to 1400 px (229 KB) |

The adapted CC BY-SA files remain under CC BY-SA 4.0.

### Still needed (see `IMAGES-NEEDED.md`)
A 2025–2026 MotoGP on-track photo (the MotoGP poster still uses the team results graphic), a night-race photo and a pit-stop photo. No suitable openly licensed, current images were found.
