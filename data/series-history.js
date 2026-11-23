/* Pace & Publish data: series history for the Legacy page (joined to data/series.js by key)
   Moved from Ben's starter guide (archive/brand-site-ben/website/script.js) with its text unchanged.
   How to add an entry: docs/adding-content.md. Source helpers (wiki(), official(), ...) live in data/sources.js. */
(function (S) {
  "use strict";
  var PP = window.PP;
  var SOURCES_CHECKED = S.SOURCES_CHECKED, wiki = S.wiki, GLOSSARY = S.GLOSSARY, official = S.official, F1_GLOSSARY_AE = S.F1_GLOSSARY_AE, F1_GLOSSARY_FJ = S.F1_GLOSSARY_FJ, F1_GLOSSARY_KO = S.F1_GLOSSARY_KO, F1_GLOSSARY_PT = S.F1_GLOSSARY_PT, F1_GLOSSARY_UZ = S.F1_GLOSSARY_UZ, f1Circuit = S.f1Circuit, MOTOGP_GLOSSARY = S.MOTOGP_GLOSSARY, WEC_ABOUT = S.WEC_ABOUT, WEC_LE_MANS = S.WEC_LE_MANS, INDYCAR_BASICS = S.INDYCAR_BASICS, FLAGS = S.FLAGS, racingCircuits = S.racingCircuits, INDYCAR_GLOSSARY = S.INDYCAR_GLOSSARY, INDYCAR_LAGUNA = S.INDYCAR_LAGUNA, INDYCAR_INDY500 = S.INDYCAR_INDY500;

  /* =====================================================================
     CONTENT: SERIES
     Keys used by every other list. Add a series here before using its key.
     A series with a "body" also gets a full entry in the Legacy page's
     Series section (anchor #series-<key>), like a track or race entry.
     TEMPLATE:
     {
       key: "formula-1",                            // short key used by every list; anchor #series-formula-1
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
  PP.seriesHistory = [
    { key: "formula-1", label: "F1", name: "Formula One",
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
})(window.PP.sources);
