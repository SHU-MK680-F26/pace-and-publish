---
document: Product Requirements Document (rough draft, v11)
product: Pace & Publish website
date: 2026-11-13
status: draft
author-agent: claude (main session)
source: website/Ben Santangelo Week 10.pages ("Plan"), brand/voice.md, CLAUDE.md, owner answers 2026-11-12
---

# Pace & Publish Website: PRD (Rough Draft)

> Pace & Publish is a fictional brand run as a student project (MK-680). The site must say so in its footer and About section, matching the Instagram bio.

## 1. Summary

A static, evergreen website that works as a starter guide to motorsport racing for new fans. It covers terminology, tactics, racetracks, and famous historical races, and has a viewer for Pace & Publish Instagram posts. Dense internal linking lets a reader jump from any term, track, or race to related material in one click.

## 2. Problem and goals

**Problem.** New fans run into unfamiliar terms, strategies, and circuits as soon as they start watching, and the explanations are scattered across many sites and long articles.

**Goals**

1. Give a new fan one place to learn the basics of motorsport.
2. Introduce several series side by side, so a fan who starts with one series can find their way into others. **Core series:** F1, MotoGP, WEC, and IndyCar. **Also covered:** other series such as NASCAR.
3. Send readers to the Instagram account for ongoing news.

**Non-goals (out of scope)**

- Sign-ups, accounts, newsletters, payments, or comments.
- Live timing, results, schedules, or anything else that needs regular updating.
- "This week" or current-season content.

## 3. Audience

- **Primary: new fans.** People just getting into motorsport who need terms and concepts explained from scratch, with no jargon left undefined.
- **Growth path:** new fans who, over time, may follow several series. The site helps that by explaining concepts across series and pointing out where series differ.

## 4. Pages

### Must have

| Page | Purpose | Key content |
|---|---|---|
| **Home** | Route readers around the site | Short welcome for new fans, a "start here" path (Terminology → Tactics → Racetracks → Historical Races), links to every section, Instagram feed viewer at the bottom |
| **Terminology** | Beginner's dictionary of racing terms | A–Z entries, each with a plain-language definition, the series it applies to, and links to related tactics, tracks, or races |
| **Tactics** | Strategies drivers and teams use to win | Entries such as pit strategy, undercut/overcut, drafting, and tire management, explained for beginners and linked back to terms |
| **Racetracks (Racetrack Repository)** | The important tracks | Interactive world map at the top; one entry per track with location, series raced there, layout features, and what to look for when watching a race there; each entry has its own anchor so the map can link to it |
| **Famous Historical Races** | Races that show why people love the sport | One entry per race: date, series, track (linked), and what happened, from cited sources |

### Track list (30)

Chosen to spread across the covered series and several continents. Each entry describes the layout and history, not who races there now. **25 confirmed 2026-11-12; tracks 26–30 (IndyCar) added 2026-11-13.** The list must be easy to grow (see §9.1).

| # | Track | Country | Mainly known for |
|---|---|---|---|
| 1 | Circuit de Monaco | Monaco | F1 |
| 2 | Silverstone Circuit | United Kingdom | F1, MotoGP, WEC |
| 3 | Autodromo Nazionale Monza | Italy | F1, WEC |
| 4 | Circuit de Spa-Francorchamps | Belgium | F1, WEC |
| 5 | Suzuka Circuit | Japan | F1 |
| 6 | Autódromo José Carlos Pace (Interlagos) | Brazil | F1, WEC |
| 7 | Circuit Gilles Villeneuve | Canada | F1 |
| 8 | Circuit of the Americas | United States | F1, MotoGP, WEC |
| 9 | Marina Bay Street Circuit | Singapore | F1 |
| 10 | Red Bull Ring | Austria | F1, MotoGP |
| 11 | Albert Park Circuit | Australia | F1 |
| 12 | Autodromo Internazionale del Mugello | Italy | MotoGP |
| 13 | Phillip Island Grand Prix Circuit | Australia | MotoGP |
| 14 | TT Circuit Assen | Netherlands | MotoGP |
| 15 | Sepang International Circuit | Malaysia | MotoGP |
| 16 | Circuito de Jerez | Spain | MotoGP |
| 17 | Circuit de la Sarthe (Le Mans) | France | WEC |
| 18 | Fuji Speedway | Japan | WEC |
| 19 | Sebring International Raceway | United States | Endurance |
| 20 | Bahrain International Circuit | Bahrain | F1, WEC |
| 21 | Daytona International Speedway | United States | NASCAR, endurance |
| 22 | Talladega Superspeedway | United States | NASCAR |
| 23 | Bristol Motor Speedway | United States | NASCAR |
| 24 | Indianapolis Motor Speedway | United States | IndyCar, NASCAR |
| 25 | Watkins Glen International | United States | NASCAR |
| 26 | Streets of Long Beach | United States | IndyCar |
| 27 | Road America | United States | IndyCar, NASCAR |
| 28 | Laguna Seca Raceway | United States | IndyCar, MotoGP (past) |
| 29 | Mid-Ohio Sports Car Course | United States | IndyCar |
| 30 | Iowa Speedway | United States | IndyCar |

The "mainly known for" column is for planning only. On the site, series links are written as history ("has hosted the Japanese Grand Prix since 1987") so they stay evergreen.

### Nice to have (placeholders in v1)

These pages ship in v1 as placeholders: a section with its title, a one-line description of what it will hold, a "coming soon" note, and a place in the navigation. Full content comes later.

| Page | Notes for when it is built out |
|---|---|
| **Car Types** | Overview of the car classes in each series. Must describe, never advise or make performance claims (see §8). |
| **Hall of Fame Drivers** | Notable drivers from the past. Text only, because the image rules exclude people. Needs a neutral, cited selection rule so it doesn't read as favoritism (see §8). |
| **About** | Student-project disclosure, what Pace & Publish is, link to Instagram. The disclosure itself is already required in the footer, so the placeholder only needs to repeat it. |

## 5. Features

### 5.1 Interactive track map (integrated tool)

- A world map with a marker at each track listed in the Racetrack Repository.
- Clicking a marker opens a popup with the track name, country, series, and a one- or two-sentence description.
- A **Learn More** button in the popup jumps to that track's entry on the Racetracks page (for example `#track-silverstone`).
- Proposed build: Leaflet with OpenStreetMap tiles, both free. The map attribution must stay visible.
- Built for mouse and keyboard on a computer: hover shows the track name, click opens the popup, and the scroll wheel zooms. A keyboard-accessible list of tracks sits beside the map as a fallback.
- Also works by touch on a phone: tap a marker to open its popup and pinch to zoom. On phones the map opens zoomed out to show every track, popups stay inside the map, the track list sits below the map, and the instructions on the page switch to touch wording (added 2026-11-13).

### 5.2 Instagram feed viewer (bottom of Home)

- Shows the latest posts from the Pace & Publish account, https://www.instagram.com/paceandpublish/. No posts are picked by hand: the viewer pulls whatever the account has posted, so the site itself never needs editing to stay current.
- **Method (decided): Behold** (https://behold.so), a feed-widget service that connects through Instagram's official API. The account owner signs in to Behold once; Behold holds the access token, and the site only includes Behold's embed snippet. Unofficial profile embeds and scraping tools stay excluded (CLAUDE.md).
- **Why Behold for a small brand:** its free plan is the most generous of the options checked. Figures as listed on its pricing page, 2026-11-12 (https://behold.so/pricing); confirm before signing up:

  | | Behold Free | Behold Starter |
  |---|---|---|
  | Price | $0 / month | $10 / month |
  | Views | 1,200 / month | 15,000 / month |
  | Posts shown | up to 6 | up to 50 |
  | Updates | once a day | hourly |
  | Branding | Behold logo on hover | none |

  Elfsight's free plan was reported at about 200 views a month (https://embeddable.co/blog/best-instagram-feed-widgets-for-websites-2026), and LightWidget's free version reportedly shows a watermark and may lack HTTPS (same source), so both were ruled out.
- **Layout:** a grid of up to 6 posts on the free plan, each linking to the post on Instagram, with a "Follow @paceandpublish" button under the grid.
- **Status: deferred.** No Behold account will be created for now. v1 ships with the styled "Follow @paceandpublish on Instagram" card linking to the profile. That card stays as the fallback once the widget is connected.
- **Hidden for later:** `index.html` includes the Behold block commented out, with the setup steps below in the comment, so turning it on later means following the steps, pasting the feed ID, and removing the comment markers. Nothing Behold-related loads or shows until then.

<!-- Behold setup steps (deferred 2026-11-12; kept for later):
  1. Make sure @paceandpublish is an Instagram Business account. Instagram has required this for third-party apps since December 2024, per Behold's FAQ (https://behold.so/faqs/).
  2. Create a free Behold account, connect @paceandpublish, and create one feed.
  3. Copy the feed ID or embed snippet from Behold (https://behold.so/docs/widget), paste it into the commented-out block in index.html, and remove the comment markers.
  Watch-out: Behold's FAQ describes its JSON feed as its main product, with the drop-in widget newer. If the widget doesn't fit, render the 6 posts from Behold's JSON feed with the site's own styling instead.
-->


### 5.3 Internal linking

- Every term, tactic, track, and race has a stable anchor ID.
- Mentions of a defined term in any entry link to its Terminology entry.
- A persistent navigation bar on every page, plus "related" links at the end of each entry.

### 5.4 Source citations

- Every image has a visible credit: photographer or author, source, and license.
- Every factual entry (track facts, historical races) cites its source.
- A Sources and Credits section collects everything in one place.

## 6. Content and voice

All copy follows `brand/voice.md`, adapted from news captions to an evergreen guide:

- **Professional:** written the way a trustworthy reference would be.
- **Succinct:** each entry gives the core idea and one relevant detail, then stops.
- **Authentic:** only what is documented, with no overhype or exaggeration.
- **Competitive:** the clearest beginner explanation a fan can find, so they don't need another site.
- **Intrigued:** genuine interest in the sport; nothing negative or dismissive.

**Hard rules (from `brand/voice.md` and CLAUDE.md)**

- Never swear.
- Never add details beyond what official or cited sources report.
- Never speculate about causes, reasoning, or intentions.
- Check that every source is up to date.
- No advice or claims about cars, driving, or repairs.
- No advice or claims about medical treatments.
- No health, financial, or legal claims.

**Website-specific rules**

- No emojis anywhere on the site.
- Written in our own words: never copied or lightly reworded from another site.
- Neutral: no favorite team or driver.
- No predictions of race, championship, or season outcomes.
- Nothing negative about a nationality or any other group of people.

**Evergreen rule.** No content may need updating over time:

- Explain concepts, track layouts, and past events, and avoid current teams, driver line-ups, schedules, or standings.
- Historical races are described as past events with their date, so they stay accurate.
- Track entries avoid details that change often (sponsor names, current lap records, which series currently races there). Where a fact could change, write it as a dated historical fact ("hosted its first Grand Prix in 1950") rather than a present-tense claim.
- Beginner-friendly: define every term the first time it appears, or link to its definition.

## 7. Look and feel

Matched to the Pace & Publish post images supplied on 2026-11-12 (the week's options page). Hex values were sampled from compressed screenshots, so each is accurate to within a few points. If the original design files exist, their exact values win.

### Colors

| Name | Hex | Seen in the posts as |
|---|---|---|
| Lights-Out Black | `#0C0C12` | Dark backgrounds, number cells, caption boxes |
| Starting-Line White | `#EAE6E0` | Warm off-white backgrounds and tiles, light text on dark |
| Race-Paint Yellow | `#F4C537` | Highlight headline words, tiles, chart bars |
| Flaming-Hot Orange | `#F64C1C` | Full backgrounds, label tags, accent bands |
| Night-Drive Navy | `#14286C` | Full backgrounds on several posts (added to the palette 2026-11-12) |

**Contrast (WCAG ratios, from these hex values)**

| Pairing | Ratio | Use |
|---|---|---|
| Black on White | 15.7 : 1 | Body text |
| Black on Yellow | 12.0 : 1 | Body text |
| White on Navy | 10.9 : 1 | Body text |
| Yellow on Navy | 8.3 : 1 | Body text |
| Black on Orange | 5.5 : 1 | Body text (matches the orange posts' black headlines) |
| White on Orange | 2.8 : 1 | Avoid for text |
| Yellow or Orange on White | 1.3 / 2.8 : 1 | Avoid for text; decorative only |

### Type

| Use | Font | Notes |
|---|---|---|
| Headlines | **Oswald** 700, capitals, tight line height | Closest free match to the posts' tall, heavy condensed headlines; also used in the team-b repo. Confirmed 2026-11-12. |
| Body and labels | **Inter** 500–800 | Matches the bold grotesque body text in the posts; also used in the team-b repo. Confirmed 2026-11-12. |
| Brand name | "Pace & Publish" in Inter 800 | Same treatment as the posts |

Both load free from Google Fonts. The plan asks for a narrow sans-serif: Oswald covers that for headings, while Inter keeps long definitions easy to read. Switching body text to a condensed face (Barlow Condensed) is possible if the whole site should feel narrow.

### Other

| Element | Requirement |
|---|---|
| Graphic style | Borrow from the posts: solid color blocks, small label tags (for example an orange "F1" tag), big numbers, thin rules between items, no gradients |
| Imagery | A few photos of race cars, tracks, and equipment. **No people.** Every image verified and easy to attribute. |
| Layout | Desktop-first: designed for laptop and desktop screens (1280–1920 px wide), using the width for side-by-side layouts such as the map next to the track list. Phones are also supported (added 2026-11-13): at 720 px wide and below the layout adapts without changing the desktop design. The nav becomes one swipeable row under the brand name, headlines scale to the screen, multi-column sections stack, and nothing scrolls sideways. On short screens below desktop width (a phone held sideways), the header and A–Z bar scroll with the page instead of staying fixed. |

## 8. Constraints and rules

- **Image sources:** Wikimedia Commons is the main source. Use only photos with a reusable license (CC BY, CC BY-SA, CC0, or public domain), and record the author, file page URL, and license for each. No Getty Images or iStock (CLAUDE.md).
- **Fact sources:** some official series sites (NASCAR in particular) may block automated access. Where an official site can't be reached, cite another reliable, citable source instead, and never fill a gap from memory without a source.
- **No people in images.** This also rules out driver photos on the Hall of Fame page.
- **Car Types page:** describe the cars, but give no advice or performance claims about cars, driving, or repairs.
- **Hall of Fame page:** use a neutral, cited selection rule (for example, championship counts from official series records) so the list doesn't show a favorite driver. Retired drivers keep it evergreen.
- **No personal data:** no forms, no analytics that collect personal data, no cookies beyond what the Instagram embed sets.
- **Publishing:** Claude delivers the site as a pull request, and a person approves and publishes it.

## 9. Technical approach (proposed)

- **Technology (required):** plain HTML, CSS, and JavaScript only. No frameworks (React, Vue, and so on), no build tools or bundlers, no package manager, and no server-side code. What is in the folder is exactly what the browser runs.
- **Folder and entry point (required):** everything the site needs lives in the `website/` folder, and the site opens by double-clicking `website/index.html` (a local `file://` address), with no local server.
- **Format (confirmed):** `index.html` holds the whole site, with each "page" as a section reached by hash links (`#terminology`, `#tracks`, and so on). CSS and JS are inline by default; if the file grows too large to edit comfortably, they may move to `style.css` and `script.js` next to it in the same folder, linked with relative paths.
- **Rules that keep it working as a local file:**
  - Use relative paths only (`style.css`, not `/style.css`).
  - Classic `<script>` tags, not `type="module"`, because browsers block JavaScript modules on `file://` pages.
  - No `fetch()` or loading of local JSON files, which browsers also block on `file://` pages. Content lives in JavaScript arrays (§9.1).
  - Leaflet's own files are saved inside the folder (for example `website/vendor/leaflet/`) rather than loaded from a CDN, so the map code works without a CDN.
- **Needs an internet connection:** map tiles (OpenStreetMap), Google Fonts, Wikimedia Commons photos, and the Instagram link. When offline, the page still works: fonts fall back to system fonts, the map area shows the keyboard-accessible track list instead of tiles, and photos show their alt text and credit. The Behold widget, if turned on later, should be tested from a `file://` page, since some embed services require a real web address.
- **External dependencies:** Leaflet (pinned version, saved in the folder), OpenStreetMap tiles, Google Fonts (Oswald, Inter), and Wikimedia Commons image URLs. Behold's embed snippet is present only as a code comment until it is turned on.
- **Content as data:** terms, tactics, tracks, and races stored as JS arrays inside the file, so adding an entry doesn't mean editing the layout.
- **Accessibility:** semantic headings, alt text on every image, visible focus states, and the keyboard fallback for the map.
- **Hosting:** opening `index.html` locally is the requirement. Because the folder has no build step, it can also be hosted as-is later (for example on GitHub Pages) without changes.

### 9.1 Adding content later (tracks first, same pattern for every list)

**Goal:** adding a track takes one new entry in one place, with no changes to layout, map, or navigation code.

**Single source of truth.** All tracks live in one `TRACKS` array near the top of the script, in a clearly marked "CONTENT: TRACKS" block. The map markers, the Racetracks list, the keyboard fallback list, the Learn More links, cross-links from terms and races, and the track count on the Home page are all generated from that array. Nothing about a track is written anywhere else.

**Entry shape.** Every track uses the same fields; a commented template sits at the top of the block to copy:

| Field | Required | Example | Notes |
|---|---|---|---|
| `id` | yes | `"suzuka"` | Lowercase, hyphens only. Becomes the anchor `#track-suzuka`. Never change it once published, because links point at it. |
| `name` | yes | `"Suzuka Circuit"` | Full official name |
| `shortName` | no | `"Suzuka"` | Used on the map popup and in tight spaces |
| `country` | yes | `"Japan"` | |
| `lat`, `lng` | yes | `34.8431`, `136.5407` | Decimal degrees, for the map marker |
| `series` | yes | `["f1"]` | Keys from a shared `SERIES` list (f1, motogp, wec, nascar, indycar, other) so labels and colors stay consistent |
| `type` | yes | `"permanent"` | `permanent`, `street`, or `oval` |
| `summary` | yes | one or two sentences | Shown in the map popup |
| `body` | yes | short paragraphs | Shown on the Racetracks page: layout, history, what to look for |
| `facts` | no | `[{ label: "First race", value: "1962" }]` | Only evergreen, dated facts |
| `related` | no | `{ terms: ["esses"], races: ["japan-1989"] }` | IDs from the other lists; turned into links automatically |
| `image` | no | `{ src, alt, author, license, sourceUrl }` | Wikimedia Commons file; all four credit fields required if an image is used |
| `sources` | yes | `[{ title, url }]` | At least one citable source |

**Ordering and display.** The list is sorted by name (or grouped by series or continent) in code, so a new entry can go anywhere in the array. Entry order in the file doesn't matter.

**Built-in checks.** On page load the script checks every entry and logs a clear console warning (without breaking the page) for a missing required field, a duplicate `id`, an `id` with the wrong format, coordinates out of range, an unknown series key, a `related` ID that doesn't exist, or an image without full credit. The same checks run for the other lists.

**Same pattern elsewhere.** Terms (`TERMS`), tactics (`TACTICS`), historical races (`RACES`), and later car types (`CARS`) and Hall of Fame drivers (`DRIVERS`) each get their own array, template, and checks. Turning a placeholder page into a full one means filling its array, not building a new page.

**How-to note.** A short comment at the top of the file explains, in plain language, how to add a track, term, tactic, or race, and how to check the console for warnings afterward.

## 10. Open questions

None at the moment.

**Decided 2026-11-12:** Oswald + Inter fonts confirmed; track list confirmed, built to be extended (§9.1); single file; core series F1, MotoGP, WEC plus others such as NASCAR (IndyCar added to core series 2026-11-13); Instagram shows the account's feed through Behold rather than hand-picked posts; nice-to-have pages ship as placeholders; Wikimedia Commons is the photo source; 30 tracks (25 plus 5 IndyCar tracks added 2026-11-13); colors and fonts matched to the post images; navy added as Night-Drive Navy; Behold setup deferred, v1 uses the follow card with the Behold block hidden in a code comment.

**Decided 2026-11-13:** phones are supported alongside the desktop-first design; phone-only adjustments must leave the desktop layout unchanged.

## 11. Success criteria (draft)

- All five must-have pages are live and reachable from the Home page in one click, and the three nice-to-have placeholders appear in the navigation.
- Every track marker's Learn More button lands on the correct entry.
- Adding a test track as one new entry in `TRACKS` makes it appear on the map, in the list, and in the Home page count with no other edits, and the built-in checks show no warnings for the 30 launch tracks.
- Every image and factual entry has a visible source.
- All copy passes the `brand/voice.md` checklist.
- No entry contains current-season facts (line-ups, schedules, standings) that would need updating.
- A new fan can follow every page without meeting an undefined term.
- The site opens by double-clicking `website/index.html`, with no server or build step, and shows no console errors.
- The layout looks right at 1280 px and 1920 px wide, and still has no horizontal scrolling in a browser window narrowed to 1024 px.
- On phones (360–430 px wide, and held sideways), every page fits the screen with no horizontal scrolling, all text is readable without zooming, and the map, popups, and nav work by touch.
- The student-project disclosure is visible in the footer.

## 12. Proposed milestones

1. Set up the content arrays, entry templates, and built-in checks (§9.1).
2. Content outline: list of terms, tactics, tracks, and races, with sources.
3. Build the page shell, navigation, colors, and type.
4. Build the track map and wire up the Learn More links.
5. Write and cite the content, then run the voice checklist review.
6. Add the Instagram follow card (with the Behold block commented out for later), the placeholder pages, and the credits section.
7. Open a pull request for review.

## 13. Updates during the build (2026-11-13)

Changes made while building the site. Where an item here conflicts with an earlier section, this section wins; the section it replaces is named in brackets.

### 13.1 Pages and navigation

- **Legacy page replaces Historical Races** [§4]. The nav item "Historical Races" is now "Legacy". The page has three sections, in this order, with numbered jump tiles at the top:
  1. **Series:** a full entry for each core series (see §13.2).
  2. **Historical Races:** the same race entries and numbered index as before.
  3. **Hall of Fame:** the placeholder moved here from its own page, so it no longer has a nav item.
- Old links still work: `#races`, `#hall-of-fame`, and every `#race-…` link open Legacy and scroll to the right place.
- Home's step 04 card is now "Legacy" and shows the series and race counts.
- **About page is complete** [§4, nice to have]. It has two sections and a side panel:
  - **The team:** one paragraph about the student team and the brand, with no names.
  - **How this site was made:** discloses that the site was built with help from Claude, an AI model made by Anthropic. Claude researched and wrote the entries, chose the photos, and wrote the code from the team's plan and this document. The team set the direction and reviewed the results. Facts come from cited sources, and readers can report errors on Instagram.
  - **At a glance:** what the brand is, the series covered, how the site was built, no affiliation, and links to Instagram and Sources & Credits.
- Remaining placeholders: Car Types (in the nav) and Hall of Fame (inside Legacy) [replaces §11's "three nice-to-have placeholders appear in the navigation"].

### 13.2 Content

- **Series entries.** Formula One, MotoGP, WEC, IndyCar, and NASCAR each have a Legacy entry (`#series-<key>`) in the same style as track and race entries: a one-line summary, four dated facts, two paragraphs, related links, and cited sources. They live in the existing `SERIES` list, which gains optional `summary`, `facts`, `body`, and `related` fields; a series with a `body` gets an entry automatically [§9.1]. The built-in checks cover series too.
- Home's series cards link to their Legacy entries. Track and race entries link to their series.
- New term: **Stock car** (cited).
- 36 more terms and 5 more tactics added from the official F1, MotoGP, and IndyCar glossaries (flags, penalties, timing, track features, and riding and driving terms), each written in our own words and cited. Terms tied to current regulations (such as Active Aero, Overtake Mode, and push-to-pass) were left out.
- **Terminology filter:** series buttons above the A-Z bar show only the terms for one series, with a checkbox for whether terms used in every series stay visible. The A-Z bar and a count line update to match, and a link to a hidden term clears the filter.
- Launch counts: 84 terms, 14 tactics, 30 tracks, 8 races, 5 series, 4 photos.

### 13.3 Track map

- **Built-in world outline.** OpenStreetMap's tile servers block requests that don't come from a web address, so tiles never load on a page opened by double-clicking (`file://`). The site therefore includes its own world outline: Natural Earth 1:50m land (public domain), via world-atlas 2.0.2, saved as `website/vendor/world/land-50m.js` and drawn in the brand colors [replaces §9's offline note that "the map area shows the keyboard-accessible track list instead of tiles"].
- **Basic / Detailed toggle** in the map's lower-left corner:
  - **Basic** (the default) is the built-in outline. It works offline and on `file://`, and zooms in to a regional level.
  - **Detailed** adds OpenStreetMap tiles with full zoom, and is credited on the map only while it's showing.
  - Detailed fades and can't be selected when it isn't available: on `file://` pages, when the browser reports no connection, when a background check of one tile fails, or when tiles fail after switching. The map then stays on, or returns to, Basic.
- Credits for the outline are on the map and on the Sources & Credits page.

### 13.4 Look and feel

- **New header stripe** [§7, Other]. The orange double stripe read as too close to F1's branding, so every page header now uses:
  - two rows of black-and-white checks with a straight left end,
  - then an orange bar over a shorter yellow bar,
  - with every inner and right-hand edge cut at the same 45-degree angle.
- The stripe also appears on Home, between the hero and "Start here".
- A smaller version (one row of checks, thinner bars, half the page wide) sits above each Legacy section header and each About section.
- Legacy's section headers are larger, and its jump tiles lift on hover like Home's "Start here" panels.
- The design options considered are kept in `design-review/stripe-options.html`, which is not part of the website.

### 13.5 Success criteria added [§11]

- Every series entry is reachable from Legacy and from Home's series cards, and passes the built-in checks.
- The map shows the Basic outline with working markers, popups, and Learn More links when `index.html` is double-clicked, and Detailed is visibly unavailable there.
- On a web address, switching to Detailed loads OpenStreetMap tiles, and switching back removes them.
- The About page discloses the AI's role and names no team members.

### 13.6 Source checks against official and reference sites [§5.4, §8]

- **Official series sites.** formula1.com, motogp.com, fiawec.com, and indycar.com were checked for evergreen facts already on the site. Where a page confirmed an entry, it was added as a source: F1, MotoGP, WEC, and IndyCar glossaries on 18 terms and 4 tactics; F1 circuit pages on 9 tracks; the WEC Le Mans page; IndyCar's Laguna Seca and Indianapolis 500 pages; and the official pages on the 1950 British Grand Prix, the 1911 Indianapolis 500, and four series entries. nascar.com blocked automated access, so nothing came from it.
- The DRS term and tactic now say the 2026 regulations replaced DRS with Active Aero and Overtake Mode, matching the F1 glossary.
- Where an official figure differed from ours, the team chose to keep the current figures and their Wikipedia sources: Spa's first Grand Prix (1925), Road America (4.048 miles, 14 turns), and Mid-Ohio (2.4 miles, 15 turns). The disagreeing official pages are not cited.
- **RacingCircuits.info.** All 30 track entries were checked against it, and it is now cited on 27 of them. Six entries were reworded so both sources support them: Spa ("about 14 km" of public roads before 1979), Albert Park (roads "reworked and resurfaced" before 1996), Sepang (no distance from Kuala Lumpur), Fuji ("First races: 1966" instead of an opening month), Watkins Glen (overhauled in 1971, with a 1992 chicane creating today's layout), and Iowa (no count of road course layouts). Three were left unchanged without the extra source: Red Bull Ring (official F1 and Wikipedia agree on 1970), Le Mans (official WEC agrees on 13.626 km), and Phillip Island (1952 versus 1956 opening is disputed between sources).
- Some official sources sit on season-dated web addresses (for example `/racing/2026/` or `/Schedule/2027/`). The facts are evergreen, but the links should be rechecked each year.

### 13.7 Terminology quick sets

- A second row of filters sits under the series buttons: **Starter Pack** (15 core terms for new fans), **Flags** (the 7 flag terms), and **Penalties** (penalty types plus the related jump start, track limits, black flag, and steward entries). The active set shows in orange.
- Sets combine with the series filter (for example MotoGP plus Penalties), clicking the active set clears it, and a link to a hidden term clears both rows.
- Membership is data, not layout: each term has an optional `topics` list, and the sets are defined once in a `TOPICS` list in the script. The built-in checks warn about an unknown set name.

### 13.8 Copy changes

- Home intro: "in plain language and one click at a time" removed.
- Racetrack Repository intro: "Hover over a marker to see the track name, or click it for a summary. Use the list of links beside the map to navigate." On touch screens it reads "Tap a marker for a summary. Use the list of links below the map to navigate."
- Historical Races description: "Moments of pure drama that made motorsport history: these are the races that turned viewers into lifelong fans."

