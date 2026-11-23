# Pace & Publish: project summary (MK-680, Week 10)

Evelin Kamimura, Team B · Final audit on Nov 18, 2026 · Version 7.3

The full specification, decision log and audit table are in `prd.md`; Section 12 covers the final site. Image credits and content sources are in `README.md`.

## 1. Final website features

The site is static: plain HTML, CSS and vanilla JavaScript. It opens by double-clicking `index.html` and works offline with no server or frameworks. All content lives in one file, `data/content.js`, which holds 14 articles, 13 events, 3 circuits, 5 photos and the series data.

| Page | Features |
| --- | --- |
| **Home** | <ul><li>A full-screen F1 photo hero with the headline "Every series. One feed.", two buttons and a ticker of the three newest stories.</li><li>A red "Latest from the paddock" band, three featured stories, More stories and an editorial standards band.</li><li>Four series posters (F1, MotoGP, NASCAR, WEC).</li><li>Explore the Circuits, a compact dashboard, upcoming events, About and the Instagram highlight.</li></ul> |
| **News** | <ul><li>14 articles grouped in the fixed order F1, MotoGP, NASCAR, WEC.</li><li>Series filter tabs.</li><li>"Read more" expands an article on the page.</li><li>A labeled NASCAR empty state.</li></ul> |
| **Explore the Circuits** | <ul><li>Tabs for Monaco, Silverstone and Suzuka.</li><li>A licensed track map and photo for each.</li><li>Length, turns, laps, country, type, first Grand Prix, race distance, lap record, a history fact and sources.</li><li>Keyboard support: arrow keys, Home and End.</li></ul> |
| **My Racing Dashboard** | <ul><li>Four series toggles plus Select all and Clear.</li><li>Stories update instantly, newest first, with OR logic.</li><li>A live summary line and filtered upcoming events.</li><li>The selection is saved on the device.</li></ul> |
| **Race Calendar** | <ul><li>13 verified events, each with its official source.</li><li>Sorted by date, with past events separated from upcoming ones.</li><li>NASCAR shows a labeled placeholder.</li></ul> |
| **About** | Brand story, audience, editorial standards, Team B credits and the Instagram link |

**Shared across all pages:**
- A two-tier header: a utility row on desktop, plus a red "My Dashboard" button.
- A hamburger menu below 1024 px.
- A footer with the student-project statement.
- Open Graph tags.
- Credits for every photo.

## 2. Changes from the original PRD

| Original PRD | Final site | Why |
| --- | --- | --- |
| Light theme, brand tokens to be decided | Dark theme: carbon black, racing-red accents, green only in the wordmark | Evelin's redesign briefs (v2 and v5) |
| Team images only | Licensed Wikimedia Commons maps, circuit photos and five racing photos, all credited | The team repository has no racing photography or track maps; Evelin approved each image set |
| Five pages | Six pages: Explore the Circuits was added | Requested in the v2 brief |
| Menu button below 768 px | Menu button below 1024 px | Six links don't fit at tablet width |
| Hero 500–650 px, headline 64–80 px | Full-screen hero (at most 1000 px), headline about 166 px | Direction A mockup |
| Rounded cards (10–14 px) | Square edges (2 px or less) | v5 premium F1 identity |
| Neutral colors; no livery-like accent | Racing red, and a hero centered on one team | Evelin chose both after the conflict with `brand/voice.md` was raised; recorded as exceptions |
| Simple 16:9 article grid | Cover cards, a photo mosaic, a numbered story list and series posters | v3 and v7 card-system briefs |
| Circuit stats without turns | Turns and laps both shown, each with a source | The v4 and v6 briefs asked for each |

## 3. Design improvements across the rounds

| Round | Date | What changed |
| --- | --- | --- |
| v1 | Nov 12 | <ul><li>A working build from the PRD.</li><li>Brand tokens from the team files.</li><li>Dashboard, News, Calendar and About pages.</li><li>Labeled placeholders where content was missing.</li></ul> |
| v2 Dark Racing | Nov 12 | <ul><li>Dark editorial theme with a Timing-yellow accent.</li><li>Lead and supporting featured cards.</li><li>First Explore the Circuits.</li><li>Pill toggles.</li></ul> |
| (fix) | Nov 12 | <ul><li>Diagnosed "plain HTML, broken images": the Browser pane shows `file://` pages as an unstyled snapshot, so the site itself was fine.</li><li>Added a local preview server for testing.</li></ul> |
| v3 Cards | Nov 12 | <ul><li>Cover-style featured cards and series poster cards.</li><li>Team graphics shown whole over a blurred backdrop, never cropped.</li><li>A real photo hero, cut from Ben's launch post.</li></ul> |
| v4 Circuits | Nov 12 | <ul><li>Real licensed track maps and circuit photos.</li><li>A tab interface.</li><li>Verified turn counts.</li></ul> |
| v5 Premium F1 | Nov 18 | <ul><li>Racing red, a condensed display font and square geometry.</li><li>Two-tier navigation.</li><li>Two-tone headlines and a numbered story ticker.</li></ul> |
| v6 Refinement | Nov 18 | <ul><li>Asymmetric More stories and an editorial standards band.</li><li>Laps added to the circuits.</li><li>Scroll reveal and performance and SEO tags.</li></ul> |
| v7 Grand Prix | Nov 18 | <ul><li>Three mockups, and Evelin chose A.</li><li>A full-bleed car hero, the red paddock band and a photo mosaic.</li><li>Outlined section numbers and cinematic inner-page headers.</li><li>Five approved photos.</li></ul> |
| v7.3 Tap areas | Nov 18 | Credit and source links got larger tap areas from invisible padding: 14 px → at least 31 px (median 44 px). No text moved. |
| v7.2 Mobile text | Nov 18 | After the final audit, body copy on phones was raised to 16 px to meet RS-5; desktop unchanged. |
| v7.1 Mobile | Nov 18 | Fixes from the iPhone 17 Pro Max review: <ul><li>Larger circuit tab labels.</li><li>The red rule no longer crosses the intro text.</li><li>A four-across News filter.</li><li>Readable credits.</li><li>Nothing hidden on the first screen.</li></ul> |

## 4. Prompts that worked well

- **Specific briefs with numbered sections and constraints.** One example is the 18-section premium redesign brief with exact colors and an explicit QA requirement. Every requirement could be checked off and tested.
- **"Show me three mockups before implementing."** This was the most effective prompt of the project. It moved the creative choice to Evelin before any code changed, and the result ("A Grand Prix") was approved on the first build.
- **Short, explicit approvals:** "Approve all six", "Approve all five", "go forward", "A Grand Prix". They were clear decisions on questions that had already been laid out, with no room to misread.
- **Bug reports that described symptoms and asked for verification.** The request about "plain HTML with broken images" said "don't claim it's fixed until verified". That led to finding the real cause (the Browser pane) instead of changing working code.
- **Testing prompts with a checklist,** such as the iPhone review covering navigation, images, text, buttons, circuits and overflow. Each item became a measurable check.
- **Saying what was wrong and why,** for example "cards look like simple information boxes" or "still shows TRACK MAP PENDING". This made the gap between the expectation and the build concrete.
- **Reference images and websites** gave a clear target for tone and composition.

## 5. Prompts that were less effective

- **The v5 brief was cut off** at "4. Homepa", so only sections 1–3 were applied. Sections 4–10 needed a second message ("I'll paste it"). Very long pastes are better sent in parts and labeled "part 1 of 2".
- **Requests that conflicted with the brand rules or the PRD**, such as orange and navy accents, racing red, real F1 car photos and "no invented content" next to "make the track map real". Each needed a pause to flag the conflict. Saying up front "the brand rule can be overridden for X" would have saved a round.
- **Laps and turns flipped between briefs.** v4 asked for turns instead of laps; v6 asked for laps. The final site shows both.
- **"Not satisfied, looks like a template"** without a specific target. This led to two incremental rounds (v5, v6) before the mockup request produced the step change Evelin wanted.
- **Asking for photography the repository didn't contain** ("cinematic F1 photos"). This couldn't be done until licensed sources were proposed and approved.
- **Reference sites:** ferrari.com did not load, so it couldn't be used as a reference.

## 6. Misinterpretations during development

1. **Track maps.** Claude read "never invent content" strictly and left "Track map pending" placeholders. Evelin expected real maps. This was fixed by sourcing licensed Wikimedia Commons maps with approval (v4).
2. **The scale of a redesign.** Claude treated "premium" and "refine" briefs (v5, v6) as refinements of the existing layout. Evelin wanted a substantial visual change, which came only with the mockup round (v7).
3. **The cause of "the site looks broken".** It looked like broken CSS and image paths, but the Browser pane can't render local `file://` pages with their CSS. The site was working when opened normally.
4. **The cut-off v5 brief** was applied only as far as it went. The homepage requirements were missed until the rest was pasted.
5. **Hero sizing.** The first v7 hero stretched on very tall windows. It is now capped at 1000 px.
6. **Device size.** Apple does not publish the logical screen size of the "iPhone 17 Pro Max". Testing assumed 440 × 956, the same as the 16 Pro Max.

## 7. Mobile and desktop testing results

**Method:** each test was run on the final site on Nov 18, 2026.
- An automated audit loaded all six pages at 375, 440, 768, 1024 and 1440 px.
- Scripted tests exercised the dashboard, circuits, calendar, News page and links.
- Headless Chrome opened every page straight from disk.
- The source code was searched for rule violations.

| Check | Result |
| --- | --- |
| Horizontal scrolling or cut-off elements, all pages at all widths | None |
| Broken images, missing `alt` text, console errors | None |
| One `h1` per page, no skipped heading levels | Pass on all 6 pages |
| Hamburger menu (375, 440, 768 px) | Opens and closes; the current page is marked; links work |
| Desktop navigation (1024 px and wider) | All six links visible; "My Dashboard" last; the header turns solid on scroll |
| News grid columns | 1, 2 and 3 columns at 375, 768 and 1440 px |
| Dashboard | <ul><li>All four series selected by default: 14 stories.</li><li>F1 alone: 8. F1 + WEC: 11, newest first.</li><li>Clear and NASCAR-only both show the correct messages.</li><li>Select all: 14.</li><li>Each update takes about 3 ms, with no reload.</li><li>The selection is restored after reload.</li><li>No external requests.</li></ul> |
| Explore the Circuits | <ul><li>Each tab shows the correct map, photo, name, length, turns and laps.</li><li>Exactly one tab is selected.</li><li>Arrow keys, Home and End work.</li><li>The map is the largest element.</li></ul> |
| Race Calendar | <ul><li>13 of 13 events, sorted, each with a source.</li><li>9 past and 4 upcoming events, separated.</li></ul> |
| Internal links | All resolve |
| Opened from `file://` | Every page renders its articles, tabs, events and dashboard |
| Code rules | <ul><li>No external scripts or `fetch`.</li><li>No colors outside the tokens.</li><li>No corner radius above 2 px.</li><li>No image over 500 KB.</li></ul> |
| Tap targets on phones | Buttons, tabs and navigation are at least 44 px. Credit and source links are at least 31 px (median 44 px) after v7.3; they were 14 px. This meets WCAG 2.2 AA. |
| Body text on phones (RS-5, 16 px or larger) | **Pass** after the v7.2 fix (it was 14.1–15.7 px). Short metadata lines (source lines, labels, credits) stay smaller by design. |

## 8. Remaining issues

**Design issues:**
- **RS-5:** fixed in v7.2.
- **Small links:** fixed in v7.3 with invisible padding (at least 31 px, median 44 px). About one in five credit links stay under 44 px where two credit lines sit close together; a full 44 px there would need more spacing (a visual change).

**Content gaps:**
- NASCAR stories and events: none verified on nascar.com.
- A current MotoGP photo.
- Night-race and pit-stop photos.
- The circuit for six calendar events.
- Audience personas.
- Logo files and Montserrat font files.

**Approved brand exceptions:**
- Racing red accents.
- A hero centered on one team (Mercedes).

**To check or confirm:**
- The team's confirmation of rights to its own graphics.
- The MotoGP Qatar dates, which should be re-checked on motogp.com.
- Browsers: testing used Chrome only. Firefox, Safari and Edge were not tested.
- Fonts vary by system: DIN Condensed on Mac, Bahnschrift on Windows.

**Documentation:**
- `README.md` keeps each round's notes in order. Its first "Content needed" list (the hero photo, "no red accent") reflects v1 and is superseded by the v5–v7 sections below it.
- The content is a snapshot as of Nov 12, 2026, so the "Upcoming" event lists will shrink over time.
