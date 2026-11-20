# Pace and Publish Website — Product Requirements Document

Nov 12, 2026 · @Miranda Bowers

## 1. Overview and how to use this PRD

Build Pace and Publish: a plain HTML, CSS and JavaScript website that opens by double-clicking index.html and gives motorsport fans results, news, line-ups and schedules for six series, with the source shown on every item.

**Purpose.** One place to find results, news, line-ups and schedules for Formula 1, F1 Academy, Formula E, MotoGP, WEC and IMSA.

**Audience.** Fans who follow several motorsport series and don't want to check multiple apps and news sources. They read either first thing after sleeping through a race or practice session, or after work for a quick update on the day. They come to check the latest results, see what's next, and plan what to watch.

### Rules for Claude Code

1. Build only what this PRD lists. The plan has no "nice to have" features, so add none.
2. Never invent data. If a value is missing from the series' official site, store `null` and show the fallback wording given in this PRD. If a whole site can't be read, see A17.
3. One item in section 12 is still marked OPEN (OPEN-3). Ask the client about it before building the part it blocks. OPEN-1 (the series table) is settled: it is in section 6, and OPEN-4 (captions) is settled in A10.
4. Every requirement has a check ID (for example S3). When the build is done, run every check in section 10 and report pass or fail with what you saw.
5. If this PRD and the client's plan disagree, this PRD wins, because the client reviewed it. The one deliberate change from the plan is the photo rule in section 8.

## 2. Technical constraints and folder layout

The site is a folder of static files that works when index.html is opened straight from the laptop's disk, with no server.

- Plain HTML, CSS and JavaScript only. No frameworks, no build step, no npm packages, no CDN links, no web fonts.
- It must work from a `file://` address. So use classic `<script src="...">` tags (never `type="module"`) and never `fetch()` a local file; browsers block both on `file://`. All data loads from `data/data.js`, which is itself a script.
- All links between pages are relative.
- It works offline. Only the outbound "Source" links need the internet.
- Target browsers: current Chrome, Edge, Firefox and Safari, on computer, laptop and phone.
- Header and footer are written once by `js/site.js` into every page, not copied into seven HTML files.
- Nothing is published. No hosting, no GitHub Pages.

```
pace-and-publish/
  index.html            Home
  formula-1.html        one page per series
  f1-academy.html
  formula-e.html
  motogp.html
  wec.html
  imsa.html
  css/styles.css
  js/site.js            header, footer, date and time formatting, result states
  js/calendar.js        the calendar tool (used by index.html only)
  data/data.js          the one data file
  images/               photos, saved locally
  scripts/refresh.<ext> the refresh script (language chosen in section 3)
  docs/voice.md         copy of the attached voice file
  README.md             how to open, refresh and test, in plain words
```

## 3. Data file and refresh script

All content lives in one file, `data/data.js`, which only the refresh script writes. The pages read that file and never fetch anything from the internet.

**Where data may come from.** Results, news, line-ups and schedules come from these six official sites, with one exception below, and each item shows its source. If a value isn't on the official site, don't take it from anywhere else (no Wikipedia, motorsport.com or other outlets). Store `null` instead.

**If a site can't be read.** If the script can't read a series' official site at all, Claude Code may take that series' data from another source. A single missing value on a readable site is still stored as `null`. Two rules apply to a fallback source: Claude Code lists which series use which site, and why, in README.md and in its final report; and every source line names the site the item really came from, so nothing is labelled as official when it isn't.

**Season.** Each series shows the latest season its official site has published. Changed 13 Nov 2026 at the client's request: when that is next year's season, the current season is kept too, so its remaining rounds and results stay on the site (Formula 1, MotoGP and WEC today). Every weekend records its own `season`. The series' `season` is the season of the latest weekend that has started (the one under Latest results), or the earliest listed if none has. The script records labels as the site gives them (for example 2026 or 2026–27), and every page that names a series shows it (section 4).

| Series | Page file | Official site (the only data source) |
|---|---|---|
| Formula 1 | formula-1.html | formula1.com |
| F1 Academy | f1-academy.html | f1academy.com |
| Formula E | formula-e.html | fiaformulae.com |
| MotoGP | motogp.html | motogp.com |
| WEC | wec.html | fiawec.com |
| IMSA | imsa.html | imsa.com |

**File format.** The file is exactly `window.PP_DATA = ` followed by valid JSON and a `;`, so both the pages and the script can read it. The sketch below shows the fields the pages need; Claude Code may add fields but not drop these.

```
window.PP_DATA = {
  "schemaVersion": 1,
  "lastUpdated": "2026-11-12T14:05:00-05:00",   // set by the script when it finishes
  "series": [{
    "id": "motogp", "name": "MotoGP", "siteName": "motogp.com", "season": "2026",
    "fetchedAt": "2026-11-12T14:05:00-05:00",   // last successful refresh of this series
    "weekends": [{
      "name": "...", "circuit": "...", "country": "...",
      "timeZone": "Europe/Rome",                 // IANA name of the track's timezone
      "raceLength": { "laps": null, "distanceKm": null, "duration": null },
      "sessions": [{
        "name": "...",                           // the table's name, or the official site's own name if it can't be mapped
        "championship": null,                    // IMSA: the championship the session belongs to
        "start": "2026-06-14T14:00:00+02:00",    // includes the track's UTC offset
        "durationMinutes": null,
        "results": null,                         // or [{ "class": null, "rows": [{ "pos": 1, "name": "...", "team": "...", "number": "...", "timeOrGap": "..." }] }]
        "sourceUrl": "https://..."
      }]
    }],
    "lineups": [{ "class": null, "team": "...", "drivers": ["..."], "sourceUrl": "https://..." }],
    "news": [{ "date": "2026-11-10", "type": "news", "caption": null, "sourceUrl": "https://..." }]   // type: "news" or "hiring"
  }],
  "photos": [{ "page": "home", "file": "images/...", "alt": "...", "credit": "...", "creditUrl": "https://...", "licence": "..." }]
}
```

### Refresh script requirements

1. Language: Claude Code checks what is already installed on the client's laptop (Python 3, Node, PowerShell, or a shell with curl), uses the first one found in that order, installs nothing and uses only that language's standard library. It writes the exact command into README.md.
2. One command, run from the project folder, refreshes everything.
3. It requests only pages on the six official domains, at most one request per second, with a 20-second timeout.
4. It writes a temporary file and renames it over `data/data.js`, so a failed run never leaves a half-written file.
5. It keeps hand-written fields (`caption` on news items, the `photos` list) and matches them by `sourceUrl`.
6. It sets `lastUpdated` to the finish time, with timezone offset, and `fetchedAt` for each series it refreshed.
7. If one series fails, it keeps that series' old data and old `fetchedAt`, names the series and the reason on screen, and exits with a non-zero code. That series page then shows "Some items could not be refreshed. Last successful refresh:" and its `fetchedAt` date. If every series fails, it doesn't write the file.
8. It leaves out news about a death or fatal accident (titles containing died, death, fatal, killed, passed away or tragic) and prints the skipped addresses.
9. It prints a summary: for each series, the number of weekends, sessions with results, line-up entries and news items.
10. If the official sites block automated requests or only offer a value in a form the script can't read, Claude Code tells the client (OPEN-3) and may use another source for that series, under the rules in "If a site can't be read" above.

| ID | Check (steps) | Pass when |
|---|---|---|
| R1 | In a terminal, in the project folder, run the command from README.md. | It finishes, prints the summary, and the exit status is 0. |
| R2 | Note "Last updated" on any page. Run the script. Reload the page. | The date and time are later, and data/data.js has a new modified time. |
| R3 | Open data/data.js. Search for `sourceUrl` and read every hit. | The file starts with `window.PP_DATA = `, ends with `;`, and every `sourceUrl` is on one of the six official domains, or on a fallback site named in README.md. |
| R4 | Turn off wifi. Run the script. Reload a page. | The script names each failed series and exits non-zero. The "Last updated" on the page hasn't changed. |
| R5 | In data/data.js, type a `caption` into one news item. Run the script. | The caption is still there afterwards. |
| R6 | Search data/data.js for died, death, fatal, killed, passed away, tragic. | No news item contains any of them. |

## 4. Requirements on every page

All seven pages (Home and the six series pages) share the same header, footer, source rule, time format and phone layout.

- **Wordmark.** "Pace and Publish" sits at the top left, links to index.html, and is the largest text on the page at every screen width. No other text, including the page headline, may have a font size equal to or larger than it.
- **Navigation bar.** Under or beside the wordmark: Home, the six series names, and "Race calendar", which jumps to the tool on the Home page (index.html#calendar). The current page is marked. On a phone the links wrap onto more lines; there is no hamburger menu.
- **Footer.** "Last updated:" followed by `lastUpdated` from the data file, shown in the visitor's own timezone with its label, for example "12 Nov 2026, 14:05 EST".
- **Sources.** Every result block, line-up block, news item and photo has a line under it starting "Source:" (photos: "Photo:"). The line names the site and links to the exact page the item came from. Links open in a new tab with `rel="noopener"`.
- **Dates and times.** English, day then month ("Sat 14 Jun"), 24-hour clock. A time is never shown without its timezone label. Show the label the browser gives for the track's timezone (for example CEST). If the browser gives only a GMT or UTC offset, add the IANA name after it, for example "14:00 GMT+2 (Europe/Rome)".
- **Test clock.** If the address ends in `?now=2026-06-14T12:00:00Z`, the page treats that moment as the current time and shows the note "Test time in use" at the top. Without it, the page uses the real clock. This exists so the client can run the checks below.
- **Phone layout.** Works from 320 px to 1920 px wide with no sideways scrolling. Images never exceed the screen width, keep their proportions and are never cropped to a fixed height. At 600 px and below, result tables turn into stacked rows (position, name, team, time) instead of scrolling. Tap targets are at least 44 px high.
- **Empty and error wording.** No news: "No news items yet." No line-up: "Line-up not yet added." Data file missing or unreadable: "The data file could not be loaded. Run the refresh script." Wording not given in this PRD must be asked for, not invented.
- **Season.** Every place that names a series also shows the season it covers, taken from `season` in the data file: a line under the headline on each series page (for example "Season 2026"), after the series name on each Home news card, and after the series name on each weekend in the calendar tool.

| ID | Check (steps) | Pass when |
|---|---|---|
| G1 | Open each of the seven pages. | "Pace and Publish" is at the top left of every page and links to the Home page. |
| G2 | On each page, open the browser console (F12) and paste: `[...document.querySelectorAll('body *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>[parseFloat(getComputedStyle(e).fontSize),e.textContent.trim().slice(0,25)]).sort((a,b)=>b[0]-a[0]).slice(0,2)`. Repeat at 375 px wide in the phone view. | The first entry is "Pace and Publish" and its number is larger than the second entry's, on desktop and phone. |
| G3 | Open each of the seven pages and scroll to the bottom. | Each shows "Last updated:" with a date, time and timezone label, and it matches `lastUpdated` in data/data.js. |
| G4 | On one page of each kind, find a result block, a news item, a line-up and a photo. | Each has a Source or Photo line, and the link opens a page on the item's official site, or the fallback site named in README.md (photos: the credited source). |
| G5 | Open the phone view (F12, device toolbar) at 320, 375 and 390 px. On all seven pages run `document.documentElement.scrollWidth <= innerWidth`, then scroll the page. | The console prints `true` each time, and no text or image is cut off. |
| G6 | Scan every page for times. | Every time is followed by a timezone label. |
| G7 | Rename data/data.js to data/data.off.js. Open index.html. Rename it back. | The page shows the "data file could not be loaded" message while renamed, and works again after. |
| G8 | Open motogp.html?now=2026-06-14T12:00:00Z. | The page shows "Test time in use". Opening motogp.html without it doesn't. |
| G9 | Open each series page, then the Home page. Look under each series headline, at the news cards and at the tool's weekends. Compare with the season values in data/data.js. | Every series name in those places is followed by its season, and it matches data.js. |

## 5. Home page (index.html)

The Home page gets a fan from the front door to any series page or the calendar in one click.

Top to bottom: header with the wordmark and, directly under it, the intro (changed 13 Nov 2026 at the client's request), then one photo with its credit (section 8), the latest news from every series, the "Build your own race calendar" tool, and the footer. The six series pages are reached from the menu in the header; the separate row of series links under the intro was removed at the client's request. The intro text is exactly:

> Six series, one place. Results, news, line-ups and schedules for Formula 1, F1 Academy, Formula E, MotoGP, WEC and IMSA, with the source on every item.

The menu links are labelled Formula 1, F1 Academy, Formula E, MotoGP, WEC and IMSA. The tool sits under the news, is the same tool described in section 7, and starts with nothing ticked. The Home page shows no results or line-ups.

**Latest news.** Changed 13 Nov 2026 at the client's request, following their motorsport.com screenshot: under the photo, one large lead story on the left and four smaller stories in a 2x2 grid beside it (two columns on a tablet, one on a phone). Stories are the latest five news items of every series (the same items as the series pages), shown five to a page, newest first, with no series twice on a page while another series still has items. Arrow buttons ("Newer stories" / "Older stories") and "Page 1 of 6" move between pages. Each story shows its series' photo with its credit line, the series name and season, the date, the caption as the headline, and a source line. Captions and fallback lines work as in section 6. A series with no news is listed under the stories with "No news items yet." Not borrowed: the "Latest news / Recommended" tabs (the site recommends nothing) and the summary line.

| ID | Check (steps) | Pass when |
|---|---|---|
| H1 | Open index.html. | The wordmark is at the top left, the intro text sits directly under it and matches the sentence above word for word. |
| H2 | Click each of the six series names in the header menu. | Each opens the right page, and that page's headline is the same series name as the link. |
| H3 | Scroll down the Home page to "Build your own race calendar". | The tool is on the Home page itself, with six checkboxes and none ticked, and it works as in section 7 (see C1). |
| H4 | Scroll to the news on the Home page and press the arrows. | One large story and four smaller ones per page, newest first, mixing series; each with the series photo and credit, series name and season, date, caption or fallback, and source line. Every page and every item matches the newest five per series in data.js. |

## 6. Series pages

Each of the six series pages shows only its own series: the latest race weekend's results, news, line-ups and track facts.

**Series table.** Each series shows only the sessions in its own row below, which is the client's series table. A weekend has only the sessions the official site schedules for it, so the list differs by weekend (Formula 1 sprint weekends, F1 Academy's one or two practices, Formula E double-headers). Never add a session because the row lists it. A session the official site lists that the table rules out is not shown. On screen, a session uses the name in this table. If the official site words a session differently, the script maps it to the table's name; if it can't map one, the page shows it under the official site's own name and the script prints it so you can check. This never applies to sessions the table rules out: F1 Academy Sprint Qualifying, Formula 1 FP2 and FP3 on sprint weekends, and any IMSA session outside the WeatherTech Championship. Those stay hidden.

| Series | Sessions to show | Notes |
|---|---|---|
| Formula 1 | FP1, FP2, FP3, Qualifying, Race | Sprint weekends: FP1, Sprint Qualifying, Sprint, Qualifying, Race (no FP2 or FP3) |
| F1 Academy | Free Practice (one or two), Qualifying, Reverse Grid Race, Feature Race | Number of practices varies by round. Montreal and Austin add an Opening Race. No Sprint Qualifying. |
| Formula E | Free Practice 1, Free Practice 2, Qualifying (groups and duels), Race | Double-headers: one practice, qualifying and race on each day. From Season 13 (December 2026), the second race is E-Prix Unleashed, with its own qualifying. |
| MotoGP | Free Practice, Practice, Free Practice 2, Q1, Q2, Sprint, Warmup, Grand Prix | 2026 format. The 2027 format adds Sprint Qualifying on Friday and separate grids. |
| WEC | FP1, FP2, FP3, Qualifying, Hyperpole, Race | Hypercar and LMGT3 qualifying and Hyperpole are separate. Race length varies by round. Show every class, top 10. |
| IMSA | Practice sessions, Qualifying, Race | WeatherTech Championship sessions only, no support series. Qualifying is split by class. Race length varies. Show every class, top 10. |

**Formula E double-headers.** On a double-header weekend the repeated sessions are numbered by day: Qualifying 1 and Race 1 on day 1, Qualifying 2 and Race 2 on day 2. The table's Free Practice 1 and Free Practice 2 are that weekend's practices in time order. The Season 13 E-Prix Unleashed race is Race 2, and its own qualifying is Qualifying 2. Single-race weekends keep the plain names Qualifying and Race. The script sets these names.

**Page order.** Header, headline (the series name, exactly as in the table above, and the start of the browser tab title), a line under it reading "Season" and the season from the data (for example "Season 2026"), one photo with credit, Latest results, Breaking news, Line-ups, Track facts, footer. Changed 15 Nov 2026 at the client's request: Breaking news moved up to sit right under the photo, before Latest results (the client chose this over keeping it after the results, from a side-by-side preview).

### Latest results

- The weekend shown is the latest weekend in the data whose first session `start` is no later than 24 hours from now. So a weekend becomes the one shown 24 hours before its first session starts. Its heading reads "Latest results: " followed by weekend name, circuit and country. If no weekend qualifies, show "No race weekend has started yet."
- Sessions are listed in time order, and only sessions from the series table row are listed, plus any unmapped session under the official site's own name.
- Each session is its own block: session name, then date and start time in the track's timezone with its label (for example "Sat 14 Jun, 14:00 CEST"), then exactly one of the three states below, then a source line.
- State A, results in the data: show them, whatever the clock says. Columns: position, name, team, number, time or gap, as the official site gives them. Formula 1, F1 Academy, Formula E and MotoGP show every row the official site gives. WEC and IMSA show at most 10 rows per class (one constant, `TOP_N`, at the top of site.js).
- State B, no results and the session hasn't ended: "Results not available until " followed by date, time and timezone label. A session has ended when now is at or after `start` plus `durationMinutes`. The date and time shown are the session's `start` in the track's timezone, even while the session is running. If the duration is unknown, the session counts as ended at its start.
- State C, no results and the session has ended: "Results not yet added."
- WEC and IMSA: inside a session block, one table per class, under the class name, each with up to 10 rows. Every class present in the data appears.
- Nothing is filled in, estimated or carried over from another session.

### Breaking news

- Added 15 Nov 2026 at the client's request: the news is shown as Home-style cards. The newest story is a large card with the series' photo and its credit; the other four are smaller text cards beside it (so the same photo is not repeated). Each card shows the label (News or Hiring) and date, the caption as its headline, and a source line. Cards in the same row share one height; one column on a phone.
- The latest 5 items for this series, newest first. The Home page shows the newest one of the same items. Each shows its date, a label (News or Hiring), the caption, and a source line. New hirings are items with `type` "hiring".
- The caption is written by Claude in Pace and Publish's own wording, following voice.md (section 8): Claude Code writes the first set at build, and captions any new items when asked after a refresh. If an item has no caption yet, show only "New article on " plus the site name, for example "New article on formula1.com." Never display the source's own headline.
- Only confirmed items from the official site appear. No rumors, and nothing about deaths or fatal accidents.

**Line-ups.** Teams with their drivers, as listed on the official site, with the source line under the block. WEC and IMSA group by class first, then team, with a source line under each class. Added 13 Nov 2026 at the client's request, following their 2026 driver line-up graphic: on the Formula 1 page each team is shown as a pair: both drivers' photos with the team name between them, a slanted banner in the team's colour with both surnames in capitals, then the team's source line. Changed 13 Nov 2026 at the client's request: the driver photos' credit lines ("Name: Photo: author, licence, via Wikimedia Commons", linked to each photo's own page) are listed together under "Photo credits" at the bottom of the page instead of under each pair; the page photo keeps its credit directly under it. Team logos are not used (trademarks, not openly licensed). Team colours are hand-written in `teamColours` in the data file (kept by the refresh script, like `photos`) and darkened where needed so the white surnames stay at 7:1. Photos follow section 8 (open licence, never Getty, saved in `images/drivers/`, listed in `photos` with `"page": "driver"`, `"series"` and `"driver"`); portraits are allowed here although section 8 prefers cars. A driver with no usable photo gets an empty frame with their name on the banner. All 22 drivers have a photo as of 13 Nov 2026; for Gasly (2022), Câmara (2021, cropped) and Pérez (2019) the most recent usable open-licence portraits are older. Teams and drivers always come from the official site, even when other sources show a different line-up.

**Track facts.** For the weekend shown under Latest results: the race length as the official site publishes it (laps, distance in km, or a duration such as 6 hours, whichever are in the data) and, for each session, its start (date, time and timezone label) and its scheduled duration in minutes. If the race length is missing: "Race length not yet added."

**Refresh notice.** If a series' `fetchedAt` is earlier than `lastUpdated`, its page shows "Some items could not be refreshed. Last successful refresh:" and that date.

| ID | Check (steps) | Pass when |
|---|---|---|
| S1 | Open the six series pages. | The headline and the start of the browser tab title match the series name on each. |
| S2 | On each page, compare the session names shown with that series' row in the series table. Open f1-academy.html and imsa.html. | Only sessions from the row appear, plus any unmapped session that the script printed. F1 Academy has no Sprint Qualifying. A Formula 1 sprint weekend shows FP1, Sprint Qualifying, Sprint, Qualifying and Race, with no FP2 or FP3. Every session on the IMSA page is a WeatherTech Championship session (check its `championship` value in data.js). |
| S3 | In data.js, pick two consecutive weekends, A then B. Open the page with `?now=` set to 23 hours before B's first session start, then 25 hours before it. | The first shows B in the heading. The second shows A. |
| S4 | Pick a session with no results whose weekend has started. Open the page with `?now=` one hour before that session's start. | The block shows "Results not available until" with the session's start date, time and timezone label, and no table. |
| S5 | In data.js, set one ended session's `results` to `null`. Reload with `?now=` after it ended. | The block shows "Results not yet added." Run the script afterwards to restore the data. |
| S6 | Open a session that has results. | A table shows every row in data.js, in position order. (WEC and IMSA are capped at 10 per class: see S7.) |
| S7 | Open wec.html and imsa.html on a session with results. | There is one table per class in the data, each with at most 10 rows, and no class is missing. |
| S8 | Look at every result block on all six pages. | Each has the session's date and start time with a timezone label. |
| S9 | Count the news items on each page. | At most 5, newest first, each with a date, a label, a caption or the fallback line, and a source line. |
| S10 | Look at Line-ups on each page. | Teams and drivers match data.js, a source line sits under each block, and WEC and IMSA are grouped by class. |
| S11 | Look at Track facts on each page. | Race length, session start times and session durations match data.js, and nothing is shown that isn't in the data. |
| S12 | On formula-1.html, hover over every Source link. | Every link is on formula1.com, unless README.md names a fallback site for that series. Repeat for each series with its own site. |
| S13 | In data.js, change one series' `fetchedAt` to an earlier date. Reload that page. | The refresh notice appears on that page only. |
| S14 | Pick a Formula E double-header in data.js and open formula-e.html with ?now= set to a moment after both days. Also pick a single-race weekend. | The double-header shows Qualifying 1, Race 1, Qualifying 2 and Race 2 in day order. The single-race weekend shows plain Qualifying and Race. |

## 7. Tool: Build your own race calendar

The tool turns a choice of series into one calendar of every race weekend, with every session's date and start time in the track's local timezone.

- **Who and when.** A fan planning which race weekends to watch, or checking what's on this weekend.
- **What goes in.** One or more series, chosen with checkboxes.
- **What comes out.** A calendar of every race weekend for those series, with every session's date and start time in the track's local timezone, labelled with that timezone.
- **Why it fits the brand.** It puts every series' schedule in one place, which is what Pace and Publish is for.

**Where it lives.** On the Home page only, just under the news, in a section with the id "calendar" (the "Race calendar" nav link jumps to it). Code: (`js/calendar.js`). Changed 13 Nov 2026 at the client's request: the tool is its own boxed panel and compact. The series are a row of chips (each a checkbox), with "Upcoming only" and "Show calendar" beside them. Each weekend is one line (series and season, weekend, circuit and country, dates, badge) that opens to show its sessions and its time zone switch; weekends with a "This weekend" badge start open. A weekend with no session times says "Session times not yet published by" and the site name. The list scrolls inside the panel.

### Behaviour

1. A set of six checkboxes, one per series, under the label "Choose series", and a button "Show calendar". There are no text fields and no `<form>` element.
2. Nothing is ticked at first, and the output area says "Choose at least one series."
3. The output lists every race weekend in the data for the chosen series, earliest first by the weekend's first session. Two series racing at the same time appear as separate entries, each tagged with its series name.
4. Each weekend shows: series name and season, weekend name, circuit and country, the first and last day in the track's local dates, then its sessions. Each session shows weekday and date, start time with timezone label, and session name.
5. Only sessions from that series' row of the series table are listed (same rule as section 6).
6. A weekend with a session between the start of today and the end of the coming Sunday (the visitor's own date; today only, if today is Sunday) carries the badge "This weekend". A weekend whose sessions have all ended carries "Past".
7. A chosen series with no weekends in the data shows "No race weekends in the data for " and its name.

| ID | Check (steps) | Pass when |
|---|---|---|
| C1 | Open the Home page and scroll to the tool. | Six checkboxes, none ticked, a "Show calendar" button, and the text "Choose at least one series." |
| C2 | Tick Formula 1 and MotoGP and press the button. Count the weekends listed. Count the Formula 1 and MotoGP weekends in data.js. | The counts are equal, and no other series appears. |
| C3 | Pick a weekend at a track whose timezone differs from yours. Compare its sessions with data.js (`start` and `timeZone`). | Every session is listed, each time is the track's local time (for example `+02:00` in Europe/Rome shows as 14:00 CEST), and each carries a label. |
| C4 | Read the order of the weekends. | They run from earliest to latest. |
| C5 | Tick F1 Academy, then IMSA, one at a time. | F1 Academy shows no Sprint Qualifying. IMSA shows only WeatherTech Championship sessions. |
| C6 | Open the Home page with `?now=` set to a moment inside one weekend in data.js. Tick that weekend's series. | That weekend has "This weekend", earlier weekends have "Past", and later ones have neither. |
| C7 | Choose all six series. | Every series appears, and the page doesn't run slowly or cut anything off at phone width (G5). |

## 8. Photos, voice and look

Three rules shape how the site feels: photos come from the web but never from Getty Images and always carry a credit, every word follows voice.md, and the look is dark green with bold white text.

### Photos

**This is the one change from the earlier plan:** photos are found on the web, never from Getty Images, each with a credit line under it.

- Home shows one main photo and each of the six series pages shows one photo. Each Home news card reuses its series' photo. Every use has its credit line directly under it.
- Photos may come from open-licence libraries (public domain, CC0, CC BY or CC BY-SA, mainly Wikimedia Commons) or from the six official series sites. Don't use photos marked non-commercial or no-derivatives, or any photo credited to or hosted by Getty Images, including pages that republish Getty photos. Official sites often carry Getty photos, so on an official page read the credit first: if it names Getty, or names no photographer or agency, skip that photo.
- Save each photo into `images/` and list it in `photos` in the data file. Pages never load a photo from another site, so they work offline.
- Directly under each photo, a caption line: "Photo: " author, licence, "via " the source site, with the source site name linked to the photo's own page. For an official-site photo that has no licence, use the credit exactly as that site shows it.
- Each photo has alt text that states what it shows, with no opinion in it. Give each `<img>` its width and height, `loading="lazy"`, and a file under 500 KB where the source allows (maximum 1600 px wide).
- Choose circuits, grids and cars over portraits. Don't use crash, injury or incident scenes. Don't feature the same team or driver on every page, so no favourite is implied.

| ID | Check (steps) | Pass when |
|---|---|---|
| P1 | Open Home and the six series pages. | Each has one photo with a credit line directly under it, and each Home news card shows its series photo with the same credit. |
| P2 | On each, read the credit line and click its link. | It names an author (or the credit the official site shows) and a licence where there is one, and the link opens the photo's own page. |
| P3 | Search every file in the folder, including data/data.js, for `getty` (any capitals). Open each credit link. | No matches, and none of the credit links is on a Getty domain. |
| P4 | Turn off wifi and reload Home and a series page. | Every photo still shows. |
| P5 | Look at each photo. | The series pages show their own series, none shows a crash or injury, and one team or driver isn't on every page. |

### Voice

Copy the attached voice.md into `docs/voice.md`. Every piece of text on the site (intro, captions, labels, notices and alt text) follows it. In short:

Nothing is taken from the team repository. All text and images on the site are new, and voice.md is the only voice source.

- **Authentic.** Captions are in our own words, never copied or lightly reworded from the source. Never display the source's headline.
- **Professional.** Report what happened. No opinion on a result, no favourite team or driver, no "we think" or "we suspect".
- **Intriguing.** A caption leads with a fact that gives the fan a reason to open the article, and doesn't repeat the whole article.
- **Hard rules.** No rumors (the site publishes none, because it only uses official sources). No predictions of a race, championship or season. No swearing. Nothing negative about a nationality or any group. Team, driver and series names are never typed into the code by hand: they come from the data, so they are as current as the last refresh.

| ID | Check (steps) | Pass when |
|---|---|---|
| V1 | Pick five captions. Answer the five checklist questions in voice.md for each. | Every answer is yes. |
| V2 | Search all files except docs/voice.md for: we think, we suspect, we feel, rumor, rumour, will win, favourite, favorite. | No matches. |
| V3 | Open the source article for three captions and compare. | No run of five or more words is shared with the source's headline or text. |
| V4 | Pick five team or driver names. Check each on the series' official site. | Every name matches the official site's current spelling. |

### Look

- **Colours.** Changed 13 Nov 2026 at the client's request: every page, Home included, has a charcoal black background (`#1C1D20`), with a darker bar (`#121315`) and slightly lighter panels (`#26282C`). All text is white (16:1 or better). Each page keeps an accent colour for lines, badges and the current-page marker:

  | Page | Accent |
  |---|---|
  | Home | light green `#6FDC9F` |
  | Formula 1 | white `#FFFFFF` |
  | F1 Academy | pink `#FF8FD0` |
  | Formula E | blue `#3D8BFF` (a brighter version of the requested dark blue, so it shows on charcoal) |
  | WEC | yellow `#FFD23F` |
  | MotoGP | red `#FF3B30` |
  | IMSA | gold `#D9A400` (a brighter version of the requested dark yellow) |
- **Weight.** Changed 15 Nov 2026 at the client's request, to modernise the look: headlines (h1 to h3, and the wordmark) are bold; body text, table cells and links are regular weight; small labels (series name and date above a headline, table headings) are semibold. Links are underlined (softly, in white), with a visible outline when focused.
- **Modern look (15 Nov 2026, client's request).** Source lines and photo credits in a softer grey (#B9BAC2, 8:1 or better) with a ↗ after source links; a sticky, frosted (blurred, see-through) header on screens wider than 760 px, with the menu as rounded pill buttons and the current page filled white; rounded cards and photos with a soft border, a slight zoom on a card's photo on hover (none with reduced motion); on screens wider than 600 px the lead story's headline sits on its photo over a dark gradient; pill-shaped buttons and chips. Page headlines are sized relative to the wordmark so it stays the largest text. Every tap target stays at least 44 px.
- **Fonts.** System sans-serif fonts only (fonts already on the visitor's device). Changed 13 Nov 2026 at the client's request: the site uses a geometric stack, `"Avenir Next", Avenir, "Century Gothic", Futura, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`, and the wordmark uses a rounded stack, `ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold"`, then the same geometric fonts, set in italics. No handwriting or script fonts, no web fonts. Body text at least 16 px with line height 1.5. Text and background contrast at least 7:1.
- **Navigation bar and headlines.** The reference is the client's motorsport.com screenshot. Borrow: a full-width bar a shade darker than the page, with the wordmark at the left and the series names in a row as bold capital letters; large, tightly spaced headlines; a small capital-letter series label with the date above each news headline; and the lead-story-plus-cards news layout (section 5). Don't borrow: the dropdown arrows and menus, the quick-links bar, the Latest news and Recommended tabs, the slider arrows, the summary line under the lead headline, their typeface (we use system fonts), their logo colour (our text stays white), or any of their code, images or wording. Headlines stay normal weight, as your rule says, even though theirs are bold. The wordmark stays the largest text.
- **Width.** Content is centred, at most 1100 px wide, and fills the screen on a phone.

| ID | Check (steps) | Pass when |
|---|---|---|
| D1 | On each page, in the console run `getComputedStyle(document.body).backgroundColor`. | `rgb(28, 29, 32)` (charcoal black) on all seven pages. |
| D2 | Run `[...document.querySelectorAll('h1,h2,h3,.wordmark')].map(e=>getComputedStyle(e).fontWeight)`. | Every value is `600` or more (bold), as changed on 15 Nov 2026. |
| D3 | Run `getComputedStyle(document.querySelector('main p:not(.kicker)')).fontWeight` and `.color`. | `400` and `rgb(255, 255, 255)` (body text regular weight and white, as changed on 15 Nov 2026). |
| D4 | Run `getComputedStyle(document.body).fontFamily`. Read a page. | It lists only system sans-serif fonts, and the text is easy to read. |
| D5 | Look at the top of each page at desktop and phone width. | A bar of links sits with the wordmark, all eight destinations are there, and on a phone the links wrap without being cut off. |
| D6 | In the browser's inspector, click a text colour on three pages. | The contrast ratio shown is 7:1 or higher. |

## 9. Out of scope

Claude Code builds none of the following. If something here seems needed, ask the client first.

- No payment options of any kind.
- No sign-ups, logins or accounts (the client added this one).
- No live data inside the page. Pages read `data/data.js` and never call the internet. No analytics, cookies or third-party scripts either.
- Nothing is published: no GitHub Pages, no hosting.
- No writing about tragic deaths, and no rumors stated as facts.
- No "nice to have" features. The plan lists none.

| ID | Check (steps) | Pass when |
|---|---|---|
| X1 | Search the .html files for: pay, checkout, cart, price, subscribe, sign up, login, password, `<form`, `type="email"`. | No matches. |
| X2 | Search the js/ folder for `fetch(`, `XMLHttpRequest` and `WebSocket`. | No matches. |
| X3 | Turn off wifi. Open all seven pages. | Everything works. Only the Source and Photo links need the internet. |
| X4 | Look at the project folder. | It holds only the files in section 2, the photos, and nothing for publishing (no .github folder, no CNAME file). |

## 10. Running the checks

Every one of the client's twelve acceptance criteria is covered by at least one check, listed below, and all the checks sit in the section of the feature they test.

### How to run them

1. Open pages by double-clicking the .html file. To use the test clock, add `?now=2026-06-14T12:00:00Z` (your own date) to the end of the address.
2. Console checks: press F12 (Cmd+Option+I on a Mac), choose Console, paste the line, press Enter.
3. Phone view: in the same tools, turn on the device toolbar (Ctrl+Shift+M, or Cmd+Shift+M on a Mac) and choose a width.
4. Claude Code runs every check itself when the build is done and sends the client a table: check ID, pass or fail, and what it saw. The client then repeats at least the twelve checks in the table below.

| # | Client's acceptance criterion | Checks |
|---|---|---|
| 1 | A visitor who selects Formula 1 and MotoGP sees every session of every race weekend for both, in track local time with the timezone label | C2, C3 |
| 2 | Each series page shows only the sessions in its own row of the series table; F1 Academy shows no Sprint Qualifying; IMSA shows only WeatherTech sessions | S2, C5 |
| 3 | A session that hasn't ended shows "Results not available until" with its date, time and timezone | S4 |
| 4 | A session with no available result shows "Results not yet added." | S5 |
| 5 | WEC and IMSA show every class with the top 10 of each | S7 |
| 6 | Every news item, result, lineup and photo shows its source | G4, S12, P2 |
| 7 | Every page shows a "Last updated" date and time from the data file | G3 |
| 8 | Running the script rewrites the data file, and the pages show the new date | R1, R2 |
| 9 | At phone width, no text or image is cut off | G5, P4 |
| 10 | Pace and Publish is at the top left of every page and is the largest element | G1, G2 |
| 11 | Headlines are not bold, and other text is bold white on dark green. Changed by the client on 15 Nov 2026 to: headlines are bold, and other text is regular-weight white on charcoal black | D1, D2, D3 |
| 12 | The site opens from the local file, with no payment options and no sign-up forms | X1, X3 |

## 11. Assumptions to review

These are choices made where the plan or the series table was silent or unclear. Tell me which to change and the PRD will be updated before Claude Code builds.

| # | Assumption | Section |
|---|---|---|
| A1 | The wordmark reads "Pace and Publish" (spelled out, not with the "&" used in voice.md's title) and is normal weight, like other headlines. Confirmed for the spelling. | 4, 8 |
| A2 | Photos come from open-licence libraries (public domain, CC0, CC BY, CC BY-SA, mainly Wikimedia Commons) or from the six official series sites. Non-commercial and no-derivatives photos, and anything credited to Getty, are excluded. They are saved into images/ rather than linked, and picked by Claude Code once; the refresh script doesn't change them. Official-site photos usually have no reuse licence, so using them is the client's decision and risk. | 8 |
| A3 | The calendar tool is only on the Home page. It has a "Show calendar" button rather than updating as you tick, and nothing is pre-ticked. | 7 |
| A4 | "This weekend" means any session from today to the end of the coming Sunday, by the visitor's own date. Weekends fully in the past are marked "Past". | 7 |
| A5 | Single-class series (Formula 1, F1 Academy, Formula E, MotoGP) show the full results the official site gives. WEC and IMSA show the top 10 of each class, as in the plan. | 6 |
| A6 | Under Track facts, "the time each session runs" shows both its start time and its scheduled duration in minutes. Track facts describe the weekend shown under Latest results. | 6 |
| A7 | A session has ended once its start plus duration has passed (its start, when the official site gives no duration). The time in "Results not available until" is always the session's start, even while the session is running. | 6 |
| A8 | The weekend under Latest results switches to the next weekend 24 hours before that weekend's first session starts. From then on its sessions show "Results not available until" until results are in, and the previous weekend's results leave the page. | 6 |
| A9 | News shows the latest 5 items per series. Hirings are news items labelled Hiring. The site publishes no rumors at all, labelled or not, because it only uses official sources. | 6 |
| A10 | Claude writes the news captions, following voice.md: Claude Code writes the first set at build, and after each refresh it is asked to caption any new items. The refresh script can't write in our own words, so a new item shows "New article on" and the site name until then. The source's headline is never shown, because voice.md bans copying. | 6, 8 |
| A11 | Pages are in English, with day-month dates and a 24-hour clock. "Last updated" shows in the visitor's own timezone. | 4 |
| A12 | The data file is `data/data.js`, not a .json file, because browsers block pages opened from a local file from reading local .json files. It is still one file. | 3 |
| A13 | Each series shows the latest season its official site has published, and every page names the season (see the Season bullet in section 4). If that season hasn't started, Latest results says "No race weekend has started yet." | 6, 7 |
| A14 | MotoGP shows exactly the sessions in your table (the 2026 format). If the official site lists Sprint Qualifying for a 2027 round, it is not shown unless you tell me to add it. | 6 |
| A15 | On a Formula E double-header, qualifying and race are numbered by day (Qualifying 1, Race 1, Qualifying 2, Race 2). The Season 13 "E-Prix Unleashed" race is Race 2 and its qualifying is Qualifying 2, since your table has no separate names for them. | 6 |
| A16 | Official sites may word a session differently from your table. The script maps names to the table's; a session it can't map shows under the official site's own name, except sessions the table rules out, which stay hidden. | 6 |
| A17 | The official sites can be read by a script from the client's laptop. If a site can't be read at all, Claude Code may use another source for that series, names it in README.md and its final report, and the source lines name the real site (OPEN-3). A single missing value stays null. | 3 |
| A18 | The refresh script uses whichever of Python 3, Node, PowerShell or a shell with curl is already installed. Nothing is installed. | 3 |
| A19 | "Largest element" for the wordmark means largest text. A photo can be physically larger. | 4 |
| A20 | The intro sentence, the labels, and the empty and error messages (for example "No news items yet.") are my wording, written to follow voice.md. | 4, 5, 6, 7 |
| A21 | A test clock (`?now=`) and a `TOP_N` constant exist only so the checks can be run. | 4, 6 |
| A22 | The page background starts from `#0B3D2E` and content is at most 1100 px wide. | 8 |
| A23 | The Home page news copies the lead-story-plus-cards layout of your motorsport.com screenshot, with one card per series (the newest item from each) so every series appears. The first card is large and five are smaller. Cards use each series' own photo rather than an article photo, and show the date rather than the hours since posting. Left out on purpose: the tabs, the slider arrows, the quick-links bar and the summary line under the lead headline. | 5 |

## 12. Open items for the client

OPEN-1, OPEN-2, OPEN-4 and OPEN-5 are settled. Only OPEN-3 needs an answer, and it can hold up the build.

| ID | Question | Blocks | Status |
|---|---|---|---|
| OPEN-1 | The series table. | Series pages, calendar | Settled 12 Nov 2026: the table you sent is in section 6. |
| OPEN-2 | The plan has three placeholders. The audience is settled (you approved my draft). I used your example sentence for why the calendar fits the brand. I left out the line about which posts or images from the team repository you use, because voice comes from the attached voice.md. Fill in or confirm the last two if your assignment needs them. | Nothing | Settled 12 Nov 2026: brand-fit sentence kept; nothing is taken from the team repository. |
| OPEN-3 | Do the six official sites let a script read their results, news and line-ups? Their terms may limit automated reading, and some pages may only load through a browser. Claude Code tests this first. If a site can't be read at all, it may use another source for that series and tells you which one (A17). | The refresh script and all data | Open |
| OPEN-4 | News captions can't be written by a script. Do you want items with no caption to show "New article on" plus the site name (my default), or to stay hidden until a caption is added? | News on series pages | Settled 12 Nov 2026: Claude writes the captions (A10). |
| OPEN-5 | I haven't seen the motorsport.com navigation bar or headline style, so I can't describe it. Send screenshots of the parts you want borrowed, or tell Claude Code to look at the site. | Navigation bar and headline style | Settled 12 Nov 2026: screenshot received (section 8, Look). |

## 13. Interactive features (added 13 Nov 2026 at the client's request)

The client asked for the site to be more fun and interactive and approved the twelve features below. They are now part of the build; rule 1 ("build only what this PRD lists") covers them. All of them keep the section 2 constraints: plain HTML, CSS and JavaScript, no libraries, no web fonts, works from `file://` and offline. None of them adds opinions, predictions or a favourite team or driver.

**Time**

1. **Countdown.** Each series page shows "Next up:" with the next session in the data that has a start time (session name, weekend name, date, time and timezone label) and a live countdown such as "in 4d 3h 12m 5s", ticking every second. A series with no upcoming timed session shows no countdown. (Home news cards no longer show it since the Home news became a story feed.)
2. **On track now.** A session whose start has passed and whose `start` plus `durationMinutes` has not, carries a pulsing "On track now" badge on its series page and in the calendar tool. A session with no duration never shows it.
3. **My time switch.** Changed 13 Nov 2026 at the client's request: each weekend in the calendar tool that has session times carries its own "Show my time zone" button, which switches that weekend's dates and times between the track's timezone (the default, as section 4 requires) and the visitor's own, always with the timezone label; pressing it again ("Show track time zone") switches back. There is no switch in the header; series pages show track time. "Last updated" stays in the visitor's timezone.

**Calendar tool**

13. **Announced 2027 calendars (added 13 Nov 2026).** When a series' official site has announced its next season's calendar before its calendar pages switch over, the refresh script adds those weekends too, with only what the announcement states (place and dates; the circuit only if it is named; no session times until published). Each weekend carries its own `season`, and the calendar tool shows it ("F1 Academy, Season 2027"). Today this applies to F1 Academy, whose 2027 calendar is in its press release "F1 ACADEMY reveals 2027 calendar". Formula 1, Formula E, MotoGP and WEC already list 2027 as their latest season. IMSA's 2027 schedule is not available from any source the script can read, so none is shown.

4. **Remember my series.** The tool remembers the ticked series (and the "Upcoming only" choice) in the browser. On a first visit nothing is ticked; on a return visit the saved choice is ticked and the calendar shows straight away.
5. **Upcoming only.** A checkbox "Upcoming only" hides weekends whose sessions have all ended.
6. **Add to your calendar.** After the calendar is shown, a box "Add these sessions to your calendar" offers three buttons. Each saves one `.ics` file (built in the browser) with every timed session listed. "Apple Calendar" saves it and says to open it, which adds the sessions in Calendar on a Mac, iPhone or iPad. "Google Calendar" saves it and opens Google Calendar's Import page (https://calendar.google.com/calendar/r/settings/export) in a new tab with the steps to import it, because Google Calendar only accepts a set of events through that page. "Other app (.ics)" saves it for Outlook or any other calendar app. The box is hidden when the chosen series have no timed sessions. Opening Google Calendar is the only outbound link the tool makes, and only when the visitor presses that button.

**Results**

7. **Sortable columns.** On wider screens each result table's column headings are buttons; clicking one sorts by that column, clicking again reverses it.
8. **Highlight a driver.** Clicking a name in a result table highlights that driver's row in every table on the page; clicking again clears it. The visitor chooses; the site never pre-selects anyone.
9. **Open and close sessions.** Each session under Latest results is a panel that opens and closes. The running session, or else the latest session with results, or else the next session, starts open. "Open all" and "Close all" buttons sit above the panels.

**Look**

10. **Motion.** Cards lift with a light green glow on hover, a light green bar slides under menu links, and sections fade in as they scroll into view. All motion is off when the visitor's device asks for reduced motion.
11. **Series colour chips.** Removed 13 Nov 2026 at the client's request: no coloured boxes next to series names anywhere.
12. **Racing details.** Changed 13 Nov 2026 at the client's request: instead of a chequered stripe, a strip under the header where a white race car with a driver (original drawing) drives across, every seven seconds, The driver wears a dark green race suit with lime trim in Aston Martin's team colours, at the client's request (13 Nov 2026), with no team logo or wings, and an original helmet design (white shell, green and lime stripes, tinted visor, chin bar, air vent) that copies no real driver's helmet. The client accepted that showing one team's colours in the header on every page goes against the section 8 rule against implying a favourite team; above a chequered line that runs along the bottom of the header in place of the coloured accent line; with reduced motion the car stays parked on the right. Also five start lights to the left of the wordmark that light one by one and go out together, over and over for as long as the page is open. Off with reduced motion.

H3 and C1 now read: on a first visit (nothing saved in the browser), nothing is ticked.

| ID | Check (steps) | Pass when |
|---|---|---|
| I1 | Open a series page with `?now=` before a timed session. Watch for five seconds. Open Home. | "Next up:" names the next timed session with date, time and label, and the countdown goes down each second. |
| I2 | Open a series page with `?now=` inside a session that has a duration. | That session shows "On track now"; the others don't. |
| I3 | In the calendar tool, press "Show my time zone" on one weekend, then press it again. | That weekend's times change to your own timezone with its label while the other weekends stay in track time, then switch back. |
| I4 | Tick two series, show the calendar, reload Home. Then clear site data and reload. | After reload the same two are ticked and shown. After clearing, nothing is ticked. |
| I5 | Show a calendar with `?now=` in the middle of a season, then tick "Upcoming only". | Past weekends disappear; later ones remain. |
| I6 | Show a calendar. Press "Apple Calendar", open the file. Press "Google Calendar" and follow the steps on the tab that opens. | Apple Calendar adds every timed session listed; Google Calendar's Import page opens in a new tab and imports the same file. |
| I7 | At desktop width, click "Name" in a result table, then click it again. | Rows sort A to Z, then Z to A. |
| I8 | Click a driver's name in a result table. | That driver's row is highlighted in every table on the page; clicking again clears it. |
| I9 | Open a series page with results. Press "Close all", then "Open all". | Sessions collapse and expand; one session starts open. |
| I10 | Hover a news card. Turn on "Reduce motion" in system settings and reload. | The card lifts; with reduced motion nothing moves or fades. |
| I11 | Look at the menu, Home cards and calendar. | No coloured boxes next to any series name. |
| I13 | Tick F1 Academy in the calendar tool with "Upcoming only" off. | The 2026 weekends are followed by seven 2027 weekends labelled "Season 2027", with the dates in the official announcement and no session times. |
| I12 | Open any page and watch for ten seconds. | A white race car crosses the strip under the header above a chequered line, and the five lights keep lighting one by one and going out together, every four seconds. With reduced motion, the car stays still. |
