/*
  Pace & Publish: news items (PRD section 7, data/news.js).
  Every item is rewritten from an approved team post on main in mk680-team-b
  (content/2026-43-*, 2026-44-*, 2026-45-*). Facts, names and sources are the ones
  those posts already cite. No new facts are added.

  Fields: id, date (day the team post went out), updated (post time, US Eastern),
  series (one or more of f1, motogp, nascar, wec), type (results, story or update),
  headline, text, image, alt, source, podium (results only), week, from (team post file).
*/
window.PP_NEWS = [
  {
    id: "w3-wec-fun-fact",
    date: "2026-11-11",
    updated: "2026-11-11T11:00:00-05:00",
    series: ["wec"],
    type: "story",
    headline: "Bronze-rated drivers can't race a WEC Hypercar, but every LMGT3 crew needs one",
    text: "In the FIA World Endurance Championship (WEC), the FIA rates every driver Platinum, Gold, Silver or Bronze. Bronze-rated drivers are not allowed to race in the Hypercar class, but every LMGT3 crew must include at least one Bronze driver.",
    image: "images/week-3/wed-fun-fact.png",
    alt: "Pace & Publish fun fact about the FIA World Endurance Championship (WEC): Bronze-rated drivers cannot race in the Hypercar class, but every LMGT3 crew must include at least one Bronze driver.",
    source: "fiawec.com",
    week: 3,
    from: "content/2026-45-fun-fact.md"
  },
  {
    id: "w3-f1-mexico-recap",
    date: "2026-11-09",
    updated: "2026-11-09T17:00:00-05:00",
    series: ["f1"],
    type: "update",
    headline: "Five drivers did not finish the F1 Mexico City Grand Prix, two of them after 5 laps",
    text: "F1 race recap, Mexico City Grand Prix at Autódromo Hermanos Rodríguez (November 1). Did not finish, with laps completed: Lance Stroll (Aston Martin Aramco Formula One Team) 5, Fernando Alonso (Aston Martin Aramco Formula One Team) 5, Valtteri Bottas (Cadillac Formula 1 Team) 42, Oliver Bearman (TGR Haas F1 Team) 47, Arvid Lindblad (Visa Cash App Racing Bulls Formula One Team) 58. Did not start: none of the 22 cars. Fastest lap: Lewis Hamilton (Scuderia Ferrari HP), 1:19.268 on lap 50.",
    image: "images/week-3/mon-weekend-recap.png",
    alt: "Pace & Publish F1 race recap. Formula 1 Mexico City Grand Prix at Autódromo Hermanos Rodríguez, November 1: five DNFs, Lance Stroll, Fernando Alonso, Valtteri Bottas, Oliver Bearman and Arvid Lindblad; no DNS; fastest lap Lewis Hamilton, 1:19.268. Source formula1.com.",
    source: "formula1.com",
    week: 3,
    from: "content/2026-45-weekend-recap.md"
  },
  {
    id: "w3-f1-mexico-results",
    date: "2026-11-08",
    updated: "2026-11-08T20:00:00-05:00",
    series: ["f1"],
    type: "results",
    headline: "Max Verstappen wins the F1 Mexico City Grand Prix after 71 laps",
    text: "F1 race results from the Mexico City Grand Prix at Autódromo Hermanos Rodríguez, Sunday, November 1. Main race result.",
    podium: [
      { pos: 1, name: "Max Verstappen", team: "Oracle Red Bull Racing" },
      { pos: 2, name: "Lewis Hamilton", team: "Scuderia Ferrari HP" },
      { pos: 3, name: "Kimi Antonelli", team: "Mercedes-AMG PETRONAS Formula One Team" }
    ],
    image: "images/week-3/sun-results-roundup-1.png",
    alt: "Pace & Publish F1 race results. Formula 1 Mexico City Grand Prix at Autódromo Hermanos Rodríguez, November 1: 1 Max Verstappen, 2 Lewis Hamilton, 3 Kimi Antonelli. Source formula1.com.",
    source: "formula1.com",
    week: 3,
    from: "content/2026-45-results-roundup.md"
  },
  {
    id: "w3-motogp-malaysia-results",
    date: "2026-11-08",
    updated: "2026-11-08T20:00:00-05:00",
    series: ["motogp"],
    type: "results",
    headline: "Two riders named Marquez share the MotoGP Grand Prix of Malaysia podium at Sepang",
    text: "MotoGP race results from the Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit, Sunday, November 1. Main race result; the Sprint is not covered.",
    podium: [
      { pos: 1, name: "Marc Marquez", team: "Ducati Lenovo Team" },
      { pos: 2, name: "Pedro Acosta", team: "Red Bull KTM Factory Racing" },
      { pos: 3, name: "Alex Marquez", team: "BK8 Gresini Racing MotoGP" }
    ],
    image: "images/week-3/sun-results-roundup-2.png",
    alt: "Pace & Publish MotoGP race results. Petronas Grand Prix of Malaysia at Petronas Sepang International Circuit, November 1: 1 Marc Marquez, 2 Pedro Acosta, 3 Alex Marquez. Source motogp.com.",
    source: "motogp.com",
    week: 3,
    from: "content/2026-45-results-roundup.md"
  },
  {
    id: "w2-f1-usgp-recap",
    date: "2026-11-02",
    updated: "2026-11-02T17:00:00-05:00",
    series: ["f1"],
    type: "update",
    headline: "Three drivers did not finish the F1 United States Grand Prix, one after 24 laps",
    text: "F1 race recap, United States Grand Prix at Circuit of The Americas, Austin (October 25). Did not finish, with laps completed: Oliver Bearman (TGR Haas F1 Team) 24, Franco Colapinto (BWT Alpine Formula One Team) 35, Valtteri Bottas (Cadillac Formula 1 Team) 48. Did not start: none of the 22 cars. Fastest lap: Charles Leclerc (Scuderia Ferrari HP), 1:37.976 on lap 42.",
    image: "images/week-2/mon-weekend-recap.png",
    alt: "Pace & Publish F1 race recap. Formula 1 United States Grand Prix at Circuit of The Americas, Austin, October 25: three DNFs, Oliver Bearman, Franco Colapinto and Valtteri Bottas; no DNS; fastest lap Charles Leclerc, 1:37.976. Source formula1.com.",
    source: "formula1.com",
    week: 2,
    from: "content/2026-44-weekend-recap.md"
  },
  {
    id: "w2-f1-usgp-results",
    date: "2026-11-01",
    updated: "2026-11-01T20:00:00-05:00",
    series: ["f1"],
    type: "results",
    headline: "Three different teams share the F1 United States Grand Prix podium in Austin",
    text: "F1 race results from the United States Grand Prix at Circuit of The Americas, Austin, Sunday, October 25. Main race result over 56 laps.",
    podium: [
      { pos: 1, name: "Kimi Antonelli", team: "Mercedes-AMG PETRONAS Formula One Team" },
      { pos: 2, name: "Charles Leclerc", team: "Scuderia Ferrari HP" },
      { pos: 3, name: "Max Verstappen", team: "Oracle Red Bull Racing" }
    ],
    image: "images/week-2/sun-results-roundup-1.png",
    alt: "Pace & Publish F1 race results. Formula 1 United States Grand Prix at Circuit of The Americas, Austin, October 25: 1 Kimi Antonelli, 2 Charles Leclerc, 3 Max Verstappen. Source formula1.com.",
    source: "formula1.com",
    week: 2,
    from: "content/2026-44-results-roundup.md"
  },
  {
    id: "w1-f1-wec-recap",
    date: "2026-10-26",
    updated: "2026-10-26T17:00:00-04:00",
    series: ["f1", "wec"],
    type: "update",
    headline: "Four drivers did not finish the F1 Singapore Grand Prix, one after 7 laps",
    text: "Race recap. Formula 1, Singapore Grand Prix at Marina Bay Street Circuit (October 11). Did not finish, with laps completed: Gabriel Bortoleto (Audi Revolut F1 Team) 7, Franco Colapinto (BWT Alpine Formula One Team) 29, Lance Stroll (Aston Martin Aramco Formula One Team) 36, Alexander Albon (Atlassian Williams F1 Team) 59. Fastest lap: Charles Leclerc (Scuderia Ferrari HP), 1:35.202 on lap 41. WEC, 6 Hours of Barcelona (October 18). Fastest lap: #7 Toyota Racing, 1:32.379 on lap 125.",
    image: "images/week-1/mon-weekend-recap.png",
    alt: "Pace & Publish recap. Formula 1 Singapore Grand Prix, October 11: four DNFs, fastest lap Charles Leclerc. WEC 6 Hours of Barcelona, October 18: fastest lap #7 Toyota Racing.",
    source: "formula1.com, fiawec.com",
    week: 1,
    from: "content/2026-43-weekend-recap.md"
  },
  {
    id: "w1-f1-singapore-results",
    date: "2026-10-25",
    updated: "2026-10-25T20:00:00-04:00",
    series: ["f1"],
    type: "results",
    headline: "Max Verstappen wins the F1 Singapore Grand Prix at Marina Bay",
    text: "F1 race results from the Singapore Grand Prix at Marina Bay Street Circuit, Sunday, October 11. Main race result.",
    podium: [
      { pos: 1, name: "Max Verstappen", team: "Oracle Red Bull Racing" },
      { pos: 2, name: "Charles Leclerc", team: "Scuderia Ferrari HP" },
      { pos: 3, name: "Kimi Antonelli", team: "Mercedes-AMG PETRONAS Formula One Team" }
    ],
    image: "images/week-1/sun-results-roundup-1.png",
    alt: "Pace & Publish results. Formula 1 Singapore Grand Prix, October 11: 1 Max Verstappen, 2 Charles Leclerc, 3 Kimi Antonelli. Source formula1.com.",
    source: "formula1.com",
    week: 1,
    from: "content/2026-43-results-roundup.md"
  },
  {
    id: "w1-motogp-indonesia-results",
    date: "2026-10-25",
    updated: "2026-10-25T20:00:00-04:00",
    series: ["motogp"],
    type: "results",
    headline: "Marco Bezzecchi wins the MotoGP Indonesian Grand Prix at Mandalika",
    text: "MotoGP race results from the Indonesian Grand Prix at Mandalika (October 9–11), race on Sunday, October 11. Main race result.",
    podium: [
      { pos: 1, name: "Marco Bezzecchi", team: "Aprilia Racing" },
      { pos: 2, name: "Raul Fernandez", team: "SuperFile Trackhouse MotoGP Team" },
      { pos: 3, name: "Jorge Martin", team: "Aprilia Racing" }
    ],
    image: "images/week-1/sun-results-roundup-2.png",
    alt: "MotoGP Indonesian Grand Prix at Mandalika, October 9–11: 1 Marco Bezzecchi, 2 Raul Fernandez, 3 Jorge Martin. Source motogp.com.",
    source: "motogp.com",
    week: 1,
    from: "content/2026-43-results-roundup.md"
  },
  {
    id: "w1-wec-barcelona-results",
    date: "2026-10-25",
    updated: "2026-10-25T20:00:00-04:00",
    series: ["wec"],
    type: "results",
    headline: "Toyota Racing finishes first and second at the WEC 6 Hours of Barcelona",
    text: "WEC race results from the 6 Hours of Barcelona, Sunday, October 18, overall classification after 198 laps. The official classification names cars by team and car number, not crew.",
    podium: [
      { pos: 1, name: "#8", team: "Toyota Racing" },
      { pos: 2, name: "#7", team: "Toyota Racing" },
      { pos: 3, name: "#50", team: "Ferrari AF Corse" }
    ],
    image: "images/week-1/sun-results-roundup-3.png",
    alt: "WEC 6 Hours of Barcelona, October 18, overall: 1 #8 Toyota Racing, 2 #7 Toyota Racing, 3 #50 Ferrari AF Corse. Source fiawec.com.",
    source: "fiawec.com",
    week: 1,
    from: "content/2026-43-results-roundup.md"
  }
];
