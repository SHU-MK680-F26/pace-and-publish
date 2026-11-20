# PRD

Owner: Sanith Chandula · Class: MK-680, Week 10 · Draft date: November 12, 2026

Readers: Claude Code (builds the site from this document) and Prof. Reilly (grades it).

Status: Final draft. Every decision is mine and is listed in section 12. If the builder finds something this PRD doesn't cover, it asks me rather than guessing.

## 1. Summary

A visitor gets F1, MotoGP, NASCAR and WEC news, results and the race calendar in one place, plus a Race weekend planner that turns the series they follow into one weekend schedule in their own time zone.

## 2. Purpose

Pace & Publish is a fictional multi-series motorsport news brand that runs on Instagram (@paceandpublish). The website is its home on the web: news, results and the race calendar for four series together, so fans don't need several apps and sites.

## 3. Audience

Fans who follow more than one racing series (F1, MotoGP, NASCAR, WEC). They visit:

- first thing in the morning, after sleeping through a race or session, to catch up on results
- after work, for a quick update on the day
- at the start of a race week, to see what's racing and when

Most visits are on a phone.

Our follower: Sam, 23. Sam follows F1, WEC and NASCAR. He checks racing news on his phone while travelling to college, mostly between 5:30 and 6:30 PM, and again after 11 PM. He needs quick, confirmed updates he can read in a few minutes, and one place to see when each of his three series is on track. That's why the planner lets him pick only his series and shows everything in his own time zone.

## 4. Constraints (the builder must follow all of these)

- Plain HTML, CSS and JavaScript in one folder. No installs, no frameworks, no build step, no package manager.
- The site opens by double-clicking `index.html` on a laptop, with no web server.
- All data (calendar, sessions, news) lives in the folder as JavaScript files the pages load with `<script>` tags, because browsers block reading local JSON files when a page is opened by double-click.
- Images and brand files come from the team repository mk680-team-b (content/images/ and brand/). Images are copied into the site folder; the team repository is never edited.
- No live data from other sites: no APIs, no live timing, no embedded social feeds. Session times are typed in by hand from the official series sites.
- No sign-ups, payments, shared comments or newsletter forms. Nothing is sent anywhere. Anything the site remembers is stored only in the visitor's own browser (localStorage).
- Nothing is published. The site is only run locally.
- Fonts: Montserrat from Google Fonts, falling back to a system sans-serif so the site still reads correctly offline.
- Site folder: Claude Projects/my-brand-site, next to the team folder but outside mk680-team-b. Image paths inside the site point to copies in my-brand-site/images/, not to the team folder.

## 5. Pages

| Page | File | Priority |
|---|---|---|
| Home | index.html | Must have |
| Race weekend planner | planner.html | Must have |
| Race calendar | calendar.html | Must have |
| News | news.html | Must have |
| About | about.html | Must have |

Every page has the same header with the Pace & Publish wordmark and a menu linking to all five pages, and the same footer with the student-project note: "A student project for a fictional brand at Sacred Heart University."

## 6. Features

### 6.1 Home (must have)

- First screen: what Pace & Publish is, in one line, naming all four series.
- "All in one place" strip (must have): F1, MotoGP, NASCAR and WEC side by side. Each opens News filtered to that series (for example news.html?series=motogp).
- Hero image: my launch images (sanith-launch-1.png, -2.png, -3.png).
- Latest news: the 6 newest news items, newest first.
- Instagram link (nice to have): a plain link to https://www.instagram.com/paceandpublish/ that opens in a new tab. No embedded feed.

### 6.2 Race weekend planner: the site's tool (must have)

Who and when: a multi-series fan at the start of a race week or the morning of a race weekend.

**Inputs**

- Series: checkboxes for F1, MotoGP, NASCAR and WEC (any combination).
- Time zone: a dropdown of every time zone the browser knows (Intl.supportedValuesOf('timeZone')), defaulting to the visitor's own browser time zone.
- Weekend: a dropdown of the race weekends in the data, picked by the visitor, defaulting to the next weekend after today (or the first one if all are past).

**Output**

- One combined list of every session for the chosen series that weekend, in time order, with day, local start time, series label, event name and session name (for example "Qualifying").
- Times are stored in UTC in the data file and converted to the chosen time zone with the browser's built-in Intl.DateTimeFormat. No outside service.
- Clashes: two sessions clash when their time ranges overlap. Both are marked "Clash". This needs each session's end time or length in the data.
- Nothing picked: if no series is checked, the list is replaced with "Choose at least one series to see your weekend."

**Nice to have**

- Remember my series: the chosen series and time zone are saved in localStorage and restored on the next visit.
- "Next up" countdown: time remaining until the next session in the visitor's list, from the laptop's clock.
- Clash helper: for each clash, which session starts first and how many minutes they overlap.
- Print my weekend: a print stylesheet so printing gives one page with only the schedule: no menu, readable in black and white.

### 6.3 Race calendar (must have)

- Every race weekend in the data: series label, event name, track, dates, session times (in the visitor's time zone), and the source line.
- Sorted by date.
- "This weekend" highlight (nice to have): the weekend that includes today's date is shown first and marked "This weekend."
- Races included: labeled sample weekends for all four series. Every sample weekend and session is marked "SAMPLE" on screen, so no one mistakes it for a real schedule. Real races can replace them later.

### 6.4 News (must have)

- News items: results, race updates, and driver and team stories.
- Each item: headline, date, series label, short text, image with alt text (optional), and source line.
- Filter by series (must have): All, F1, MotoGP, NASCAR, WEC. Also reads the ?series= value from the Home strip.
- Filter by type (nice to have): Results, Driver and team stories, Updates.
- "Updated" time stamp (nice to have): "Updated [date], [time] ET" on each item.
- Results cards (nice to have): a results item shows positions 1–3 in green numbered boxes, with driver and team names.
- Search (nice to have): a text box that filters items by words in the headline or text (driver, team or track).
- "Your take" poll (nice to have): on each news item, "Was this update useful?" with Yes / Somewhat / No. The vote is saved only in the visitor's browser and never sent anywhere. The poll never asks fans to predict results or pick favorites.
- News items: about 8, rewritten from the team's past posts on main in mk680-team-b (Weeks 1–3 results roundups, weekend recaps and the fun fact). They keep the facts and sources those posts already cite. No new facts are added.
- Each news item uses its own week's post image from content/images/week-1, week-2 or week-3.

### 6.5 About (must have)

- Who Pace & Publish is, who it's for, and the four series it covers.
- "Our rules" box (nice to have): "Confirmed facts only · No predictions · No favorites."
- The student-project note.

### 6.6 Across the site

- Series color tags (must have): a small label for each series, in brand colors only, never team colors. Style: a thin #1B5E3A green outline with the series name in white caps. All four series look the same, and the name tells them apart.
- Source line (must have): every race and news item names its official source: formula1.com, motogp.com, nascar.com or fiawec.com.
- Back-to-top button (nice to have) on long pages.
- Phone layout (must have): works from 375 px wide upward.

## 7. Data

All data lives in a data/ folder inside the site, as JavaScript files.

`data/sessions.js`: one entry per session:
series, event (official event name), track, session (for example "Race"), startUTC, endUTC (or length in minutes), source (official site).

`data/news.js`: one entry per news item:
id, date, updated, series, type (results, story or update), headline, text, image (optional), alt, source, podium (optional: positions 1–3 with driver and team).

Rules for data (from brand/voice.md and the team's sources rules):

- Facts come only from the four official series sites. Every entry names its source.
- Team and driver names must be current on the day they're entered.
- No rumors stated as facts, no predictions, no opinions on results, no favorite team or driver.
- If a fact isn't confirmed, it isn't entered. The builder must not invent results, times or quotes. Placeholder entries must be clearly labeled "SAMPLE" until I replace them.

## 8. Look and voice

Colors (from the team's brand files):

| Use | Color |
|---|---|
| Background | Asphalt #1E2228 |
| Text | Chequered white #F7F7F4 |
| Accent (rules, tags, numbered boxes, buttons) | British racing green #1B5E3A |

Contrast must stay readable: green is used for shapes and lines, and any text on green is white.

Type: Montserrat ExtraBold, all caps, for headlines; Montserrat Regular for body text.

Style: borrowed from ferrari.com: bold headlines, big full-width images, lots of dark space, and sharp edges. Not its red, its logo or its fonts. The brand never shows a favorite team.

Images: copied from mk680-team-b/content/images/. Every image has alt text naming the series and event, using the search words in brand/search.md. My launch images go on Home; each news item uses its own week's post image.

Voice: all site text follows brand/voice.md: authentic, professional, intriguing; confirmed facts only; no predictions, rumors as facts, swearing, or favorite teams or drivers. Headlines lead with the most interesting confirmed fact and use the series and event names from brand/search.md.

## 9. Out of scope

- Sign-ups, accounts, payments and newsletter forms
- Live scores, live timing, APIs and any live data from other sites
- Embedded social feeds
- Shared comments or anything visitors post for others to see
- Rankings, predictions, odds and fantasy picks
- Ferrari's or any team's colors, logos or fonts
- Publishing the site anywhere
- Editing the team repository

## 10. Acceptance criteria

Every feature is checked in Chrome on a laptop, and again at phone width (375 px).

| # | Feature | Check | Priority |
|---|---|---|---|
| 1 | Opens offline | Double-clicking index.html opens the site with nothing installed and no errors in the console. | Must |
| 2 | Menu | From any page, every other page is one click away. | Must |
| 3 | Home | The first screen says what Pace & Publish is and names all four series. | Must |
| 4 | "All in one place" strip | Home shows F1, MotoGP, NASCAR and WEC; clicking one opens News filtered to that series. | Must |
| 5 | Planner: series choice | A visitor who picks F1 and MotoGP sees only F1 and MotoGP sessions. | Must |
| 6 | Planner: time zone | A visitor who picks Eastern Time sees a session stored as 14:00 UTC listed as 9:00 AM (when Eastern Time is UTC−5). | Must |
| 7 | Planner: order | Sessions show in time order. | Must |
| 8 | Planner: clashes | Two sessions whose times overlap are both marked "Clash"; sessions that don't overlap aren't. | Must |
| 9 | Planner: nothing picked | With no series checked, the visitor sees "Choose at least one series to see your weekend." | Must |
| 10 | Race calendar | Every race shows series, event, track, dates, session times and its source site, sorted by date. | Must |
| 11 | News filter by series | Picking "WEC" shows only WEC items; "All" shows everything. | Must |
| 12 | Series color tags | Every calendar entry and news item has a series label in brand colors, with no team colors. | Must |
| 13 | Source line | Every race and news item names its official source site. | Must |
| 14 | About | About states it's a student project for a fictional brand at Sacred Heart University. | Must |
| 15 | Phone layout | At 375 px wide, no text or image is cut off and nothing scrolls sideways. | Must |
| 16 | Brand look | Every page uses #1E2228, #F7F7F4, #1B5E3A and Montserrat, and nothing else for brand color. | Must |
| 17 | Brand voice | Every headline and news item passes the five voice-checklist questions in brand/voice.md. | Must |
| 18 | Images | Every image is copied from the team repo and has alt text naming the series and event. | Must |
| 19 | No data sent | With the browser's network panel open, using every feature makes no requests except the Google Fonts files. | Must |
| 20 | Remember my series | Picking MotoGP and Eastern Time, closing the page and reopening it shows the same choices. | Nice |
| 21 | "Next up" countdown | Shows the time until the next session in the visitor's list; a minute later, after reload, it's one minute less. | Nice |
| 22 | Clash helper | Each clash shows which session starts first and how many minutes they overlap. | Nice |
| 23 | Print my weekend | Printing the planner gives one page with only the schedule, no menu, readable in black and white. | Nice |
| 24 | "This weekend" highlight | The weekend that includes today's date is shown first and marked "This weekend." | Nice |
| 25 | News filter by type | Picking "Results" shows only results items. | Nice |
| 26 | "Updated" time stamp | Every news item shows when it was last updated. | Nice |
| 27 | Results cards | A results item shows positions 1–3 in green numbered boxes with driver and team names. | Nice |
| 28 | Search | Typing "Monza" shows only items that mention Monza; clearing the box shows everything. | Nice |
| 29 | "Your take" poll | A vote stays after reload on the same laptop and isn't sent anywhere (check 19 still passes). | Nice |
| 30 | "Our rules" box | About shows "Confirmed facts only · No predictions · No favorites." | Nice |
| 31 | Instagram link | The link opens instagram.com/paceandpublish in a new tab; no feed is embedded. | Nice |
| 32 | Back-to-top button | On a long page at phone width, the button appears after scrolling and returns to the top. | Nice |

## 11. Build order

- Folder, shared header, footer, menu and styles; all five pages as shells (checks 1, 2, 15, 16).
- Data files with my entries (or clearly labeled SAMPLE entries).
- Race weekend planner (checks 5–9).
- Race calendar, News, Home and About (checks 3, 4, 10–14, 17, 18).
- Run every must-have check and fix failures (check 19 last).
- Nice-to-haves, one per improvement round.

## 12. Decisions

None still open. Decided on November 12:

- Site folder: Claude Projects/my-brand-site.
- Follower: Sam, 23. Follows F1, WEC and NASCAR, and checks news on the way to college (5:30–6:30 PM) and after 11 PM.
- Races: labeled sample weekends for all four series, because the 2026 MotoGP, NASCAR and WEC seasons have ended.
- Planner weekend: the visitor picks, defaulting to the next one.
- Time zones: every zone the browser knows, defaulting to the visitor's own.
- News: about 8 items, rewritten from the team's Weeks 1–3 posts.
- Home: the 6 newest news items.
- Images: my launch images on Home; each news item uses its own week's post image.
- Poll: "Was this update useful?" Yes / Somewhat / No.
- Series tags: a green outline with the series name in white caps.

## What I changed in Claude's draft, and why

At first I wanted live race scores and a place for visitors to leave comments, but I took both out because the site can't pull live data from other websites or have sign-ups. I used sample race weekends instead, since most 2026 seasons are already over, and added a "Was this useful?" poll that stays on the visitor's own laptop.

I also changed the series from F1, F2 and F3 to F1, MotoGP, NASCAR and WEC so the site matches our Pace & Publish brand, merged News, Stories and Updates into one News page because they overlapped, and added the Race weekend planner as my tool so a fan like Sam can see all his races in one list in his own time zone.
