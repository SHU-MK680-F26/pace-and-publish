# Pace and Publish

Results, news, line-ups and schedules for Formula 1, F1 Academy, Formula E, MotoGP, WEC and IMSA, with the source on every item.

## Open the site

**Link to the site:** [file:///Users/moxie/Desktop/Claude%20Projects/my-brand-site/index.html](file:///Users/moxie/Desktop/Claude%20Projects/my-brand-site/index.html)

This link opens the copy saved on the laptop the site was built on, so it works on that computer only (paste it into the browser's address bar if clicking it does nothing). On any other computer, download this `brand-site` folder and double-click `index.html`.

Double-click `index.html`. It opens in your browser from your own disk. You don't need a server or an internet connection. You only need the internet to follow a "Source" or "Photo" link.

## Refresh the data

This laptop already has Python 3, so the refresh script is written in Python and uses only its standard library. Nothing needs installing.

1. Open Terminal.
2. Go to the folder that holds `index.html`: `brand-site` in the sandbox repo, or on this laptop `cd "~/Desktop/Claude Projects/my-brand-site"`.
3. Run this command:

```
python3 scripts/refresh.py
```

It takes about three and a half minutes, because it reads at most one page per second. When it finishes, it prints a summary for each series: the number of weekends, sessions with results, line-up entries and news items. Reload any page and "Last updated" at the bottom shows the new time.

- If a series can't be read (for example with no internet), the script names it and the reason, keeps that series' old data, and ends with a non-zero exit code. That series' page then shows "Some items could not be refreshed. Last successful refresh:" with the date of its last good refresh.
- If every series fails, `data/data.js` is left as it was.
- The script writes to a temporary file first and then swaps it in, so a failed run never leaves a half-written file.
- News captions and the photo list are written by hand. The script keeps them, matching each caption to its news item by `sourceUrl`. A new news item shows "New article on" and the site name until Claude is asked to caption it.
- News whose headline mentions a death or fatal accident is left out, and its address is printed.

## Where the data comes from

| Series | Source | Notes |
|---|---|---|
| Formula 1 | formula1.com | The 2026 season (with results) and the 2027 calendar the site has already published. |
| F1 Academy | f1academy.com | Season 2026, with full results for every round run so far. The 2027 calendar (seven rounds, dates only) comes from the official announcement on f1academy.com. |
| Formula E | fiaformulae.com | Season 2027 (Season 13). The site publishes a start time only for the next race, so the other sessions show their date only. Practice and qualifying appear once their results are posted. |
| MotoGP | motogp.com | The 2026 and 2027 calendars. The site's own pages give the weekend dates but not session times or results. Those come only from a separate data service that isn't on motogp.com. The line-up is the grid the site's team page lists now. |
| WEC | fiawec.com | The 2026 season (with results and its entry list) and the 2027 calendar, where only race times are published so far. |
| IMSA | **sportscar365.com (fallback)** | See below. No 2027 schedule is available from a source the script can read. |

### IMSA fallback source

The script can't read any imsa.com page. www.imsa.com answers every automated request with a Cloudflare browser check ("Just a moment..."). results.imsa.com sends every request on to imsa.results.alkamelcloud.com, which is not an imsa.com address and only accepts a newer secure connection (TLS 1.3) that this laptop's built-in Python 3.9 can't make. Following PRD rule A17, the client chose **sportscar365.com** as IMSA's fallback source.

sportscar365.com publishes WeatherTech Championship news as a feed the script can read: `https://sportscar365.com/category/imsa/iwsc/feed/`. It publishes no schedule, result tables or entry lists in a form a script can read, so the IMSA page has news only. Its other sections show the PRD's empty wording, and no season is shown because no season schedule could be read. Every IMSA source line names sportscar365.com, so nothing is labelled as official when it isn't.

## Photos

The seven page photos and 19 Formula 1 driver portraits (in `images/drivers/`) all come from Wikimedia Commons under CC BY or CC BY-SA licences, taken by the photographers credited, not by a stock photo agency. They are saved in `images/` and each one is credited under it on the page. The list, with credits and links, is in `photos` in `data/data.js`. Pierre Gasly, Rafael Câmara and Sergio Perez have no openly licensed portrait on Commons yet, so their cards show only their name and team; to add one, save the photo in `images/drivers/` and add an entry with `"page": "driver"`, `"series": "formula-1"` and `"driver"`.

## Look

Charcoal pages with a bold title and headlines, regular-weight text, a sticky frosted header with pill-shaped menu buttons on larger screens, and rounded cards. Each series page has its own accent colour. Details are in prd.md, section 8.

## Interactive features

prd.md section 13 lists them: countdowns to the next session, an "On track now" badge, a button on each calendar weekend that switches its times between track time and your own time zone, a race calendar that remembers your series and can hide past weekends, and can add the sessions to Apple Calendar, Google Calendar or any other calendar app, sortable result tables, click-a-name driver highlighting, open-and-close session panels, hover and fade-in motion, a white race car above a chequered line under the header, and start lights. Your calendar choices are saved only in your own browser. Motion switches off if your device is set to reduce motion.

## Test the site

The checks are in `prd.md`, section 10. Two tools exist only for testing:

- **Test clock:** add `?now=2026-06-14T12:00:00Z` (any date and time) to the end of a page address. The page treats that moment as now and shows "Test time in use" at the top.
- **TOP_N:** the constant at the top of `js/site.js` sets how many rows per class WEC and IMSA show (10).

## Files

- `index.html` and the six series pages
- `css/styles.css`
- `js/site.js`: header, footer, dates and times, result states
- `js/calendar.js`: the race calendar tool
- `data/data.js`: the one data file
- `images/`
- `scripts/refresh.py`
- `docs/voice.md`: copy of the brand voice
- `prd.md`: the product requirements
