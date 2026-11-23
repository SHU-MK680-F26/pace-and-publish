/* Pace & Publish data: race tactics
   Moved from Ben's starter guide (archive/brand-site-ben/website/script.js) with its text unchanged.
   How to add an entry: docs/adding-content.md. Source helpers (wiki(), official(), ...) live in data/sources.js. */
(function (S) {
  "use strict";
  var PP = window.PP;
  var SOURCES_CHECKED = S.SOURCES_CHECKED, wiki = S.wiki, GLOSSARY = S.GLOSSARY, official = S.official, F1_GLOSSARY_AE = S.F1_GLOSSARY_AE, F1_GLOSSARY_FJ = S.F1_GLOSSARY_FJ, F1_GLOSSARY_KO = S.F1_GLOSSARY_KO, F1_GLOSSARY_PT = S.F1_GLOSSARY_PT, F1_GLOSSARY_UZ = S.F1_GLOSSARY_UZ, f1Circuit = S.f1Circuit, MOTOGP_GLOSSARY = S.MOTOGP_GLOSSARY, WEC_ABOUT = S.WEC_ABOUT, WEC_LE_MANS = S.WEC_LE_MANS, INDYCAR_BASICS = S.INDYCAR_BASICS, FLAGS = S.FLAGS, racingCircuits = S.racingCircuits, INDYCAR_GLOSSARY = S.INDYCAR_GLOSSARY, INDYCAR_LAGUNA = S.INDYCAR_LAGUNA, INDYCAR_INDY500 = S.INDYCAR_INDY500;

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
  PP.tactics = [
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
    { id: "drs", name: "Using DRS (2011 to 2025)", order: 9, series: ["formula-1"],
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
    { id: "sandbagging", name: "Sandbagging", order: 14, series: ["formula-1"],
      body: [
        "Deliberately running slower than the car can go, to hide its true pace from rivals.",
        "Teams may do it in pre-season testing or practice, for example by using lower engine settings or carrying extra fuel or weight."
      ],
      sources: [F1_GLOSSARY_PT] }
  ];
})(window.PP.sources);
