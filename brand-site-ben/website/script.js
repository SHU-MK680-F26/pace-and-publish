/* =====================================================================
   Pace & Publish: Motorsport Starter Guide
   ---------------------------------------------------------------------
   HOW TO ADD CONTENT (no layout or map code needs to change)

   1. Find the list you want below: SERIES, TERMS, TACTICS, TRACKS,
      RACES (and, later, CARS and DRIVERS). Each block starts with a
      commented TEMPLATE you can copy.
   2. Paste a copy anywhere inside the list (order does not matter: the
      site sorts entries itself) and fill in the fields.
   3. Give it a new "id": lowercase letters, numbers, and hyphens only.
      Never change an id after it is published, because links point at it.
   4. Save, then open index.html (double-click it) and open the browser
      console (Cmd+Option+J in Chrome, Cmd+Option+C in Safari). The site
      checks every entry on load and prints a clear warning for anything
      missing or wrong. No warnings means you are done.

   A new track automatically gets a map marker, a list row, a Learn More
   link, an entry on the Racetracks page, and is counted on the Home page.

   Content rules (prd.md section 6): our own words, no emojis, no
   predictions, nothing current-season, and every entry cites a source.
   Facts were checked against the cited sources on SOURCES_CHECKED.
   ===================================================================== */

"use strict";

var SOURCES_CHECKED = "13 November 2026";

/* Small helpers for writing sources. */
function wiki(title) {
  return { title: "Wikipedia: " + title.replace(/_/g, " ").replace(/%27/g, "'"), url: "https://en.wikipedia.org/wiki/" + title };
}
var GLOSSARY = wiki("Glossary_of_motorsport_terms");

/* Official series sources (checked 13 November 2026; nascar.com blocked automated access). */
function official(title, url) { return { title: title, url: url }; }
var F1_GLOSSARY_AE = official("Formula 1: F1 Glossary, A to E", "https://www.formula1.com/en/latest/article/f1-glossary-a-e.1MFONigMlQSbSQtpP7YCy2");
var F1_GLOSSARY_FJ = official("Formula 1: F1 Glossary, F to J", "https://www.formula1.com/en/latest/article/f1-glossary-f-j.2g6grJVxT6dFCDpSmgoCQX");
var F1_GLOSSARY_KO = official("Formula 1: F1 Glossary, K to O", "https://www.formula1.com/en/latest/article/f1-glossary-k-o.6g2hrWHA2pyxbXoe8FT9Db");
var F1_GLOSSARY_PT = official("Formula 1: F1 Glossary, P to T", "https://www.formula1.com/en/latest/article/f1-glossary-p-t.GBhLQtpeu9b8LrK5VM0F1");
var F1_GLOSSARY_UZ = official("Formula 1: F1 Glossary, U to Z", "https://www.formula1.com/en/latest/article/f1-glossary-u-z.5JSlDsnyvYmbK0TCjTs7KB");
function f1Circuit(slug, title) { return official("Formula 1: " + title, "https://www.formula1.com/en/racing/2026/" + slug); }
var MOTOGP_GLOSSARY = official("MotoGP: MotoGP Glossary", "https://www.motogp.com/en/glossary");
var WEC_ABOUT = official("FIA WEC: What is FIAWEC?", "https://www.fiawec.com/en/page/le-wec-cest-quoi-1");
var WEC_LE_MANS = official("FIA WEC: 24 Hours of Le Mans (track information)", "https://www.fiawec.com/en/race/24-hours-of-le-mans-2026");
var INDYCAR_BASICS = official("IndyCar: The Basics of INDYCAR", "http://www.indycar.com/Fan-Info/INDYCAR-101/Basics");
var FLAGS = wiki("Racing_flags");
function racingCircuits(path, name) { return official("RacingCircuits.info: " + name, "https://www.racingcircuits.info/" + path); }
var INDYCAR_GLOSSARY = official("IndyCar: INDYCAR 101 Glossary", "http://www.indycar.com/Fan-Info/INDYCAR-101/Glossary");
var INDYCAR_LAGUNA = official("IndyCar: WeatherTech Raceway Laguna Seca", "http://www.indycar.com/Schedule/2027/Laguna-Seca");
var INDYCAR_INDY500 = official("IndyCar: Indianapolis 500 (track information and previous winners)", "http://www.indycar.com/Schedule/2027/Indianapolis-500");

/* =====================================================================
   CONTENT: SERIES
   Keys used by every other list. Add a series here before using its key.
   A series with a "body" also gets a full entry in the Legacy page's
   Series section (anchor #series-<key>), like a track or race entry.
   TEMPLATE:
   {
     key: "f1",                            // short key used by every list; anchor #series-f1
     label: "F1",                          // text on tags
     name: "Formula One",
     summary: "One sentence shown under the heading.",       // optional
     desc: "Short description for the Home page card.",
     facts: [{ label: "First season", value: "1950" }],      // optional, evergreen only
     body: ["Paragraph.", "Paragraph."],                     // optional: adds a Legacy entry
     related: { terms: [], tracks: [], races: [] },          // optional
     sources: [wiki("Formula_One")]
   },
   ===================================================================== */
var SERIES = [
  { key: "f1", label: "F1", name: "Formula One",
    desc: "The top class of single-seater racing worldwide, run as a world championship since 1950. Its races are called Grands Prix.",
    summary: "The world's top single-seater championship, decided across Grands Prix since 1950.",
    facts: [
      { label: "First season", value: "1950" },
      { label: "Sanctioned by", value: "FIA" },
      { label: "Vehicles", value: "Single-seater cars" },
      { label: "Teams' title since", value: "1958" }
    ],
    body: [
      "Formula One is the highest class of worldwide racing for single-seater cars, sanctioned by the FIA, motorsport's world governing body. The word \"formula\" refers to the set of rules every car must follow. The world championship began in 1950, and its very first race was the 1950 British Grand Prix at Silverstone.",
      "F1 cars are the fastest regulated road-course racing cars in the world, mostly because their wings and underbody create large amounts of downforce for cornering. Each season is a series of Grands Prix on purpose-built circuits and street circuits, deciding two titles: one for drivers and, since 1958, one for constructors (the teams)."
    ],
    related: { terms: ["grand-prix", "downforce", "street-circuit"], tracks: ["silverstone", "monza", "monaco", "suzuka"] },
    sources: [wiki("Formula_One"), f1Circuit("great-britain", "British Grand Prix circuit page")] },
  { key: "motogp", label: "MotoGP", name: "MotoGP",
    desc: "The premier class of Grand Prix motorcycle racing, the oldest motorsport world championship. It has carried the MotoGP name since 2002.",
    summary: "The premier class of Grand Prix motorcycle racing, the oldest motorsport world championship.",
    facts: [
      { label: "World championship since", value: "1949" },
      { label: "Sanctioned by", value: "FIM" },
      { label: "Vehicles", value: "Prototype motorcycles" },
      { label: "Named MotoGP since", value: "2002" }
    ],
    body: [
      "Grand Prix motorcycle racing is the highest class of motorcycle road racing, sanctioned by the FIM, motorcycling's world governing body. Its world championship began in 1949, which makes it the oldest motorsport world championship. The top class was called 500cc until 2002, when it was renamed MotoGP at the start of the four-stroke era.",
      "The bikes are purpose-built prototypes that cannot be bought by the public or ridden legally on public roads. That sets MotoGP apart from production-based racing such as the Superbike World Championship. Smaller classes race at the same events: Moto2 replaced the 250cc class in 2010, and Moto3 replaced the 125cc class in 2012."
    ],
    related: { terms: ["grand-prix"], tracks: ["assen", "mugello", "phillip-island", "jerez", "sepang"] },
    sources: [wiki("Grand_Prix_motorcycle_racing"), MOTOGP_GLOSSARY] },
  { key: "wec", label: "WEC", name: "World Endurance Championship",
    desc: "A world championship for endurance racing, where several classes of cars share the track at once over long races.",
    summary: "A world championship for endurance racing, first run in 2012 with the 24 Hours of Le Mans on its calendar.",
    facts: [
      { label: "First season", value: "2012" },
      { label: "Organized by", value: "ACO" },
      { label: "Sanctioned by", value: "FIA" },
      { label: "Format", value: "Multi-class endurance" }
    ],
    body: [
      "The FIA World Endurance Championship is a world championship for endurance racing, organized by the Automobile Club de l'Ouest (ACO) and sanctioned by the FIA. It was first run in 2012 with eight races around the world, including the 24 Hours of Le Mans. It revived the World Sportscar Championship, which ended after the 1992 season.",
      "Several classes of cars race on the track at the same time: purpose-built sports prototypes and grand touring (GT) cars based on production models. The classes have changed over the years; the Hypercar class for prototypes first appeared in 2021. Teams share each car between drivers, and in the 2026 season points at the 24 Hours of Le Mans were worth roughly double those of a standard race."
    ],
    related: { terms: ["endurance-racing", "triple-crown"], tracks: ["le-mans", "spa", "fuji", "bahrain", "interlagos", "cota"] },
    sources: [wiki("FIA_World_Endurance_Championship"), wiki("Endurance_racing_(motorsport)"), WEC_ABOUT] },
  { key: "indycar", label: "IndyCar", name: "IndyCar Series",
    desc: "The top level of American single-seater racing. Its biggest event is the Indianapolis 500, first held in 1911.",
    summary: "The top level of single-seater racing in the United States, home of the Indianapolis 500.",
    facts: [
      { label: "Top-level racing since", value: "1920" },
      { label: "Current series since", value: "1996" },
      { label: "Reunified", value: "2008" },
      { label: "Biggest race", value: "Indianapolis 500" }
    ],
    body: [
      "The IndyCar Series is the top level of single-seater racing in the United States, a tradition run by various sanctioning bodies since 1920. Its biggest event, the Indianapolis 500, was first held in 1911 and gives the series its name.",
      "The current series began in 1996 as the Indy Racing League. American single-seater racing was then split between rival series until 2008, when IndyCar merged with the Champ Car World Series and combined their histories. Its calendar mixes ovals such as Iowa Speedway, road courses such as Road America, and street circuits such as Long Beach."
    ],
    related: { terms: ["oval", "road-course", "street-circuit", "triple-crown"], tracks: ["indianapolis", "long-beach", "road-america", "iowa", "mid-ohio", "laguna-seca"] },
    sources: [wiki("IndyCar_Series"), wiki("Grand_Prix_of_Long_Beach"), wiki("Road_America"), wiki("Iowa_Speedway"), INDYCAR_BASICS] },
  { key: "nascar", label: "NASCAR", name: "NASCAR",
    desc: "The American racing organization founded by Bill France Sr. in 1948 and based in Daytona Beach, Florida. Its top division is the Cup Series.",
    summary: "America's stock car racing organization, founded in Daytona Beach in 1948.",
    facts: [
      { label: "Founded", value: "21 Feb 1948" },
      { label: "Founder", value: "Bill France Sr." },
      { label: "First race", value: "19 June 1949" },
      { label: "Top division", value: "Cup Series" }
    ],
    body: [
      "NASCAR is the American organization best known for stock car racing. Stock cars were originally production-model road cars, which gave the sport its name, but top-level stock cars are now built specifically for racing. The sport's roots trace back to Prohibition-era moonshine runners, who tuned ordinary-looking cars to outrun the authorities and later raced each other.",
      "Bill France Sr. founded NASCAR on 21 February 1948 in Daytona Beach, Florida, and its first Strictly Stock race was held at Charlotte Speedway on 19 June 1949. NASCAR races mainly on ovals, from superspeedways to short tracks, along with road courses and street circuits. Its top division is the Cup Series, and its most prestigious race is the Daytona 500."
    ],
    related: { terms: ["stock-car", "oval", "tri-oval", "drafting"], tracks: ["daytona", "talladega", "bristol", "watkins-glen"] },
    sources: [wiki("NASCAR"), wiki("Stock_car_racing"), wiki("Daytona_International_Speedway")] },
  { key: "other", label: "Other", name: "Other series",
    desc: "Sports car, endurance, and national championships that have also raced at these tracks over the years.",
    sources: [] }
];

/* =====================================================================
   CONTENT: TOPICS
   Quick sets shown as the second row of filters on the Terminology page.
   Add a topic key to a term's optional "topics" list to include it,
   e.g. topics: ["starter", "flags"].
   ===================================================================== */
var TOPICS = [
  { key: "starter", label: "Starter Pack", name: "the Starter Pack" },
  { key: "flags", label: "Flags", name: "flags" },
  { key: "penalties", label: "Penalties", name: "penalties" }
];

/* =====================================================================
   CONTENT: TERMS
   TEMPLATE:
   {
     id: "apex",                         // anchor becomes #term-apex
     name: "Apex",                        // shown as the heading
     aka: ["Other name"],                 // optional: shown and auto-linked
     forms: ["apexes"],                   // optional: extra words auto-linked (plurals)
     autolink: false,                     // optional: set false to stop auto-linking
     series: ["all"],                     // "all" or keys from SERIES
     topics: ["starter"],                 // optional: keys from TOPICS (quick sets)
     text: "Plain-language definition.",
     related: { terms: [], tactics: [], tracks: [], races: [] },   // optional
     sources: [GLOSSARY]
   },
   Any mention of a term's name, aka, or forms in other entries links here.
   ===================================================================== */
var TERMS = [
  { id: "apex", name: "Apex", topics: ["starter"], series: ["all"],
    text: "The point in a corner where a car or bike passes closest to the inside edge. Hitting the apex is part of following the racing line.",
    forms: ["apexes"], related: { terms: ["racing-line"] }, sources: [GLOSSARY, wiki("Racing_line")] },
  { id: "backmarker", name: "Backmarker", series: ["all"],
    text: "A slower competitor near the back of the field, often one the leaders are about to lap. Getting past backmarkers cleanly can matter in a close fight at the front.",
    forms: ["backmarkers"], sources: [GLOSSARY] },
  { id: "banking", name: "Banking", series: ["nascar", "indycar"],
    text: "The tilt of a track's surface, usually rising toward the outside of a corner. Banked corners are common on ovals.",
    forms: ["banked"], related: { terms: ["oval"], tracks: ["indianapolis", "daytona", "talladega"] }, sources: [GLOSSARY, wiki("Banked_turn")] },
  { id: "box", name: "Box", series: ["f1", "wec"], autolink: false,
    text: "A radio call from the pit wall telling a driver to come in for a pit stop, as in \"box this lap.\" It is used mostly in European racing.",
    related: { terms: ["pit-stop"] }, sources: [GLOSSARY] },
  { id: "chicane", name: "Chicane", series: ["all"],
    text: "A tight pair or set of turns, often left then right, added to a track to slow vehicles down. Some chicanes also create a place to overtake.",
    forms: ["chicanes"], related: { tracks: ["monza", "suzuka"] }, sources: [GLOSSARY, wiki("Chicane")] },
  { id: "dirty-air", name: "Dirty air", series: ["f1", "indycar", "wec"],
    text: "The disturbed air behind a fast car. A car following closely through it can lose downforce, which makes it harder to stay close in corners. Undisturbed air is called clean air.",
    related: { terms: ["downforce"], tactics: ["drs"] }, sources: [GLOSSARY, F1_GLOSSARY_AE] },
  { id: "downforce", name: "Downforce", topics: ["starter"], series: ["all"],
    text: "Grip created by a vehicle's aerodynamic shape, such as its wings, pressing it onto the track. More downforce allows faster cornering, at the cost of extra drag and lower top speed on straights.",
    related: { terms: ["dirty-air"] }, sources: [GLOSSARY, wiki("Downforce"), F1_GLOSSARY_AE] },
  { id: "drafting", name: "Drafting", topics: ["starter"], aka: ["Slipstreaming"], forms: ["slipstream", "draft"], series: ["all"],
    text: "Following closely behind another vehicle to use the pocket of lower air resistance in its wake. It helps the trailing vehicle close the gap or overtake.",
    related: { tactics: ["drafting"], tracks: ["talladega", "monza"] }, sources: [GLOSSARY, wiki("Slipstream")] },
  { id: "drs", name: "DRS", aka: ["Drag Reduction System"], series: ["f1"],
    text: "An adjustable flap in the rear wing that a Formula One driver could open in set zones to cut drag and gain straight-line speed. A driver qualified for it by being within one second of the car ahead at a detection point. F1 used DRS from 2011 to 2025; the 2026 regulations replaced it with Active Aero and Overtake Mode.",
    related: { tactics: ["drs"], terms: ["dirty-air"] }, sources: [GLOSSARY, wiki("Drag_reduction_system"), F1_GLOSSARY_AE] },
  { id: "endurance-racing", name: "Endurance racing", series: ["wec", "other"],
    text: "Racing designed to test how long cars and drivers can keep going, over long distances or long times such as 6, 12, or 24 hours. Two to four drivers usually share one car and take turns at the wheel.",
    forms: ["endurance race", "endurance races"], related: { tracks: ["le-mans", "sebring", "daytona"], races: ["le-mans-1966"] }, sources: [wiki("Endurance_racing_(motorsport)"), WEC_ABOUT] },
  { id: "esses", name: "Esses", series: ["all"],
    text: "A run of alternating left and right turns that together form an S shape.",
    related: { tracks: ["suzuka"] }, sources: [GLOSSARY] },
  { id: "flag-to-flag", name: "Flag-to-flag", series: ["all"],
    text: "Live broadcast of an entire race, from the start (the green flag) to the finish (the checkered flag). The 1979 Daytona 500 was the first major 500-mile race shown this way.",
    related: { races: ["daytona-500-1979"] }, sources: [GLOSSARY] },
  { id: "formation-lap", name: "Formation lap", aka: ["Pace lap", "Parade lap", "Warm-up lap"], series: ["all"],
    text: "A slow lap before the start in which competitors line up in order. In some series they follow the safety car.",
    forms: ["formation laps"], sources: [wiki("Formation_lap"), F1_GLOSSARY_FJ] },
  { id: "full-course-yellow", name: "Full-course yellow", topics: ["starter"], aka: ["Caution"], forms: ["caution period", "caution periods", "cautions"], series: ["all"],
    text: "A period when yellow flags are shown around the whole track and a safety car leads the field at reduced speed until a hazard is cleared.",
    related: { terms: ["safety-car"] }, sources: [GLOSSARY] },
  { id: "grand-prix", name: "Grand Prix", topics: ["starter"], forms: ["Grands Prix"], series: ["f1", "motogp"],
    text: "French for \"great prize.\" The name for a race in the Formula One and MotoGP world championships, such as the British Grand Prix.",
    sources: [wiki("Formula_One"), wiki("Grand_Prix_motorcycle_racing")] },
  { id: "graining", name: "Graining", series: ["all"],
    text: "When small pieces of rubber tear off a tire's surface, which can reduce grip.",
    related: { terms: ["marbles"], tactics: ["tire-management"] }, sources: [GLOSSARY] },
  { id: "gravel-trap", name: "Gravel trap", series: ["all"],
    text: "A bed of gravel beside the track, usually on the outside of a corner, that slows and stops vehicles that run off the circuit.",
    forms: ["gravel traps"], related: { terms: ["run-off-area"] }, sources: [GLOSSARY] },
  { id: "grid", name: "Grid", topics: ["starter"], aka: ["Starting grid"], series: ["all"],
    text: "The starting formation of a race, usually two cars per row, or three or four motorcycles per row. The Indianapolis 500 traditionally lines up three cars per row. \"The grid\" can also mean all the teams and drivers in a series.",
    related: { terms: ["pole-position", "qualifying"], tracks: ["indianapolis"] }, sources: [GLOSSARY] },
  { id: "hairpin", name: "Hairpin", series: ["all"],
    text: "A very tight corner of about 180 degrees that turns back on itself.",
    forms: ["hairpins"], related: { tracks: ["suzuka"] }, sources: [GLOSSARY, wiki("Hairpin_turn")] },
  { id: "in-lap", name: "In-lap", series: ["all"],
    text: "A lap that ends with a visit to the pits.",
    forms: ["in-laps"], related: { tactics: ["in-lap"] }, sources: [GLOSSARY] },
  { id: "intermediate-tire", name: "Intermediate tire", aka: ["Intermediates"], forms: ["intermediate tires"], series: ["f1", "wec"],
    text: "A tire with light grooves for a track that is damp or drying but not fully wet. It sits between a slick tire and a full wet tire.",
    related: { terms: ["slick-tire", "wet-tire"], tactics: ["weather-tires"] }, sources: [GLOSSARY, F1_GLOSSARY_FJ] },
  { id: "marbles", name: "Marbles", series: ["all"],
    text: "Small bits of worn tire rubber that collect off the racing line. They are slippery, so running wide onto them costs grip.",
    related: { terms: ["graining", "racing-line"] }, sources: [GLOSSARY] },
  { id: "marshal", name: "Marshal", series: ["all"],
    text: "A track official who signals conditions to drivers with flags, helps clear damaged vehicles, and responds to emergencies.",
    forms: ["marshals"], sources: [GLOSSARY, wiki("Racing_flags")] },
  { id: "oval", name: "Oval", series: ["nascar", "indycar"],
    text: "A track shaped like an oval, with turns in one direction only, almost always counterclockwise. Ovals are the most common kind of track in the United States and often have banked turns.",
    forms: ["ovals"], related: { terms: ["banking", "tri-oval"], tracks: ["indianapolis", "bristol", "iowa"] }, sources: [wiki("Oval_track_racing"), INDYCAR_BASICS] },
  { id: "overcut", name: "Overcut", series: ["all"],
    text: "Making a pit stop later than a rival to gain time on them. The opposite of an undercut.",
    related: { tactics: ["overcut"] }, sources: [GLOSSARY, F1_GLOSSARY_KO] },
  { id: "oversteer", name: "Oversteer", series: ["all"],
    text: "When the rear of a car slides toward the outside of a corner, so the car turns more sharply than the driver intended. The opposite of understeer.",
    sources: [GLOSSARY] },
  { id: "parc-ferme", name: "Parc fermé", series: ["f1", "wec", "indycar"],
    text: "A secure area where cars go after qualifying. Mechanics may work on them there only under the officials' supervision. Some series call it impound.",
    related: { terms: ["qualifying"] }, sources: [GLOSSARY, F1_GLOSSARY_PT] },
  { id: "pit-lane", name: "Pit lane", forms: ["pits"], series: ["all"],
    text: "The lane beside the track where the team garages are. Drivers leave the track and drive down the pit lane to make a pit stop.",
    related: { terms: ["pit-stop"] }, sources: [GLOSSARY, wiki("Pit_stop")] },
  { id: "pit-stop", name: "Pit stop", topics: ["starter"], forms: ["pit stops"], series: ["all"],
    text: "A stop in the pit lane for new tires, fuel, repairs, adjustments, a driver change, or a penalty. In Formula One, a crew of up to about twenty mechanics does the work.",
    related: { terms: ["pit-window", "stint"], tactics: ["pit-strategy"] }, sources: [GLOSSARY, wiki("Pit_stop")] },
  { id: "pit-window", name: "Pit window", series: ["all"],
    text: "The range of laps in which a pit stop makes the most sense, based on tire wear and fuel use.",
    related: { tactics: ["pit-strategy"] }, sources: [GLOSSARY, F1_GLOSSARY_PT] },
  { id: "pole-position", name: "Pole position", topics: ["starter"], aka: ["Pole"], forms: ["pole-sitter"], series: ["all"],
    text: "First place on the starting grid, usually earned by setting the fastest time in qualifying. The driver who earns it is called the pole-sitter.",
    related: { terms: ["grid", "qualifying"] }, sources: [GLOSSARY, wiki("Pole_position"), F1_GLOSSARY_PT] },
  { id: "qualifying", name: "Qualifying", topics: ["starter"], series: ["all"],
    text: "Timed sessions before a race that decide the starting order.",
    related: { terms: ["grid", "pole-position"] }, sources: [GLOSSARY] },
  { id: "racing-line", name: "Racing line", topics: ["starter"], series: ["all"],
    text: "The fastest path around a track. It usually uses the full width of the road: enter a corner from the outside edge, touch the apex on the inside, then return to the outside on the way out.",
    related: { terms: ["apex"] }, sources: [wiki("Racing_line")] },
  { id: "restrictor-plate", name: "Restrictor plate", forms: ["restrictor plates"], series: ["nascar"],
    text: "A device fitted to an engine's air intake to limit its power. In racing it is used to cap top speed, keep competition close, and lower costs.",
    related: { tracks: ["talladega"], tactics: ["drafting"] }, sources: [wiki("Restrictor_plate")] },
  { id: "road-course", name: "Road course", forms: ["road courses"], series: ["all"],
    text: "A North American term for a paved track with both left and right turns, either purpose-built or on closed public roads, as opposed to an oval.",
    related: { terms: ["oval", "street-circuit"] }, sources: [wiki("Road_racing")] },
  { id: "run-off-area", name: "Run-off area", forms: ["run-off"], series: ["all"],
    text: "Open space beside the track where a vehicle that leaves the circuit can slow down without hitting anything.",
    related: { terms: ["gravel-trap", "street-circuit"] }, sources: [GLOSSARY] },
  { id: "safety-car", name: "Safety car", topics: ["starter"], aka: ["Pace car"], forms: ["safety cars"], series: ["all"],
    text: "A car that leads the field at a controlled speed during a caution so officials can clear the track safely. The first known use was a pace car at the first Indianapolis 500 in 1911.",
    related: { terms: ["full-course-yellow"], races: ["indy-1911"] }, sources: [GLOSSARY, wiki("Safety_car"), F1_GLOSSARY_PT, INDYCAR_GLOSSARY] },
  { id: "slick-tire", name: "Slick tire", topics: ["starter"], aka: ["Slicks"], forms: ["slick tires"], series: ["all"],
    text: "A racing tire with no tread pattern, which puts the most rubber on the road for grip in the dry. Slicks give little protection against aquaplaning in the wet.",
    related: { terms: ["intermediate-tire", "wet-tire", "tire-compound"] }, sources: [GLOSSARY, F1_GLOSSARY_PT] },
  { id: "stock-car", name: "Stock car", forms: ["stock cars", "stock car racing"], series: ["nascar"],
    text: "A racing car whose name comes from the production-model road cars the sport began with. Top-level stock cars are now built specifically for racing and run on ovals and road courses.",
    related: { terms: ["oval", "road-course"] }, sources: [wiki("Stock_car_racing")] },
  { id: "stint", name: "Stint", topics: ["starter"], forms: ["stints"], series: ["all"],
    text: "The part of a race between two pit stops.",
    related: { terms: ["pit-stop"] }, sources: [GLOSSARY] },
  { id: "street-circuit", name: "Street circuit", forms: ["street circuits"], series: ["all"],
    text: "A track laid out on public roads that are closed for the race. Grandstands and barriers are often temporary, the surface can be bumpy, and there is often little run-off, so mistakes are costly.",
    related: { tracks: ["monaco", "marina-bay", "long-beach", "albert-park"] }, sources: [wiki("Street_circuit")] },
  { id: "team-orders", name: "Team orders", series: ["all"],
    text: "Instructions from a team telling its drivers not to race each other normally, for example to hold position or let a teammate pass.",
    related: { tactics: ["team-orders"] }, sources: [GLOSSARY, wiki("Team_orders")] },
  { id: "tire-compound", name: "Tire compound", forms: ["tire compounds", "compounds"], series: ["all"],
    text: "How hard or soft a racing tire's rubber is. Softer compounds are usually faster but wear sooner; harder ones last longer.",
    related: { tactics: ["tire-management"] }, sources: [GLOSSARY, F1_GLOSSARY_AE] },
  { id: "triple-crown", name: "Triple Crown of Motorsport", forms: ["Triple Crown"], series: ["f1", "indycar", "wec"],
    text: "An unofficial achievement for winning three of the sport's biggest prizes: the Indianapolis 500, the 24 Hours of Le Mans, and either the Monaco Grand Prix or the Formula One World Drivers' Championship. Graham Hill was the first driver to complete it.",
    related: { tracks: ["indianapolis", "le-mans", "monaco"] }, sources: [wiki("Triple_Crown_of_Motorsport")] },
  { id: "tri-oval", name: "Tri-oval", forms: ["tri-ovals"], series: ["nascar"],
    text: "An oval with an extra gentle bend along one side, giving a shape between a triangle and an oval.",
    related: { terms: ["oval"], tracks: ["daytona", "talladega"] }, sources: [wiki("Tri-oval")] },
  { id: "undercut", name: "Undercut", topics: ["starter"], series: ["all"],
    text: "Making a pit stop earlier than a rival to gain time on them. The opposite of an overcut.",
    related: { tactics: ["undercut"] }, sources: [GLOSSARY, F1_GLOSSARY_UZ] },
  { id: "understeer", name: "Understeer", aka: ["Push"], autolink: true, series: ["all"],
    text: "When the front of a car pushes wide in a corner and the car turns less than the driver steers. NASCAR calls it \"push.\" The opposite of oversteer.",
    sources: [GLOSSARY] },
  { id: "wet-tire", name: "Wet tire", aka: ["Wets"], forms: ["wet tires", "full wet tire", "full wet tires"], series: ["all"],
    text: "A tire with deep grooves that clear standing water, so it can grip in heavy rain where slick tires would aquaplane.",
    related: { terms: ["intermediate-tire", "slick-tire"], tactics: ["weather-tires"] }, sources: [GLOSSARY, F1_GLOSSARY_UZ] },

  /* ----- Added 2026-11-13 from the official series glossaries ----- */

  /* Flags */
  { id: "green-flag", name: "Green flag", topics: ["flags"], forms: ["green flags"], series: ["all"],
    text: "Shown to start a race or session, and again once a hazard has been cleared, to tell drivers the track is clear and they can race at full speed.",
    related: { terms: ["yellow-flag", "restart"] }, sources: [F1_GLOSSARY_FJ, FLAGS] },
  { id: "yellow-flag", name: "Yellow flag", topics: ["flags"], forms: ["yellow flags"], series: ["all"],
    text: "A warning of a hazard ahead, such as a crash, a stopped car, or debris. Drivers must slow down and may not overtake. In F1, two yellow flags waved together mean the track may be partly or fully blocked.",
    related: { terms: ["full-course-yellow", "green-flag", "marshal"] }, sources: [F1_GLOSSARY_UZ, INDYCAR_GLOSSARY, FLAGS] },
  { id: "red-flag", name: "Red flag", topics: ["flags"], forms: ["red flags"], series: ["all"],
    text: "Stops the session because it is too dangerous to continue, for example after a serious incident, a hazard on the track, or severe weather. Drivers slow down and return to the pit lane, or stop where officials direct them.",
    related: { terms: ["restart"], races: ["canada-2011"] }, sources: [F1_GLOSSARY_PT, INDYCAR_GLOSSARY, FLAGS] },
  { id: "blue-flag", name: "Blue flag", topics: ["flags"], forms: ["blue flags"], series: ["all"],
    text: "Tells a driver that a faster car is coming up behind and they should let it past. In a race it is usually shown to a backmarker about to be lapped. In F1, repeatedly ignoring it can bring a penalty.",
    related: { terms: ["backmarker", "lapped"] }, sources: [F1_GLOSSARY_AE, FLAGS] },
  { id: "white-flag", name: "White flag", topics: ["flags"], forms: ["white flags"], series: ["all"],
    text: "Its meaning depends on the series. Under the FIA's rules, used in F1 and many other series, it warns of a slow vehicle, such as a service vehicle, on the track ahead. In most American racing, including NASCAR and IndyCar, a white flag waved at the start line means the final lap has begun. In MotoGP, it tells riders they may switch to a second bike during a race that has turned wet.",
    sources: [F1_GLOSSARY_UZ, FLAGS] },
  { id: "black-flag", name: "Black flag", topics: ["flags", "penalties"], forms: ["black flags"], series: ["all"],
    text: "Shown with a driver's number to call them into the pits. In F1 and MotoGP it means disqualification. In other series it can also be used for a rules penalty or for a car that has become unsafe.",
    related: { terms: ["steward"] }, sources: [F1_GLOSSARY_AE, MOTOGP_GLOSSARY, FLAGS] },
  { id: "checkered-flag", name: "Checkered flag", topics: ["starter", "flags"], aka: ["Chequered flag"], forms: ["checkered flags", "chequered flags"], series: ["all"],
    text: "The black-and-white flag waved at the finish line to end a race or session. The winner is the first driver to cross the line as it is waved.",
    related: { terms: ["flag-to-flag", "podium"] }, sources: [F1_GLOSSARY_AE, INDYCAR_GLOSSARY, FLAGS] },

  /* Officials and penalties */
  { id: "steward", name: "Steward", topics: ["penalties"], forms: ["stewards"], series: ["all"],
    text: "An official who makes sure the rules are followed over a race weekend. Stewards investigate incidents and decide on any penalties.",
    related: { terms: ["drive-through-penalty", "stop-go-penalty", "long-lap-penalty", "track-limits"] }, sources: [F1_GLOSSARY_PT, INDYCAR_GLOSSARY, MOTOGP_GLOSSARY] },
  { id: "drive-through-penalty", name: "Drive-through penalty", topics: ["penalties"], forms: ["drive-through penalties"], series: ["f1", "indycar"],
    text: "A penalty in which a driver must drive through the pit lane at the pit speed limit without stopping, then rejoin the race. It costs time and usually track position.",
    related: { terms: ["stop-go-penalty", "steward", "pit-lane"] }, sources: [F1_GLOSSARY_AE, INDYCAR_GLOSSARY] },
  { id: "stop-go-penalty", name: "Stop-go penalty", topics: ["penalties"], forms: ["stop-go penalties"], series: ["f1"],
    text: "A penalty in which a driver must come into the pits and stop in their pit box for a set time, often 10 seconds, before rejoining. No work may be done on the car during the stop.",
    related: { terms: ["drive-through-penalty", "steward"] }, sources: [F1_GLOSSARY_PT, GLOSSARY] },
  { id: "long-lap-penalty", name: "Long lap penalty", topics: ["penalties"], forms: ["long lap penalties"], series: ["motogp"],
    text: "A MotoGP penalty in which the rider must ride through a longer section added to the track, usually costing around two to four seconds and sometimes several positions.",
    related: { terms: ["steward", "jump-start"] }, sources: [MOTOGP_GLOSSARY] },
  { id: "jump-start", name: "Jump start", topics: ["penalties"], forms: ["jump starts"], series: ["all"],
    text: "Moving off the starting spot before the start signal is given. Sensors can detect even a small movement, and it brings a penalty.",
    related: { terms: ["grid", "long-lap-penalty"] }, sources: [F1_GLOSSARY_FJ, MOTOGP_GLOSSARY] },
  { id: "track-limits", name: "Track limits", topics: ["penalties"], series: ["all"],
    text: "The edges of the track, usually marked by a white line, with kerbs as a guide. In F1, a driver who goes beyond the line with all four wheels has that lap time deleted, and repeated offenses bring a penalty.",
    related: { terms: ["kerb", "steward"] }, sources: [F1_GLOSSARY_PT, MOTOGP_GLOSSARY] },
  { id: "dnf", name: "DNF", aka: ["Did not finish"], series: ["all"],
    text: "Short for \"did not finish\": a driver who retires before the end of a race.",
    sources: [F1_GLOSSARY_AE] },

  /* Race and timing */
  { id: "virtual-safety-car", name: "Virtual safety car", aka: ["VSC"], series: ["f1"],
    text: "A way to slow a race without sending out the safety car. Every driver must slow down and keep to a set time, which holds the gaps between cars and prevents overtaking. Officials can end it at any moment.",
    related: { terms: ["safety-car", "full-course-yellow"] }, sources: [F1_GLOSSARY_UZ] },
  { id: "restart", name: "Restart", forms: ["restarts"], series: ["all"],
    text: "The moment racing resumes after a caution or a red flag.",
    related: { terms: ["full-course-yellow", "red-flag", "green-flag"] }, sources: [INDYCAR_GLOSSARY, GLOSSARY] },
  { id: "lapped", name: "Lapped", series: ["all"],
    text: "Being passed by a car that has completed one more lap, which leaves you a full lap behind. A driver can \"unlap\" themselves by catching and passing that car again.",
    related: { terms: ["backmarker", "blue-flag"] }, sources: [F1_GLOSSARY_KO] },
  { id: "out-lap", name: "Out-lap", forms: ["out-laps", "out lap"], series: ["all"],
    text: "The lap a driver makes coming out of the pits. In a race it follows a pit stop; in qualifying it brings the tires up to temperature before a flying lap.",
    related: { terms: ["in-lap", "flying-lap"] }, sources: [F1_GLOSSARY_KO, INDYCAR_GLOSSARY] },
  { id: "flying-lap", name: "Flying lap", aka: ["Hot lap"], forms: ["flying laps"], series: ["all"],
    text: "A lap driven as fast as possible to set a time, usually between an out-lap and an in-lap.",
    related: { terms: ["out-lap", "in-lap", "qualifying"] }, sources: [F1_GLOSSARY_FJ] },
  { id: "sector", name: "Sector", forms: ["sectors"], series: ["all"],
    text: "One of the sections a lap is split into for timing. F1 divides each lap into three sectors, so viewers can see where each driver is gaining or losing time.",
    sources: [F1_GLOSSARY_PT] },
  { id: "podium", name: "Podium", series: ["all"],
    text: "The raised platform where the top three finishers receive their trophies. A \"podium finish\" means finishing in the top three.",
    sources: [F1_GLOSSARY_PT] },
  { id: "hole-shot", name: "Hole shot", series: ["motogp"],
    text: "Leading the race into the first corner after the start.",
    related: { terms: ["grid"] }, sources: [MOTOGP_GLOSSARY] },
  { id: "night-race", name: "Night race", forms: ["night races"], series: ["f1"],
    text: "A race held after dark under floodlights. The 2008 Singapore Grand Prix was the first night race in F1.",
    related: { tracks: ["marina-bay"] }, sources: [F1_GLOSSARY_KO] },

  /* Track */
  { id: "kerb", name: "Kerb", aka: ["Curb"], forms: ["kerbs", "curbs"], series: ["all"],
    text: "The raised, striped edging at the side of the track, especially around corners. Drivers and riders use kerbs as reference points and sometimes ride over them, but hitting one too hard can unsettle the car or bike.",
    related: { terms: ["track-limits", "apex"] }, sources: [F1_GLOSSARY_KO, MOTOGP_GLOSSARY, INDYCAR_GLOSSARY] },
  { id: "pit-wall", name: "Pit wall", series: ["all"],
    text: "The area between the pit lane and the track where senior team members watch data and talk to drivers by radio during a session.",
    related: { terms: ["pit-lane", "box"] }, sources: [F1_GLOSSARY_PT] },
  { id: "paddock", name: "Paddock", series: ["all"],
    text: "The restricted area behind the pit lane and garages where teams base their trucks, motorhomes, and staff for the race weekend.",
    related: { terms: ["pit-lane"] }, sources: [F1_GLOSSARY_PT, MOTOGP_GLOSSARY] },
  { id: "superspeedway", name: "Superspeedway", forms: ["superspeedways"], series: ["nascar", "indycar"],
    text: "A large, very fast oval. Indianapolis, Daytona, and Talladega are all superspeedways.",
    related: { terms: ["oval", "restrictor-plate", "drafting"], tracks: ["indianapolis", "daytona", "talladega"] }, sources: [INDYCAR_GLOSSARY, wiki("Stock_car_racing"), wiki("Talladega_Superspeedway")] },

  /* Cars, bikes, and driving */
  { id: "grip", name: "Grip", series: ["all"],
    text: "How well the tires hold onto the track. More grip lets a car go faster through corners; worn tires and slippery surfaces reduce it.",
    related: { terms: ["downforce", "degradation"] }, sources: [F1_GLOSSARY_FJ] },
  { id: "clean-air", name: "Clean air", series: ["all"],
    text: "Undisturbed air in front of a car with no one close ahead. It lets the car's aerodynamics work at their best, so drivers in clean air are often faster. The opposite of dirty air.",
    related: { terms: ["dirty-air", "downforce"] }, sources: [F1_GLOSSARY_AE, INDYCAR_GLOSSARY] },
  { id: "degradation", name: "Degradation", aka: ["Deg"], forms: ["tire degradation"], series: ["all"],
    text: "The gradual loss of performance as parts wear, most often tires losing grip over a stint.",
    related: { terms: ["graining", "stint"], tactics: ["tire-management"] }, sources: [F1_GLOSSARY_AE] },
  { id: "lock-up", name: "Lock-up", forms: ["lock-ups"], series: ["all"],
    text: "When a wheel stops turning under heavy braking while the car is still moving. The tire skids, often with a puff of smoke, and can be left with a flat spot.",
    related: { tactics: ["outbraking"] }, sources: [F1_GLOSSARY_KO, INDYCAR_GLOSSARY] },
  { id: "constructor", name: "Constructor", forms: ["constructors"], series: ["f1"],
    text: "Formula One's official word for a team. Each team must design and build its own car, and the teams compete for the Constructors' Championship.",
    related: { races: ["british-gp-1950", "brazil-2008"] }, sources: [F1_GLOSSARY_AE] },
  { id: "halo", name: "Halo", series: ["f1"],
    text: "A curved titanium bar above and around the cockpit that helps protect the driver in a crash. F1 introduced it in 2018.",
    sources: [F1_GLOSSARY_FJ] },
  { id: "lean-angle", name: "Lean angle", series: ["motogp"],
    text: "How far a rider tips the bike over in a corner. MotoGP riders lean beyond 65 degrees, low enough to touch the track with their knees and elbows.",
    related: { terms: ["highside", "lowside"] }, sources: [MOTOGP_GLOSSARY] },
  { id: "highside", name: "Highside", forms: ["highsides"], series: ["motogp"],
    text: "A crash in which the rear tire slides and then suddenly grips again, flipping the bike and throwing the rider upward.",
    related: { terms: ["lowside", "lean-angle"] }, sources: [MOTOGP_GLOSSARY] },
  { id: "lowside", name: "Lowside", forms: ["lowsides"], series: ["motogp"],
    text: "A crash in which the front or rear tire loses grip and the bike slides out on its side. Lowsides are common in wet conditions.",
    related: { terms: ["highside", "lean-angle"] }, sources: [MOTOGP_GLOSSARY] }
];

/* =====================================================================
   CONTENT: TACTICS
   TEMPLATE:
   {
     id: "undercut",                       // anchor becomes #tactic-undercut
     name: "The undercut",
     series: ["all"],
     body: ["First paragraph.", "Second paragraph."],
     related: { terms: [], tactics: [], tracks: [], races: [] },
     sources: [GLOSSARY]
   },
   ===================================================================== */
var TACTICS = [
  { id: "pit-strategy", name: "Pit strategy", order: 1, series: ["all"],
    body: [
      "Deciding how many pit stops to make and when to make them.",
      "Every stop costs time in the pit lane, but fresh tires, and in some series fuel, can make the car faster for the next stint. Teams plan a pit window for each stop based on tire wear and fuel use, then adjust as the race unfolds."
    ],
    related: { terms: ["pit-stop", "pit-window", "stint"], tactics: ["undercut", "overcut"] },
    sources: [GLOSSARY, wiki("Pit_stop"), F1_GLOSSARY_PT] },
  { id: "undercut", name: "The undercut", order: 2, series: ["all"],
    body: [
      "Pitting earlier than the rival ahead to get past them.",
      "Right after the stop, the driver on fresh tires can lap faster than a rival still on worn ones. If the gain is big enough, the positions have swapped by the time the rival makes their own stop."
    ],
    related: { terms: ["pit-stop", "in-lap"], tactics: ["overcut", "in-lap"] },
    sources: [GLOSSARY, F1_GLOSSARY_UZ] },
  { id: "overcut", name: "The overcut", order: 3, series: ["all"],
    body: [
      "Staying out longer than the rival instead of stopping first.",
      "It can work when fresh tires need time to reach their best operating temperature: the driver who stays out on warmed-up tires gains time while the rival's new tires come up to speed. It is rarely seen in modern Formula One."
    ],
    related: { terms: ["undercut"], tactics: ["undercut"] },
    sources: [GLOSSARY, F1_GLOSSARY_KO] },
  { id: "drafting", name: "Drafting", order: 4, series: ["all"],
    body: [
      "Tucking in close behind another vehicle to use its slipstream, where air resistance is lower.",
      "The trailing vehicle gains speed and can pull out to pass. On very fast ovals such as Talladega, the use of restrictor plates from the late 1980s led to pack racing, with large groups of cars drafting together."
    ],
    related: { terms: ["drafting", "restrictor-plate"], tracks: ["talladega", "daytona", "monza"] },
    sources: [GLOSSARY, wiki("Slipstream"), wiki("Talladega_Superspeedway")] },
  { id: "tire-management", name: "Tire management", order: 5, series: ["all"],
    body: [
      "Driving in a way that makes tires last, so the car is still fast at the end of a stint.",
      "It is one of the oldest strategies in racing. At the first Indianapolis 500 in 1911, winner Ray Harroun held a planned steady pace of about 75 mph to reduce his tire wear."
    ],
    related: { terms: ["tire-compound", "graining", "stint"], races: ["indy-1911"] },
    sources: [GLOSSARY, wiki("1911_Indianapolis_500")] },
  { id: "weather-tires", name: "Choosing tires for the weather", order: 6, series: ["all"],
    body: [
      "Picking the right tire as conditions change: slick tires in the dry, intermediate tires on a damp or drying track, and wet tires in heavy rain.",
      "Changing at the right moment can gain or lose many places. Rain shaped the results of both the 2008 Brazilian Grand Prix and the 2011 Canadian Grand Prix."
    ],
    related: { terms: ["slick-tire", "intermediate-tire", "wet-tire"], races: ["brazil-2008", "canada-2011"] },
    sources: [GLOSSARY, wiki("2008_Brazilian_Grand_Prix"), wiki("2011_Canadian_Grand_Prix")] },
  { id: "in-lap", name: "Pushing on the in-lap", order: 7, series: ["all"],
    body: [
      "Driving the lap before a pit stop as fast as possible, even on worn tires.",
      "A quick in-lap wins back some of the time the stop will cost, which is why it goes hand in hand with the undercut and the overcut."
    ],
    related: { terms: ["in-lap"], tactics: ["undercut", "overcut"] },
    sources: [GLOSSARY] },
  { id: "team-orders", name: "Team orders", order: 8, series: ["all"],
    body: [
      "A team telling its drivers to hold position, or to let a teammate pass, instead of racing each other.",
      "Teams usually do it to help the driver who is ahead in the championship, or to avoid a collision between their own cars. In U.S.-based series such as NASCAR and IndyCar, team orders have rarely been used."
    ],
    related: { terms: ["team-orders"] },
    sources: [GLOSSARY, wiki("Team_orders")] },
  { id: "drs", name: "Using DRS (2011 to 2025)", order: 9, series: ["f1"],
    body: [
      "Opening a flap in the rear wing on set straights to pass the car ahead.",
      "From 2011 to 2025, a Formula One driver within one second of the car ahead at a detection point could use DRS. Less drag meant more top speed and a better chance to overtake. The 2026 regulations replaced it with Active Aero and Overtake Mode."
    ],
    related: { terms: ["drs", "dirty-air", "downforce"] },
    sources: [wiki("Drag_reduction_system"), F1_GLOSSARY_AE] },

  /* ----- Added 2026-11-13 from the official series glossaries ----- */
  { id: "outbraking", name: "Outbraking", order: 10, series: ["all"],
    body: [
      "Braking later than the rival ahead going into a corner, to take their position.",
      "Every corner has a braking point where drivers and riders start to slow down. Braking later than a rival can win the place, but leave it too late and the car runs wide or locks up."
    ],
    related: { terms: ["lock-up", "racing-line", "apex"] },
    sources: [F1_GLOSSARY_KO, F1_GLOSSARY_AE, MOTOGP_GLOSSARY] },
  { id: "lift-and-coast", name: "Lift and coast", order: 11, series: ["all"],
    body: [
      "Lifting off the throttle a little before a corner and coasting into it, instead of staying flat out until the braking point.",
      "It saves fuel, which matters in series where cars cannot refuel during a race, such as Formula One."
    ],
    related: { tactics: ["tire-management", "pit-strategy"] },
    sources: [F1_GLOSSARY_KO] },
  { id: "double-stack", name: "Double stack", order: 12, series: ["all"],
    body: [
      "Pitting both of a team's cars on the same lap, one straight after the other.",
      "It is risky: if the first stop runs long, the second car is left waiting. Done perfectly, the first car leaves its pit box just as the second one arrives."
    ],
    related: { terms: ["pit-stop", "pit-lane"], tactics: ["pit-strategy"] },
    sources: [F1_GLOSSARY_AE] },
  { id: "fuel-window", name: "Working the fuel window", order: 13, series: ["indycar"],
    body: [
      "Planning pit stops around the number of laps a car can run on a full tank.",
      "In series where cars refuel during the race, such as IndyCar, the fuel window sets how far a car can go between stops, so it shapes the whole pit strategy."
    ],
    related: { terms: ["pit-window", "stint"], tactics: ["pit-strategy", "lift-and-coast"] },
    sources: [INDYCAR_GLOSSARY] },
  { id: "sandbagging", name: "Sandbagging", order: 14, series: ["f1"],
    body: [
      "Deliberately running slower than the car can go, to hide its true pace from rivals.",
      "Teams may do it in pre-season testing or practice, for example by using lower engine settings or carrying extra fuel or weight."
    ],
    sources: [F1_GLOSSARY_PT] }
];

/* =====================================================================
   CONTENT: TRACKS
   TEMPLATE:
   {
     id: "suzuka",                         // anchor becomes #track-suzuka
     name: "Suzuka Circuit",
     shortName: "Suzuka",                  // optional
     country: "Japan",
     lat: 34.8417, lng: 136.5389,          // decimal degrees
     series: ["f1"],                       // keys from SERIES
     type: "permanent",                    // permanent, street, or oval
     summary: "One or two sentences for the map popup.",
     body: ["Layout and history.", "What to look for."],
     facts: [{ label: "First F1 race", value: "1987" }],   // optional, evergreen only
     related: { terms: ["esses"], races: ["japan-1989"] }, // optional
     image: { src, alt, author, license, licenseUrl, sourceUrl },  // optional
     sources: [wiki("Suzuka_International_Racing_Course")]
   },
   Races held at a track are linked from its entry automatically.
   ===================================================================== */
var TRACKS = [
  { id: "monaco", name: "Circuit de Monaco", shortName: "Monaco", country: "Monaco",
    lat: 43.7347, lng: 7.4206, series: ["f1"], type: "street",
    summary: "A short, tight street circuit through Monte Carlo and around the harbor of Monaco.",
    body: [
      "The Circuit de Monaco runs for 3.337 km (2.074 mi) on the city streets of Monte Carlo and La Condamine, looping around the harbor. It is so closely tied to Monte Carlo that it is often simply called by that name.",
      "The Monaco Grand Prix is one of the three races in the Triple Crown of Motorsport. Watch how close the barriers are: on a street circuit this narrow, a small mistake ends a race."
    ],
    facts: [{ label: "Length", value: "3.337 km" }],
    related: { terms: ["street-circuit", "triple-crown"] },
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Circuit_de_Monaco%2C_April_1%2C_2018_SkySat_%28cropped%29.jpg/960px-Circuit_de_Monaco%2C_April_1%2C_2018_SkySat_%28cropped%29.jpg",
      alt: "Satellite view of Monaco's harbor, lined with yachts, with the city streets that form the circuit wrapping around it.",
      author: "Planet Labs, Inc.", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Circuit_de_Monaco,_April_1,_2018_SkySat_(cropped).jpg"
    },
    sources: [wiki("Circuit_de_Monaco"), f1Circuit("monaco", "Monaco Grand Prix circuit page"), racingCircuits("europe/monaco/monte-carlo.html", "Monte Carlo")] },

  { id: "silverstone", name: "Silverstone Circuit", shortName: "Silverstone", country: "United Kingdom",
    lat: 52.0710, lng: -1.0160, series: ["f1", "motogp", "wec"], type: "permanent",
    summary: "The home of the British Grand Prix and the venue of the first Formula One World Championship race in 1950.",
    body: [
      "Silverstone sits near the villages of Silverstone and Whittlebury in Northamptonshire, England. It first hosted the British Grand Prix in 1948, and in 1950 it held the very first race of the new World Championship.",
      "The British Grand Prix rotated between Silverstone, Aintree, and Brands Hatch from 1955 to 1986 before settling at Silverstone for good in 1987. The circuit has also hosted the British round of MotoGP."
    ],
    facts: [{ label: "First British GP", value: "1948" }, { label: "First World Championship race", value: "1950" }],
    related: { terms: ["grand-prix"] },
    sources: [wiki("Silverstone_Circuit"), f1Circuit("great-britain", "British Grand Prix circuit page"), racingCircuits("europe/united-kingdom/silverstone.html", "Silverstone")] },

  { id: "monza", name: "Autodromo Nazionale Monza", shortName: "Monza", country: "Italy",
    lat: 45.6206, lng: 9.2894, series: ["f1", "wec"], type: "permanent",
    summary: "The \"Temple of Speed\": a 1922 circuit in a royal park near Milan, famous for long straights and fast corners.",
    body: [
      "Built in 1922 in the park of the Royal Villa of Monza, north of Milan, Monza was the world's fourth purpose-built racing circuit and the oldest in mainland Europe. The Grand Prix track is 5.793 km (3.600 mi) long, and the site also holds an old high-speed oval with steep banking that was restored in the 2010s.",
      "The Italian Grand Prix has been held here every year since 1949 except 1980. Look for the long straights broken up by chicanes, and for named corners such as the Curva Grande, Lesmo, Variante Ascari, and the Curva Alboreto (formerly Parabolica)."
    ],
    facts: [{ label: "Built", value: "1922" }, { label: "Length", value: "5.793 km" }, { label: "Nickname", value: "Temple of Speed" }],
    related: { terms: ["chicane", "banking", "drafting"] },
    sources: [wiki("Monza_Circuit"), f1Circuit("italy", "Italian Grand Prix circuit page"), F1_GLOSSARY_PT, racingCircuits("europe/italy/monza.html", "Monza")] },

  { id: "spa", name: "Circuit de Spa-Francorchamps", shortName: "Spa", country: "Belgium",
    lat: 50.4372, lng: 5.9714, series: ["f1", "wec"], type: "permanent",
    summary: "A long, fast circuit in the Belgian Ardennes that hosted its first Grand Prix in 1925.",
    body: [
      "Spa-Francorchamps, usually called Spa, is a 7.004 km (4.352 mi) circuit in Francorchamps, about 8 km southeast of the town of Spa. It hosted its first Grand Prix in 1925 and was part of the first Formula One season in 1950.",
      "Until 1979 the track used about 14 km of public roads. It was then shortened and rebuilt as a permanent circuit for safety. Beyond Formula One, Spa has hosted the 24 Hours of Spa and the World Endurance Championship's 6 Hours of Spa-Francorchamps."
    ],
    facts: [{ label: "First Grand Prix", value: "1925" }, { label: "Length", value: "7.004 km" }],
    related: { terms: ["endurance-racing"] },
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2022_6_Hours_of_Spa-Francorchamps_-_Eau_Rouge_Corner.jpg/960px-2022_6_Hours_of_Spa-Francorchamps_-_Eau_Rouge_Corner.jpg",
      alt: "Two endurance prototype race cars driving through the Eau Rouge corner at Spa-Francorchamps beside a large grandstand.",
      author: "United Autosports", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:2022_6_Hours_of_Spa-Francorchamps_-_Eau_Rouge_Corner.jpg"
    },
    sources: [wiki("Circuit_de_Spa-Francorchamps"), racingCircuits("europe/belgium/spa-francorchamps.html", "Spa-Francorchamps")] },

  { id: "suzuka", name: "Suzuka Circuit", shortName: "Suzuka", country: "Japan",
    lat: 34.8417, lng: 136.5389, series: ["f1"], type: "permanent",
    summary: "A figure-of-eight circuit built as a Honda test track in 1962, where the back straight crosses over the front section.",
    body: [
      "Suzuka was designed in 1962 by John Hugenholtz as a test track for Honda. Its figure-of-eight layout is rare: the back straight passes over the front section on a bridge. The full circuit is 5.807 km (3.608 mi) long.",
      "Suzuka hosted its first Formula One Japanese Grand Prix in 1987. Watch the flowing esses after the first corner, then named corners such as Degner, the hairpin, Spoon, and the very fast 130R."
    ],
    facts: [{ label: "Designed", value: "1962" }, { label: "First F1 race", value: "1987" }, { label: "Length", value: "5.807 km" }],
    related: { terms: ["esses", "hairpin", "chicane"] },
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Suzuka_International_Racing_Course%2C_July_10%2C_2018_SkySat.jpg/960px-Suzuka_International_Racing_Course%2C_July_10%2C_2018_SkySat.jpg",
      alt: "Satellite view of Suzuka Circuit showing its figure-of-eight layout among fields and buildings.",
      author: "Planet Labs, Inc.", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Suzuka_International_Racing_Course,_July_10,_2018_SkySat.jpg"
    },
    sources: [wiki("Suzuka_International_Racing_Course"), f1Circuit("japan", "Japanese Grand Prix circuit page"), racingCircuits("asia/japan/suzuka.html", "Suzuka")] },

  { id: "interlagos", name: "Autódromo José Carlos Pace (Interlagos)", shortName: "Interlagos", country: "Brazil",
    lat: -23.7011, lng: -46.6972, series: ["f1", "wec"], type: "permanent",
    summary: "São Paulo's counterclockwise circuit, opened in 1940 and home to the Brazilian Grand Prix since 1973.",
    body: [
      "Better known as Interlagos, this 4.309 km (2.677 mi) circuit in São Paulo opened on 12 May 1940. In 1985 it was renamed in honor of Brazilian Formula One driver José Carlos Pace. Unusually, it runs counterclockwise.",
      "It first hosted the Brazilian Grand Prix in 1973. It has also hosted the World Endurance Championship from 2012 to 2014 and again from 2024, and Brazil's motorcycle Grand Prix in 1992."
    ],
    facts: [{ label: "Opened", value: "1940" }, { label: "First F1 race", value: "1973" }, { label: "Direction", value: "Counterclockwise" }],
    sources: [wiki("Interlagos_Circuit"), f1Circuit("brazil", "Sao Paulo Grand Prix circuit page"), racingCircuits("south-america/brazil/interlagos.html", "Interlagos")] },

  { id: "gilles-villeneuve", name: "Circuit Gilles Villeneuve", shortName: "Montreal", country: "Canada",
    lat: 45.5006, lng: -73.5225, series: ["f1"], type: "street",
    summary: "A 4.361 km circuit on Notre Dame Island in Montreal, the home of the Canadian Grand Prix.",
    body: [
      "Circuit Gilles Villeneuve is a 4.361 km (2.710 mi) track on Notre Dame Island in Montreal, Quebec. It is the venue of the Formula One Canadian Grand Prix.",
      "Over the years it has also hosted the World Sportscar Championship, Champ Car, and NASCAR's Nationwide and Pinty's series. In 2011 it held the Canadian Grand Prix that set the record for the longest race in Formula One history."
    ],
    facts: [{ label: "Length", value: "4.361 km" }],
    sources: [wiki("Circuit_Gilles_Villeneuve"), f1Circuit("canada", "Canadian Grand Prix circuit page"), racingCircuits("north-america/canada/circuit-gilles-villeneuve,-montreal.html", "Circuit Gilles Villeneuve")] },

  { id: "cota", name: "Circuit of the Americas", shortName: "COTA", country: "United States",
    lat: 30.1328, lng: -97.6411, series: ["f1", "motogp", "wec"], type: "permanent",
    summary: "The first circuit in the United States purpose-built for Formula One, in Austin, Texas.",
    body: [
      "The Circuit of the Americas, or COTA, is a 5.514 km (3.426 mi) track in Austin, Texas. First proposed in 2010, it was the first circuit in the United States built specifically for Formula One.",
      "The layout was drawn up by promoter Tavo Hellmund and 1993 motorcycle world champion Kevin Schwantz, with circuit designer Hermann Tilke. It has hosted the United States Grand Prix, MotoGP's Grand Prix of the Americas, World Endurance Championship rounds, and NASCAR."
    ],
    facts: [{ label: "Proposed", value: "2010" }, { label: "Length", value: "5.514 km" }],
    sources: [wiki("Circuit_of_the_Americas"), racingCircuits("north-america/usa/circuit-of-the-americas.html", "Circuit of the Americas")] },

  { id: "marina-bay", name: "Marina Bay Street Circuit", shortName: "Singapore", country: "Singapore",
    lat: 1.2914, lng: 103.8641, series: ["f1"], type: "street",
    summary: "A harborside street circuit in central Singapore, home of the Singapore Grand Prix since 2008.",
    body: [
      "This 4.927 km (3.061 mi) street circuit runs around Marina Bay in the center of Singapore, in a harborside setting often compared to Monaco. It was designed by KBR, adapting an earlier proposal by Hermann Tilke, and joined the Formula One calendar in 2008.",
      "The walls are close and the race is long and hot, so look for the safety car: every Singapore Grand Prix from 2008 to 2023 had at least one safety car period."
    ],
    facts: [{ label: "First F1 race", value: "2008" }, { label: "Length", value: "4.927 km" }],
    related: { terms: ["street-circuit", "safety-car"] },
    sources: [wiki("Marina_Bay_Street_Circuit"), f1Circuit("singapore", "Singapore Grand Prix circuit page"), racingCircuits("asia/singapore/marina-bay-singapore.html", "Singapore Marina Bay")] },

  { id: "red-bull-ring", name: "Red Bull Ring", country: "Austria",
    lat: 47.2197, lng: 14.7647, series: ["f1", "motogp"], type: "permanent",
    summary: "A hillside circuit in Spielberg that began as the Österreichring in 1970.",
    body: [
      "This 4.326 km (2.688 mi) circuit in Spielberg, Styria, opened as the Österreichring and hosted the Austrian Grand Prix every year from 1970 to 1987. It was later shortened and rebuilt as the A1-Ring, which hosted the race from 1997 to 2003.",
      "After a long rebuild, it reopened as the Red Bull Ring on 15 May 2011. Formula One returned in 2014 and MotoGP in 2016. In 2020 and 2021 it hosted two Grands Prix a year in both series."
    ],
    facts: [{ label: "First Austrian GP here", value: "1970" }, { label: "Reopened", value: "2011" }, { label: "Length", value: "4.326 km" }],
    sources: [wiki("Red_Bull_Ring"), f1Circuit("austria", "Austrian Grand Prix circuit page")] },

  { id: "albert-park", name: "Albert Park Circuit", shortName: "Melbourne", country: "Australia",
    lat: -37.8497, lng: 144.9683, series: ["f1"], type: "street",
    summary: "A circuit on everyday park roads around Albert Park Lake in Melbourne.",
    body: [
      "Albert Park Circuit uses normally public roads around Albert Park Lake, just south of central Melbourne. The roads were reworked and resurfaced before the first event in 1996, so the surface is smooth for a street circuit.",
      "Its corners are medium to high speed and the setting is flat, with few true straights. For most of the year, ordinary cars can drive much of the track."
    ],
    facts: [{ label: "First F1 race", value: "1996" }],
    related: { terms: ["street-circuit"] },
    sources: [wiki("Albert_Park_Circuit"), f1Circuit("australia", "Australian Grand Prix circuit page"), racingCircuits("australasia/australia/albert-park,-melbourne.html", "Albert Park, Melbourne")] },

  { id: "mugello", name: "Autodromo Internazionale del Mugello", shortName: "Mugello", country: "Italy",
    lat: 43.9975, lng: 11.3719, series: ["motogp"], type: "permanent",
    summary: "A Tuscan hillside circuit, home of the Italian motorcycle Grand Prix.",
    body: [
      "Mugello is a 5.245 km (3.259 mi) circuit with 15 turns and a 1.141 km main straight, near Florence in Tuscany. It hosts the Italian motorcycle Grand Prix.",
      "Ferrari has owned it since 1988 and uses it for testing. It held its first Formula One race, the Tuscan Grand Prix, on 13 September 2020."
    ],
    facts: [{ label: "Turns", value: "15" }, { label: "Main straight", value: "1.141 km" }, { label: "First F1 race", value: "2020" }],
    sources: [wiki("Mugello_Circuit"), racingCircuits("europe/italy/mugello.html", "Mugello")] },

  { id: "phillip-island", name: "Phillip Island Grand Prix Circuit", shortName: "Phillip Island", country: "Australia",
    lat: -38.5031, lng: 145.2360, series: ["motogp"], type: "permanent",
    summary: "A fast coastal circuit in Victoria, Australia, first used in 1952.",
    body: [
      "Racing on Phillip Island began in 1928 with the 100 Miles Road Race on local roads, an event now regarded as the first Australian Grand Prix. The current 4.448 km (2.764 mi) circuit opened nearby in 1952.",
      "Built on the edge of the coast, the track has steep grades. It holds the highest track license from the FIM, motorcycling's world governing body, which allows MotoGP racing."
    ],
    facts: [{ label: "Racing since", value: "1928" }, { label: "Current circuit", value: "1952" }, { label: "Length", value: "4.448 km" }],
    sources: [wiki("Phillip_Island_Grand_Prix_Circuit")] },

  { id: "assen", name: "TT Circuit Assen", shortName: "Assen", country: "Netherlands",
    lat: 52.9616, lng: 6.5233, series: ["motogp"], type: "permanent",
    summary: "The \"Cathedral of Speed\" and home of the Dutch TT.",
    body: [
      "Built in 1955 in Assen, Netherlands, this circuit hosts the Dutch TT. Motorcycle fans call it \"The Cathedral of Speed.\"",
      "Assen is the only venue to have held a motorcycle Grand Prix every year since the world championship began in 1949, with the exception of 2020."
    ],
    facts: [{ label: "Built", value: "1955" }, { label: "Nickname", value: "Cathedral of Speed" }],
    sources: [wiki("TT_Circuit_Assen"), racingCircuits("europe/netherlands/tt-circuit-assen.html", "TT Circuit Assen")] },

  { id: "sepang", name: "Sepang International Circuit", shortName: "Sepang", country: "Malaysia",
    lat: 2.7606, lng: 101.7375, series: ["motogp", "f1"], type: "permanent",
    summary: "A circuit near Kuala Lumpur that hosted the Malaysian Grand Prix in Formula One from 1999 to 2017.",
    body: [
      "Sepang is a 5.543 km (3.444 mi) circuit south of Kuala Lumpur, next to the city's international airport.",
      "It hosted Formula One's Malaysian Grand Prix from 1999 to 2017 and is the venue of the Malaysian Motorcycle Grand Prix."
    ],
    facts: [{ label: "F1 Malaysian GP", value: "1999 to 2017" }, { label: "Length", value: "5.543 km" }],
    sources: [wiki("Sepang_International_Circuit"), racingCircuits("asia/malaysia/sepang.html", "Sepang")] },

  { id: "jerez", name: "Circuito de Jerez", shortName: "Jerez", country: "Spain",
    lat: 36.7083, lng: -6.0342, series: ["motogp"], type: "permanent",
    summary: "A circuit in southern Spain that opened in 1985 and hosts the Spanish motorcycle Grand Prix.",
    body: [
      "The 4.428 km (2.751 mi) Circuito de Jerez lies near Jerez de la Frontera, in the sherry-making region of southern Spain. It opened on 8 December 1985, and in 1986 it held both Spain's first international motorcycle event and the Formula One Spanish Grand Prix.",
      "It went on to host the European Grand Prix in 1994 and 1997. In 2018 it was renamed Circuito de Jerez – Ángel Nieto in honor of the Spanish motorcycle racer. It hosts the Spanish motorcycle Grand Prix."
    ],
    facts: [{ label: "Opened", value: "1985" }, { label: "Length", value: "4.428 km" }],
    sources: [wiki("Circuito_de_Jerez"), racingCircuits("europe/spain/jerez.html", "Jerez")] },

  { id: "le-mans", name: "Circuit de la Sarthe (Le Mans)", shortName: "Le Mans", country: "France",
    lat: 47.9499, lng: 0.2075, series: ["wec"], type: "permanent",
    summary: "The 13.626 km home of the 24 Hours of Le Mans, mixing a race circuit with public roads.",
    body: [
      "The Circuit de la Sarthe in Le Mans is the home of the 24 Hours of Le Mans. Its 24-hour layout combines private racing sections with public roads that stay open for most of the year. At 13.626 km (8.467 mi), it is one of the longest circuits in the world.",
      "Up to 85% of a lap is spent at full throttle. Watch the braking at the village of Mulsanne, where cars slow from over 322 km/h (200 mph) to around 100 km/h (62 mph) for a sharp corner."
    ],
    facts: [{ label: "24-hour layout", value: "13.626 km" }, { label: "Full throttle", value: "Up to 85%" }],
    related: { terms: ["endurance-racing", "triple-crown"], races: [] },
    sources: [wiki("Circuit_de_la_Sarthe"), WEC_LE_MANS] },

  { id: "fuji", name: "Fuji Speedway", shortName: "Fuji", country: "Japan",
    lat: 35.3717, lng: 138.9267, series: ["wec", "f1"], type: "permanent",
    summary: "A road course in the foothills of Mount Fuji with one of the longest straights in racing.",
    body: [
      "Fuji Speedway sits in the eastern foothills of Mount Fuji. It was first planned as an American-style oval but was finished as a road course, and racing began there in 1966.",
      "It hosted the first Formula One race in Japan in 1976, and the Japanese Grand Prix again in 2007 and 2008. Its main straight, at 1.475 km (0.917 mi), is one of the longest in motorsport."
    ],
    facts: [{ label: "First races", value: "1966" }, { label: "Main straight", value: "1.475 km" }],
    related: { terms: ["road-course"] },
    sources: [wiki("Fuji_Speedway"), racingCircuits("asia/japan/fuji-speedway.html", "Fuji Speedway")] },

  { id: "sebring", name: "Sebring International Raceway", shortName: "Sebring", country: "United States",
    lat: 27.4550, lng: -81.3500, series: ["other"], type: "permanent",
    summary: "A Florida road course on part of a former World War II airfield, home of the 12 Hours of Sebring.",
    body: [
      "Sebring International Raceway is a road course near Sebring, Florida, and one of the oldest continuously operating race tracks in the United States. Its first race was held in 1950.",
      "The track uses part of Sebring Regional Airport, which began as Hendricks Army Airfield, a World War II training base. It is the home of the 12 Hours of Sebring, a classic of North American sports car racing."
    ],
    facts: [{ label: "First race", value: "1950" }, { label: "Famous race", value: "12 Hours of Sebring" }],
    related: { terms: ["endurance-racing", "road-course"] },
    sources: [wiki("Sebring_International_Raceway"), racingCircuits("north-america/usa/sebring.html", "Sebring")] },

  { id: "bahrain", name: "Bahrain International Circuit", shortName: "Bahrain", country: "Bahrain",
    lat: 26.0325, lng: 50.5106, series: ["f1", "wec"], type: "permanent",
    summary: "The 5.412 km circuit that held the first Formula One race in the Middle East in 2004.",
    body: [
      "The Bahrain International Circuit opened in 2004. Its 5.412 km (3.363 mi) Grand Prix layout hosted the 2004 Bahrain Grand Prix, the first Formula One race in the Middle East.",
      "The venue has several layouts and has also hosted 24-hour endurance races."
    ],
    facts: [{ label: "Opened", value: "2004" }, { label: "Length", value: "5.412 km" }],
    sources: [wiki("Bahrain_International_Circuit"), racingCircuits("middle-east/bahrain/bahrain-international-circuit.html", "Bahrain International Circuit")] },

  { id: "daytona", name: "Daytona International Speedway", shortName: "Daytona", country: "United States",
    lat: 29.1856, lng: -81.0694, series: ["nascar", "other"], type: "oval",
    summary: "The 2.5-mile tri-oval in Florida that has been home to the Daytona 500 since 1959.",
    body: [
      "NASCAR founder Bill France Sr. built Daytona in 1959 to replace racing on the old Daytona Beach Road Course. His banked design allowed higher speeds and gave fans a better view.",
      "The main track is a 2.5-mile (4.023 km) high-speed tri-oval, with a 3.56-mile road course inside for sports cars. It is home to the Daytona 500, NASCAR's most prestigious race, and the 24 Hours of Daytona endurance race."
    ],
    facts: [{ label: "Opened", value: "1959" }, { label: "Main oval", value: "2.5 miles" }],
    related: { terms: ["tri-oval", "banking", "drafting"] },
    sources: [wiki("Daytona_International_Speedway"), racingCircuits("north-america/usa/daytona.html", "Daytona")] },

  { id: "talladega", name: "Talladega Superspeedway", shortName: "Talladega", country: "United States",
    lat: 33.5661, lng: -86.0700, series: ["nascar"], type: "oval",
    summary: "A 2.66-mile tri-oval in Alabama, known for very high speeds and pack racing.",
    body: [
      "Talladega is a 2.66-mile (4.281 km) tri-oval in Lincoln, Alabama, built in 1969 by NASCAR founder Bill France Sr. It was called Alabama International Motor Speedway until 1989.",
      "Speeds have topped 200 mph (320 km/h). From the late 1980s, NASCAR's restrictor plates led to pack racing, where large groups of cars draft together. Watch how drivers work in lines to gain speed."
    ],
    facts: [{ label: "Built", value: "1969" }, { label: "Length", value: "2.66 miles" }],
    related: { terms: ["tri-oval", "restrictor-plate", "drafting"], tactics: ["drafting"] },
    sources: [wiki("Talladega_Superspeedway"), racingCircuits("north-america/usa/talladega-superspeedway.html", "Talladega Superspeedway")] },

  { id: "bristol", name: "Bristol Motor Speedway", shortName: "Bristol", country: "United States",
    lat: 36.5156, lng: -82.2569, series: ["nascar"], type: "oval",
    summary: "A half-mile oval in Tennessee, opened in 1961, with seating for 146,000 as of 2021.",
    body: [
      "Bristol Motor Speedway is a 0.533-mile (0.858 km) short oval in Bristol, Tennessee. It opened in July 1961.",
      "Despite its small track, it is one of the largest sports venues in the United States, with a capacity of 146,000 as of 2021."
    ],
    facts: [{ label: "Opened", value: "1961" }, { label: "Length", value: "0.533 miles" }],
    related: { terms: ["oval"] },
    sources: [wiki("Bristol_Motor_Speedway"), racingCircuits("north-america/usa/bristol-motor-speedway.html", "Bristol Motor Speedway")] },

  { id: "indianapolis", name: "Indianapolis Motor Speedway", shortName: "Indianapolis", country: "United States",
    lat: 39.7983, lng: -86.2328, series: ["indycar", "nascar"], type: "oval",
    summary: "The 1909 \"Brickyard,\" home of the Indianapolis 500 and the first track to be called a speedway.",
    body: [
      "Built in 1909 as a proving ground for the young car industry, Indianapolis was the first track to be called a \"speedway.\" It is home to the Indianapolis 500 and the Brickyard 400, and has the largest permanent seating capacity of any sports venue in the world.",
      "The 2.5-mile (4.023 km) oval has kept nearly the same rectangular shape since it was built: two long straights, two short ones, and four identical turns with relatively flat 9-degree banking. An infield road course was added in 2000, and it formerly hosted the United States Grand Prix."
    ],
    facts: [{ label: "Built", value: "1909" }, { label: "Oval", value: "2.5 miles" }, { label: "Banking", value: "About 9 degrees" }],
    related: { terms: ["oval", "banking", "grid", "triple-crown"] },
    sources: [wiki("Indianapolis_Motor_Speedway"), INDYCAR_INDY500, racingCircuits("north-america/usa/indianapolis-motor-speedway.html", "Indianapolis Motor Speedway")] },

  { id: "watkins-glen", name: "Watkins Glen International", shortName: "Watkins Glen", country: "United States",
    lat: 42.3370, lng: -76.9270, series: ["nascar", "indycar", "f1"], type: "permanent",
    summary: "\"The Glen,\" a New York road course that hosted the United States Grand Prix from 1961 to 1980.",
    body: [
      "Watkins Glen International, nicknamed \"The Glen,\" sits near the southern tip of Seneca Lake in New York. It opened in 1956 to replace races on public roads around the village of Watkins Glen.",
      "It hosted Formula One's United States Grand Prix for twenty straight years, from 1961 to 1980, and has hosted NASCAR, IndyCar, IMSA, and many other series. The circuit was overhauled in 1971, and a chicane added in 1992 created the layout used today."
    ],
    facts: [{ label: "Opened", value: "1956" }, { label: "US Grand Prix", value: "1961 to 1980" }],
    related: { terms: ["road-course"] },
    sources: [wiki("Watkins_Glen_International"), racingCircuits("north-america/usa/watkins-glen.html", "Watkins Glen")] },

  { id: "long-beach", name: "Streets of Long Beach", shortName: "Long Beach", country: "United States",
    lat: 33.7664, lng: -118.1928, series: ["indycar"], type: "street",
    summary: "The street circuit of the Grand Prix of Long Beach, North America's longest-running major street race.",
    body: [
      "The Grand Prix of Long Beach is held on a street circuit in Long Beach, California. It began in 1975 and was a Formula One race, the United States Grand Prix West, from 1976 until it switched to the CART series in 1984.",
      "Since 2009 it has been part of the unified IndyCar Series. It is the longest-running major street race in North America and the second-oldest continuously running event in American single-seater (open-wheel) racing, after the Indianapolis 500."
    ],
    facts: [{ label: "First race", value: "1975" }, { label: "IndyCar Series since", value: "2009" }],
    related: { terms: ["street-circuit"] },
    sources: [wiki("Grand_Prix_of_Long_Beach"), racingCircuits("north-america/usa/long-beach.html", "Long Beach")] },

  { id: "road-america", name: "Road America", country: "United States",
    lat: 43.7975, lng: -87.9939, series: ["indycar", "nascar"], type: "permanent",
    summary: "A 4.048-mile Wisconsin road course that has kept its original layout since 1955.",
    body: [
      "Road America is a road course near Elkhart Lake, Wisconsin, halfway between Milwaukee and Green Bay. It has hosted races since 1955.",
      "It is one of only a handful of circuits in the world still using its original configuration: 4.048 miles (6.515 km) with 14 turns. Look for the elevation changes, the long front straight where speeds approach 200 mph, and the corner known as \"the Kink.\""
    ],
    facts: [{ label: "Racing since", value: "1955" }, { label: "Length", value: "4.048 miles" }, { label: "Turns", value: "14" }],
    related: { terms: ["road-course"] },
    sources: [wiki("Road_America"), racingCircuits("north-america/usa/road-america.html", "Road America")] },

  { id: "laguna-seca", name: "Laguna Seca Raceway", shortName: "Laguna Seca", country: "United States",
    lat: 36.5842, lng: -121.7536, series: ["indycar", "motogp"], type: "permanent",
    summary: "A California road course built in 1957, famous for the plunging Corkscrew.",
    body: [
      "Laguna Seca, Spanish for \"dry lake,\" is a road course near Salinas and Monterey, California, built in 1957 around a dried-up lake bed. It is used for both car and motorcycle racing.",
      "The track is 2.238 miles (3.602 km) long, with 11 turns and 180 feet (55 m) of elevation change. Its signature is the Corkscrew at Turns 8 and 8A, where the track drops sharply downhill."
    ],
    facts: [{ label: "Built", value: "1957" }, { label: "Length", value: "2.238 miles" }, { label: "Elevation change", value: "180 ft" }],
    related: { terms: ["road-course"] },
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Laguna_Seca%27s_Corkscrew_-_2014_%281%29.jpg/960px-Laguna_Seca%27s_Corkscrew_-_2014_%281%29.jpg",
      alt: "The Corkscrew at Laguna Seca: an empty track drops steeply downhill between trees under a blue sky.",
      author: "菅野崇", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Laguna_Seca%27s_Corkscrew_-_2014_(1).jpg"
    },
    sources: [wiki("Laguna_Seca"), INDYCAR_LAGUNA, racingCircuits("north-america/usa/laguna-seca.html", "Laguna Seca")] },

  { id: "mid-ohio", name: "Mid-Ohio Sports Car Course", shortName: "Mid-Ohio", country: "United States",
    lat: 40.6893, lng: -82.6364, series: ["indycar"], type: "permanent",
    summary: "A rolling 2.4-mile, 15-turn road course between Columbus and Cleveland.",
    body: [
      "Mid-Ohio is a road course near Lexington, Ohio, between Columbus and Cleveland. It has 15 turns over 2.4 miles (3.862 km).",
      "The track's rolling terrain and elevation changes reward technical skill and patience. It has hosted IndyCar, IMSA sports cars, NASCAR trucks, and motorcycle racing."
    ],
    facts: [{ label: "Length", value: "2.4 miles" }, { label: "Turns", value: "15" }],
    related: { terms: ["road-course"] },
    sources: [wiki("Mid-Ohio_Sports_Car_Course"), racingCircuits("north-america/usa/mid-ohio.html", "Mid-Ohio")] },

  { id: "iowa", name: "Iowa Speedway", shortName: "Iowa", country: "United States",
    lat: 41.6741, lng: -93.0163, series: ["indycar", "nascar"], type: "oval",
    summary: "A 0.875-mile short oval in Newton, Iowa, that held its first races in 2006.",
    body: [
      "Iowa Speedway is a 0.875-mile (1.408 km) short oval in Newton, Iowa. It held its first races in September 2006 and has hosted events from both NASCAR and IndyCar.",
      "The complex also has road course layouts, including one that combines part of the oval with the infield."
    ],
    facts: [{ label: "First races", value: "2006" }, { label: "Length", value: "0.875 miles" }],
    related: { terms: ["oval"] },
    sources: [wiki("Iowa_Speedway"), racingCircuits("north-america/usa/iowa-speedway.html", "Iowa Speedway")] }
];

/* =====================================================================
   CONTENT: RACES
   TEMPLATE:
   {
     id: "japan-1989",                     // anchor becomes #race-japan-1989
     name: "1989 Japanese Grand Prix",
     date: "1989-10-22",                   // YYYY-MM-DD, used for sorting
     dateLabel: "22 October 1989",
     series: ["f1"],
     track: "suzuka",                      // id from TRACKS
     facts: [{ label: "Winner", value: "Name" }],
     body: ["What happened.", "Why it matters."],
     related: { terms: [], tactics: [] },
     sources: [wiki("1989_Japanese_Grand_Prix")]
   },
   ===================================================================== */
var RACES = [
  { id: "indy-1911", name: "1911 Indianapolis 500", date: "1911-05-30", dateLabel: "30 May 1911",
    series: ["indycar"], track: "indianapolis",
    facts: [{ label: "Winner", value: "Ray Harroun" }, { label: "Distance", value: "500 miles" }],
    body: [
      "The first Indianapolis 500. The Speedway's managers replaced their earlier program of smaller race meetings with one big event, and it quickly became one of the most important races in the world.",
      "Ray Harroun, an engineer with the Marmon Motor Car Company, came out of retirement to win. Cars of the time usually carried a riding mechanic to watch for traffic, but Harroun drove alone and fitted a rearview mirror, believed to be the first used on a racing car. He also held a planned steady pace to save his tires. The race featured a pace car, the first known use of what is now called the safety car."
    ],
    related: { tactics: ["tire-management"], terms: ["safety-car"] },
    sources: [wiki("1911_Indianapolis_500"), wiki("Safety_car"), INDYCAR_INDY500] },

  { id: "british-gp-1950", name: "1950 British Grand Prix", date: "1950-05-13", dateLabel: "13 May 1950",
    series: ["f1"], track: "silverstone",
    facts: [{ label: "Winner", value: "Nino Farina" }, { label: "Laps", value: "70" }],
    body: [
      "The first race of the Formula One World Championship. Formally named the Grand Prix d'Europe incorporating the British Grand Prix, it was the first of seven championship races in 1950.",
      "Nino Farina won the 70-lap race for Alfa Romeo from pole position, with teammates Luigi Fagioli and Reg Parnell second and third."
    ],
    related: { terms: ["pole-position", "grand-prix"] },
    sources: [wiki("1950_British_Grand_Prix"), f1Circuit("great-britain", "British Grand Prix circuit page")] },

  { id: "le-mans-1966", name: "1966 24 Hours of Le Mans", date: "1966-06-18", dateLabel: "18 to 19 June 1966",
    series: ["other"], track: "le-mans",
    facts: [{ label: "Overall winner", value: "Ford GT40" }, { label: "Championship", value: "World Sportscar" }],
    body: [
      "The 34th running of the 24 Hours of Le Mans, and the seventh round of the 1966 World Sportscar Championship.",
      "The Ford GT40 took its first overall win at Le Mans. It was the first win for an American car maker in a major European race since 1921. The race also marked the first Le Mans starts for Henri Pescarolo, who went on to set the record for most starts, and Jacky Ickx, who went on to win the race six times."
    ],
    related: { terms: ["endurance-racing"] },
    sources: [wiki("1966_24_Hours_of_Le_Mans")] },

  { id: "japan-1976", name: "1976 Japanese Grand Prix", date: "1976-10-24", dateLabel: "24 October 1976",
    series: ["f1"], track: "fuji",
    facts: [{ label: "Champion", value: "James Hunt" }, { label: "Title margin", value: "1 point" }],
    body: [
      "The final race of the 1976 season and the first Formula One race held in Japan.",
      "Niki Lauda arrived three points ahead of James Hunt in the championship. Lauda retired early in the race, and Hunt's third place was enough to win the title by a single point."
    ],
    sources: [wiki("1976_Japanese_Grand_Prix"), wiki("Fuji_Speedway")] },

  { id: "daytona-500-1979", name: "1979 Daytona 500", date: "1979-02-18", dateLabel: "18 February 1979",
    series: ["nascar"], track: "daytona",
    facts: [{ label: "Winner", value: "Richard Petty" }, { label: "Broadcast", value: "Live, flag-to-flag" }],
    body: [
      "The 21st Daytona 500 was the first 500-mile race in the United States shown live on television from start to finish, with in-car camera views new to viewers.",
      "On the final lap, leaders Cale Yarborough and Donnie Allison collided on the back straight, and Richard Petty, who had been more than half a lap behind, took his sixth Daytona 500 win. A winter storm kept much of the Midwest and Northeast indoors, so the race reached a large new audience and brought NASCAR national attention."
    ],
    related: { terms: ["flag-to-flag"] },
    sources: [wiki("1979_Daytona_500"), GLOSSARY] },

  { id: "brazil-2008", name: "2008 Brazilian Grand Prix", date: "2008-11-02", dateLabel: "2 November 2008",
    series: ["f1"], track: "interlagos",
    facts: [{ label: "Race winner", value: "Felipe Massa" }, { label: "Champion", value: "Lewis Hamilton" }],
    body: [
      "The final race of the 2008 season. Rain fell just before the start and again in the closing laps.",
      "Felipe Massa won for Ferrari from pole position. Lewis Hamilton passed Timo Glock in the final corners to finish fifth, which gave him just enough points to win the Drivers' Championship. Massa's win and Kimi Räikkönen's third place helped Ferrari take the Constructors' Championship, the title for teams."
    ],
    related: { tactics: ["weather-tires"] },
    sources: [wiki("2008_Brazilian_Grand_Prix")] },

  { id: "canada-2011", name: "2011 Canadian Grand Prix", date: "2011-06-12", dateLabel: "12 June 2011",
    series: ["f1"], track: "gilles-villeneuve",
    facts: [{ label: "Winner", value: "Jenson Button" }, { label: "Duration", value: "Over 4 hours" }],
    body: [
      "Heavy rain stopped the race on lap 26, and it restarted more than two hours later. At over four hours including the stoppage, it set the record for the longest race in Formula One history.",
      "Jenson Button fell to last place after a collision on lap 37, then climbed from 21st to first, passing Sebastian Vettel on the final lap to win."
    ],
    related: { tactics: ["weather-tires"], terms: ["safety-car"] },
    sources: [wiki("2011_Canadian_Grand_Prix")] },

  { id: "australia-motogp-2015", name: "2015 Australian Motorcycle Grand Prix", date: "2015-10-18", dateLabel: "18 October 2015",
    series: ["motogp"], track: "phillip-island",
    facts: [{ label: "Winner", value: "Marc Márquez" }, { label: "Deciding move", value: "Final-lap pass" }],
    body: [
      "A four-way fight between Marc Márquez, Jorge Lorenzo, Andrea Iannone, and Valentino Rossi that many regard as one of the best races in MotoGP history.",
      "Márquez won with a pass on Lorenzo on the final lap. It was his 50th Grand Prix win, in his 130th start, making him the youngest rider to reach 50 wins, at 22 years and 243 days."
    ],
    sources: [wiki("2015_Australian_motorcycle_Grand_Prix")] }
];

/* =====================================================================
   CONTENT: CARS and DRIVERS (placeholder pages, filled in later)
   Fill these arrays to turn the placeholder pages into full pages.
   ===================================================================== */
var CARS = [];
var DRIVERS = [];

/* =====================================================================
   Everything below builds the site from the lists above.
   You should not need to edit it to add content.
   ===================================================================== */

(function () {
  var TYPE_LABELS = { permanent: "Road course", street: "Street circuit", oval: "Oval" };
  var TYPE_TERMS = { permanent: "road-course", street: "street-circuit", oval: "oval" };
  var LISTS = { term: TERMS, tactic: TACTICS, track: TRACKS, race: RACES };
  var LIST_LABELS = { terms: "term", tactics: "tactic", tracks: "track", races: "race" };

  var seriesByKey = {};
  SERIES.forEach(function (s) { seriesByKey[s.key] = s; });

  function indexById(list) {
    var m = Object.create(null); // no inherited keys, so ids like "constructor" are safe
    list.forEach(function (x) { if (x && x.id) m[x.id] = x; });
    return m;
  }
  var BY = { term: indexById(TERMS), tactic: indexById(TACTICS), track: indexById(TRACKS), race: indexById(RACES), series: Object.create(null) };
  /* Series with a "body" get a full entry on the Legacy page (#series-<key>). */
  var LEGACY_SERIES = SERIES.filter(function (s) { return s.body && s.body.length; });
  LEGACY_SERIES.forEach(function (s) { BY.series[s.key] = s; });
  function seriesExtras(keys) {
    return (keys || []).filter(function (k) { return BY.series[k]; }).map(function (k) { return ["series", k]; });
  }

  /* ---------- Utilities ---------- */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function byName(a, b) { return a.name.localeCompare(b.name, "en", { sensitivity: "base" }); }
  function name(item) { return item.name; }

  function seriesTags(keys) {
    return '<div class="tags">' + (keys || []).map(function (k) {
      if (k === "all") return '<span class="tag tag--all">All series</span>';
      var s = seriesByKey[k];
      return s ? '<span class="tag tag--' + esc(k) + '" title="' + esc(s.name) + '">' + esc(s.label) + "</span>" : "";
    }).join("") + "</div>";
  }

  /* ---------- Built-in checks (prd.md 9.1) ---------- */

  function validate() {
    var problems = 0;
    function warn(list, item, msg) {
      problems++;
      console.warn("[Pace & Publish content] " + list + ' "' + ((item && item.id) || "?") + '": ' + msg);
    }
    var idPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    var seriesKeys = SERIES.map(function (s) { return s.key; });

    function checkCommon(listName, list, required) {
      var seen = Object.create(null);
      list.forEach(function (item) {
        required.forEach(function (f) {
          var v = item[f];
          if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) warn(listName, item, 'missing required field "' + f + '"');
        });
        if (item.id) {
          if (!idPattern.test(item.id)) warn(listName, item, "id should use lowercase letters, numbers, and hyphens only");
          if (seen[item.id]) warn(listName, item, "duplicate id");
          seen[item.id] = true;
        }
        (item.series || []).forEach(function (k) {
          if (k !== "all" && seriesKeys.indexOf(k) === -1) warn(listName, item, 'unknown series key "' + k + '"');
        });
        var rel = item.related || {};
        Object.keys(rel).forEach(function (kind) {
          var singular = LIST_LABELS[kind];
          if (!singular) { warn(listName, item, 'unknown related list "' + kind + '"'); return; }
          (rel[kind] || []).forEach(function (rid) {
            if (!BY[singular][rid]) warn(listName, item, "related " + singular + ' "' + rid + '" does not exist');
          });
        });
        (item.sources || []).forEach(function (s) {
          if (!s || !s.title || !s.url) warn(listName, item, "a source is missing its title or url");
        });
        if (item.image) {
          ["src", "alt", "author", "license", "sourceUrl"].forEach(function (f) {
            if (!item.image[f]) warn(listName, item, 'image is missing "' + f + '" (every image needs full credit)');
          });
        }
      });
    }

    checkCommon("TERMS", TERMS, ["id", "name", "series", "text", "sources"]);
    checkCommon("TACTICS", TACTICS, ["id", "name", "series", "body", "sources"]);
    checkCommon("TRACKS", TRACKS, ["id", "name", "country", "lat", "lng", "series", "type", "summary", "body", "sources"]);
    checkCommon("RACES", RACES, ["id", "name", "date", "dateLabel", "series", "track", "body", "sources"]);
    checkCommon("SERIES", LEGACY_SERIES.map(function (s) {
      var copy = {}; Object.keys(s).forEach(function (k) { copy[k] = s[k]; });
      copy.id = s.key; delete copy.series; return copy;
    }), ["id", "label", "name", "desc", "body", "sources"]);

    var topicKeys = TOPICS.map(function (tp) { return tp.key; });
    TERMS.forEach(function (t) {
      (t.topics || []).forEach(function (k) {
        if (topicKeys.indexOf(k) === -1) warn("TERMS", t, 'unknown topic "' + k + '" (add it to TOPICS)');
      });
    });
    TRACKS.forEach(function (t) {
      if (typeof t.lat !== "number" || t.lat < -90 || t.lat > 90) warn("TRACKS", t, "lat must be a number between -90 and 90");
      if (typeof t.lng !== "number" || t.lng < -180 || t.lng > 180) warn("TRACKS", t, "lng must be a number between -180 and 180");
      if (t.type && !TYPE_LABELS[t.type]) warn("TRACKS", t, 'type must be "permanent", "street", or "oval"');
    });
    RACES.forEach(function (r) {
      if (r.track && !BY.track[r.track]) warn("RACES", r, 'track "' + r.track + '" does not exist in TRACKS');
      if (r.date && !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) warn("RACES", r, "date should look like YYYY-MM-DD");
    });

    if (problems === 0) console.info("[Pace & Publish content] All entries passed the built-in checks (" +
      TERMS.length + " terms, " + TACTICS.length + " tactics, " + TRACKS.length + " tracks, " + RACES.length + " races, " + LEGACY_SERIES.length + " series).");
  }

  /* ---------- Automatic links to Terminology ---------- */

  var termLookup = Object.create(null);
  var phrases = [];
  TERMS.forEach(function (t) {
    if (t.autolink === false) return;
    [t.name].concat(t.aka || [], t.forms || []).forEach(function (p) {
      var key = p.toLowerCase();
      if (!termLookup[key]) { termLookup[key] = t.id; phrases.push(p); }
    });
  });
  phrases.sort(function (a, b) { return b.length - a.length; });
  var termRegex = phrases.length ? new RegExp("(?<![\\w-])(" + phrases.map(function (p) {
    return esc(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("|") + ")(?![\\w-])", "gi") : null;

  /* Links the first mention of each defined term in a block of text. */
  function linkify(text, selfTermId, used) {
    var html = esc(text);
    if (!termRegex) return html;
    used = used || Object.create(null);
    return html.replace(termRegex, function (m) {
      var id = termLookup[m.toLowerCase()];
      if (!id || id === selfTermId || used[id]) return m;
      used[id] = true;
      return '<a class="term-link" href="#term-' + id + '">' + m + "</a>";
    });
  }
  function paragraphs(list, selfTermId) {
    var used = Object.create(null);
    return (list || []).map(function (p) { return "<p>" + linkify(p, selfTermId, used) + "</p>"; }).join("");
  }

  /* ---------- Shared entry parts ---------- */

  function relatedHtml(item, extra) {
    var rel = item.related || {};
    var links = [];
    var seen = Object.create(null);
    function add(kind, id) {
      var obj = BY[kind][id];
      var key = kind + ":" + id;
      if (!obj || seen[key]) return;
      if (kind === "term" && item._kind === "term" && id === item.id) return;
      seen[key] = true;
      links.push('<li><a href="#' + kind + "-" + id + '">' + esc(name(obj)) + "</a></li>");
    }
    ["terms", "tactics", "tracks", "races"].forEach(function (k) {
      (rel[k] || []).forEach(function (id) { add(LIST_LABELS[k], id); });
    });
    (extra || []).forEach(function (e) { add(e[0], e[1]); });
    if (!links.length) return "";
    return '<div class="related"><strong>Related</strong><ul>' + links.join("") + "</ul></div>";
  }

  function sourcesHtml(item) {
    var s = item.sources || [];
    if (!s.length) return "";
    return '<div class="sources"><strong>Sources</strong><ul>' + s.map(function (src) {
      return '<li><a href="' + esc(src.url) + '" rel="noopener" target="_blank">' + esc(src.title) + "</a></li>";
    }).join("") + "</ul></div>";
  }

  function factsHtml(rows) {
    if (!rows.length) return "";
    return '<dl class="facts">' + rows.map(function (r) {
      return "<div><dt>" + esc(r.label) + "</dt><dd>" + (r.html || esc(r.value)) + "</dd></div>";
    }).join("") + "</dl>";
  }

  function imageHtml(img) {
    if (!img) return "";
    var lic = img.licenseUrl ? '<a href="' + esc(img.licenseUrl) + '" rel="noopener" target="_blank">' + esc(img.license) + "</a>" : esc(img.license);
    return '<figure class="media"><img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy" width="960" height="640">' +
      '<figcaption>Photo: ' + esc(img.author) + ", via " +
      '<a href="' + esc(img.sourceUrl) + '" rel="noopener" target="_blank">Wikimedia Commons</a>, ' + lic + "</figcaption></figure>";
  }

  /* ---------- Home ---------- */

  function renderHome() {
    var counts = { terms: TERMS.length, tactics: TACTICS.length, tracks: TRACKS.length, races: RACES.length, series: LEGACY_SERIES.length };
    var words = { terms: "terms", tactics: "tactics", tracks: "tracks", races: "races", series: "series" };
    Array.prototype.forEach.call(document.querySelectorAll("[data-count]"), function (el) {
      var k = el.getAttribute("data-count");
      el.textContent = k === "legacy"
        ? counts.series + " series · " + counts.races + " races"
        : counts[k] + " " + words[k];
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-num]"), function (el) {
      el.textContent = counts[el.getAttribute("data-num")];
    });
    $("series-row").innerHTML = SERIES.filter(function (s) { return s.key !== "other"; }).map(function (s) {
      var inner = '<span class="tag tag--' + s.key + '">' + esc(s.label) + "</span>" +
        "<h3>" + esc(s.name) + "</h3><p>" + esc(s.desc) + "</p>";
      return BY.series[s.key]
        ? '<a class="series-card" href="#series-' + s.key + '">' + inner + '<span class="series-more">Read the story</span></a>'
        : '<div class="series-card">' + inner + "</div>";
    }).join("");
  }

  /* ---------- Terminology ---------- */

  function renderTerms() {
    var sorted = TERMS.slice().sort(byName);
    var groups = {};
    sorted.forEach(function (t) {
      var letter = t.name.charAt(0).toUpperCase();
      (groups[letter] = groups[letter] || []).push(t);
    });
    $("terms-list").innerHTML = Object.keys(groups).sort().map(function (L) {
      return '<section class="letter-group" id="letter-' + L.toLowerCase() + '" aria-label="' + L + '"><h2 aria-hidden="true">' + L + '</h2><div class="term-grid">' +
        groups[L].map(function (t) {
          t._kind = "term";
          return '<article class="term" id="term-' + t.id + '" tabindex="-1" data-series="' + esc(t.series.join(" ")) + '" data-topics="' + esc((t.topics || []).join(" ")) + '">' +
            '<div class="term-head"><h3>' + esc(t.name) + "</h3>" + seriesTags(t.series) + "</div>" +
            (t.aka && t.aka.length ? '<p class="aka">Also called: ' + t.aka.map(esc).join(", ") + "</p>" : "") +
            '<div class="prose">' + paragraphs([t.text], t.id) + "</div>" +
            relatedHtml(t) + sourcesHtml(t) + "</article>";
        }).join("") + "</div></section>";
    }).join("");

    // Series filter buttons: one per series that has terms of its own.
    var keys = SERIES.filter(function (s) {
      return s.key !== "other" && TERMS.some(function (t) { return t.series.indexOf(s.key) !== -1; });
    });
    $("term-filter").innerHTML = '<button type="button" data-term-filter="all" aria-pressed="true">All series</button>' +
      keys.map(function (s) { return '<button type="button" data-term-filter="' + s.key + '" aria-pressed="false">' + esc(s.label) + "</button>"; }).join("");
    // Second row: quick sets (Starter Pack, Flags, Penalties). Click again to clear.
    $("term-topics").innerHTML = TOPICS.map(function (tp) {
      return '<button type="button" data-term-topic="' + tp.key + '" aria-pressed="false">' + esc(tp.label) + "</button>";
    }).join("");
    applyTermFilter();
  }

  /* ---------- Terminology filter ----------
     Row 1 shows only the terms for one series. Terms tagged "All series" apply everywhere,
     so the checkbox decides whether they stay visible alongside a series' own terms.
     Row 2 narrows to a quick set (TOPICS). Both rows combine: e.g. MotoGP + Flags. */

  var termFilter = "all";
  var termTopic = null;
  var topicByKey = {};
  TOPICS.forEach(function (tp) { topicByKey[tp.key] = tp; });

  function setTermTopic(key) {
    termTopic = termTopic === key ? null : key; // clicking the active set clears it
    applyTermFilter();
  }

  function applyTermFilter(key) {
    if (key) termFilter = key;
    var shared = $("term-shared").checked;
    $("term-shared").disabled = termFilter === "all";
    Array.prototype.forEach.call(document.querySelectorAll("[data-term-filter]"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-term-filter") === termFilter));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-term-topic]"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-term-topic") === termTopic));
    });
    var shown = 0;
    Array.prototype.forEach.call(document.querySelectorAll("#terms-list .term"), function (el) {
      var tags = el.getAttribute("data-series").split(" ");
      var visible = termFilter === "all" || tags.indexOf(termFilter) !== -1 || (shared && tags.indexOf("all") !== -1);
      if (visible && termTopic) visible = el.getAttribute("data-topics").split(" ").indexOf(termTopic) !== -1;
      el.hidden = !visible;
      if (visible) shown++;
    });
    // Hide empty letter groups and rebuild the A-Z bar to match.
    var az = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (L) {
      var group = $("letter-" + L.toLowerCase());
      var has = group && group.querySelector(".term:not([hidden])");
      if (group) group.hidden = !has;
      az += has ? '<a href="#letter-' + L.toLowerCase() + '" aria-label="Terms starting with ' + L + '">' + L + "</a>"
        : '<span aria-hidden="true">' + L + "</span>";
    });
    $("az-bar").innerHTML = az;
    var label = (termTopic ? " in " + topicByKey[termTopic].name : "") +
      (termFilter === "all" ? "" : " for " + seriesByKey[termFilter].name);
    $("term-count").textContent = "Showing " + shown + " of " + TERMS.length + " terms" + label + ".";
  }

  /* Links to a term hidden by the filter clear the filter first. */
  function revealTerm(el) {
    if (el && el.closest && el.closest("#terms-list") && (el.hidden || el.closest("[hidden]"))) { termTopic = null; applyTermFilter("all"); }
  }

  /* ---------- Tactics ---------- */

  function renderTactics() {
    var sorted = TACTICS.slice().sort(function (a, b) { return (a.order || 999) - (b.order || 999) || byName(a, b); });
    $("tactics-list").innerHTML = sorted.map(function (t, i) {
      return '<article class="tactic" id="tactic-' + t.id + '" tabindex="-1">' +
        '<div class="tactic-num" aria-hidden="true">' + pad(i + 1) + "</div>" +
        '<div class="tactic-body">' + seriesTags(t.series) + '<h2 style="margin-top:12px">' + esc(t.name) + "</h2>" +
        '<div class="prose">' + paragraphs(t.body) + "</div>" + relatedHtml(t) + sourcesHtml(t) + "</div></article>";
    }).join("");
  }

  /* ---------- Racetracks ---------- */

  var sortedTracks = TRACKS.slice().sort(byName);

  function renderTracks() {
    $("tracks-list").innerHTML = sortedTracks.map(function (t, i) {
      var racesHere = RACES.filter(function (r) { return r.track === t.id; }).map(function (r) { return ["race", r.id]; });
      var facts = [
        { label: "Country", value: t.country },
        { label: "Track type", html: '<a href="#term-' + TYPE_TERMS[t.type] + '">' + esc(TYPE_LABELS[t.type] || t.type) + "</a>" }
      ].concat(t.facts || []);
      return '<article class="entry" id="track-' + t.id + '" tabindex="-1">' +
        '<div class="entry-top"><div>' + seriesTags(t.series) +
        '<h2 style="margin-top:14px">' + esc(t.name) + '</h2><p class="entry-sub">' + esc(t.summary) + "</p></div>" +
        '<span class="entry-num" aria-hidden="true">' + pad(i + 1) + "</span></div>" +
        factsHtml(facts) +
        '<div class="entry-body' + (t.image ? "" : " no-media") + '">' + imageHtml(t.image) +
        '<div><div class="prose">' + paragraphs(t.body) + "</div>" +
        relatedHtml(t, racesHere.concat(seriesExtras(t.series))) + sourcesHtml(t) +
        '<p><a class="back-to-map" href="#map-top">Back to the map</a></p></div></div></article>';
    }).join("");

    // List beside the map
    $("track-list").innerHTML = sortedTracks.map(function (t) {
      return '<li data-id="' + t.id + '" data-series="' + esc(t.series.join(" ")) + '">' +
        '<a href="#track-' + t.id + '">' + esc(t.name) + "<small>" + esc(t.country) + " · " +
        t.series.map(function (k) { return seriesByKey[k] ? seriesByKey[k].label : k; }).join(", ") + "</small></a>" +
        '<button type="button" data-locate="' + t.id + '" aria-label="Show ' + esc(t.name) + ' on the map">Map</button></li>';
    }).join("");

    // Series filter
    var used = SERIES.filter(function (s) { return TRACKS.some(function (t) { return t.series.indexOf(s.key) !== -1; }); });
    $("track-filter").innerHTML = '<button type="button" data-filter="all" aria-pressed="true">All</button>' +
      used.map(function (s) { return '<button type="button" data-filter="' + s.key + '" aria-pressed="false">' + esc(s.label) + "</button>"; }).join("");
  }

  /* ---------- Map (Leaflet + OpenStreetMap) ---------- */

  var map = null, markers = {}, currentFilter = "all";

  function popupHtml(t) {
    return '<div class="pop"><h3>' + esc(t.name) + '</h3><p class="pop-country">' + esc(t.country) + "</p>" +
      seriesTags(t.series) + "<p>" + esc(t.summary) + "</p>" +
      '<a class="btn" href="#track-' + t.id + '">Learn more</a></div>';
  }

  function markOffline() { $("map-wrap").classList.add("is-offline"); }

  function initMap() {
    if (map) { map.invalidateSize(); return; }
    if (typeof L === "undefined") { markOffline(); return; }

    // Narrow (phone) maps may zoom out one more step so the whole world fits on screen.
    var narrowMap = $("track-map").clientWidth < 600;
    map = L.map("track-map", { scrollWheelZoom: true, minZoom: narrowMap ? 0 : 2, zoomSnap: 0.5, maxBounds: [[-85, -200], [85, 200]] });

    /* Built-in world outline (vendor/world/land-50m.js), drawn in brand colors.
       It needs no internet connection, so the map always works, including when the
       page is opened by double-clicking (file://). */
    if (typeof WORLD_LAND !== "undefined") {
      // Own pane below the tile pane (z-index 200), so Detailed tiles cover it.
      map.createPane("basicPane").style.zIndex = 150;
      L.geoJSON(WORLD_LAND, {
        pane: "basicPane",
        renderer: L.canvas({ padding: 0.5, pane: "basicPane" }),
        interactive: false,
        style: { fillColor: "#0C0C12", fillOpacity: 1, color: "#EAE6E0", opacity: 0.35, weight: 0.8 },
        attribution: 'Land outline: <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
      }).addTo(map);
    }

    if (typeof WORLD_LAND === "undefined") markOffline();
    setupMapStyleToggle();

    var bounds = [];
    TRACKS.forEach(function (t) {
      var m = L.circleMarker([t.lat, t.lng], {
        radius: 8, weight: 2, color: "#0C0C12", fillColor: "#F64C1C", fillOpacity: 1
      });
      m.bindTooltip(t.name, { className: "track-tip", direction: "top", offset: [0, -8] });
      m.bindPopup(popupHtml(t), narrowMap
        // Phones: keep the popup inside the map and clear of the zoom buttons.
        ? { maxWidth: Math.min(300, $("track-map").clientWidth - 130), autoPanPaddingTopLeft: [56, 16], autoPanPaddingBottomRight: [16, 16] }
        : { maxWidth: 300 });
      m.on("mouseover", function () { m.setStyle({ fillColor: "#F4C537", radius: 10 }); highlightRow(t.id, true); });
      m.on("mouseout", function () { m.setStyle({ fillColor: "#F64C1C", radius: 8 }); highlightRow(t.id, false); });
      m.addTo(map);
      markers[t.id] = m;
      bounds.push([t.lat, t.lng]);
    });
    map.fitBounds(bounds, { padding: [30, 30] });
    applyFilter(currentFilter);
  }

  /* ---------- Basic / Detailed map toggle (lower left of the map) ----------
     Basic: the built-in world outline. Default, and works offline and on file:// pages.
     Detailed: OpenStreetMap tiles on top. OSM's servers require a web address (an HTTP
     Referer), which a double-clicked file:// page does not send, so there it is disabled.
     It is also disabled if the tiles fail to load (for example, when offline). */
  var BASIC_MAX_ZOOM = 8;
  var osmTiles = null, detailedAvailable = true, toggleEl = null;

  function setupMapStyleToggle() {
    map.setMaxZoom(BASIC_MAX_ZOOM);

    var Toggle = L.Control.extend({
      options: { position: "bottomleft" },
      onAdd: function () {
        var div = L.DomUtil.create("div", "map-style-toggle");
        div.setAttribute("role", "group");
        div.setAttribute("aria-label", "Map style");
        div.innerHTML =
          '<button type="button" data-style="basic" aria-pressed="true">Basic</button>' +
          '<button type="button" data-style="detailed" aria-pressed="false">Detailed</button>';
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.on(div, "click", function (e) {
          var b = e.target.closest("button[data-style]");
          if (b && !b.disabled) setMapStyle(b.getAttribute("data-style"));
        });
        return div;
      }
    });
    map.addControl(new Toggle());
    toggleEl = $("map-wrap").querySelector(".map-style-toggle");

    if (location.protocol !== "http:" && location.protocol !== "https:") {
      disableDetailed("The Detailed map needs the site to be opened from a web address, such as once it is hosted online.");
      return;
    }
    if (navigator.onLine === false) {
      disableDetailed("The Detailed map needs an internet connection.");
      return;
    }
    // Check once, in the background, that OpenStreetMap tiles can be reached.
    var probe = new Image();
    probe.onerror = function () { disableDetailed("The Detailed map could not be loaded."); };
    probe.src = "https://tile.openstreetmap.org/2/2/1.png";
  }

  function setMapStyle(style) {
    if (style === "detailed" && !detailedAvailable) style = "basic";
    if (style === "detailed") {
      if (!osmTiles) {
        osmTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        var loaded = 0, failed = 0;
        osmTiles.on("tileload", function () { loaded++; });
        osmTiles.on("tileerror", function () {
          failed++;
          if (failed >= 4 && loaded === 0) disableDetailed("The Detailed map could not be loaded.");
        });
      }
      map.setMaxZoom(18);
      if (!map.hasLayer(osmTiles)) osmTiles.addTo(map);
    } else {
      if (osmTiles && map.hasLayer(osmTiles)) map.removeLayer(osmTiles);
      if (map.getZoom() > BASIC_MAX_ZOOM) map.setZoom(BASIC_MAX_ZOOM);
      map.setMaxZoom(BASIC_MAX_ZOOM);
    }
    if (toggleEl) {
      Array.prototype.forEach.call(toggleEl.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-style") === style));
      });
    }
  }

  function disableDetailed(reason) {
    detailedAvailable = false;
    setMapStyle("basic");
    if (!toggleEl) return;
    toggleEl.classList.add("is-unavailable");
    var b = toggleEl.querySelector('[data-style="detailed"]');
    b.disabled = true;
    b.title = reason;
    b.setAttribute("aria-label", "Detailed (unavailable). " + reason);
  }

  function highlightRow(id, on) {
    var li = document.querySelector('#track-list li[data-id="' + id + '"]');
    if (li) li.classList.toggle("is-active", on);
  }

  function applyFilter(key) {
    currentFilter = key;
    Array.prototype.forEach.call(document.querySelectorAll("#track-filter button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === key));
    });
    var shown = 0;
    TRACKS.forEach(function (t) {
      var visible = key === "all" || t.series.indexOf(key) !== -1;
      if (visible) shown++;
      var li = document.querySelector('#track-list li[data-id="' + t.id + '"]');
      if (li) li.hidden = !visible;
      if (map && markers[t.id]) {
        if (visible && !map.hasLayer(markers[t.id])) markers[t.id].addTo(map);
        if (!visible && map.hasLayer(markers[t.id])) map.removeLayer(markers[t.id]);
      }
    });
    $("track-list-title").textContent = key === "all" ? "All tracks (" + shown + ")" : seriesByKey[key].label + " tracks (" + shown + ")";
  }

  function locate(id) {
    var t = BY.track[id];
    if (!t) return;
    if (!map) initMap();
    if (!map) { location.hash = "#track-" + id; return; }
    if (currentFilter !== "all" && t.series.indexOf(currentFilter) === -1) applyFilter("all");
    map.setView([t.lat, t.lng], 7);
    markers[id].openPopup();
    $("map-top").scrollIntoView({ block: "start" });
  }

  /* ---------- Historical races ---------- */

  function renderRaces() {
    var sorted = RACES.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    $("race-index").innerHTML = sorted.map(function (r, i) {
      return '<li><a href="#race-' + r.id + '"><b>' + pad(i + 1) + "</b><span><strong>" + esc(r.name) + "</strong><small>" +
        esc(r.dateLabel) + "</small></span></a></li>";
    }).join("");
    $("races-list").innerHTML = sorted.map(function (r, i) {
      var t = BY.track[r.track];
      var facts = [
        { label: "Date", value: r.dateLabel },
        { label: "Track", html: t ? '<a href="#track-' + t.id + '">' + esc(t.shortName || t.name) + "</a>" : esc(r.track) }
      ].concat(r.facts || []);
      return '<article class="entry" id="race-' + r.id + '" tabindex="-1">' +
        '<div class="entry-top"><div>' + seriesTags(r.series) + '<h3 style="margin-top:14px">' + esc(r.name) + "</h3></div>" +
        '<span class="entry-num" aria-hidden="true">' + pad(i + 1) + "</span></div>" +
        factsHtml(facts) +
        '<div class="entry-body no-media"><div><div class="prose">' + paragraphs(r.body) + "</div>" +
        relatedHtml(r, (t ? [["track", t.id]] : []).concat(seriesExtras(r.series))) + sourcesHtml(r) + "</div></div></article>";
    }).join("");
  }

  /* ---------- Series (Legacy page) ---------- */

  function renderSeries() {
    $("series-list").innerHTML = LEGACY_SERIES.map(function (s, i) {
      var racesIn = RACES.filter(function (r) { return r.series.indexOf(s.key) !== -1; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; })
        .map(function (r) { return ["race", r.id]; });
      return '<article class="entry" id="series-' + s.key + '" tabindex="-1">' +
        '<div class="entry-top"><div>' + seriesTags([s.key]) +
        '<h3 style="margin-top:14px">' + esc(s.name) + "</h3>" +
        (s.summary ? '<p class="entry-sub">' + esc(s.summary) + "</p>" : "") + "</div>" +
        '<span class="entry-num" aria-hidden="true">' + pad(i + 1) + "</span></div>" +
        factsHtml(s.facts || []) +
        '<div class="entry-body no-media"><div><div class="prose">' + paragraphs(s.body) + "</div>" +
        relatedHtml(s, racesIn) + sourcesHtml(s) + "</div></div></article>";
    }).join("");
  }

  /* ---------- Sources and credits ---------- */

  function renderCredits() {
    function collect(groups) {
      var map = Object.create(null), order = [];
      groups.forEach(function (g) {
        g.list.forEach(function (item) {
          (item.sources || []).forEach(function (s) {
            if (!map[s.url]) { map[s.url] = { title: s.title, url: s.url, used: [] }; order.push(s.url); }
            var label = g.label(item);
            if (map[s.url].used.indexOf(label) === -1) map[s.url].used.push(label);
          });
        });
      });
      return order.map(function (u) { return map[u]; }).sort(function (a, b) { return a.title.localeCompare(b.title); });
    }
    function list(items) {
      return "<ol>" + items.map(function (s) {
        return '<li><a href="' + esc(s.url) + '" rel="noopener" target="_blank">' + esc(s.title) + '</a> <span class="used-in">Used in: ' +
          esc(s.used.join(", ")) + "</span></li>";
      }).join("") + "</ol>";
    }
    var trackSrc = collect([{ list: TRACKS, label: function (t) { return t.shortName || t.name; } }]);
    var raceSrc = collect([{ list: RACES, label: function (r) { return r.name; } }]);
    var termSrc = collect([
      { list: TERMS, label: function (t) { return t.name; } },
      { list: TACTICS, label: function (t) { return t.name; } },
      { list: SERIES, label: function (s) { return s.name; } }
    ]);
    var photos = TRACKS.filter(function (t) { return t.image; }).map(function (t) {
      var i = t.image;
      return '<li><a href="' + esc(i.sourceUrl) + '" rel="noopener" target="_blank">' + esc(t.name) + "</a>: photo by " + esc(i.author) +
        ", " + (i.licenseUrl ? '<a href="' + esc(i.licenseUrl) + '" rel="noopener" target="_blank">' + esc(i.license) + "</a>" : esc(i.license)) +
        ", via Wikimedia Commons</li>";
    }).join("");

    $("credits").innerHTML =
      '<section><h2>Racetracks</h2>' + list(trackSrc) + "</section>" +
      '<section><h2>Historical races</h2>' + list(raceSrc) + "</section>" +
      '<section><h2>Terms, tactics, and series</h2>' + list(termSrc) + "</section>" +
      '<section><h2>Photos</h2><ul>' + photos + "</ul>" +
      '<h2 style="margin-top:36px">Map, fonts, and code</h2><ul>' +
      '<li>Map data &copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener" target="_blank">OpenStreetMap</a> contributors, available under the Open Database License.</li>' +
      '<li>Built-in world outline: <a href="https://www.naturalearthdata.com/" rel="noopener" target="_blank">Natural Earth</a> 1:50m land (public domain), via <a href="https://github.com/topojson/world-atlas" rel="noopener" target="_blank">world-atlas</a> 2.0.2, saved in vendor/world.</li>' +
      '<li>Map library: <a href="https://leafletjs.com" rel="noopener" target="_blank">Leaflet</a> 1.9.4 (BSD 2-Clause License), saved in vendor/leaflet.</li>' +
      '<li>Fonts: <a href="https://fonts.google.com/specimen/Oswald" rel="noopener" target="_blank">Oswald</a> and <a href="https://fonts.google.com/specimen/Inter" rel="noopener" target="_blank">Inter</a> via Google Fonts (SIL Open Font License).</li>' +
      "</ul><p class=\"used-in\" style=\"margin-top:24px\">Sources were checked on " + esc(SOURCES_CHECKED) + ".</p></section>";
  }

  /* ---------- Router: one page visible at a time ---------- */

  var pages = Array.prototype.slice.call(document.querySelectorAll("[data-page]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
  var currentPage = null;

  function showPage(id) {
    if (currentPage === id) return false;
    pages.forEach(function (p) { p.hidden = p.id !== id; });
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // On phones the nav is a swipeable row: bring the current link into view.
    var nav = document.querySelector(".main-nav");
    var current = nav && nav.querySelector('a[aria-current="page"]');
    if (current && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2;
    }
    var h = document.querySelector("#" + id + " h1");
    document.title = (id === "home" ? "Pace & Publish | Motorsport Starter Guide" : (h ? h.textContent : id) + " | Pace & Publish");
    currentPage = id;
    if (id === "tracks") setTimeout(initMap, 0);
    return true;
  }

  function route() {
    var hash = decodeURIComponent(location.hash.replace(/^#/, "")) || "home";
    var target = document.getElementById(hash);
    var page = target ? (target.hasAttribute("data-page") ? target : target.closest("[data-page]")) : null;
    if (!page) { page = $("home"); target = null; }
    var changed = showPage(page.id);

    if (target && target !== page) {
      revealTerm(target);
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start" });
        if (target.hasAttribute("tabindex")) {
          target.focus({ preventScroll: true });
          target.classList.remove("entry-flash");
          void target.offsetWidth;
          target.classList.add("entry-flash");
        }
      });
    } else if (changed || target === page) {
      window.scrollTo(0, 0);
      var h1 = page.querySelector("h1");
      if (h1 && changed) h1.focus({ preventScroll: true });
    }
  }

  /* ---------- Start ---------- */

  validate();
  // Touch screens: map instructions in touch terms (no hover or scroll wheel).
  if (window.matchMedia && window.matchMedia("(hover: none)").matches && $("map-intro")) {
    $("map-intro").textContent = "Tap a marker for a summary. Use the list of links below the map to navigate.";
  }
  renderHome();
  renderTerms();
  renderTactics();
  renderTracks();
  renderSeries();
  renderRaces();
  renderCredits();

  document.addEventListener("click", function (e) {
    var loc = e.target.closest("[data-locate]");
    if (loc) { locate(loc.getAttribute("data-locate")); return; }
    var tt = e.target.closest("[data-term-topic]");
    if (tt) { setTermTopic(tt.getAttribute("data-term-topic")); return; }
    var tf = e.target.closest("[data-term-filter]");
    if (tf) { applyTermFilter(tf.getAttribute("data-term-filter")); return; }
    var f = e.target.closest("[data-filter]");
    if (f) applyFilter(f.getAttribute("data-filter"));
  });
  document.addEventListener("mouseover", function (e) {
    var li = e.target.closest && e.target.closest("#track-list li");
    if (!li || !map) return;
    var m = markers[li.getAttribute("data-id")];
    if (m) { m.setStyle({ fillColor: "#F4C537", radius: 10 }); m.bringToFront(); }
  });
  document.addEventListener("mouseout", function (e) {
    var li = e.target.closest && e.target.closest("#track-list li");
    if (!li || !map) return;
    var m = markers[li.getAttribute("data-id")];
    if (m) m.setStyle({ fillColor: "#F64C1C", radius: 8 });
  });

  $("term-shared").addEventListener("change", function () { applyTermFilter(); });
  window.addEventListener("hashchange", route);
  route();
})();
