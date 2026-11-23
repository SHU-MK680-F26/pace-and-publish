/* Pace & Publish data: famous historical races
   Moved from Ben's starter guide (archive/brand-site-ben/website/script.js) with its text unchanged.
   How to add an entry: docs/adding-content.md. Source helpers (wiki(), official(), ...) live in data/sources.js. */
(function (S) {
  "use strict";
  var PP = window.PP;
  var SOURCES_CHECKED = S.SOURCES_CHECKED, wiki = S.wiki, GLOSSARY = S.GLOSSARY, official = S.official, F1_GLOSSARY_AE = S.F1_GLOSSARY_AE, F1_GLOSSARY_FJ = S.F1_GLOSSARY_FJ, F1_GLOSSARY_KO = S.F1_GLOSSARY_KO, F1_GLOSSARY_PT = S.F1_GLOSSARY_PT, F1_GLOSSARY_UZ = S.F1_GLOSSARY_UZ, f1Circuit = S.f1Circuit, MOTOGP_GLOSSARY = S.MOTOGP_GLOSSARY, WEC_ABOUT = S.WEC_ABOUT, WEC_LE_MANS = S.WEC_LE_MANS, INDYCAR_BASICS = S.INDYCAR_BASICS, FLAGS = S.FLAGS, racingCircuits = S.racingCircuits, INDYCAR_GLOSSARY = S.INDYCAR_GLOSSARY, INDYCAR_LAGUNA = S.INDYCAR_LAGUNA, INDYCAR_INDY500 = S.INDYCAR_INDY500;

  /* =====================================================================
     CONTENT: RACES
     TEMPLATE:
     {
       id: "japan-1989",                     // anchor becomes #race-japan-1989
       name: "1989 Japanese Grand Prix",
       date: "1989-10-22",                   // YYYY-MM-DD, used for sorting
       dateLabel: "22 October 1989",
       series: ["formula-1"],
       track: "suzuka",                      // id from TRACKS
       facts: [{ label: "Winner", value: "Name" }],
       body: ["What happened.", "Why it matters."],
       related: { terms: [], tactics: [] },
       sources: [wiki("1989_Japanese_Grand_Prix")]
     },
     ===================================================================== */
  PP.races = [
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
      series: ["formula-1"], track: "silverstone",
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
      series: ["formula-1"], track: "fuji",
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
      series: ["formula-1"], track: "interlagos",
      facts: [{ label: "Race winner", value: "Felipe Massa" }, { label: "Champion", value: "Lewis Hamilton" }],
      body: [
        "The final race of the 2008 season. Rain fell just before the start and again in the closing laps.",
        "Felipe Massa won for Ferrari from pole position. Lewis Hamilton passed Timo Glock in the final corners to finish fifth, which gave him just enough points to win the Drivers' Championship. Massa's win and Kimi Räikkönen's third place helped Ferrari take the Constructors' Championship, the title for teams."
      ],
      related: { tactics: ["weather-tires"] },
      sources: [wiki("2008_Brazilian_Grand_Prix")] },

    { id: "canada-2011", name: "2011 Canadian Grand Prix", date: "2011-06-12", dateLabel: "12 June 2011",
      series: ["formula-1"], track: "gilles-villeneuve",
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
})(window.PP.sources);
