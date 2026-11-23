# Brand

## Palette (Ben's, matching the rebranded Instagram)

| Token | Hex | Name | Use |
|---|---|---|---|
| `--raw-black` | `#0C0C12` | Lights-Out Black | Page background, text on yellow/orange |
| `--raw-white` | `#EAE6E0` | Starting-Line White | Text |
| `--raw-yellow` | `#F4C537` | Race-Paint Yellow | Primary buttons, links, focus ring |
| `--raw-orange` | `#F64C1C` | Flaming-Hot Orange | Highlights, active states, accent wipes, live badges |
| `--raw-navy` | `#14286C` | Night-Drive Navy | Panels (Instagram card, About sidebar). Never as text on black. |

Every text/background pair used passes WCAG AA (lowest: orange on black, 5.5:1).

**Rule:** components use only the semantic tokens in `css/tokens.css` (`--color-accent`, `--color-text`, ...), never raw hex or `--raw-*`. A rebrand means editing the raw palette in one file.

Series are marked by text tags in palette colors only (no extra hues): F1 orange, MotoGP yellow, WEC white, IndyCar navy, NASCAR black with a yellow ring, IMSA black with an orange ring.

## Type

- **Oswald** (500, 600, 700), uppercase: headings, nav, buttons, numbers.
- **Inter** (400–800): body text.
- Both stored in `assets/fonts/` (SIL Open Font License), so the site looks the same offline.

## Shape and motion

- Square corners (2 px), from Evelin's premium identity.
- Ben's checkered stripe opens every page head.
- Motion from Evelin and Sanith: scroll reveal, image zoom and orange underline wipe on card hover, button lift with arrow nudge, nav underline that grows from the left, the logo car that drives off on hover, the hero video fade-up and slow drift. Timing tokens: `--speed` 220 ms, `--ease`.
- Everything stops for visitors who set "reduce motion".

## Logo

Sanith's car badge, recolored: a white car and white motion lines, with yellow wheels, in an orange badge; "PACE & PUBLISH" in Oswald, with the "&" in yellow. On hover or focus the car drives off and loops back. Favicon: `assets/images/logo/logo-icon.svg`.

## Voice (Miranda's voice guide)

**Audience:** fans who follow several series and want all the news in one place, often first thing after sleeping through a race, or after work.

**Personality**
- **Authentic:** every caption in our own words. Never copy or lightly reword another outlet.
- **Professional:** report what happened without taking sides. No favorite team or driver.
- **Intriguing:** lead with a fact that makes the fan want to read on.

| We say | We never say |
|---|---|
| "Lando Norris takes P1 in FP2, with Oscar Piastri P2 and Fernando Alonso P3." | "Lando dominated FP2, as usual." |
| "It's race week and we're headed to Montreal." | "We think this weekend belongs to McLaren." |
| "There are some rumors around the paddock about next season's line-up. Nothing is confirmed yet." | "We suspect a big driver move is coming next season." |
| "Aramco Aston Martin F1 Team" (current full name) | An outdated team name |

**Hard rules:** never state a rumor as fact; never predict an outcome; never use outdated team, driver or series details; never swear; never be negative about a nationality or group; never give an opinion on a result ("we think", "we suspect").

**Checklist before anything is published** (all must be yes):
1. Is every statement a confirmed fact, and every rumor labeled as one?
2. Is it free of opinions, predictions and favorites?
3. Are all names and series details current?
4. Is it in our own words?
5. Does it lead with a fact, and is it free of swearing?
