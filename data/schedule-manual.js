/* =====================================================================
   Pace & Publish data: hand-entered race weekends.
   ---------------------------------------------------------------------
   For a series refresh.py can't read (or sessions an official site
   publishes only as text). The calendar, planner, Home and series pages
   merge these with data/generated/schedule.js automatically.
   Copy every fact from the official site and give its address in sourceUrl.

   TEMPLATE:
   {
     series: "imsa",                              // id from data/series.js
     name: "Rolex 24 At Daytona",
     circuit: "Daytona International Speedway",
     country: "United States",
     timeZone: "America/New_York",                // IANA zone of the track
     season: "2027",
     startDate: "2027-01-28", endDate: "2027-01-31",
     sessions: [
       // a timed session (ISO time with offset); durationMinutes enables "on track now" and clash checks
       { name: "Race", start: "2027-01-30T13:40:00-05:00", durationMinutes: 1440,
         sourceUrl: "https://www.imsa.com/..." },
       // or a date-only session when no time is published yet
       { name: "Qualifying", date: "2027-01-25", sourceUrl: "https://www.imsa.com/..." }
     ]
   },
   ===================================================================== */
window.PP = window.PP || {};
window.PP.scheduleManual = [
];
