# Pace & Publish Website — Product Requirements Document

Nov 12, 2026 · @Evelin Kamimura

**Status:** Final. Approved for submission on Nov 18, 2026 (version 7.3). Sections 1–10 are the original requirements, Section 11 records each approved redesign in order, and **Section 12 describes the final website, the final audit and the remaining issues**. Where sections disagree, the later one wins.

**Course:** MK-680, Week 10 individual assignment, Sacred Heart University

**Team:** Team B

## 0. How Claude Code should use this PRD

Claude Code should treat this document as the single source of product decisions. Where the PRD and the brand files disagree on brand identity, the brand files win. Where the PRD is silent, Claude Code should choose the simplest option that meets the acceptance criteria and record the choice in `README.md`.

Placeholders in the form **\[TBD: …\]** mark information the brand files must supply. Claude Code must not invent values for them. If a placeholder is still open at build time, Claude Code should build anyway, using a labeled placeholder or the neutral fallback named next to it, and list it in README.md.

The key words MUST, SHOULD and MAY carry their usual meaning: MUST is required, SHOULD is expected unless there is a stated reason, and MAY is optional.

## 1. Project overview and purpose

Pace & Publish is a fictional motorsport news brand created by Team B. It brings news and updates from four racing series, Formula 1 (F1), MotoGP, NASCAR and the FIA World Endurance Championship (WEC), into one place. This project builds a static, locally run website that presents the brand and lets visitors filter content by the series they follow.

**Problem.** Fans who follow several series must check separate websites and apps to stay current.

**Solution.** One site that groups verified updates by series, plus a personal filter (My Racing Dashboard) that shows only the series a visitor selects.

**Brand characteristics.** Every page MUST reflect the three brand traits: **authentic**, **professional** and **intriguing**. Section 5 explains how each trait translates into copy and design.

**Project goals**

1. Present the Pace & Publish brand consistently with the team's brand files.
2. Organize motorsport content clearly by series.
3. Deliver a working, client-side interactive dashboard.
4. Run entirely from `index.html` on a local machine, on desktop and mobile screen sizes.

**Context.** This is a class project. The site will not be published, and it uses no live data, accounts or payments.

## 2. Target audience

The primary audience is motorsport fans who follow more than one racing series and want quick, reliable updates without checking several sources.

| Attribute | Description |
| --- | --- |
| Core need | Fast, trustworthy updates across F1, MotoGP, NASCAR and WEC in one place |
| Behavior | Checks news often, frequently on a phone; skims headlines before reading in depth |
| Expectations | Accurate facts, a clear separation of confirmed news from speculation, no team or driver bias |
| Demographics and personas | **\[TBD: age range, location and personas from the brand files\]** |

**Design implications**

- Headlines, series labels and dates MUST be visible without opening an article.
- The series filter MUST be reachable from the main navigation in one click or tap.
- Mobile layout is a first-class requirement, not an afterthought.

## 3. Site map and features

The site is a small multi-page static website. Every page shares one header, one navigation bar and one footer.

| Page | File | Priority | Purpose |
| --- | --- | --- | --- |
| Home | `index.html` | Must-have | Introduces the brand and highlights featured content |
| News | `news.html` | Must-have | All articles, grouped by series, with series tabs or anchors |
| My Racing Dashboard | `dashboard.html` | Must-have | Interactive series filter |
| Race Calendar | `calendar.html` | Nice-to-have | Verified upcoming or recent events from the repository |
| About | `about.html` | SHOULD | Brand story, mission, editorial standards and Team B credits |
| Explore the Circuits | `circuits.html` | Must-have (v2) | Interactive circuit explorer (Section 11.5); also embedded on Home |

The Instagram highlight is a section on the Home page, not a separate page.

### 3.1 Must-have features

**F1. Homepage**

- Hero area with the Pace & Publish logo, name, tagline **\[TBD: tagline from brand files\]** and a strong racing image.
- A short brand introduction (2–3 sentences) stating what Pace & Publish is and who it serves.
- A Featured Stories area showing 3 to 6 articles marked `featured: true` in the content data.
- A "Browse by series" strip with one card each for F1, MotoGP, NASCAR and WEC, linking to that series on the News page.
- A call-to-action button linking to My Racing Dashboard.

**F2. News section by series**

- Four series groups in a fixed order: F1, MotoGP, NASCAR, WEC.
- Each article card shows: series label, headline, date, 1–2 sentence summary, image (or neutral placeholder), and source or author attribution.
- Series tabs or in-page anchor links let visitors jump to one series.
- A series with no articles shows a short empty-state message instead of a blank area.
- Articles MAY open as an expanded view on the same page or as a modal. A separate page per article is not required.

**F3. My Racing Dashboard.** Full requirements in Section 4.

**F4. Navigation**

- A persistent header with logo (linking to Home) and links to every page in the table above.
- The current page is visually marked in the navigation.
- Below 768 px width, the navigation collapses into a menu button that opens and closes the links.
- A footer repeats the main links and states that Pace & Publish is a fictional brand created for MK-680.

**F5. Responsive design**

- Layouts adapt at three widths: mobile (≤ 767 px), tablet (768–1023 px) and desktop (≥ 1024 px).
- Article grids use 1 column on mobile, 2 on tablet and 3 on desktop.

### 3.2 Nice-to-have features

These SHOULD be built only after every must-have passes its acceptance criteria.

**N1. Race Calendar.** A list or table of events, using only verified entries already in the repository. Each entry shows series, event name, circuit, location and date. Events are sorted by date, and past events are visually separated from upcoming ones. No event may be added from memory.

**N2. Instagram highlight.** A Home page section showing 3 to 6 of Team B's Instagram posts as local images with captions, plus a link to the team account **\[TBD: Instagram handle and URL\]**. No embedded feed or external script.

**N3. Additional visuals.** Extra racing images, series icons and decorative elements from the project files, used to strengthen the motorsport feel without slowing the page.

## 4. My Racing Dashboard requirements

The dashboard lets a visitor pick one or more series and instantly see only the matching local content. It runs entirely in the browser with no network requests.

### 4.1 Inputs

| Input | Control | Values | Notes |
| --- | --- | --- | --- |
| Series selection | Four toggle controls (checkboxes or toggle buttons) | F1, MotoGP, NASCAR, WEC | Any combination, including none |
| Select all | Button | — | Selects all four series |
| Clear | Button | — | Deselects all four series |

Each toggle MUST show its state with more than color alone (for example a checkmark or filled style plus `aria-pressed` or a native checkbox).

### 4.2 Outputs

- A results area listing every content item whose series is selected, sorted newest first.
- Each result uses the same card design as the News page (series label, headline, date, summary, image).
- A live summary line above the results, for example: "Showing 7 stories for F1 and WEC."
- If the Race Calendar (N1) is built, a second results group, "Upcoming events", filtered the same way.

### 4.3 Behavior rules

1. **Default state.** On first visit all four series are selected. **(Confirmed by Team B.)**
2. **Filter logic.** An item appears if its `series` matches *any* selected series (OR logic).
3. **Instant update.** Results and the summary line update on every toggle, with no page reload and no submit button.
4. **Empty state: nothing selected.** Show: "Select at least one series to build your dashboard."
5. **Empty state: no matching content.** Show: "No stories are available yet for \[series names\]. Try adding another series."
6. **Remembered preferences.** The selection SHOULD be saved in `localStorage` and restored on the next visit. Storage access MUST be wrapped in `try/catch`, so the dashboard still works if storage is blocked.
7. **Accessibility.** The summary line uses `aria-live="polite"` so screen readers announce changes. All controls work with keyboard only (Tab, Space, Enter).
8. **No external calls.** The dashboard MUST NOT make any network request.

### 4.4 Data model

All content lives in one local file, `data/content.js`, which assigns a global object (for example `window.PP_CONTENT`). A `.json` file loaded with `fetch()` MUST NOT be used, because browsers block `fetch()` for pages opened directly from disk (`file://`).

**Article fields**

| Field | Type | Required | Example or rule |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique, e.g. `f1-001` |
| `series` | string | Yes | Exactly one of `F1`, `MotoGP`, `NASCAR`, `WEC` |
| `title` | string | Yes | Headline, ≤ 90 characters |
| `date` | string | Yes | ISO format `YYYY-MM-DD` |
| `summary` | string | Yes | 1–2 sentences |
| `body` | string | No | Full text for the expanded view |
| `image` | string | No | Relative path in `assets/images/`; placeholder if missing |
| `imageAlt` | string | If image | Describes the image |
| `source` | string | Yes | Author or verified source name |
| `sourceUrl` | string | No | Link to the original verified source |
| `featured` | boolean | No | `true` shows the article on Home |

**Event fields (only if N1 is built):** `id`, `series`, `name`, `circuit`, `location`, `date` (ISO), `source`.

The Home, News and Dashboard pages MUST all read from this one file, so content is edited in a single place.

## 5. Content sources and brand guidelines

The team's brand files are the source of truth for identity, audience and voice. Site content comes only from Team B's existing materials; nothing is invented.

### 5.1 Content sources, in priority order

1. **Team B brand files** (brand guide, style guide, audience profile): identity, voice, colors, typography, logo. **\[TBD: file names and repository paths\]**
2. **Team B content** (articles, social posts, captions already written): all news cards and featured stories. **\[TBD: location in repository and number of articles per series\]**
3. **Verified event data in the repository**: Race Calendar only. **\[TBD: file name, and the official source used to verify each event\]**
4. **Team images**: hero, cards and Instagram section. **\[TBD: folder path and image rights or credits\]**

### 5.2 Rules for missing content

- Claude Code MUST NOT write racing news, results, schedules, standings, quotes or driver details from its own knowledge.
- Where content is missing, Claude Code MUST insert a clearly labeled placeholder card (for example "Content needed: WEC story") and list every placeholder in `README.md` under "Content needed".
- Brand and interface copy (navigation labels, buttons, empty-state messages, the About page structure) MAY be written by Claude Code, following the voice rules below.

### 5.3 Editorial standards

- **Factual:** every news item names its source or author, and its date.
- **Neutral:** no favoring of drivers, teams, manufacturers or series in wording, ordering or emphasis. Series always appear in the fixed order F1, MotoGP, NASCAR, WEC.
- **No speculation:** rumors are never presented as confirmed facts; unconfirmed reports, if used, MUST be labeled "Unconfirmed". No race-result predictions.
- **Original:** no copied text from other publications beyond short attributed quotes.

### 5.4 Voice and tone

| Brand trait | In copy | In design |
| --- | --- | --- |
| Authentic | Plain, accurate language; sources named; real team photos | Real racing images over stock graphics |
| Professional | Consistent style, correct terminology, no slang or clickbait | Clean grid, consistent spacing, restrained type scale |
| Intriguing | Active, vivid headlines that stay accurate | Bold hero imagery, motion cues, dynamic angles |

**\[TBD: any additional voice rules, banned words or sample copy from the brand files\]**

## 6. Visual design requirements

The look is modern, clean and energetic, built strictly on the Pace & Publish brand identity. The Formula 1 website is a reference for *qualities* only: strong full-width imagery, bold headlines and organized navigation. Its layout, colors, fonts, logos and graphics MUST NOT be copied.

### 6.1 Brand tokens

All colors and fonts MUST be defined once as CSS custom properties in `css/styles.css` and reused everywhere.

| Token | Value | Use |
| --- | --- | --- |
| `--color-primary` | #1B5E3A (British racing green) | Final use: wordmark rule only (see 11.9) |
| `--color-secondary` | #A3A7AD (brand grey) | Secondary text |
| `--color-dark` | #1E2228 (Asphalt) | Cards and panels |
| `--color-light` | #F7F7F4 (Chequered white) | Text on the dark theme (the page background is `--color-bg` #0B0D12) |
| `--color-text` | #F7F7F4 | Body text |
| `--font-heading` | DIN Condensed, Avenir Next Condensed, Bahnschrift, Roboto Condensed, Arial Narrow (system fonts) | Headlines and navigation |
| `--font-body` | Montserrat if installed, otherwise the system sans-serif | Body text |

**Final values (Nov 18, 2026):** the TBDs above were filled from the team's brand files and the approved redesigns. The racing-red accents added in version 5 are in Section 11.9.

**Fallback until values arrive** (no longer used): a neutral dark and light scheme with system fonts, clearly marked in `README.md` as temporary.

**Fonts.** Brand fonts SHOULD be stored as local files in `assets/fonts/` so the site looks correct offline. A hosted font link MAY be used only if the team accepts that it needs an internet connection.

### 6.2 Layout and components

- Full-width hero image on Home with a dark overlay, so text keeps a contrast ratio of at least 4.5:1.
- Card-based grids for articles, with consistent image ratio (16:9) and spacing.
- Series labels as small colored tags. Each series gets one accent from the brand palette, and the label always includes the series name in text. **\[Decision: series accent colors\]**
- Official series logos (F1, MotoGP, NASCAR, WEC) MUST NOT be used, because they are trademarks. Series are identified by name.
- Subtle energy cues are allowed: angled section dividers, hover lift on cards, short transitions (≤ 300 ms). Motion is disabled when the user's system requests reduced motion.

### 6.3 Imagery

- Use only images from the team repository. **\[TBD: folder path\]**
- Every image has meaningful `alt` text; decorative images use `alt=""`.
- Images SHOULD be compressed so that no single image exceeds 500 KB.
- Missing images fall back to a branded placeholder graphic, never a broken image icon.

## 7. Technical requirements

The site is plain HTML, CSS and JavaScript in one folder, opened by double-clicking `index.html`, with no build step, server or installation.

### 7.1 Requirements

1. Plain HTML5, CSS3 and vanilla JavaScript (ES6). No frameworks, libraries, package managers or build tools.
2. All files in one project folder, linked with relative paths only (no leading `/`).
3. Works when opened from disk (`file://`) in current Chrome, Edge, Firefox and Safari.
4. No `fetch()`, XHR or ES module imports (`type="module"`), because these fail or are blocked on `file://`. Scripts load with classic `<script src>` tags.
5. No external API calls or third-party scripts. The only allowed external links are ordinary hyperlinks (for example to Instagram) that open in a new tab.
6. Semantic HTML (`header`, `nav`, `main`, `article`, `footer`), one `h1` per page, and a valid `lang="en"` attribute.
7. Responsive layout using CSS Grid or Flexbox and media queries, with a `viewport` meta tag on every page.
8. Meets WCAG 2.1 AA basics: text contrast ≥ 4.5:1, visible keyboard focus, labeled controls, alt text.
9. No JavaScript errors in the browser console on any page.

### 7.2 File structure

```
pace-and-publish/
├── index.html
├── news.html
├── dashboard.html
├── calendar.html        (nice-to-have)
├── about.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── main.js          (navigation, shared rendering)
│   └── dashboard.js     (dashboard logic)
├── data/
│   └── content.js       (articles and events)
└── assets/
    ├── images/
    ├── logo/
    └── fonts/
```

### 7.3 README.md contents

- How to open the site (double-click `index.html`).
- Where to edit content (`data/content.js`) and brand tokens (`css/styles.css`).
- A "Content needed" list of every placeholder.
- Any decision Claude Code made where this PRD was silent.

## 8. Out of scope

The following MUST NOT be built:

- Publishing or hosting the site online.
- User accounts, logins, registration or newsletter sign-up forms.
- Payments, subscriptions or e-commerce.
- Live data, external APIs, RSS feeds or embedded social media widgets.
- A content management system or admin interface.
- Comments, likes, sharing counters or other user-generated content.
- Search across articles (MAY be reconsidered later).
- Race results, standings, predictions, betting odds or fantasy features.
- Analytics, tracking or cookies.
- Multi-language support.

## 9. Acceptance criteria

Each criterion is pass or fail. A feature is done only when all of its criteria pass. Test widths: 375 px (mobile), 768 px (tablet) and 1440 px (desktop).

### 9.1 Homepage (F1)

| ID | Criterion | How to test |
| --- | --- | --- |
| HP-1 | The logo, the name "Pace & Publish" and the tagline appear in the hero, using brand colors and fonts from Section 6.1 | Open `index.html`; compare with brand tokens |
| HP-2 | A 2–3 sentence brand introduction is visible without scrolling on desktop | View at 1440 px |
| HP-3 | Featured Stories shows every article with `featured: true`, between 3 and 6 cards | Count cards against `data/content.js` |
| HP-4 | Four series cards appear in the order F1, MotoGP, NASCAR, WEC, and each links to its section on the News page | Click each card |
| HP-5 | A visible button opens `dashboard.html` | Click the button |

### 9.2 News section (F2)

| ID | Criterion | How to test |
| --- | --- | --- |
| NW-1 | Articles are grouped under four headings in the order F1, MotoGP, NASCAR, WEC | Open `news.html` |
| NW-2 | Every article in `data/content.js` appears exactly once, under its correct series | Compare article count per series with the data file |
| NW-3 | Each card shows series label, headline, date, summary and source | Inspect any 3 cards |
| NW-4 | Each series tab or anchor scrolls to or shows only that series | Click all four |
| NW-5 | A series with zero articles shows an empty-state message, not a blank area | Temporarily remove one series' articles |
| NW-6 | No article text states a rumor as fact or predicts a result | Read all summaries against Section 5.3 |

### 9.3 My Racing Dashboard (F3)

| ID | Criterion | How to test |
| --- | --- | --- |
| DB-1 | Four series controls are shown and any combination, including all four, can be selected | Select 1, 2, 3 and 4 series in turn |
| DB-2 | Only items whose series is selected are shown; the count matches the data file | Select F1 + WEC; compare count with data |
| DB-3 | Results update within 0.5 seconds of a toggle, with no page reload | Toggle; check the URL and scroll position do not reset |
| DB-4 | The summary line names the selected series and the correct result count | Check after each toggle |
| DB-5 | With nothing selected, the "Select at least one series" message appears and no cards show | Press Clear |
| DB-6 | When selected series have no content, the "No stories are available yet" message names those series | Remove one series' content; select only it |
| DB-7 | Select all and Clear buttons work | Press each |
| DB-8 | The selection is restored after reloading the page | Select MotoGP only; reload |
| DB-9 | All controls work with keyboard only, and focus is visible | Tab through; toggle with Space |
| DB-10 | The browser network panel shows no external requests while using the dashboard | Open DevTools → Network |

### 9.4 Navigation (F4)

| ID | Criterion | How to test |
| --- | --- | --- |
| NV-1 | Every page has the same header with links to all pages, and every link opens the correct page | Click every link on every page |
| NV-2 | The logo links to `index.html` from every page | Click the logo on each page |
| NV-3 | The current page is visually marked in the navigation | Visit each page |
| NV-4 | At 375 px a menu button replaces the links and opens and closes them | Resize; tap the button twice |
| NV-5 | No link returns a missing-file error | Click all links, including footer links |

### 9.5 Responsive design (F5)

| ID | Criterion | How to test |
| --- | --- | --- |
| RS-1 | At 375 px no page scrolls horizontally | Resize to 375 px; scroll sideways on each page |
| RS-2 | No text, image or control overlaps another or is cut off at 375, 768 or 1440 px | Visual check of each page at each width |
| RS-3 | Article grids show 1, 2 and 3 columns at mobile, tablet and desktop widths | Resize and count columns |
| RS-4 | Tap targets are at least 44 × 44 px on mobile | Inspect buttons and links |
| RS-5 | Body text is at least 16 px on mobile | Inspect computed font size |

### 9.6 Technical and brand (all pages)

| ID | Criterion | How to test |
| --- | --- | --- |
| TC-1 | The site opens and works fully by double-clicking `index.html`, with no server | Open from disk in Chrome and Firefox |
| TC-2 | No frameworks, libraries or external scripts are referenced | Search source for `<script src="http` and `import` |
| TC-3 | The browser console shows zero errors on every page | Open DevTools → Console on each page |
| TC-4 | All colors and fonts come from CSS custom properties in `styles.css` | Search CSS for hard-coded hex values outside the token block |
| TC-5 | Every image has an `alt` attribute and no image is broken | Inspect images; check for broken icons |
| TC-6 | Every placeholder is listed under "Content needed" in `README.md` | Compare placeholders in pages with the README |
| TC-7 | No official series logos or copied F1-website assets are used | Review `assets/` folder |

### 9.7 Nice-to-have features (if built)

| ID | Criterion | How to test |
| --- | --- | --- |
| CL-1 | Every calendar event comes from the repository's verified event file, with its source stored | Compare each event with the source file |
| CL-2 | Events are sorted by date, and past events are visually separated from upcoming ones | View `calendar.html` |
| IG-1 | The Instagram section shows 3–6 local images with captions and a link to the team account that opens in a new tab | View Home; click the link |
| IG-2 | The Instagram section loads no external scripts or embeds | DevTools → Network |

## 10. Open questions and missing information

The brand files were not attached to the first draft, so every brand-specific value in this PRD started as a placeholder. **Final status (Nov 18, 2026):** each item below is marked resolved [x] or still open [ ], with the answer used.

### 10.1 Information to supply from the brand files or repository

- [ ] Logo files: **open.** No logo file is in the repository; the header uses the "Pace & Publish" wordmark with a green rule, as in the team templates.
- [x] Brand colors: from the launch posts and `brand/templates/` (Section 6.1).
- [x] Fonts: Montserrat for body text (no font files in the repository, so it is used only if installed) and a condensed system display stack for headlines (11.9).
- [x] Tagline: "Every series. One feed." (launch post 1, `content/launch.md`).
- [x] Mission and brand story: `brand/brief.md`, `brand/voice.md`.
- [ ] Audience personas: **open.** The brand files give habits but no age, location or personas.
- [x] Voice rules: `brand/voice.md` (neutral, sourced, no rumors as fact, no predictions).
- [x] Articles: 14 from approved posts in `content/` (F1 8, MotoGP 3, NASCAR 0, WEC 3). NASCAR stays a labeled placeholder.
- [x] Sources: every article stores the official series URL its post cites.
- [ ] Images: team graphics from `content/images/`; circuit images and five photos from Wikimedia Commons, credited and approved by Evelin. **Open:** the team's written confirmation of rights to its own graphics.
- [x] Events: 13 events from `strategy/calendar-2026-43.md` to `-45.md`, each with its official source.
- [x] Instagram: @paceandpublish, with launch posts 1–3.
- [x] Team names: repository `README.md` roster.
- [x] Repository: `mk680-team-b`, read only and never modified.

### 10.2 Decisions for you to make

- [x] **Dashboard default:** all four series selected on first visit.
- [x] **Remembered preferences:** kept (`localStorage`, wrapped in try/catch).
- [x] **About page:** built.
- [x] **Article view:** "Read more" expands on the same page.
- [x] **Series accent colors:** one accent for all series, so none is favored (green in v1–v4, red from v5).
- [x] **Fonts:** local and system fonts only; no hosted font link.
- [x] **Placeholder policy:** build with labeled placeholders where content is missing.
- [x] **Content date range:** posts from Oct 25 to Nov 11, 2026; the site says "Content as of November 12, 2026".

## 11. Version 2: Dark Racing editorial redesign (approved Nov 12, 2026)

This section records the approved visual direction for version 2. Where it differs from Sections 3, 6 and 9, this section wins. All earlier functional requirements (data in `data/content.js`, dashboard behavior, no invented content, offline `index.html`) still apply.

### 11.1 Visual direction

The site should feel like a premium motorsport editorial publication combined with a racing analytics dashboard. Two references set the direction:
- **F1 hero concept:** a cinematic full-width hero, a small uppercase label, a very large uppercase headline, a filled and an outline call-to-action, and a minimal uppercase navigation.
- **Trackscope and Spa notes apps:** dark canvas panels, thin borders, stat cells with small grey labels and bold values, filter pills, and note cards with uppercase tags and colored edges.

The references are used for composition and quality only. Their images, logos, layouts and team liveries are not copied.

### 11.2 Color system

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | #0B0D12 | Main background |
| `--color-bg-2` | #151922 | Secondary sections |
| `--color-dark` | #1E2228 | Cards and panels (brand Asphalt, used in place of the proposed #1D222C) |
| `--color-light` / `--color-text` | #F7F7F4 | Primary text (brand Chequered white, used in place of the proposed #F5F5F5) |
| `--color-secondary` | #A3A7AD | Secondary text (brand grey, used in place of the proposed #A8ADB7) |
| `--color-line` | #343A46 | Borders |
| `--color-primary` | #1B5E3A | Brand green: wordmark rule, series tags, section rules |
| `--color-highlight` | #F2B705 | Timing yellow: primary buttons, active states, stat values |

**Decision:** the proposed yellow is replaced by Timing yellow #F2B705, which the repository already documents as neutral (`strategy/calendar-evelin.md`). The proposed orange (#FF4D24) and navy (#162B68) are **not** used: both sit close to current team liveries, and the brand rules say no team or driver may look favored (`brand/voice.md`). Most of the interface stays dark; yellow and green appear only as accents.

### 11.3 Typography

Use a local or system sans-serif stack, Montserrat first, with no hosted fonts.

| Element | Size |
| --- | --- |
| Hero headline | 64–80 px desktop, 36–44 px mobile, uppercase, weight 800–900, tight tracking |
| Section headings | 32–42 px, uppercase |
| Card headlines | 20–26 px |
| Body text | 16–18 px, line height ≥ 1.6 |
| Category labels | 11–13 px, uppercase, letter-spaced |

### 11.4 Homepage order

1. Navigation bar
2. Hero
3. Featured news ("Latest from the paddock")
4. Explore the Circuits
5. My Racing Dashboard ("Your racing. Your way.")
6. Race calendar preview (upcoming events)
7. About Pace & Publish
8. Footer

Layout:
- **Container:** max 1400 px, horizontal padding 40–64 px on desktop and 20–24 px on mobile.
- **Section spacing:** 88–120 px on desktop, 48–64 px on mobile.
- **Card gaps:** 20–28 px. **Card corner radius:** 10–14 px.

### 11.5 Features

**V1. Navigation.**
- The sticky dark bar shows the wordmark on the left. On the right are links to Home, News, Explore Circuits, My Racing Dashboard, Race Calendar and About.
- The active link is marked in Timing yellow, and hover effects are subtle.
- Below 1024 px the links collapse into an accessible menu button. Six links do not fit at tablet width.

**V2. Hero.**
- A cinematic area 500–650 px tall on desktop, with a dark gradient overlay.
- Copy:
  - **Label:** "Motorsport. One destination." with the Pace & Publish name.
  - **Headline:** "Every series. One feed."
  - **Description:** two sentences.
  - **Buttons:** "Explore the latest" (to News) and "Discover the circuits" (to the circuits section).
- If no verified team racing photograph exists, the image area is a designed editorial placeholder with the right proportions and a visible "photo pending" label.

**V3. Editorial card system.**
- **Featured layout:** one lead story (the most recent featured story by date, so no series is favored) with a 4:5 image, plus two supporting stories. A "More stories" grid follows.
- **Each card shows:** image, series label, headline, summary, verified date and "Read more".
- **Hover:** a small lift and a subtle image scale, with no heavy shadows.

**V4. Explore the Circuits.**
- **Circuits:** Circuit de Monaco, Silverstone Circuit and Suzuka International Racing Course.
- **Layout:** the left canvas shows the track illustration, circuit name and country. The right panel holds the circuit selector, stat cards, the circuit type, one historical fact and a short description.
- **Stats:**
  - Circuit length
  - First Grand Prix
  - Number of laps
  - Race distance
  - Lap record
  - Number of turns
  - Country
- **Sources:** facts come only from the official circuit pages on formula1.com (`strategy/sources.md`), checked on Nov 12, 2026, and each circuit stores its source URL. Descriptions are written in our own words.
- **Missing data:** any value the source does not list is shown as a labeled placeholder ("Content needed"). This currently applies to the number of turns.
- **Track maps:** official layout assets are not in the repository, so the illustration area is a labeled placeholder. No track shape is drawn from memory.

**V5. My Racing Dashboard.**
- The same behavior as Section 4, presented as pill controls labeled Formula 1, MotoGP, NASCAR and WEC. Selected pills are filled yellow with a check mark.
- The full dashboard is on `dashboard.html`. Home embeds the same controls with the six newest matching stories and a link to the full view.

**V6. Race calendar.** A list of verified events (Section 3.2 N1). Home shows the next upcoming events and links to `calendar.html`.

**V7. Footer.** Wordmark, short brand description, navigation links, content source acknowledgments, and the student-project statement.

**V8. Responsive layout.**
- On mobile and tablet, sections are reorganized rather than shrunk:
  - Single column.
  - The circuit illustration stacks above the controls and stats.
  - The lead story stacks its image above the text.
  - Controls are touch-friendly.
- Motion respects `prefers-reduced-motion`.

### 11.6 Acceptance criteria (v2)

| ID | Criterion | How to test |
| --- | --- | --- |
| V-1 | Every page loads `css/styles.css`, has a dark background and shows no broken images | Open each page; check computed background and images |
| V-2 | The navigation shows six links plus the wordmark, marks the current page in yellow, and collapses to a working menu below 1024 px | Resize to 1440, 1023 and 375 px; open and close the menu |
| V-3 | The hero is 500–650 px tall on desktop and shows the label, name, headline, description and two buttons; a pending-photo label is visible while no photo exists | View at 1440 px |
| V-4 | The hero headline is 64–80 px on desktop and 36–44 px on mobile | Inspect computed font size |
| V-5 | The featured section shows one lead card and two supporting cards, all with `featured: true`, plus a "More stories" grid of other articles; each card shows image, label, headline, summary, date and Read more | Compare with `data/content.js` |
| V-6 | The circuits section is directly below Featured news and shows three circuit controls | View Home |
| V-7 | Selecting a circuit updates the name, location, stats, type, fact, description, source and active control without a reload | Click each circuit; check the URL and scroll position |
| V-8 | Every circuit fact matches its stored formula1.com source; missing values say "Content needed" | Compare with the source pages |
| V-9 | Circuit controls work by keyboard (Tab, arrow keys, Enter or Space) with a visible focus ring | Keyboard only |
| V-10 | The dashboard meets DB-1 to DB-10 on both Home and `dashboard.html`; selected pills are filled and show a check mark | Repeat Section 9.3 |
| V-11 | No proposed color outside Section 11.2 is used; no team livery color is used as an accent | Search the CSS for hex values |
| V-12 | At 375, 768 and 1440 px no page scrolls sideways, nothing overlaps, and body text is ≥ 16 px | Resize and inspect |
| V-13 | Section spacing, container width and card radius follow Section 11.4 | Inspect computed styles |

### 11.7 Version 3 card system (approved Nov 12, 2026)

- **Hero:** the hero uses the team's only photograph, the Canva stock road image from Ben's launch post. It is cropped clear of the post's baked-in text and credited on the page.
- **Browse by series:** four poster category cards sit between the hero and Featured news. Each shows the series' latest results graphic, with a dark gradient, bold name, short description and an arrow.
- **Featured news:**
  - One cover-style lead at about 60% of the grid width, with two stacked supporting cover cards.
  - "More stories" uses borderless, image-first cards.
  - Every card image is the full team graphic shown sharp over a blurred backdrop. No graphic is cropped.

| ID | Criterion | How to test |
| --- | --- | --- |
| V-14 | No headline, summary, label or footer text overlaps a card's sharp graphic at 375, 768, 1024, 1200, 1440 or 1920 px | Measure bounding boxes |
| V-15 | The four category cards link to `news.html#f1`, `#motogp`, `#nascar` and `#wec`, show 4 / 2×2 / 1-per-row layouts at desktop, tablet and mobile widths, and NASCAR says "Coming soon" | Click each card; resize |
| V-16 | Every image is a team asset copied into `assets/images/` and is no larger than 500 KB | Review the folder |

### 11.8 Explore the Circuits, complete version (approved Nov 12, 2026)

- **Map and photo sources:** track maps and circuit photographs come from Wikimedia Commons under CC0, CC BY 4.0, CC BY-SA 3.0 and CC BY-SA 4.0, approved by the student. Every image shows its author, license link, source link and any changes. Full credits are in README.md.
- **Layout:**
  - A tab bar with Monaco, Silverstone and Suzuka.
  - A large track-map stage taking about 55–60% of the panel width on desktop.
  - A side column with the photo, a 2×2 spec sheet (length, turns, country, type), the history fact, the description, the first Grand Prix, the lap record and the sources.
  - On mobile, the map stacks above the side column, with a link to open the full-size map.
- **Turns replace Laps** in every summary.
- **Turn sources:** formula1.com circuit guides for Monaco (19) and Silverstone (18); suzukacircuit.jp for Suzuka (18).

| ID | Criterion | How to test |
| --- | --- | --- |
| V-17 | Each tab shows its own map, photo, name, country, length, turns, type and fact, matching `data/content.js`; exactly one tab is selected | Click each tab |
| V-18 | Every map and photo loads, has descriptive alt text, and shows its license credit | Inspect the images |
| V-19 | On desktop the map is the largest element in the explorer | Measure at 1440 px |
| V-20 | Tabs work with arrow keys, Home and End, with a visible focus ring | Keyboard only |

### 11.9 Version 5: Premium F1 editorial identity (decided Nov 18, 2026)

**Student decision:** use racing red accents, as requested in the v5 brief and confirmed ("go forward") after the conflict with the brand neutrality rule (`brand/voice.md`, `strategy/calendar-evelin.md`) was raised. Red is used as an accent only, never as a background, and never with team names, logos or liveries. Brand green stays only in the wordmark rule, as the Pace & Publish signature.

**Reference study:** formula1.com, mclaren.com/racing and mercedesamgf1.com were reviewed (ferrari.com did not load). We take only their qualities, not their layouts, logos or colors:
- two-tier navigation (a slim utility row above the main navigation)
- condensed uppercase headlines with two-tone emphasis
- numbered story tickers on hairline rules
- sharp, square edges with angular geometric accents
- sparse accent color

| Token | Value | Use |
| --- | --- | --- |
| `--color-accent` | #C8102E | Racing red fills: buttons, active tabs, selected toggles (white text 5.9:1) |
| `--color-highlight` | #FF5E6A | Red text and lines on black: labels, active links, stat figures (6.5:1 on #0B0D12, at least 4.8:1 on every surface) |
| `--color-metal` | #8B929C | Metallic gray: hairlines, secondary labels, tag fills |
| `--font-display` | DIN Condensed, Bahnschrift SemiBold Condensed, Roboto Condensed, Arial Narrow, then a sans-serif fallback | Headlines, navigation, labels (system fonts only, so the site works offline) |

**Rules:**
- Corner radius is 0–2 px everywhere; no rounded pills or cards.
- No glow shadows, neon effects or decorative gradients, except image shading where it keeps text readable.
- Motion is limited to short hover lifts and fades, and switches off under reduced motion.

| ID | Criterion | How to test |
| --- | --- | --- |
| V-21 | Red appears only as an accent (buttons, active states, labels, rules); no section background is red | Visual review |
| V-22 | Headlines use the condensed display stack; body text uses the clean sans stack | Inspect computed fonts |
| V-23 | No component has a border radius above 2 px, except circular number markers | Search CSS for `border-radius` |
| V-24 | Text on red and red text meet WCAG AA (4.5:1) | Compute contrast |

### 11.10 Version 6: Homepage and experience refinement (Nov 18, 2026)

**Conflicts raised before building:**
1. **F1 photography.** The repository has none. Photos of real teams' cars and drivers would also raise licensing and likeness questions and conflict with the neutrality rule. No photos were inserted; `IMAGES-NEEDED.md` lists the slots instead.
2. **Laps vs. Turns.** The earlier request replaced laps with turns; this brief asks for laps. Both are shown.

| ID | Criterion | How to test |
| --- | --- | --- |
| V-25 | Home "More stories" uses two different story shapes (one wide card and a numbered list), and no image appears twice above the Explore the Circuits section | Visual review |
| V-26 | The circuit spec sheet shows length, turns, laps, country, type and first Grand Prix for every circuit, matching `data/content.js` | Click each tab |
| V-27 | Scroll reveal never hides content without JavaScript or under reduced motion | Disable JavaScript or turn on reduced motion |
| V-28 | Every page has one `h1`, no skipped heading levels, named controls, unique IDs and Open Graph tags | Run the automated audit |

### 11.11 Version 7: Direction A "Grand Prix" (approved Nov 18, 2026)

- **Direction:** Evelin chose A from three mockups (A Grand Prix, B Telemetry, C Paddock Journal).
- **Photos:** Evelin approved five Wikimedia Commons photos, including a hero that centers on one team. This exception to the no-favorites rule is recorded here. Every photo is credited, and every story photo is labeled "file photo".
- **Red band:** this version allows one red section background, the "Latest from the paddock" band from the approved mockup. This supersedes V-21 for that band only.
- **Navigation:** the dashboard link is labeled "My Dashboard" and styled as the red call to action.

| ID | Criterion | How to test |
| --- | --- | --- |
| V-29 | The home hero shows the approved F1 photo with the car as the main subject, the credit is visible, and the hero is no taller than 1000 px | View at 1440 px; resize to a very tall window |
| V-30 | The header is transparent over the home hero and solid after scrolling; all six links are visible horizontally at ≥1024 px; the red "My Dashboard" button is last | Scroll; resize |
| V-31 | No photo appears twice on the homepage; every photo shows its photographer and license | Inspect images |
| V-32 | On phones, hero text and poster text sit on a dark area, not over busy photo detail | View at 375 px |

**Version 7.1 phone fixes (Nov 18, 2026):** after a review at iPhone 17 Pro Max size (440 × 956):
- Circuit tab labels were raised from 10.6 px to 15.2 px.
- The diagonal red rule that crossed the intro text on News and About is hidden on phones.
- The News series filters sit in a row of four.
- Photo credits are at least 11.5 px.
- The scroll reveal never hides content that is on the first screen, and a 2.5-second failsafe shows anything still hidden.

All of the CSS changes apply only at 767 px and below, so the desktop layout is unchanged.

**Version 7.2 (Nov 18, 2026, approved by Evelin after the final audit):** on phones, body copy is now 16 px. This covers circuit descriptions and facts, the dashboard hint, the editorial principles, calendar event details and the "as of" line, which were 14.1–15.7 px before. This is a phone-only rule, so desktop is unchanged.

**Version 7.3 (Nov 18, 2026, requested by Evelin):** the small license and source links (photo credits, circuit credits and sources, calendar sources, the About Instagram link) get 15 px of invisible vertical padding. This gives each link a larger tap area without moving any text: 4,488 text positions were compared at four widths with zero changes. On keyboard focus the padding is removed, so the focus ring keeps its original size. The result: all 200 link fragments measured are at least 31 px tall, which meets WCAG 2.2 AA (2.5.8, minimum 24 px), and the median is 44 px. Where two credit lines sit close together, the links share the space between them; giving every link a full 44 px there would need more spacing, which would be a visual change.

## 12. Final approved website (Nov 18, 2026)

This section describes the website as submitted. Where it differs from the sections above, this section wins.

### 12.1 Pages and features

| Page | File | What it does |
| --- | --- | --- |
| Home | `index.html` | The sections, in order: <ol><li>A full-screen F1 photo hero, with the headline "Every series. One feed.", two buttons and a ticker of the three newest stories.</li><li>The red "Latest from the paddock" band.</li><li>Featured stories: three cards, all marked `featured: true`.</li><li>More stories.</li><li>The editorial standards band.</li><li>Four series posters.</li><li>Explore the Circuits.</li><li>A compact My Racing Dashboard showing the six newest matches.</li><li>The next upcoming events.</li><li>About.</li><li>The Instagram highlight (three launch posts).</li><li>The footer.</li></ol> |
| News | `news.html` | 14 articles grouped as F1, MotoGP, NASCAR, WEC; series filters; "Read more" expands on the page; NASCAR shows a labeled empty state |
| Explore the Circuits | `circuits.html` (also on Home) | Monaco, Silverstone and Suzuka tabs. Each shows a licensed track map and photo plus length, turns, laps, country, type, first Grand Prix, race distance, lap record, a history fact and sources. Tabs work by mouse, touch and keyboard (arrow keys, Home and End). |
| My Racing Dashboard | `dashboard.html` | Four series toggles (filled red with a check mark when selected) with Select all and Clear buttons. Stories are listed newest first, filtered with OR logic. Above them is a live summary line, and below them "Upcoming events", filtered the same way. The selection is saved on the device. |
| Race Calendar | `calendar.html` | 13 verified events, each with its official source, sorted by date, with past events separated from upcoming ones. NASCAR is a labeled placeholder. |
| About | `about.html` | Brand story, audience, editorial standards, Team B credits and the Instagram link |

**Structure changes from Section 7.2:**
- Two files were added: `circuits.html` and `js/circuits.js`.
- The files sit directly in `my-brand-site/`, not in a `pace-and-publish/` subfolder.
- `assets/images/circuits/` and `assets/images/photos/` hold licensed Wikimedia Commons images, credited in `README.md`.
- `mockups/` holds the three design comps from version 7. They are not linked from the site.

### 12.2 Design decisions made by Evelin

| Date | Decision | Effect on the original PRD |
| --- | --- | --- |
| Nov 12 | Dark Racing theme | Replaced the light scheme and neutral fallback (Section 6) |
| Nov 12 | No orange or navy accent; Timing yellow instead | Kept the brand neutrality rule (11.2) |
| Nov 12 | Editorial card system with cover cards and series posters | Replaced the plain 16:9 card grid (6.2) |
| Nov 12 | Explore the Circuits with Wikimedia Commons maps and photos ("Approve all six") | A new must-have page. Section 6.3's "team images only" rule was relaxed to cover licensed, credited images. |
| Nov 12 | "Turns" instead of laps in the circuit summary; laps added back in v6 | Both are shown (11.8, 11.10) |
| Nov 18 | Racing red accents ("go forward"), after the conflict with the brand neutrality rule was raised | Red replaces yellow; green is kept only in the wordmark (11.9) |
| Nov 18 | Square edges (corner radius 2 px or less) and a condensed display font | Replaced the 10–14 px radius and the Montserrat headlines (11.4, 11.3) |
| Nov 18 | Direction A "Grand Prix" chosen from three mockups | The final layout (11.11) |
| Nov 18 | Five Wikimedia Commons photos approved ("Approve all five"), including a hero centered on one team | A recorded exception to the no-favorites rule; each photo is labeled "file photo" |
| Nov 18 | One red section background (the paddock band) | Supersedes V-21 for that band only |
| Nov 18 | Mobile fixes after the iPhone review (v7.1) | Phone-only CSS; desktop unchanged |

### 12.3 Criteria superseded by later decisions

| Criterion | Original requirement | Final, approved state |
| --- | --- | --- |
| F4, NV-4 | Menu button below 768 px | Menu button below 1024 px, because six links do not fit at tablet width (V-2) |
| V-2 | Current page marked in yellow | Marked in red (11.9) |
| V-3 | Hero 500–650 px tall with a "photo pending" label | Full-screen photo hero, at most 1000 px tall, with a credit (V-29) |
| V-4 | Hero headline 64–80 px on desktop | About 166 px at 1440 px, following the approved Direction A mockup |
| V-11 | Only the 11.2 colors; no livery-like accent | Racing red approved (11.9) |
| V-13 | Card radius 10–14 px | 2 px or less (V-23) |
| V-21 | No red section background | One red band allowed (11.11) |
| 6.3 | Team images only | Licensed Wikimedia Commons images are allowed when credited and approved |
| 6.2 | 16:9 card images | Cover cards and posters at several ratios (v3, v7) |

### 12.4 Final audit (Nov 18, 2026)

**Method:**
- An automated audit loaded all six pages over the local preview server at 375, 440 (iPhone 17 Pro Max), 768, 1024 and 1440 px.
- Scripted tests exercised the dashboard, the circuit tabs, the calendar, the News page and every internal link.
- Headless Chrome opened each page straight from disk (`file://`).
- The source code was searched for external scripts, `fetch`, module imports, hard-coded colors, corner radii and image sizes.

| Area | Criteria | Result |
| --- | --- | --- |
| Homepage | HP-1 to HP-5 | **Pass.** <ul><li>HP-1: the wordmark stands in for the logo, because no logo file exists.</li><li>Three featured cards.</li><li>Four series posters link to `news.html#f1`, `#motogp`, `#nascar` and `#wec`.</li><li>The dashboard button works.</li></ul> |
| News | NW-1 to NW-6 | **Pass.** <ul><li>F1 8, MotoGP 3, NASCAR 0 (with an empty state), WEC 3, which matches the data file.</li><li>Every card shows its tag, headline, date, summary and source.</li><li>"Read more" expands the article.</li><li>No rumor or prediction wording.</li></ul> |
| My Racing Dashboard | DB-1 to DB-10, V-10 | **Pass.** <ul><li>All four series are selected by default (14 stories).</li><li>F1 alone shows 8; F1 + WEC shows 11, newest first.</li><li>Clear shows "Select at least one series…" and hides events.</li><li>NASCAR alone shows the "No stories are available yet for NASCAR" message.</li><li>Select all restores 14.</li><li>Each update takes about 3 ms, with no reload.</li><li>A MotoGP-only selection is restored after reload.</li><li>The summary line is `aria-live="polite"`, and the toggles are native buttons with `aria-pressed`.</li><li>No external requests.</li></ul> |
| Navigation | NV-1 to NV-5, V-30 | **Pass.** <ul><li>Every page marks its own link with `aria-current`.</li><li>The logo links Home on every page.</li><li>The menu opens and closes at 375, 440 and 768 px.</li><li>All six links are visible from 1024 px, with "My Dashboard" last.</li><li>No broken internal links.</li><li>The header is transparent over the hero and solid after scrolling.</li></ul> |
| Responsive | RS-1 to RS-4, V-12 | **Pass.** <ul><li>No horizontal scrolling and nothing cut off at any width.</li><li>News grid: 1, 2 and 3 columns at 375, 768 and 1440 px.</li><li>Buttons, tabs and navigation links are at least 44 px.</li><li>After v7.3, credit and source links have a tap area of at least 31 px (median 44 px), which meets WCAG 2.2 AA.</li></ul> |
| Responsive | RS-5 (body text at least 16 px on mobile) | **Pass (after v7.2).** All body copy is at least 16 px at 375 and 440 px, with no overflow or overlap. Short metadata lines stay smaller by design: source lines, event labels, photo credits and uppercase kickers. |
| Technical | TC-1 to TC-7 | **Pass.** <ul><li>Works from `file://` in Chrome.</li><li>No external scripts, `fetch` or modules.</li><li>No console errors on any page.</li><li>No hard-coded hex colors outside `:root`.</li><li>Every image has `alt` text and none is broken.</li><li>Placeholders are listed in `README.md`.</li><li>No series logos are used.</li></ul> |
| Calendar and Instagram | CL-1, CL-2, IG-1, IG-2 | **Pass.** <ul><li>13 of 13 events are rendered, each with a source, sorted by date.</li><li>9 past events are separated from 4 upcoming ones (as of Nov 18, 2026).</li><li>Three Instagram images with captions; the link opens in a new tab.</li><li>No embeds.</li></ul> |
| Circuits | V-17 to V-20, V-26 | **Pass.** <ul><li>Each tab updates its own map, photo, name, length, turns and laps.</li><li>Exactly one tab is selected at a time.</li><li>Every image loads, with alt text and a credit.</li><li>The map is the largest element.</li><li>Arrow keys, Home and End work.</li></ul> |
| Version 5–7 | V-22 to V-32 | **Pass.** <ul><li>No corner radius above 2 px.</li><li>The hero is capped at 1000 px on a 2200 px-tall window.</li><li>Each of the five photos appears once on Home, with its credit.</li><li>Every page has one `h1` and no skipped heading levels.</li></ul> |

### 12.5 Remaining issues

**Design issues:**
1. **RS-5:** fixed in v7.2.
2. **Small tap targets:** fixed in v7.3, with no visual change. Credit links are at least 31 px tall (the WCAG 2.2 AA minimum is 24 px). About one in five are under 44 px where two credit lines sit close together; reaching 44 px there would need more spacing (a visual change).

**Content still missing:**
3. NASCAR stories and NASCAR events. No race has been verified on nascar.com.
4. A current MotoGP photo. The MotoGP poster uses the team's results graphic.
5. Night-race and pit-stop photos (`IMAGES-NEEDED.md`).
6. The circuit for six calendar events.
7. Audience personas.
8. Logo files and Montserrat font files.

**Approved exceptions to the brand rules:**
9. Racing red accents.
10. A hero centered on one team (Mercedes). Both were approved by Evelin and recorded in Sections 11.9 and 11.11.

**Things to check or confirm:**
11. The team's written confirmation of rights to its own graphics.
12. The MotoGP Qatar dates, which should be re-checked on motogp.com.
13. Browser coverage: tests ran in Chrome only (the Browser pane and headless Chrome). Firefox, Safari and Edge were not tested.
14. Fonts vary by system. The display font is DIN Condensed on Mac and Bahnschrift on Windows. Montserrat appears only where it is installed.

**Static content:**
15. The content is as of Nov 12, 2026. Past and upcoming events are worked out from the visitor's date, so the "Upcoming" lists shrink over time without new data.
