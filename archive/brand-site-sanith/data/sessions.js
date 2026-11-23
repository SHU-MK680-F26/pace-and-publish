/*
  Pace & Publish: race weekends and sessions (PRD section 7, data/sessions.js).

  !!! EVERY ENTRY IN THIS FILE IS SAMPLE DATA. !!!
  The 2026 MotoGP, NASCAR and WEC seasons have ended (PRD section 12), so these are
  placeholder weekends for testing the planner and calendar. The event names, tracks,
  dates and times are NOT real and are shown on screen with a "SAMPLE" label.
  Replace them with real sessions typed in by hand from formula1.com, motogp.com,
  nascar.com and fiawec.com, and set sample: false on each real entry.

  Times are stored in UTC (the "Z" at the end). Every session has a start and an end,
  so the planner can find clashes.
*/
window.PP_WEEKENDS = [
  { id: "A", name: "SAMPLE weekend A", start: "2026-11-12", end: "2026-11-15", sample: true },
  { id: "B", name: "SAMPLE weekend B", start: "2026-11-19", end: "2026-11-22", sample: true },
  { id: "C", name: "SAMPLE weekend C", start: "2026-11-26", end: "2026-11-29", sample: true }
];

window.PP_SESSIONS = [
  /* ---------- SAMPLE weekend A: Thursday, November 12 to Sunday, November 15, 2026 ---------- */
  { weekend: "A", series: "f1", event: "SAMPLE F1 Round A", track: "SAMPLE circuit (to be replaced)", session: "Practice 1", startUTC: "2026-11-13T11:30:00Z", endUTC: "2026-11-13T12:30:00Z", source: "formula1.com", sample: true },
  { weekend: "A", series: "f1", event: "SAMPLE F1 Round A", track: "SAMPLE circuit (to be replaced)", session: "Practice 2", startUTC: "2026-11-13T15:00:00Z", endUTC: "2026-11-13T16:00:00Z", source: "formula1.com", sample: true },
  { weekend: "A", series: "f1", event: "SAMPLE F1 Round A", track: "SAMPLE circuit (to be replaced)", session: "Practice 3", startUTC: "2026-11-14T10:30:00Z", endUTC: "2026-11-14T11:30:00Z", source: "formula1.com", sample: true },
  { weekend: "A", series: "f1", event: "SAMPLE F1 Round A", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-14T14:00:00Z", endUTC: "2026-11-14T15:00:00Z", source: "formula1.com", sample: true },
  { weekend: "A", series: "f1", event: "SAMPLE F1 Round A", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-15T14:00:00Z", endUTC: "2026-11-15T16:00:00Z", source: "formula1.com", sample: true },

  { weekend: "A", series: "motogp", event: "SAMPLE MotoGP Round A", track: "SAMPLE circuit (to be replaced)", session: "Practice 1", startUTC: "2026-11-13T09:45:00Z", endUTC: "2026-11-13T10:30:00Z", source: "motogp.com", sample: true },
  { weekend: "A", series: "motogp", event: "SAMPLE MotoGP Round A", track: "SAMPLE circuit (to be replaced)", session: "Practice", startUTC: "2026-11-13T14:00:00Z", endUTC: "2026-11-13T15:00:00Z", source: "motogp.com", sample: true },
  { weekend: "A", series: "motogp", event: "SAMPLE MotoGP Round A", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-14T09:50:00Z", endUTC: "2026-11-14T10:30:00Z", source: "motogp.com", sample: true },
  { weekend: "A", series: "motogp", event: "SAMPLE MotoGP Round A", track: "SAMPLE circuit (to be replaced)", session: "Sprint", startUTC: "2026-11-14T14:30:00Z", endUTC: "2026-11-14T15:00:00Z", source: "motogp.com", sample: true },
  { weekend: "A", series: "motogp", event: "SAMPLE MotoGP Round A", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-15T12:00:00Z", endUTC: "2026-11-15T12:45:00Z", source: "motogp.com", sample: true },

  { weekend: "A", series: "nascar", event: "SAMPLE NASCAR Round A", track: "SAMPLE speedway (to be replaced)", session: "Practice", startUTC: "2026-11-14T16:30:00Z", endUTC: "2026-11-14T17:20:00Z", source: "nascar.com", sample: true },
  { weekend: "A", series: "nascar", event: "SAMPLE NASCAR Round A", track: "SAMPLE speedway (to be replaced)", session: "Qualifying", startUTC: "2026-11-14T17:35:00Z", endUTC: "2026-11-14T18:35:00Z", source: "nascar.com", sample: true },
  { weekend: "A", series: "nascar", event: "SAMPLE NASCAR Round A", track: "SAMPLE speedway (to be replaced)", session: "Race", startUTC: "2026-11-15T19:00:00Z", endUTC: "2026-11-15T22:30:00Z", source: "nascar.com", sample: true },

  { weekend: "A", series: "wec", event: "SAMPLE WEC Round A", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 1", startUTC: "2026-11-12T10:00:00Z", endUTC: "2026-11-12T11:30:00Z", source: "fiawec.com", sample: true },
  { weekend: "A", series: "wec", event: "SAMPLE WEC Round A", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 2", startUTC: "2026-11-12T15:00:00Z", endUTC: "2026-11-12T16:30:00Z", source: "fiawec.com", sample: true },
  { weekend: "A", series: "wec", event: "SAMPLE WEC Round A", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 3", startUTC: "2026-11-13T10:00:00Z", endUTC: "2026-11-13T11:00:00Z", source: "fiawec.com", sample: true },
  { weekend: "A", series: "wec", event: "SAMPLE WEC Round A", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-13T17:00:00Z", endUTC: "2026-11-13T18:00:00Z", source: "fiawec.com", sample: true },
  { weekend: "A", series: "wec", event: "SAMPLE WEC Round A", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-15T08:00:00Z", endUTC: "2026-11-15T14:00:00Z", source: "fiawec.com", sample: true },

  /* ---------- SAMPLE weekend B: Thursday, November 19 to Sunday, November 22, 2026 ---------- */
  { weekend: "B", series: "f1", event: "SAMPLE F1 Round B", track: "SAMPLE circuit (to be replaced)", session: "Practice 1", startUTC: "2026-11-20T16:30:00Z", endUTC: "2026-11-20T17:30:00Z", source: "formula1.com", sample: true },
  { weekend: "B", series: "f1", event: "SAMPLE F1 Round B", track: "SAMPLE circuit (to be replaced)", session: "Practice 2", startUTC: "2026-11-20T20:00:00Z", endUTC: "2026-11-20T21:00:00Z", source: "formula1.com", sample: true },
  { weekend: "B", series: "f1", event: "SAMPLE F1 Round B", track: "SAMPLE circuit (to be replaced)", session: "Practice 3", startUTC: "2026-11-21T16:30:00Z", endUTC: "2026-11-21T17:30:00Z", source: "formula1.com", sample: true },
  { weekend: "B", series: "f1", event: "SAMPLE F1 Round B", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-21T20:00:00Z", endUTC: "2026-11-21T21:00:00Z", source: "formula1.com", sample: true },
  { weekend: "B", series: "f1", event: "SAMPLE F1 Round B", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-22T19:00:00Z", endUTC: "2026-11-22T21:00:00Z", source: "formula1.com", sample: true },

  { weekend: "B", series: "motogp", event: "SAMPLE MotoGP Round B", track: "SAMPLE circuit (to be replaced)", session: "Practice 1", startUTC: "2026-11-20T03:45:00Z", endUTC: "2026-11-20T04:30:00Z", source: "motogp.com", sample: true },
  { weekend: "B", series: "motogp", event: "SAMPLE MotoGP Round B", track: "SAMPLE circuit (to be replaced)", session: "Practice", startUTC: "2026-11-20T08:00:00Z", endUTC: "2026-11-20T09:00:00Z", source: "motogp.com", sample: true },
  { weekend: "B", series: "motogp", event: "SAMPLE MotoGP Round B", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-21T03:50:00Z", endUTC: "2026-11-21T04:30:00Z", source: "motogp.com", sample: true },
  { weekend: "B", series: "motogp", event: "SAMPLE MotoGP Round B", track: "SAMPLE circuit (to be replaced)", session: "Sprint", startUTC: "2026-11-21T08:00:00Z", endUTC: "2026-11-21T08:30:00Z", source: "motogp.com", sample: true },
  { weekend: "B", series: "motogp", event: "SAMPLE MotoGP Round B", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-22T07:00:00Z", endUTC: "2026-11-22T07:45:00Z", source: "motogp.com", sample: true },

  { weekend: "B", series: "nascar", event: "SAMPLE NASCAR Round B", track: "SAMPLE speedway (to be replaced)", session: "Practice", startUTC: "2026-11-21T17:00:00Z", endUTC: "2026-11-21T17:50:00Z", source: "nascar.com", sample: true },
  { weekend: "B", series: "nascar", event: "SAMPLE NASCAR Round B", track: "SAMPLE speedway (to be replaced)", session: "Qualifying", startUTC: "2026-11-21T18:05:00Z", endUTC: "2026-11-21T19:05:00Z", source: "nascar.com", sample: true },
  { weekend: "B", series: "nascar", event: "SAMPLE NASCAR Round B", track: "SAMPLE speedway (to be replaced)", session: "Race", startUTC: "2026-11-22T19:30:00Z", endUTC: "2026-11-22T23:00:00Z", source: "nascar.com", sample: true },

  { weekend: "B", series: "wec", event: "SAMPLE WEC Round B", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 1", startUTC: "2026-11-19T12:00:00Z", endUTC: "2026-11-19T13:30:00Z", source: "fiawec.com", sample: true },
  { weekend: "B", series: "wec", event: "SAMPLE WEC Round B", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 2", startUTC: "2026-11-19T16:00:00Z", endUTC: "2026-11-19T17:30:00Z", source: "fiawec.com", sample: true },
  { weekend: "B", series: "wec", event: "SAMPLE WEC Round B", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 3", startUTC: "2026-11-20T11:00:00Z", endUTC: "2026-11-20T12:00:00Z", source: "fiawec.com", sample: true },
  { weekend: "B", series: "wec", event: "SAMPLE WEC Round B", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-20T15:00:00Z", endUTC: "2026-11-20T16:00:00Z", source: "fiawec.com", sample: true },
  { weekend: "B", series: "wec", event: "SAMPLE WEC Round B", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-21T13:00:00Z", endUTC: "2026-11-21T21:00:00Z", source: "fiawec.com", sample: true },

  /* ---------- SAMPLE weekend C: Thursday, November 26 to Sunday, November 29, 2026 ---------- */
  { weekend: "C", series: "f1", event: "SAMPLE F1 Round C", track: "SAMPLE circuit (to be replaced)", session: "Practice 1", startUTC: "2026-11-27T09:30:00Z", endUTC: "2026-11-27T10:30:00Z", source: "formula1.com", sample: true },
  { weekend: "C", series: "f1", event: "SAMPLE F1 Round C", track: "SAMPLE circuit (to be replaced)", session: "Practice 2", startUTC: "2026-11-27T13:00:00Z", endUTC: "2026-11-27T14:00:00Z", source: "formula1.com", sample: true },
  { weekend: "C", series: "f1", event: "SAMPLE F1 Round C", track: "SAMPLE circuit (to be replaced)", session: "Practice 3", startUTC: "2026-11-28T10:30:00Z", endUTC: "2026-11-28T11:30:00Z", source: "formula1.com", sample: true },
  { weekend: "C", series: "f1", event: "SAMPLE F1 Round C", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-28T14:00:00Z", endUTC: "2026-11-28T15:00:00Z", source: "formula1.com", sample: true },
  { weekend: "C", series: "f1", event: "SAMPLE F1 Round C", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-29T13:00:00Z", endUTC: "2026-11-29T15:00:00Z", source: "formula1.com", sample: true },

  { weekend: "C", series: "motogp", event: "SAMPLE MotoGP Round C", track: "SAMPLE circuit (to be replaced)", session: "Practice 1", startUTC: "2026-11-27T08:45:00Z", endUTC: "2026-11-27T09:30:00Z", source: "motogp.com", sample: true },
  { weekend: "C", series: "motogp", event: "SAMPLE MotoGP Round C", track: "SAMPLE circuit (to be replaced)", session: "Practice", startUTC: "2026-11-27T11:00:00Z", endUTC: "2026-11-27T12:00:00Z", source: "motogp.com", sample: true },
  { weekend: "C", series: "motogp", event: "SAMPLE MotoGP Round C", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-28T09:10:00Z", endUTC: "2026-11-28T09:50:00Z", source: "motogp.com", sample: true },
  { weekend: "C", series: "motogp", event: "SAMPLE MotoGP Round C", track: "SAMPLE circuit (to be replaced)", session: "Sprint", startUTC: "2026-11-28T12:00:00Z", endUTC: "2026-11-28T12:30:00Z", source: "motogp.com", sample: true },
  { weekend: "C", series: "motogp", event: "SAMPLE MotoGP Round C", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-29T11:00:00Z", endUTC: "2026-11-29T11:45:00Z", source: "motogp.com", sample: true },

  { weekend: "C", series: "nascar", event: "SAMPLE NASCAR Round C", track: "SAMPLE speedway (to be replaced)", session: "Practice", startUTC: "2026-11-28T18:00:00Z", endUTC: "2026-11-28T18:50:00Z", source: "nascar.com", sample: true },
  { weekend: "C", series: "nascar", event: "SAMPLE NASCAR Round C", track: "SAMPLE speedway (to be replaced)", session: "Qualifying", startUTC: "2026-11-28T19:05:00Z", endUTC: "2026-11-28T20:05:00Z", source: "nascar.com", sample: true },
  { weekend: "C", series: "nascar", event: "SAMPLE NASCAR Round C", track: "SAMPLE speedway (to be replaced)", session: "Race", startUTC: "2026-11-29T20:00:00Z", endUTC: "2026-11-29T23:30:00Z", source: "nascar.com", sample: true },

  { weekend: "C", series: "wec", event: "SAMPLE WEC Round C", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 1", startUTC: "2026-11-26T13:00:00Z", endUTC: "2026-11-26T14:30:00Z", source: "fiawec.com", sample: true },
  { weekend: "C", series: "wec", event: "SAMPLE WEC Round C", track: "SAMPLE circuit (to be replaced)", session: "Free Practice 2", startUTC: "2026-11-27T09:00:00Z", endUTC: "2026-11-27T10:30:00Z", source: "fiawec.com", sample: true },
  { weekend: "C", series: "wec", event: "SAMPLE WEC Round C", track: "SAMPLE circuit (to be replaced)", session: "Qualifying", startUTC: "2026-11-27T15:00:00Z", endUTC: "2026-11-27T16:00:00Z", source: "fiawec.com", sample: true },
  { weekend: "C", series: "wec", event: "SAMPLE WEC Round C", track: "SAMPLE circuit (to be replaced)", session: "Race", startUTC: "2026-11-29T16:00:00Z", endUTC: "2026-11-29T22:00:00Z", source: "fiawec.com", sample: true }
];
