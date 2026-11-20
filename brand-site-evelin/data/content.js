/*
 * Pace & Publish — all site content in one place.
 *
 * Every article below is taken from an approved Team B post in the
 * mk680-team-b repository (content/2026-4x-*.md). Facts, names and dates are
 * copied from those posts and their cited official sources. Nothing here was
 * written from memory. To add or change content, edit this file only; the
 * Home, News, Dashboard and Calendar pages all read from it.
 *
 * Article fields: id, series (F1 | MotoGP | NASCAR | WEC), title, date (ISO,
 * the date the post went out), summary, body, image, imageAlt, source,
 * sourceUrl, featured.
 * Event fields: id, series, name, circuit, location, date (ISO, first day),
 * dateEnd (ISO, last day, optional), source, sourceUrl.
 */
window.PP_CONTENT = {
  asOf: "2026-11-12",

  /* Fixed order, used everywhere (PRD 5.3: neutral ordering). */
  series: [
    /* image: a team results graphic for the series, chosen so it does not repeat a Featured image on Home (NASCAR has none,
       so it uses the team's generic "Lights Out" launch graphic). */
    { id: "F1", slug: "f1", name: "F1", label: "Formula 1", longName: "Formula 1",
      description: "Race results, race-week schedules and recaps.",
      image: "assets/images/week2-sun-results-roundup-1.png",
      photo: "f1-track",
      imageAlt: "Pace & Publish results graphic for the F1 United States Grand Prix, October 25." },
    { id: "MotoGP", slug: "motogp", name: "MotoGP", label: "MotoGP", longName: "MotoGP",
      description: "Grand Prix podiums and race-week schedules.",
      image: "assets/images/week1-sun-results-roundup-2.png",
      imageAlt: "Pace & Publish results graphic for the MotoGP Indonesian Grand Prix, October 11." },
    { id: "NASCAR", slug: "nascar", name: "NASCAR", label: "NASCAR", longName: "NASCAR",
      description: "Coverage starts once stories are verified on nascar.com.",
      image: "assets/images/ben-launch-1.png",
      photo: "nascar-bristol",
      imageAlt: "Pace & Publish launch graphic: five start lights and the words Lights Out." },
    { id: "WEC", slug: "wec", name: "WEC", label: "WEC", longName: "FIA World Endurance Championship",
      description: "Endurance race results and championship facts.",
      image: "assets/images/week1-sun-results-roundup-3.png",
      photo: "wec-spa",
      imageAlt: "Pace & Publish results graphic for the WEC 6 Hours of Barcelona, October 18." }
  ],

  /*
   * Explore the Circuits. Every value below comes from the official circuit
   * page on formula1.com (the F1 source in strategy/sources.md), checked on
   * November 12, 2026. Descriptions and facts are written in our own words.
   * Turn counts come from the formula1.com 2026 circuit guides (Monaco,
   * Silverstone) and the official Suzuka Circuit course guide, checked
   * November 12, 2026. A value of null means no verified source lists it; the
   * site shows a labeled "Content needed" placeholder.
   * Track maps and photos: Wikimedia Commons files approved by the student on
   * Nov 12, 2026, stored in assets/images/circuits/ with full credits below.
   */
  circuits: [
    {
      id: "monaco",
      name: "Circuit de Monaco",
      shortName: "Monaco",
      country: "Monaco",
      location: "Monaco",
      event: "Formula 1 Louis Vuitton Grand Prix de Monaco 2026",
      type: "Street circuit",
      length: "3.337 km",
      turns: "19",
      turnsSource: "formula1.com circuit guide",
      turnsSourceUrl: "https://www.formula1.com/en/latest/article/circuit-guide-everything-you-need-to-know-about-the-circuit-de-monaco.vFsmfGHr6RWyLFtxi58wi",
      firstGrandPrix: "1950",
      laps: "78",
      raceDistance: "260.286 km",
      lapRecord: "1:12.909",
      lapRecordHolder: "Lewis Hamilton (2021)",
      fact: "Racing first came to the streets of the Principality in 1929. The race was on the calendar in the first year of the Formula 1 World Championship, 1950, and has been on every calendar since 1955.",
      description: "A narrow, tight street circuit where precision matters on every lap and overtaking is rare.",
      trackMap: "assets/images/circuits/monaco-track.svg",
      trackMapAlt: "Track layout of the Circuit de Monaco with its 19 numbered corners, from Sainte Devote through Casino, the Tunnel, the Swimming Pool section and La Rascasse.",
      mapCredit: {"author": "Will Pittenger", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monte_Carlo_Formula_1_track_map.svg", "changes": "colors inverted for display"},
      photo: "assets/images/circuits/monaco.jpg",
      photoAlt: "Satellite view of Monte Carlo harbour and the streets that form the Circuit de Monaco, April 1, 2018.",
      photoCredit: {"author": "Planet Labs, Inc.", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Monaco,_April_1,_2018_SkySat_(cropped).jpg", "changes": "cropped for display"},
      source: "formula1.com",
      sourceUrl: "https://www.formula1.com/en/racing/2026/monaco",
      checked: "2026-11-12"
    },
    {
      id: "silverstone",
      name: "Silverstone Circuit",
      shortName: "Silverstone",
      country: "United Kingdom",
      location: "Northamptonshire",
      event: "Formula 1 Pirelli British Grand Prix 2026",
      type: "Circuit on a former airfield",
      length: "5.891 km",
      turns: "18",
      turnsSource: "formula1.com circuit guide",
      turnsSourceUrl: "https://www.formula1.com/en/latest/article/circuit-guide-everything-you-need-to-know-about-silverstone-2026.5Sl0O8g393enBWVIkjRzOr",
      firstGrandPrix: "1950",
      laps: "52",
      raceDistance: "306.198 km",
      lapRecord: "1:27.097",
      lapRecordHolder: "Max Verstappen (2020)",
      fact: "Silverstone hosted the first-ever round of the Formula 1 World Championship on May 13, 1950. Giuseppe Farina won it in an Alfa Romeo 158.",
      description: "Built on the perimeter roads of a former Royal Air Force airfield, it is one of the fastest tracks on the calendar, with the Maggotts, Becketts and Abbey corners among its best-known sections.",
      trackMap: "assets/images/circuits/silverstone-track.svg",
      trackMapAlt: "Track layout of Silverstone Circuit's Grand Prix configuration with its 18 numbered corners, including Copse, Maggotts, Becketts, Stowe and Club.",
      mapCredit: {"author": "AlexJ", "license": "CC0 1.0 (public domain)", "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Silverstone_2011.svg", "changes": "colors inverted for display"},
      photo: "assets/images/circuits/silverstone.jpg",
      photoAlt: "Satellite view of Silverstone Circuit and its surrounding fields, July 2, 2018.",
      photoCredit: {"author": "Planet Labs, Inc.", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Circuit,_July_2,_2018_SkySat_(cropped).jpg", "changes": "resized and cropped for display"},
      source: "formula1.com",
      sourceUrl: "https://www.formula1.com/en/racing/2026/great-britain",
      checked: "2026-11-12"
    },
    {
      id: "suzuka",
      name: "Suzuka International Racing Course",
      shortName: "Suzuka",
      country: "Japan",
      location: "Japan",
      event: "Formula 1 Aramco Japanese Grand Prix 2026",
      type: "Purpose-built test track with a crossover",
      length: "5.807 km",
      turns: "18",
      turnsSource: "suzukacircuit.jp course guide (4-wheel course)",
      turnsSourceUrl: "https://www.suzukacircuit.jp/eng/course_s/",
      firstGrandPrix: "1987",
      laps: "53",
      raceDistance: "307.471 km",
      lapRecord: "1:30.965",
      lapRecordHolder: "Kimi Antonelli (2025)",
      fact: "Suzuka was built in 1962 as Honda's own test track, designed by John Hugenholtz. Formula 1 first raced there in 1987.",
      description: "A high-speed track with a crossover, known for the 'S' Curves, the two Degner corners and 130R.",
      trackMap: "assets/images/circuits/suzuka-track.svg",
      trackMapAlt: "Track layout of the Suzuka International Racing Course with its crossover, showing its 18 numbered corners including the S Curves, Degner, the Hairpin, Spoon Curve and the Casio Triangle.",
      mapCredit: {"author": "Will Pittenger", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_circuit_map--2005.svg", "changes": "colors inverted for display; map drawn in 2005"},
      mapNote: "The map was drawn in 2005 and prints its own length (5.8153 km). The official length today is 5.807 km (suzukacircuit.jp), which is the figure shown in the stats.",
      photo: "assets/images/circuits/suzuka.jpg",
      photoAlt: "The Suzuka Circuit pit straight and grandstands seen from the main start-finish grandstand, September 21, 2024.",
      photoCredit: {"author": "BWard 1997", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_Circuit_21-09-2024.jpg", "changes": "resized and cropped for display"},
      source: "formula1.com",
      sourceUrl: "https://www.formula1.com/en/racing/2026/japan",
      checked: "2026-11-12"
    }
  ],

  /*
   * Photography (v7). Wikimedia Commons files approved by Evelin on Nov 18,
   * 2026, stored locally in assets/images/photos/. Every use shows its credit.
   * These are file photos: they illustrate a series, not the specific event
   * in a story, and their captions say so.
   */
  photos: {
      "f1-sparks": {
          "src": "assets/images/photos/f1-dutch-gp-2024-sparks.jpg",
          "alt": "A Formula 1 car throwing sparks from its floor on track at the 2024 Dutch Grand Prix.",
          "caption": "Mercedes-AMG Petronas, 2024 Dutch Grand Prix (file photo)",
          "author": "Steffen Prößdorf",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport,_Formel_1,_Großer_Preis_der_Niederlande_2024_STP_3829_by_Stepro.jpg",
          "changes": "resized and compressed"
      },
      "f1-track": {
          "src": "assets/images/photos/f1-dutch-gp-2024-track.jpg",
          "alt": "A Formula 1 car on track at the 2024 Dutch Grand Prix.",
          "caption": "2024 Dutch Grand Prix (file photo)",
          "author": "Steffen Prößdorf",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport,_Formel_1,_Großer_Preis_der_Niederlande_2024_STP_3908_by_Stepro.jpg",
          "changes": "resized and compressed"
      },
      "f1-tyres": {
          "src": "assets/images/photos/f1-dutch-gp-2024-tyres.jpg",
          "alt": "Formula 1 tyres in soft, medium and hard compounds stacked in the paddock.",
          "caption": "F1 tyres, 2024 Dutch Grand Prix (file photo)",
          "author": "Steffen Prößdorf",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport,_Formel_1,_Großer_Preis_der_Niederlande_2024_STP_3619_by_Stepro.jpg",
          "changes": "resized and compressed"
      },
      "wec-spa": {
          "src": "assets/images/photos/wec-spa-2024-start.jpg",
          "alt": "The Hypercar field running in a pack after the start of the 2024 6 Hours of Spa-Francorchamps.",
          "caption": "Hypercar field, 2024 6 Hours of Spa (file photo)",
          "author": "MarcelX42",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:2024_6_Hours_of_Spa-Francorchamps_(DSC08757).jpg",
          "changes": "resized and compressed"
      },
      "nascar-bristol": {
          "src": "assets/images/photos/nascar-bristol-2023-restart.jpg",
          "alt": "NASCAR stock cars bunched together on a restart at Bristol Motor Speedway.",
          "caption": "Restart at Bristol, 2023 (file photo)",
          "author": "Zach Catanzareti Photo",
          "license": "CC BY 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Restart_bristol_(52866799028).jpg",
          "changes": "resized and compressed"
      }
  },

  articles: [
    /* ---------------- F1 ---------------- */
    {
      id: "f1-001",
      series: "F1",
      title: "Verstappen, Leclerc and Antonelli on the Singapore Grand Prix podium",
      date: "2026-10-25",
      summary: "F1 race results from the Singapore Grand Prix at Marina Bay Street Circuit on October 11. Max Verstappen finished P1, Charles Leclerc P2 and Kimi Antonelli P3.",
      body: "Formula 1, Singapore Grand Prix at Marina Bay Street Circuit (October 11): P1 Max Verstappen (Oracle Red Bull Racing), P2 Charles Leclerc (Scuderia Ferrari HP), P3 Kimi Antonelli (Mercedes-AMG PETRONAS Formula One Team). Main race results only.",
      image: "assets/images/week1-sun-results-roundup-1.png",
      imageAlt: "Pace & Publish results slide. Formula 1 Singapore Grand Prix, October 11: 1 Max Verstappen, 2 Charles Leclerc, 3 Kimi Antonelli. Source formula1.com.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/results/2026/races/1296/singapore/race-result",
      featured: false
    },
    {
      id: "f1-002",
      series: "F1",
      title: "Four drivers did not finish the Singapore Grand Prix",
      date: "2026-10-26",
      summary: "Four Formula 1 drivers did not finish the Singapore Grand Prix on October 11, one of them after 7 laps. Charles Leclerc set the fastest lap.",
      body: "Did not finish, with laps completed: Gabriel Bortoleto (Audi Revolut F1 Team) 7, Franco Colapinto (BWT Alpine Formula One Team) 29, Lance Stroll (Aston Martin Aramco Formula One Team) 36, Alexander Albon (Atlassian Williams F1 Team) 59. Fastest lap: Charles Leclerc (Scuderia Ferrari HP), 1:35.202 on lap 41.",
      image: "assets/images/week1-mon-weekend-recap.png",
      imageAlt: "Pace & Publish recap. Formula 1 Singapore Grand Prix, October 11: four DNFs, fastest lap Charles Leclerc. WEC 6 Hours of Barcelona, October 18: fastest lap #7 Toyota Racing.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/results/2026/races/1296/singapore/race-result",
      featured: false
    },
    {
      id: "f1-003",
      series: "F1",
      title: "Race week: Formula 1 is in Mexico City for Round 19",
      date: "2026-10-28",
      summary: "Formula 1 races at Autódromo Hermanos Rodríguez in Mexico City for Round 19, October 30 to November 1, with 71 laps on Sunday.",
      body: "Formula 1 Gran Premio de la Ciudad de México, October 30 to November 1 (US Eastern). Fri Oct 30: Practice 1 1:30–2:30 PM, Practice 2 6:00–7:00 PM (EDT). Sat Oct 31: Practice 3 1:30–2:30 PM, Qualifying 5:00–6:00 PM (EDT). Sun Nov 1: Race 3:00–5:00 PM (EST). US clocks went back on Sunday, November 1, so Sunday's times were in EST.",
      image: "assets/images/week1-wed-race-preview.png",
      imageAlt: "Pace & Publish weekend preview. Formula 1 races at Autódromo Hermanos Rodríguez in Mexico City for Round 19, October 30 to November 1.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/racing/2026/mexico",
      featured: false
    },
    {
      id: "f1-004",
      series: "F1",
      title: "Antonelli, Leclerc and Verstappen on the United States Grand Prix podium",
      date: "2026-11-01",
      summary: "F1 race results from the United States Grand Prix at Circuit of The Americas in Austin on October 25. Three different teams shared the podium.",
      body: "Formula 1, United States Grand Prix (October 25): P1 Kimi Antonelli (Mercedes-AMG PETRONAS Formula One Team), P2 Charles Leclerc (Scuderia Ferrari HP), P3 Max Verstappen (Oracle Red Bull Racing).",
      image: "assets/images/week2-sun-results-roundup-1.png",
      imageAlt: "Pace & Publish F1 race results. Formula 1 United States Grand Prix at Circuit of The Americas, Austin, October 25: 1 Kimi Antonelli, 2 Charles Leclerc, 3 Max Verstappen. Source formula1.com.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/results/2026/races/1297/united-states/race-result",
      featured: false
    },
    {
      id: "f1-005",
      series: "F1",
      title: "Three drivers did not finish the United States Grand Prix",
      date: "2026-11-02",
      summary: "This F1 race recap from the United States Grand Prix (October 25) starts with three drivers who did not finish, one of them after 24 laps. All 22 cars started.",
      body: "Did not finish, with laps completed: Oliver Bearman (TGR Haas F1 Team) 24, Franco Colapinto (BWT Alpine Formula One Team) 35, Valtteri Bottas (Cadillac Formula 1 Team) 48. Did not start: none of the 22 cars. Fastest lap: Charles Leclerc (Scuderia Ferrari HP), 1:37.976 on lap 42.",
      image: "assets/images/week2-mon-weekend-recap.png",
      imageAlt: "Pace & Publish F1 race recap. Formula 1 United States Grand Prix, October 25: three DNFs, Oliver Bearman, Franco Colapinto and Valtteri Bottas; no DNS; fastest lap Charles Leclerc, 1:37.976.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/results/2026/races/1297/united-states/race-result",
      featured: false
    },
    {
      id: "f1-006",
      series: "F1",
      title: "Race week: F1 heads to Interlagos for the Grande Prêmio de São Paulo",
      date: "2026-11-04",
      summary: "F1 races at Autódromo José Carlos Pace (Interlagos), Brazil, for Round 20 of the season, November 6–8.",
      body: "F1: Formula 1 MSC Cruises Grande Prêmio de São Paulo, Round 20. Autódromo José Carlos Pace (Interlagos), Brazil. November 6–8.",
      image: "assets/images/week2-wed-race-preview.png",
      imageAlt: "Pace & Publish weekend preview. Formula 1 races at Autódromo José Carlos Pace (Interlagos) for the Grande Prêmio de São Paulo, and MotoGP races at Lusail International Circuit for the Grand Prix of Qatar, November 6 to 8.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/racing/2026/brazil",
      featured: false
    },
    {
      id: "f1-007",
      series: "F1",
      title: "Verstappen, Hamilton and Antonelli on the Mexico City Grand Prix podium",
      date: "2026-11-08",
      summary: "F1 race results from the Mexico City Grand Prix at Autódromo Hermanos Rodríguez on November 1: P1 Max Verstappen, P2 Lewis Hamilton, P3 Kimi Antonelli.",
      body: "Formula 1, Mexico City Grand Prix at Autódromo Hermanos Rodríguez (November 1): P1 Max Verstappen (Oracle Red Bull Racing), P2 Lewis Hamilton (Scuderia Ferrari HP), P3 Kimi Antonelli (Mercedes-AMG PETRONAS Formula One Team). Main race results only.",
      image: "assets/images/week3-sun-results-roundup-1.png",
      photo: "f1-tyres",
      imageAlt: "Pace & Publish F1 race results. Formula 1 Mexico City Grand Prix at Autódromo Hermanos Rodríguez, November 1: 1 Max Verstappen, 2 Lewis Hamilton, 3 Kimi Antonelli. Source formula1.com.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/results/2026/races/1298/mexico/race-result",
      featured: true
    },
    {
      id: "f1-008",
      series: "F1",
      title: "Five drivers did not finish the Mexico City Grand Prix",
      date: "2026-11-09",
      summary: "This F1 race recap from the Mexico City Grand Prix (November 1) starts with five drivers who did not finish, two of them after 5 laps. Lewis Hamilton set the fastest lap.",
      body: "Did not finish, with laps completed: Lance Stroll (Aston Martin Aramco Formula One Team) 5, Fernando Alonso (Aston Martin Aramco Formula One Team) 5, Valtteri Bottas (Cadillac Formula 1 Team) 42, Oliver Bearman (TGR Haas F1 Team) 47, Arvid Lindblad (Visa Cash App Racing Bulls Formula One Team) 58. Did not start: none of the 22 cars. Fastest lap: Lewis Hamilton (Scuderia Ferrari HP), 1:19.268 on lap 50.",
      image: "assets/images/week3-mon-weekend-recap.png",
      imageAlt: "Pace & Publish F1 race recap. Formula 1 Mexico City Grand Prix, November 1: five DNFs, Lance Stroll, Fernando Alonso, Valtteri Bottas, Oliver Bearman and Arvid Lindblad; no DNS; fastest lap Lewis Hamilton, 1:19.268.",
      source: "Pace & Publish (Team B), from formula1.com",
      sourceUrl: "https://www.formula1.com/en/results/2026/races/1298/mexico/race-result",
      featured: false
    },

    /* ---------------- MotoGP ---------------- */
    {
      id: "motogp-001",
      series: "MotoGP",
      title: "Bezzecchi, Fernandez and Martin on the Indonesian Grand Prix podium",
      date: "2026-10-25",
      summary: "MotoGP race results from the Indonesian Grand Prix at Mandalika on October 11: P1 Marco Bezzecchi, P2 Raul Fernandez, P3 Jorge Martin.",
      body: "MotoGP, Indonesian Grand Prix at Mandalika (October 9–11): P1 Marco Bezzecchi (Aprilia Racing), P2 Raul Fernandez (SuperFile Trackhouse MotoGP Team), P3 Jorge Martin (Aprilia Racing). Main race results only.",
      image: "assets/images/week1-sun-results-roundup-2.png",
      imageAlt: "Pace & Publish results slide. MotoGP Indonesian Grand Prix at Mandalika, October 9–11: 1 Marco Bezzecchi, 2 Raul Fernandez, 3 Jorge Martin. Source motogp.com.",
      source: "Pace & Publish (Team B), from motogp.com",
      sourceUrl: "https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850",
      featured: false
    },
    {
      id: "motogp-002",
      series: "MotoGP",
      title: "Race week: MotoGP heads to Lusail for the Grand Prix of Qatar",
      date: "2026-11-04",
      summary: "MotoGP races at Lusail International Circuit in Doha, Qatar, for the Qatar Airways Grand Prix of Qatar, November 6–8.",
      body: "MotoGP: Qatar Airways Grand Prix of Qatar. Lusail International Circuit, Doha, Qatar. November 6–8.",
      image: "assets/images/week2-wed-race-preview.png",
      imageAlt: "Pace & Publish weekend preview. Formula 1 races at Autódromo José Carlos Pace (Interlagos) for the Grande Prêmio de São Paulo, and MotoGP races at Lusail International Circuit for the Grand Prix of Qatar, November 6 to 8.",
      source: "Pace & Publish (Team B), from motogp.com",
      sourceUrl: "https://www.motogp.com/en/calendar/2026/event/qatar/3f3d3f5e-851c-42d2-887a-8ce8b41fa908",
      featured: false
    },
    {
      id: "motogp-003",
      series: "MotoGP",
      title: "Two riders named Marquez share the Grand Prix of Malaysia podium",
      date: "2026-11-08",
      summary: "MotoGP race results from the Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit on November 1: P1 Marc Marquez, P2 Pedro Acosta, P3 Alex Marquez.",
      body: "MotoGP, Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit (November 1): P1 Marc Marquez (Ducati Lenovo Team), P2 Pedro Acosta (Red Bull KTM Factory Racing), P3 Alex Marquez (BK8 Gresini Racing MotoGP). Main race results only; the Sprint is not covered.",
      image: "assets/images/week3-sun-results-roundup-2.png",
      imageAlt: "Pace & Publish MotoGP race results. Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit, November 1: 1 Marc Marquez, 2 Pedro Acosta, 3 Alex Marquez. Source motogp.com.",
      source: "Pace & Publish (Team B), from motogp.com",
      sourceUrl: "https://www.motogp.com/en/news/2026/11/01/masterclass-marc-marquez-marches-to-malaysia-victory-to-earn-2026-match-point/1179524",
      featured: true
    },

    /* ---------------- NASCAR ----------------
     * No NASCAR article exists in the team repository: nascar.com could not
     * be opened to verify any race (strategy/calendar-2026-45.md). The site
     * shows a labeled "Content needed: NASCAR story" message instead.
     */

    /* ---------------- WEC ---------------- */
    {
      id: "wec-001",
      series: "WEC",
      title: "Toyota Racing takes P1 and P2 at the 6 Hours of Barcelona",
      date: "2026-10-25",
      summary: "WEC overall race results from the 6 Hours of Barcelona on October 18: P1 #8 Toyota Racing, P2 #7 Toyota Racing, P3 #50 Ferrari AF Corse.",
      body: "WEC, 6 Hours of Barcelona (October 18), overall: P1 #8 Toyota Racing, P2 #7 Toyota Racing, P3 #50 Ferrari AF Corse. The official classification names cars by team and number, not crew.",
      image: "assets/images/week1-sun-results-roundup-3.png",
      imageAlt: "Pace & Publish results slide. WEC 6 Hours of Barcelona, October 18, overall: 1 #8 Toyota Racing, 2 #7 Toyota Racing, 3 #50 Ferrari AF Corse. Source fiawec.com.",
      source: "Pace & Publish (Team B), from fiawec.com",
      sourceUrl: "https://www.fiawec.com/en/race/summary/5065",
      featured: false
    },
    {
      id: "wec-002",
      series: "WEC",
      title: "#7 Toyota Racing sets the fastest lap at the 6 Hours of Barcelona",
      date: "2026-10-26",
      summary: "The #7 Toyota Racing car set the fastest lap of the 6 Hours of Barcelona on October 18: 1:32.379 on lap 125.",
      body: "WEC, 6 Hours of Barcelona (October 18). Fastest lap: #7 Toyota Racing, 1:32.379 on lap 125. The official pages name the car, not the driver.",
      image: "assets/images/week1-mon-weekend-recap.png",
      imageAlt: "Pace & Publish recap. Formula 1 Singapore Grand Prix, October 11: four DNFs, fastest lap Charles Leclerc. WEC 6 Hours of Barcelona, October 18: fastest lap #7 Toyota Racing.",
      source: "Pace & Publish (Team B), from fiawec.com",
      sourceUrl: "https://www.fiawec.com/en/race/summary/5065",
      featured: false
    },
    {
      id: "wec-003",
      series: "WEC",
      title: "WEC fun fact: Bronze-rated drivers can't race in the Hypercar class",
      date: "2026-11-11",
      summary: "The FIA rates every WEC driver Platinum, Gold, Silver or Bronze. Bronze-rated drivers cannot race in Hypercar, but every LMGT3 crew must include one.",
      body: "This WEC fun fact is about driver ratings in the FIA World Endurance Championship. The FIA rates every driver Platinum, Gold, Silver or Bronze. Bronze-rated drivers are not allowed to race in the Hypercar class, but every LMGT3 crew must include at least one Bronze driver.",
      image: "assets/images/week3-wed-fun-fact.png",
      imageAlt: "Pace & Publish fun fact about the FIA World Endurance Championship (WEC): Bronze-rated drivers cannot race in the Hypercar class, but every LMGT3 crew must include at least one Bronze driver.",
      source: "Pace & Publish (Team B), from fiawec.com",
      sourceUrl: "https://www.fiawec.com/en/page/le-wec-cest-quoi-1",
      featured: true
    }
  ],

  /*
   * Race Calendar. Only events already verified in the team repository
   * (strategy/calendar-2026-43.md to calendar-2026-45.md and the approved
   * content files). "circuit: null" means the repository does not name the
   * circuit; the page shows a labeled placeholder.
   */
  events: [
    { id: "ev-f1-sgp", series: "F1", name: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", location: "Singapore", date: "2026-10-11", source: "formula1.com", sourceUrl: "https://www.formula1.com/en/racing/2026/singapore" },
    { id: "ev-motogp-ina", series: "MotoGP", name: "Indonesian Grand Prix", circuit: "Mandalika", location: "Indonesia", date: "2026-10-09", dateEnd: "2026-10-11", source: "motogp.com", sourceUrl: "https://www.motogp.com/en/calendar" },
    { id: "ev-wec-bcn", series: "WEC", name: "6 Hours of Barcelona", circuit: null, location: "Barcelona", date: "2026-10-16", dateEnd: "2026-10-18", source: "fiawec.com", sourceUrl: "https://www.fiawec.com/en/race/6-hours-of-barcelona-2026" },
    { id: "ev-f1-usa", series: "F1", name: "United States Grand Prix", circuit: "Circuit of The Americas", location: "Austin", date: "2026-10-25", source: "formula1.com", sourceUrl: "https://www.formula1.com/en/racing/2026/united-states" },
    { id: "ev-f1-mex", series: "F1", name: "Formula 1 Gran Premio de la Ciudad de México 2026", circuit: "Autódromo Hermanos Rodríguez", location: "Mexico City", date: "2026-10-30", dateEnd: "2026-11-01", source: "formula1.com", sourceUrl: "https://www.formula1.com/en/racing/2026/mexico" },
    { id: "ev-motogp-mal", series: "MotoGP", name: "Petronas Grand Prix of Malaysia", circuit: "Petronas Sepang International Circuit", location: "Malaysia", date: "2026-10-30", dateEnd: "2026-11-01", source: "motogp.com", sourceUrl: "https://www.motogp.com/en/calendar/2026/event/malaysia/d1aedfce-d7c8-4d4a-9532-99c82547baad" },
    { id: "ev-f1-bra", series: "F1", name: "Formula 1 MSC Cruises Grande Prêmio de São Paulo 2026", circuit: "Autódromo José Carlos Pace (Interlagos)", location: "Brazil", date: "2026-11-06", dateEnd: "2026-11-08", source: "formula1.com", sourceUrl: "https://www.formula1.com/en/racing/2026/brazil" },
    { id: "ev-motogp-qat", series: "MotoGP", name: "Qatar Airways Grand Prix of Qatar", circuit: "Lusail International Circuit", location: "Doha, Qatar", date: "2026-11-06", dateEnd: "2026-11-08", source: "motogp.com", sourceUrl: "https://www.motogp.com/en/calendar/2026/event/qatar/3f3d3f5e-851c-42d2-887a-8ce8b41fa908" },
    { id: "ev-wec-monza", series: "WEC", name: "6 Hours of Monza 2026", circuit: null, location: "Monza", date: "2026-11-06", dateEnd: "2026-11-08", source: "fiawec.com", sourceUrl: "https://www.fiawec.com/en/race/6-hours-of-monza-2026" },
    { id: "ev-f1-lv", series: "F1", name: "Las Vegas", circuit: null, location: "Las Vegas", date: "2026-11-19", dateEnd: "2026-11-21", source: "formula1.com", sourceUrl: "https://www.formula1.com/en/racing/2026" },
    { id: "ev-motogp-por", series: "MotoGP", name: "Portugal", circuit: null, location: "Portugal", date: "2026-11-20", dateEnd: "2026-11-22", source: "motogp.com", sourceUrl: "https://www.motogp.com/en/calendar" },
    { id: "ev-motogp-val", series: "MotoGP", name: "Valencia", circuit: null, location: "Valencia", date: "2026-11-27", dateEnd: "2026-11-29", source: "motogp.com", sourceUrl: "https://www.motogp.com/en/calendar" },
    { id: "ev-wec-qat", series: "WEC", name: "Qatar 1812km", circuit: null, location: "Qatar", date: "2027-03-25", dateEnd: "2027-03-27", source: "fiawec.com", sourceUrl: "https://www.fiawec.com/en/race/6-hours-of-monza-2026" }
  ],

  /* Instagram highlight: Team B launch posts (content/launch.md, approved). */
  instagram: {
    handle: "@paceandpublish",
    url: "https://www.instagram.com/paceandpublish/",
    posts: [
      {
        image: "assets/images/miranda-launch-1.png",
        imageAlt: "Text graphic on an asphalt background: \"Every series. One feed.\" in white, with a thin green line underneath and the Pace & Publish wordmark.",
        caption: "F1, MotoGP, WEC and more, all in one feed. Pace & Publish brings the news from several motorsport series together, written in our own words and built on confirmed facts only."
      },
      {
        image: "assets/images/miranda-launch-2.png",
        imageAlt: "Text graphic on an asphalt background with a green sunrise icon and the word \"Morning\" in white, slide 1 of 3.",
        caption: "Missed a session overnight or during the workday? Pace & Publish is for fans who follow more than one series and catch up first thing in the morning or after work."
      },
      {
        image: "assets/images/miranda-launch-3.png",
        imageAlt: "Text graphic on an asphalt background: \"The results roundup\" in white above three green numbered boxes, 1, 2 and 3, beside empty podium bars.",
        caption: "Every podium from every series that raced over the weekend, in one post. That's the results roundup, our first regular feature."
      }
    ]
  }
};
