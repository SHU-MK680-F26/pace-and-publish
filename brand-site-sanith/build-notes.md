# Pace & Publish site: build notes

Built November 12, 2026 from `prd.md`. Open `index.html` by double-clicking it. No server, installs or build step.

## Folder

| Path | What it is |
|---|---|
| `index.html`, `planner.html`, `calendar.html`, `news.html`, `about.html` | The five pages (PRD section 5) |
| `css/style.css` | All styles, including the print stylesheet for "Print my weekend" |
| `js/` | `common.js` (shared helpers, back-to-top), plus one script per page |
| `data/news.js` | 10 news items rewritten from the team's Weeks 1–3 posts on `main` |
| `data/sessions.js` | Race weekends and sessions: **all SAMPLE data** |
| `data/photos.js` | Credits for the four series photos |
| `images/` | Copies of team images (launch images, `week-1/`, `week-2/`, `week-3/`) and `photos/` |

## Decisions made with Sanith during the build (November 12)

1. **Testing in Chrome.** The Claude app's Browser pane can't open a site as `file://` (it shows a frozen copy with no CSS, JS or images). Sanith chose Chrome. The Claude in Chrome extension wasn't connected, so the site was tested in real Google Chrome (headless), driven through Chrome's DevTools protocol and opened as `file://` with no server.
2. **Racing look.** Sanith asked for a more "racing" look, then for real racing photos and a real news-site interface instead of the team's post graphics. Sanith approved four free-license photos from Wikimedia Commons (credits on the About page and in `data/photos.js`). **This changes check 18:** those four photos are not from the team repo. Every other image is a copy from the team repo, as the PRD says. The PRD itself (`prd.md`) is unchanged.
3. **Color palette.** Sanith replaced the PRD's asphalt, chequered white and British racing green with "Purple sector": background #14121C, text #F4F2FA, accent #7C5CFF. **This changes check 16:** it now tests these three colors, plus Montserrat. White text on the purple accent has a contrast ratio of about 3.9:1, which is fine for the large podium numbers but under the 4.5:1 guideline for the small text on buttons and badges.
4. **Logo.** Sanith picked logo concept G: a white racing car with speed lines in a purple badge, with "PACE & PUBLISH" stacked beside it. On hover (or keyboard focus) the car speeds off to the right and comes back round. It stays still for visitors who prefer reduced motion. The same car is the browser-tab icon (`images/logo-icon.svg`). The concept page (`logo-lab.html`) stayed in the working folder and isn't part of this copy.
5. **Home hero video.** Sanith asked for racing footage, then for a drone shot like the opening of the F1 movie, then for a 1080p clip at an F1 track. The movie's footage is copyrighted, and Wikimedia Commons had no usable clip, so with Sanith's OK the site uses one free Pexels clip: "Exciting Race Circuit with City Skyline Backdrop" by Abhilash Venkat (pexels.com/video/38076413). It shows Formula 1 cars from many teams racing through a corner with a city skyline behind, at 1920×1080, 24 s, 17 MB, saved as `videos/circuit-city-skyline-1080p.mp4`. It fades up from black, drifts slowly, and loops muted over the WEC photo, which shows first and stays for reduced-motion visitors. The credit is under the hero. Two earlier Pexels clips (pit lane, Indianapolis drone) were replaced and deleted.
6. **Carousels.** At Sanith's request, three sections are now swipeable carousels, with arrows and an "x of n" counter on a laptop and swipe on a phone:
   - **Home, Latest news:** 3 cards in view on a laptop, 1 on a phone. The lead-story layout was replaced by equal cards.
   - **News page:** one item per slide. The series and type filters, search and poll still work, and links from Home (`news.html#id`) open the carousel at that story.
   - **Race calendar:** each weekend's race cards, 2 in view on a laptop.

   The code is `PP.carousel()` in `js/common.js`. If a browser never runs smooth scrolling (the Claude app's preview pane doesn't), the arrows jump straight to the next slide. Only the carousel strip scrolls sideways, never the page, so check 15 still holds. The Home hero video is unchanged.
7. **Side-pane preview.** While building, a `.claude/launch.json` file in the working folder pointed the Claude app's Browser pane at a local preview server. It isn't part of this copy, and the site needs no server.
8. **News images.** Each news item shows its series photo, and still links its own week's Instagram post graphic ("Our Instagram post"), so PRD 6.4 is still met. The launch images are on Home, in "From our Instagram launch".

## Where the facts come from

- Week 1: `content/2026-43-results-roundup.md`, `content/2026-43-weekend-recap.md`
- Week 2: `content/2026-44-results-roundup.md`, `content/2026-44-weekend-recap.md`
- Week 3: `content/2026-45-results-roundup.md`, `content/2026-45-weekend-recap.md`, `content/2026-45-fun-fact.md`

The Week 3 files and the `content/images/week-3/` images are only on the team repo's `main` branch (`origin/main`). The team folder's checked-out branch (`engagement`) doesn't have them. They were read with `git show origin/main:...`, and nothing in `mk680-team-b` was changed.

## SAMPLE data to replace

Everything in `data/sessions.js`: 3 sample weekends (Nov 12–15, 19–22, 26–29), 12 sample events, 53 sample sessions. Event names, tracks and times are placeholders and show "SAMPLE" on screen. Replace them with real sessions from formula1.com, motogp.com, nascar.com and fiawec.com, and set `sample: false`.

## Known gaps

- **NASCAR news:** none of the team's Weeks 1–3 posts covered NASCAR, so News filtered to NASCAR shows an empty-state message.
- **Check 28 ("Monza"):** no news item mentions Monza, so typing "Monza" shows none, with a message. The search was also checked with Marquez, Sepang and Leclerc.
- **Google Fonts:** loaded only when the browser reports it's online, so an offline double-click opens with a clean console and a system sans-serif.
