/* =====================================================================
   Pace & Publish data: team news stories (hand-written).
   ---------------------------------------------------------------------
   Stories the team wrote from its approved Instagram posts (Weeks 1-3).
   Merged from Evelin's 14 articles (text) and Sanith's 10 (story types and
   podium data). Official-source headlines are separate: data/generated/headlines.js.

   Newest first is not required: pages sort by date.
   TEMPLATE:
   {
     id: "f1-009",                       // unique, lowercase-hyphen; never change once published
     date: "2026-11-16",                 // the day the team post went out
     series: ["formula-1"],              // ids from data/series.js (one or more)
     type: "results",                    // results | recap | preview | feature
     title: "Headline in our own words",
     summary: "One or two sentences for cards.",
     body: ["Paragraph.", "Paragraph."], // shown when a reader opens the story
     podium: [{ pos: 1, name: "Driver", team: "Team" }],   // optional, results only
     source: { site: "formula1.com", url: "https://..." }, // the official page the facts come from
     graphic: "assets/images/team/week4-sun-results-roundup-1.png",  // optional: our Instagram graphic
     graphicAlt: "Text on the graphic, for screen readers.",
     photo: "f1-zandvoort-2024-sparks",  // optional: photo id from data/photos.js; default is the series photo
     featured: true                      // optional: lead story on Home
   },
   ===================================================================== */
window.PP = window.PP || {};
window.PP.news = [
  {
    "id": "wec-003",
    "date": "2026-11-11",
    "series": [
      "wec"
    ],
    "type": "feature",
    "title": "WEC fun fact: Bronze-rated drivers can't race in the Hypercar class",
    "summary": "The FIA rates every WEC driver Platinum, Gold, Silver or Bronze. Bronze-rated drivers cannot race in Hypercar, but every LMGT3 crew must include one.",
    "body": [
      "This WEC fun fact is about driver ratings in the FIA World Endurance Championship. The FIA rates every driver Platinum, Gold, Silver or Bronze. Bronze-rated drivers are not allowed to race in the Hypercar class, but every LMGT3 crew must include at least one Bronze driver."
    ],
    "source": {
      "site": "fiawec.com",
      "url": "https://www.fiawec.com/en/page/le-wec-cest-quoi-1"
    },
    "graphic": "assets/images/team/week3-wed-fun-fact.png",
    "graphicAlt": "Pace & Publish fun fact about the FIA World Endurance Championship (WEC): Bronze-rated drivers cannot race in the Hypercar class, but every LMGT3 crew must include at least one Bronze driver.",
    "featured": true
  },
  {
    "id": "f1-008",
    "date": "2026-11-09",
    "series": [
      "formula-1"
    ],
    "type": "recap",
    "title": "Five drivers did not finish the Mexico City Grand Prix",
    "summary": "This F1 race recap from the Mexico City Grand Prix (November 1) starts with five drivers who did not finish, two of them after 5 laps. Lewis Hamilton set the fastest lap.",
    "body": [
      "Did not finish, with laps completed: Lance Stroll (Aston Martin Aramco Formula One Team) 5, Fernando Alonso (Aston Martin Aramco Formula One Team) 5, Valtteri Bottas (Cadillac Formula 1 Team) 42, Oliver Bearman (TGR Haas F1 Team) 47, Arvid Lindblad (Visa Cash App Racing Bulls Formula One Team) 58. Did not start: none of the 22 cars. Fastest lap: Lewis Hamilton (Scuderia Ferrari HP), 1:19.268 on lap 50."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/results/2026/races/1298/mexico/race-result"
    },
    "graphic": "assets/images/team/week3-mon-weekend-recap.png",
    "graphicAlt": "Pace & Publish F1 race recap. Formula 1 Mexico City Grand Prix, November 1: five DNFs, Lance Stroll, Fernando Alonso, Valtteri Bottas, Oliver Bearman and Arvid Lindblad; no DNS; fastest lap Lewis Hamilton, 1:19.268."
  },
  {
    "id": "motogp-003",
    "date": "2026-11-08",
    "series": [
      "motogp"
    ],
    "type": "results",
    "title": "Two riders named Marquez share the Grand Prix of Malaysia podium",
    "summary": "MotoGP race results from the Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit on November 1: P1 Marc Marquez, P2 Pedro Acosta, P3 Alex Marquez.",
    "body": [
      "MotoGP, Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit (November 1): P1 Marc Marquez (Ducati Lenovo Team), P2 Pedro Acosta (Red Bull KTM Factory Racing), P3 Alex Marquez (BK8 Gresini Racing MotoGP). Main race results only; the Sprint is not covered."
    ],
    "source": {
      "site": "motogp.com",
      "url": "https://www.motogp.com/en/news/2026/11/01/masterclass-marc-marquez-marches-to-malaysia-victory-to-earn-2026-match-point/1179524"
    },
    "graphic": "assets/images/team/week3-sun-results-roundup-2.png",
    "graphicAlt": "Pace & Publish MotoGP race results. Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit, November 1: 1 Marc Marquez, 2 Pedro Acosta, 3 Alex Marquez. Source motogp.com.",
    "podium": [
      {
        "pos": 1,
        "name": "Marc Marquez",
        "team": "Ducati Lenovo Team"
      },
      {
        "pos": 2,
        "name": "Pedro Acosta",
        "team": "Red Bull KTM Factory Racing"
      },
      {
        "pos": 3,
        "name": "Alex Marquez",
        "team": "BK8 Gresini Racing MotoGP"
      }
    ],
    "featured": true
  },
  {
    "id": "f1-007",
    "date": "2026-11-08",
    "series": [
      "formula-1"
    ],
    "type": "results",
    "title": "Verstappen, Hamilton and Antonelli on the Mexico City Grand Prix podium",
    "summary": "F1 race results from the Mexico City Grand Prix at Autódromo Hermanos Rodríguez on November 1: P1 Max Verstappen, P2 Lewis Hamilton, P3 Kimi Antonelli.",
    "body": [
      "Formula 1, Mexico City Grand Prix at Autódromo Hermanos Rodríguez (November 1): P1 Max Verstappen (Oracle Red Bull Racing), P2 Lewis Hamilton (Scuderia Ferrari HP), P3 Kimi Antonelli (Mercedes-AMG PETRONAS Formula One Team). Main race results only."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/results/2026/races/1298/mexico/race-result"
    },
    "graphic": "assets/images/team/week3-sun-results-roundup-1.png",
    "graphicAlt": "Pace & Publish F1 race results. Formula 1 Mexico City Grand Prix at Autódromo Hermanos Rodríguez, November 1: 1 Max Verstappen, 2 Lewis Hamilton, 3 Kimi Antonelli. Source formula1.com.",
    "podium": [
      {
        "pos": 1,
        "name": "Max Verstappen",
        "team": "Oracle Red Bull Racing"
      },
      {
        "pos": 2,
        "name": "Lewis Hamilton",
        "team": "Scuderia Ferrari HP"
      },
      {
        "pos": 3,
        "name": "Kimi Antonelli",
        "team": "Mercedes-AMG PETRONAS Formula One Team"
      }
    ],
    "featured": true
  },
  {
    "id": "motogp-002",
    "date": "2026-11-04",
    "series": [
      "motogp"
    ],
    "type": "preview",
    "title": "Race week: MotoGP heads to Lusail for the Grand Prix of Qatar",
    "summary": "MotoGP races at Lusail International Circuit in Doha, Qatar, for the Qatar Airways Grand Prix of Qatar, November 6–8.",
    "body": [
      "MotoGP: Qatar Airways Grand Prix of Qatar. Lusail International Circuit, Doha, Qatar. November 6–8."
    ],
    "source": {
      "site": "motogp.com",
      "url": "https://www.motogp.com/en/calendar/2026/event/qatar/3f3d3f5e-851c-42d2-887a-8ce8b41fa908"
    },
    "graphic": "assets/images/team/week2-wed-race-preview.png",
    "graphicAlt": "Pace & Publish weekend preview. Formula 1 races at Autódromo José Carlos Pace (Interlagos) for the Grande Prêmio de São Paulo, and MotoGP races at Lusail International Circuit for the Grand Prix of Qatar, November 6 to 8."
  },
  {
    "id": "f1-006",
    "date": "2026-11-04",
    "series": [
      "formula-1"
    ],
    "type": "preview",
    "title": "Race week: F1 heads to Interlagos for the Grande Prêmio de São Paulo",
    "summary": "F1 races at Autódromo José Carlos Pace (Interlagos), Brazil, for Round 20 of the season, November 6–8.",
    "body": [
      "F1: Formula 1 MSC Cruises Grande Prêmio de São Paulo, Round 20. Autódromo José Carlos Pace (Interlagos), Brazil. November 6–8."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/racing/2026/brazil"
    },
    "graphic": "assets/images/team/week2-wed-race-preview.png",
    "graphicAlt": "Pace & Publish weekend preview. Formula 1 races at Autódromo José Carlos Pace (Interlagos) for the Grande Prêmio de São Paulo, and MotoGP races at Lusail International Circuit for the Grand Prix of Qatar, November 6 to 8."
  },
  {
    "id": "f1-005",
    "date": "2026-11-02",
    "series": [
      "formula-1"
    ],
    "type": "recap",
    "title": "Three drivers did not finish the United States Grand Prix",
    "summary": "This F1 race recap from the United States Grand Prix (October 25) starts with three drivers who did not finish, one of them after 24 laps. All 22 cars started.",
    "body": [
      "Did not finish, with laps completed: Oliver Bearman (TGR Haas F1 Team) 24, Franco Colapinto (BWT Alpine Formula One Team) 35, Valtteri Bottas (Cadillac Formula 1 Team) 48. Did not start: none of the 22 cars. Fastest lap: Charles Leclerc (Scuderia Ferrari HP), 1:37.976 on lap 42."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/results/2026/races/1297/united-states/race-result"
    },
    "graphic": "assets/images/team/week2-mon-weekend-recap.png",
    "graphicAlt": "Pace & Publish F1 race recap. Formula 1 United States Grand Prix, October 25: three DNFs, Oliver Bearman, Franco Colapinto and Valtteri Bottas; no DNS; fastest lap Charles Leclerc, 1:37.976."
  },
  {
    "id": "f1-004",
    "date": "2026-11-01",
    "series": [
      "formula-1"
    ],
    "type": "results",
    "title": "Antonelli, Leclerc and Verstappen on the United States Grand Prix podium",
    "summary": "F1 race results from the United States Grand Prix at Circuit of The Americas in Austin on October 25. Three different teams shared the podium.",
    "body": [
      "Formula 1, United States Grand Prix (October 25): P1 Kimi Antonelli (Mercedes-AMG PETRONAS Formula One Team), P2 Charles Leclerc (Scuderia Ferrari HP), P3 Max Verstappen (Oracle Red Bull Racing)."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/results/2026/races/1297/united-states/race-result"
    },
    "graphic": "assets/images/team/week2-sun-results-roundup-1.png",
    "graphicAlt": "Pace & Publish F1 race results. Formula 1 United States Grand Prix at Circuit of The Americas, Austin, October 25: 1 Kimi Antonelli, 2 Charles Leclerc, 3 Max Verstappen. Source formula1.com.",
    "podium": [
      {
        "pos": 1,
        "name": "Kimi Antonelli",
        "team": "Mercedes-AMG PETRONAS Formula One Team"
      },
      {
        "pos": 2,
        "name": "Charles Leclerc",
        "team": "Scuderia Ferrari HP"
      },
      {
        "pos": 3,
        "name": "Max Verstappen",
        "team": "Oracle Red Bull Racing"
      }
    ]
  },
  {
    "id": "f1-003",
    "date": "2026-10-28",
    "series": [
      "formula-1"
    ],
    "type": "preview",
    "title": "Race week: Formula 1 is in Mexico City for Round 19",
    "summary": "Formula 1 races at Autódromo Hermanos Rodríguez in Mexico City for Round 19, October 30 to November 1, with 71 laps on Sunday.",
    "body": [
      "Formula 1 Gran Premio de la Ciudad de México, October 30 to November 1 (US Eastern). Fri Oct 30: Practice 1 1:30–2:30 PM, Practice 2 6:00–7:00 PM (EDT). Sat Oct 31: Practice 3 1:30–2:30 PM, Qualifying 5:00–6:00 PM (EDT). Sun Nov 1: Race 3:00–5:00 PM (EST). US clocks went back on Sunday, November 1, so Sunday's times were in EST."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/racing/2026/mexico"
    },
    "graphic": "assets/images/team/week1-wed-race-preview.png",
    "graphicAlt": "Pace & Publish weekend preview. Formula 1 races at Autódromo Hermanos Rodríguez in Mexico City for Round 19, October 30 to November 1."
  },
  {
    "id": "wec-002",
    "date": "2026-10-26",
    "series": [
      "wec"
    ],
    "type": "recap",
    "title": "#7 Toyota Racing sets the fastest lap at the 6 Hours of Barcelona",
    "summary": "The #7 Toyota Racing car set the fastest lap of the 6 Hours of Barcelona on October 18: 1:32.379 on lap 125.",
    "body": [
      "WEC, 6 Hours of Barcelona (October 18). Fastest lap: #7 Toyota Racing, 1:32.379 on lap 125. The official pages name the car, not the driver."
    ],
    "source": {
      "site": "fiawec.com",
      "url": "https://www.fiawec.com/en/race/summary/5065"
    },
    "graphic": "assets/images/team/week1-mon-weekend-recap.png",
    "graphicAlt": "Pace & Publish recap. Formula 1 Singapore Grand Prix, October 11: four DNFs, fastest lap Charles Leclerc. WEC 6 Hours of Barcelona, October 18: fastest lap #7 Toyota Racing."
  },
  {
    "id": "f1-002",
    "date": "2026-10-26",
    "series": [
      "formula-1"
    ],
    "type": "recap",
    "title": "Four drivers did not finish the Singapore Grand Prix",
    "summary": "Four Formula 1 drivers did not finish the Singapore Grand Prix on October 11, one of them after 7 laps. Charles Leclerc set the fastest lap.",
    "body": [
      "Did not finish, with laps completed: Gabriel Bortoleto (Audi Revolut F1 Team) 7, Franco Colapinto (BWT Alpine Formula One Team) 29, Lance Stroll (Aston Martin Aramco Formula One Team) 36, Alexander Albon (Atlassian Williams F1 Team) 59. Fastest lap: Charles Leclerc (Scuderia Ferrari HP), 1:35.202 on lap 41."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/results/2026/races/1296/singapore/race-result"
    },
    "graphic": "assets/images/team/week1-mon-weekend-recap.png",
    "graphicAlt": "Pace & Publish recap. Formula 1 Singapore Grand Prix, October 11: four DNFs, fastest lap Charles Leclerc. WEC 6 Hours of Barcelona, October 18: fastest lap #7 Toyota Racing."
  },
  {
    "id": "wec-001",
    "date": "2026-10-25",
    "series": [
      "wec"
    ],
    "type": "results",
    "title": "Toyota Racing takes P1 and P2 at the 6 Hours of Barcelona",
    "summary": "WEC overall race results from the 6 Hours of Barcelona on October 18: P1 #8 Toyota Racing, P2 #7 Toyota Racing, P3 #50 Ferrari AF Corse.",
    "body": [
      "WEC, 6 Hours of Barcelona (October 18), overall: P1 #8 Toyota Racing, P2 #7 Toyota Racing, P3 #50 Ferrari AF Corse. The official classification names cars by team and number, not crew."
    ],
    "source": {
      "site": "fiawec.com",
      "url": "https://www.fiawec.com/en/race/summary/5065"
    },
    "graphic": "assets/images/team/week1-sun-results-roundup-3.png",
    "graphicAlt": "Pace & Publish results slide. WEC 6 Hours of Barcelona, October 18, overall: 1 #8 Toyota Racing, 2 #7 Toyota Racing, 3 #50 Ferrari AF Corse. Source fiawec.com.",
    "podium": [
      {
        "pos": 1,
        "name": "#8",
        "team": "Toyota Racing"
      },
      {
        "pos": 2,
        "name": "#7",
        "team": "Toyota Racing"
      },
      {
        "pos": 3,
        "name": "#50",
        "team": "Ferrari AF Corse"
      }
    ]
  },
  {
    "id": "motogp-001",
    "date": "2026-10-25",
    "series": [
      "motogp"
    ],
    "type": "results",
    "title": "Bezzecchi, Fernandez and Martin on the Indonesian Grand Prix podium",
    "summary": "MotoGP race results from the Indonesian Grand Prix at Mandalika on October 11: P1 Marco Bezzecchi, P2 Raul Fernandez, P3 Jorge Martin.",
    "body": [
      "MotoGP, Indonesian Grand Prix at Mandalika (October 9–11): P1 Marco Bezzecchi (Aprilia Racing), P2 Raul Fernandez (SuperFile Trackhouse MotoGP Team), P3 Jorge Martin (Aprilia Racing). Main race results only."
    ],
    "source": {
      "site": "motogp.com",
      "url": "https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850"
    },
    "graphic": "assets/images/team/week1-sun-results-roundup-2.png",
    "graphicAlt": "Pace & Publish results slide. MotoGP Indonesian Grand Prix at Mandalika, October 9–11: 1 Marco Bezzecchi, 2 Raul Fernandez, 3 Jorge Martin. Source motogp.com.",
    "podium": [
      {
        "pos": 1,
        "name": "Marco Bezzecchi",
        "team": "Aprilia Racing"
      },
      {
        "pos": 2,
        "name": "Raul Fernandez",
        "team": "SuperFile Trackhouse MotoGP Team"
      },
      {
        "pos": 3,
        "name": "Jorge Martin",
        "team": "Aprilia Racing"
      }
    ]
  },
  {
    "id": "f1-001",
    "date": "2026-10-25",
    "series": [
      "formula-1"
    ],
    "type": "results",
    "title": "Verstappen, Leclerc and Antonelli on the Singapore Grand Prix podium",
    "summary": "F1 race results from the Singapore Grand Prix at Marina Bay Street Circuit on October 11. Max Verstappen finished P1, Charles Leclerc P2 and Kimi Antonelli P3.",
    "body": [
      "Formula 1, Singapore Grand Prix at Marina Bay Street Circuit (October 11): P1 Max Verstappen (Oracle Red Bull Racing), P2 Charles Leclerc (Scuderia Ferrari HP), P3 Kimi Antonelli (Mercedes-AMG PETRONAS Formula One Team). Main race results only."
    ],
    "source": {
      "site": "formula1.com",
      "url": "https://www.formula1.com/en/results/2026/races/1296/singapore/race-result"
    },
    "graphic": "assets/images/team/week1-sun-results-roundup-1.png",
    "graphicAlt": "Pace & Publish results slide. Formula 1 Singapore Grand Prix, October 11: 1 Max Verstappen, 2 Charles Leclerc, 3 Kimi Antonelli. Source formula1.com.",
    "podium": [
      {
        "pos": 1,
        "name": "Max Verstappen",
        "team": "Oracle Red Bull Racing"
      },
      {
        "pos": 2,
        "name": "Charles Leclerc",
        "team": "Scuderia Ferrari HP"
      },
      {
        "pos": 3,
        "name": "Kimi Antonelli",
        "team": "Mercedes-AMG PETRONAS Formula One Team"
      }
    ]
  }
];
