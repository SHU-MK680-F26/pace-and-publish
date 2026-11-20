# Pace & Publish — images needed

**Update, Nov 18, 2026 (v7):** slots 1 (hero), 2 (F1 card), 4 (NASCAR card) and 5 (WEC card) are now filled with approved Wikimedia Commons photos (credits in `README.md`). The open slots are **3 (MotoGP card)**, **6 (pit-stop band)**, **7 (night race)** and **8 (detail close-up)**. No current, openly licensed MotoGP on-track photo was found; the only one available is from 2014, with a livery and team that are now outdated.

## Original list (v6)

**Status as of Nov 18, 2026:** the team repository has no motorsport photography. Every slot in `mk680-team-b/pace-publish-image-pack/IMAGE-SOURCING.csv` is still marked NEEDED, and its folders are empty. The redesign works now with the team's graphics, the road photo from Ben's launch post and the licensed circuit images. The photos below would take the site to the cinematic F1 look in the v6 brief.

## Rules for every image
- **Licensing:** team-owned, a Canva license the team holds, or an open license (CC0, CC BY, CC BY-SA) with the author and license recorded. No search-result previews or hot-linked URLs.
- **Neutrality** (`brand/voice.md`): prefer shots with no single team dominating, such as several cars, an unbranded detail, a circuit, or a night atmosphere. A shot that centers on one team or driver should be balanced elsewhere on the page.
- **People:** avoid identifiable faces unless the license covers the person's likeness. Helmets and race suits shot from a distance are fine.
- **Files:** JPEG, at most 500 KB each (export at about 75–80% quality), at the sizes below. Add a credit line to `README.md`.

## Slots and placement

| # | Section (file) | What to shoot or source | Ratio and minimum size | Composition notes | Replaces now |
|---|---|---|---|---|---|
| 1 | Homepage hero (`homepage/hero-night-race.jpg`) | An F1 car on track at night, or under lights with motion blur | 16:9, 2400×1350 | Keep the car in the right two-thirds; the left third must stay dark for the headline and buttons | Road-at-sunrise photo (Ben's launch post) |
| 2 | Browse by series: F1 card (`formula-1/f1-race.jpg`) | An F1 car cornering, low angle | 4:5, 1200×1500 | Subject in the top half; the bottom 40% sits under text | F1 United States GP results graphic |
| 3 | Browse by series: MotoGP card (`motogp/motogp-corner.jpg`) | A rider leaning into a corner | 4:5, 1200×1500 | Same as #2 | MotoGP Indonesia results graphic |
| 4 | Browse by series: NASCAR card (`nascar/nascar-pack.jpg`) | Stock cars racing in a pack | 4:5, 1200×1500 | Same as #2 | "Lights Out" launch graphic |
| 5 | Browse by series: WEC card (`wec/wec-hypercar.jpg`) | A Hypercar at night, headlights on | 4:5, 1200×1500 | Same as #2 | WEC Barcelona results graphic |
| 6 | Full-width photo band between "More stories" and "Editorial standards" (`news/pit-stop.jpg`) | A pit lane or garage during a stop, mechanics in motion | 21:9, 2400×1030 | Wide and atmospheric; keep the top-left calm for a short caption | Not built yet; the band will be added once this photo exists |
| 7 | Race calendar section header (new: `homepage/calendar-night.jpg`) | A grandstand or start line at night, floodlights | 21:9, 2400×1030 | Dark overall; used behind the section title | Plain charcoal background |
| 8 | Featured lead backdrop, optional (new: `news/detail-closeup.jpg`) | A technical close-up: wheel, wing or steering wheel | 16:10, 1800×1125 | Soft focus works; the lead headline sits on the left | Blurred team graphic |

Circuit maps and photos are already in place for Monaco, Silverstone and Suzuka (`assets/images/circuits/`, credits in `README.md`).

## How to add them
1. Put the files in `mk680-team-b/pace-publish-image-pack/` under the names above, and mark them APPROVED in `IMAGE-SOURCING.csv` with author and license. A teammate does this, because this project doesn't change the team repository.
2. Ask Claude Code to copy them into `my-brand-site/assets/images/` and wire them into the slots. Each slot is a single image path in `index.html` or `data/content.js` (`series[].image`), so swapping is quick.
