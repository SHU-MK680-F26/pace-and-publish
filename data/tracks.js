/* Pace & Publish data: racetracks
   Moved from Ben's starter guide (archive/brand-site-ben/website/script.js) with its text unchanged.
   How to add an entry: docs/adding-content.md. Photos: "photo" and "map" are ids in data/photos.js.
   Monaco, Silverstone and Suzuka carry Evelin's circuit detail (turns, laps, lap record) in "detail". Source helpers (wiki(), official(), ...) live in data/sources.js. */
(function (S) {
  "use strict";
  var PP = window.PP;
  var SOURCES_CHECKED = S.SOURCES_CHECKED, wiki = S.wiki, GLOSSARY = S.GLOSSARY, official = S.official, F1_GLOSSARY_AE = S.F1_GLOSSARY_AE, F1_GLOSSARY_FJ = S.F1_GLOSSARY_FJ, F1_GLOSSARY_KO = S.F1_GLOSSARY_KO, F1_GLOSSARY_PT = S.F1_GLOSSARY_PT, F1_GLOSSARY_UZ = S.F1_GLOSSARY_UZ, f1Circuit = S.f1Circuit, MOTOGP_GLOSSARY = S.MOTOGP_GLOSSARY, WEC_ABOUT = S.WEC_ABOUT, WEC_LE_MANS = S.WEC_LE_MANS, INDYCAR_BASICS = S.INDYCAR_BASICS, FLAGS = S.FLAGS, racingCircuits = S.racingCircuits, INDYCAR_GLOSSARY = S.INDYCAR_GLOSSARY, INDYCAR_LAGUNA = S.INDYCAR_LAGUNA, INDYCAR_INDY500 = S.INDYCAR_INDY500;

  /* =====================================================================
     CONTENT: TRACKS
     TEMPLATE:
     {
       id: "suzuka",                         // anchor becomes #track-suzuka
       name: "Suzuka Circuit",
       shortName: "Suzuka",                  // optional
       country: "Japan",
       lat: 34.8417, lng: 136.5389,          // decimal degrees
       series: ["formula-1"],                       // keys from SERIES
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
  PP.tracks = [
    { id: "monaco", name: "Circuit de Monaco", shortName: "Monaco", country: "Monaco",
      map: "map-monaco",
      detail: {"turns": "19", "turnsSource": {"title": "formula1.com circuit guide", "url": "https://www.formula1.com/en/latest/article/circuit-guide-everything-you-need-to-know-about-the-circuit-de-monaco.vFsmfGHr6RWyLFtxi58wi"}, "laps": "78", "raceDistance": "260.286 km", "lapRecord": "1:12.909", "lapRecordHolder": "Lewis Hamilton (2021)", "firstGrandPrix": "1950", "fact": "Racing first came to the streets of the Principality in 1929. The race was on the calendar in the first year of the Formula 1 World Championship, 1950, and has been on every calendar since 1955.", "event": "Formula 1 Louis Vuitton Grand Prix de Monaco 2026", "source": {"title": "formula1.com", "url": "https://www.formula1.com/en/racing/2026/monaco"}, "checked": "2026-11-12"},
      lat: 43.7347, lng: 7.4206, series: ["formula-1"], type: "street",
      summary: "A short, tight street circuit through Monte Carlo and around the harbor of Monaco.",
      body: [
        "The Circuit de Monaco runs for 3.337 km (2.074 mi) on the city streets of Monte Carlo and La Condamine, looping around the harbor. It is so closely tied to Monte Carlo that it is often simply called by that name.",
        "The Monaco Grand Prix is one of the three races in the Triple Crown of Motorsport. Watch how close the barriers are: on a street circuit this narrow, a small mistake ends a race."
      ],
      facts: [{ label: "Length", value: "3.337 km" }],
      related: { terms: ["street-circuit", "triple-crown"] },
      photo: "track-monaco",
      sources: [wiki("Circuit_de_Monaco"), f1Circuit("monaco", "Monaco Grand Prix circuit page"), racingCircuits("europe/monaco/monte-carlo.html", "Monte Carlo")] },

    { id: "silverstone", name: "Silverstone Circuit", shortName: "Silverstone", country: "United Kingdom",
      map: "map-silverstone", photo: "track-silverstone",
      detail: {"turns": "18", "turnsSource": {"title": "formula1.com circuit guide", "url": "https://www.formula1.com/en/latest/article/circuit-guide-everything-you-need-to-know-about-silverstone-2026.5Sl0O8g393enBWVIkjRzOr"}, "laps": "52", "raceDistance": "306.198 km", "lapRecord": "1:27.097", "lapRecordHolder": "Max Verstappen (2020)", "firstGrandPrix": "1950", "fact": "Silverstone hosted the first-ever round of the Formula 1 World Championship on May 13, 1950. Giuseppe Farina won it in an Alfa Romeo 158.", "event": "Formula 1 Pirelli British Grand Prix 2026", "source": {"title": "formula1.com", "url": "https://www.formula1.com/en/racing/2026/great-britain"}, "checked": "2026-11-12"},
      lat: 52.0710, lng: -1.0160, series: ["formula-1", "motogp", "wec"], type: "permanent",
      summary: "The home of the British Grand Prix and the venue of the first Formula One World Championship race in 1950.",
      body: [
        "Silverstone sits near the villages of Silverstone and Whittlebury in Northamptonshire, England. It first hosted the British Grand Prix in 1948, and in 1950 it held the very first race of the new World Championship.",
        "The British Grand Prix rotated between Silverstone, Aintree, and Brands Hatch from 1955 to 1986 before settling at Silverstone for good in 1987. The circuit has also hosted the British round of MotoGP."
      ],
      facts: [{ label: "First British GP", value: "1948" }, { label: "First World Championship race", value: "1950" }],
      related: { terms: ["grand-prix"] },
      sources: [wiki("Silverstone_Circuit"), f1Circuit("great-britain", "British Grand Prix circuit page"), racingCircuits("europe/united-kingdom/silverstone.html", "Silverstone")] },

    { id: "monza", name: "Autodromo Nazionale Monza", shortName: "Monza", country: "Italy",
      lat: 45.6206, lng: 9.2894, series: ["formula-1", "wec"], type: "permanent",
      summary: "The \"Temple of Speed\": a 1922 circuit in a royal park near Milan, famous for long straights and fast corners.",
      body: [
        "Built in 1922 in the park of the Royal Villa of Monza, north of Milan, Monza was the world's fourth purpose-built racing circuit and the oldest in mainland Europe. The Grand Prix track is 5.793 km (3.600 mi) long, and the site also holds an old high-speed oval with steep banking that was restored in the 2010s.",
        "The Italian Grand Prix has been held here every year since 1949 except 1980. Look for the long straights broken up by chicanes, and for named corners such as the Curva Grande, Lesmo, Variante Ascari, and the Curva Alboreto (formerly Parabolica)."
      ],
      facts: [{ label: "Built", value: "1922" }, { label: "Length", value: "5.793 km" }, { label: "Nickname", value: "Temple of Speed" }],
      related: { terms: ["chicane", "banking", "drafting"] },
      sources: [wiki("Monza_Circuit"), f1Circuit("italy", "Italian Grand Prix circuit page"), F1_GLOSSARY_PT, racingCircuits("europe/italy/monza.html", "Monza")] },

    { id: "spa", name: "Circuit de Spa-Francorchamps", shortName: "Spa", country: "Belgium",
      lat: 50.4372, lng: 5.9714, series: ["formula-1", "wec"], type: "permanent",
      summary: "A long, fast circuit in the Belgian Ardennes that hosted its first Grand Prix in 1925.",
      body: [
        "Spa-Francorchamps, usually called Spa, is a 7.004 km (4.352 mi) circuit in Francorchamps, about 8 km southeast of the town of Spa. It hosted its first Grand Prix in 1925 and was part of the first Formula One season in 1950.",
        "Until 1979 the track used about 14 km of public roads. It was then shortened and rebuilt as a permanent circuit for safety. Beyond Formula One, Spa has hosted the 24 Hours of Spa and the World Endurance Championship's 6 Hours of Spa-Francorchamps."
      ],
      facts: [{ label: "First Grand Prix", value: "1925" }, { label: "Length", value: "7.004 km" }],
      related: { terms: ["endurance-racing"] },
      photo: "track-spa",
      sources: [wiki("Circuit_de_Spa-Francorchamps"), racingCircuits("europe/belgium/spa-francorchamps.html", "Spa-Francorchamps")] },

    { id: "suzuka", name: "Suzuka Circuit", shortName: "Suzuka", country: "Japan",
      map: "map-suzuka",
      detail: {"turns": "18", "turnsSource": {"title": "suzukacircuit.jp course guide (4-wheel course)", "url": "https://www.suzukacircuit.jp/eng/course_s/"}, "laps": "53", "raceDistance": "307.471 km", "lapRecord": "1:30.965", "lapRecordHolder": "Kimi Antonelli (2025)", "firstGrandPrix": "1987", "fact": "Suzuka was built in 1962 as Honda's own test track, designed by John Hugenholtz. Formula 1 first raced there in 1987.", "event": "Formula 1 Aramco Japanese Grand Prix 2026", "source": {"title": "formula1.com", "url": "https://www.formula1.com/en/racing/2026/japan"}, "checked": "2026-11-12", "mapNote": "The map was drawn in 2005 and prints its own length (5.8153 km). The official length today is 5.807 km (suzukacircuit.jp), which is the figure shown in the stats."},
      lat: 34.8417, lng: 136.5389, series: ["formula-1"], type: "permanent",
      summary: "A figure-of-eight circuit built as a Honda test track in 1962, where the back straight crosses over the front section.",
      body: [
        "Suzuka was designed in 1962 by John Hugenholtz as a test track for Honda. Its figure-of-eight layout is rare: the back straight passes over the front section on a bridge. The full circuit is 5.807 km (3.608 mi) long.",
        "Suzuka hosted its first Formula One Japanese Grand Prix in 1987. Watch the flowing esses after the first corner, then named corners such as Degner, the hairpin, Spoon, and the very fast 130R."
      ],
      facts: [{ label: "Designed", value: "1962" }, { label: "First F1 race", value: "1987" }, { label: "Length", value: "5.807 km" }],
      related: { terms: ["esses", "hairpin", "chicane"] },
      photo: "track-suzuka",
      sources: [wiki("Suzuka_International_Racing_Course"), f1Circuit("japan", "Japanese Grand Prix circuit page"), racingCircuits("asia/japan/suzuka.html", "Suzuka")] },

    { id: "interlagos", name: "Autódromo José Carlos Pace (Interlagos)", shortName: "Interlagos", country: "Brazil",
      lat: -23.7011, lng: -46.6972, series: ["formula-1", "wec"], type: "permanent",
      summary: "São Paulo's counterclockwise circuit, opened in 1940 and home to the Brazilian Grand Prix since 1973.",
      body: [
        "Better known as Interlagos, this 4.309 km (2.677 mi) circuit in São Paulo opened on 12 May 1940. In 1985 it was renamed in honor of Brazilian Formula One driver José Carlos Pace. Unusually, it runs counterclockwise.",
        "It first hosted the Brazilian Grand Prix in 1973. It has also hosted the World Endurance Championship from 2012 to 2014 and again from 2024, and Brazil's motorcycle Grand Prix in 1992."
      ],
      facts: [{ label: "Opened", value: "1940" }, { label: "First F1 race", value: "1973" }, { label: "Direction", value: "Counterclockwise" }],
      sources: [wiki("Interlagos_Circuit"), f1Circuit("brazil", "Sao Paulo Grand Prix circuit page"), racingCircuits("south-america/brazil/interlagos.html", "Interlagos")] },

    { id: "gilles-villeneuve", name: "Circuit Gilles Villeneuve", shortName: "Montreal", country: "Canada",
      lat: 45.5006, lng: -73.5225, series: ["formula-1"], type: "street",
      summary: "A 4.361 km circuit on Notre Dame Island in Montreal, the home of the Canadian Grand Prix.",
      body: [
        "Circuit Gilles Villeneuve is a 4.361 km (2.710 mi) track on Notre Dame Island in Montreal, Quebec. It is the venue of the Formula One Canadian Grand Prix.",
        "Over the years it has also hosted the World Sportscar Championship, Champ Car, and NASCAR's Nationwide and Pinty's series. In 2011 it held the Canadian Grand Prix that set the record for the longest race in Formula One history."
      ],
      facts: [{ label: "Length", value: "4.361 km" }],
      sources: [wiki("Circuit_Gilles_Villeneuve"), f1Circuit("canada", "Canadian Grand Prix circuit page"), racingCircuits("north-america/canada/circuit-gilles-villeneuve,-montreal.html", "Circuit Gilles Villeneuve")] },

    { id: "cota", name: "Circuit of the Americas", shortName: "COTA", country: "United States",
      lat: 30.1328, lng: -97.6411, series: ["formula-1", "motogp", "wec"], type: "permanent",
      summary: "The first circuit in the United States purpose-built for Formula One, in Austin, Texas.",
      body: [
        "The Circuit of the Americas, or COTA, is a 5.514 km (3.426 mi) track in Austin, Texas. First proposed in 2010, it was the first circuit in the United States built specifically for Formula One.",
        "The layout was drawn up by promoter Tavo Hellmund and 1993 motorcycle world champion Kevin Schwantz, with circuit designer Hermann Tilke. It has hosted the United States Grand Prix, MotoGP's Grand Prix of the Americas, World Endurance Championship rounds, and NASCAR."
      ],
      facts: [{ label: "Proposed", value: "2010" }, { label: "Length", value: "5.514 km" }],
      sources: [wiki("Circuit_of_the_Americas"), racingCircuits("north-america/usa/circuit-of-the-americas.html", "Circuit of the Americas")] },

    { id: "marina-bay", name: "Marina Bay Street Circuit", shortName: "Singapore", country: "Singapore",
      lat: 1.2914, lng: 103.8641, series: ["formula-1"], type: "street",
      summary: "A harborside street circuit in central Singapore, home of the Singapore Grand Prix since 2008.",
      body: [
        "This 4.927 km (3.061 mi) street circuit runs around Marina Bay in the center of Singapore, in a harborside setting often compared to Monaco. It was designed by KBR, adapting an earlier proposal by Hermann Tilke, and joined the Formula One calendar in 2008.",
        "The walls are close and the race is long and hot, so look for the safety car: every Singapore Grand Prix from 2008 to 2023 had at least one safety car period."
      ],
      facts: [{ label: "First F1 race", value: "2008" }, { label: "Length", value: "4.927 km" }],
      related: { terms: ["street-circuit", "safety-car"] },
      sources: [wiki("Marina_Bay_Street_Circuit"), f1Circuit("singapore", "Singapore Grand Prix circuit page"), racingCircuits("asia/singapore/marina-bay-singapore.html", "Singapore Marina Bay")] },

    { id: "red-bull-ring", name: "Red Bull Ring", country: "Austria",
      lat: 47.2197, lng: 14.7647, series: ["formula-1", "motogp"], type: "permanent",
      summary: "A hillside circuit in Spielberg that began as the Österreichring in 1970.",
      body: [
        "This 4.326 km (2.688 mi) circuit in Spielberg, Styria, opened as the Österreichring and hosted the Austrian Grand Prix every year from 1970 to 1987. It was later shortened and rebuilt as the A1-Ring, which hosted the race from 1997 to 2003.",
        "After a long rebuild, it reopened as the Red Bull Ring on 15 May 2011. Formula One returned in 2014 and MotoGP in 2016. In 2020 and 2021 it hosted two Grands Prix a year in both series."
      ],
      facts: [{ label: "First Austrian GP here", value: "1970" }, { label: "Reopened", value: "2011" }, { label: "Length", value: "4.326 km" }],
      sources: [wiki("Red_Bull_Ring"), f1Circuit("austria", "Austrian Grand Prix circuit page")] },

    { id: "albert-park", name: "Albert Park Circuit", shortName: "Melbourne", country: "Australia",
      lat: -37.8497, lng: 144.9683, series: ["formula-1"], type: "street",
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
      lat: 2.7606, lng: 101.7375, series: ["motogp", "formula-1"], type: "permanent",
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
      lat: 35.3717, lng: 138.9267, series: ["wec", "formula-1"], type: "permanent",
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
      lat: 26.0325, lng: 50.5106, series: ["formula-1", "wec"], type: "permanent",
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
      lat: 42.3370, lng: -76.9270, series: ["nascar", "indycar", "formula-1"], type: "permanent",
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
      photo: "track-laguna-seca",
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
})(window.PP.sources);
