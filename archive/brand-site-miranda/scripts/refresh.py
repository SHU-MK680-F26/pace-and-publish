#!/usr/bin/env python3
"""Pace and Publish refresh script.

Run from the project folder:   python3 scripts/refresh.py

Reads the official sites of the six series (and sportscar365.com for IMSA,
the fallback named in README.md), then rewrites data/data.js in one go.
Python 3 standard library only. At most one request per second, 20-second timeout.
"""

import time
import urllib.request
import urllib.parse
import urllib.error
import gzip
import zlib
import json
import re
import html

# Hosts the script may read. Every series uses its own official site;
# IMSA uses sportscar365.com because no imsa.com page can be read by a script (see README.md).
ALLOWED = ("formula1.com", "f1academy.com", "fiaformulae.com", "motogp.com", "fiawec.com", "imsa.com",
           "sportscar365.com")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
_last = [0.0]
REQUEST_LOG = []


class FetchError(Exception):
    pass


def _allowed(url):
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    return any(host == d or host.endswith("." + d) for d in ALLOWED)


class _GuardedRedirects(urllib.request.HTTPRedirectHandler):
    """Follow redirects only when they stay on an allowed host."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not _allowed(newurl):
            raise FetchError("refused redirect to %s (not an allowed site)" % newurl)
        return urllib.request.HTTPRedirectHandler.redirect_request(self, req, fp, code, msg, headers, newurl)


_OPENER = urllib.request.build_opener(_GuardedRedirects)


def get(url, accept="text/html,application/json;q=0.9,*/*;q=0.8"):
    if not _allowed(url):
        raise FetchError("refused: %s is not an allowed site" % url)
    wait = 1.0 - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    _last[0] = time.time()
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept,
                                               "Accept-Encoding": "gzip, deflate", "Accept-Language": "en"})
    REQUEST_LOG.append(url)
    try:
        with _OPENER.open(req, timeout=20) as r:
            data = r.read()
            enc = r.headers.get("Content-Encoding", "")
            if enc == "gzip":
                data = gzip.decompress(data)
            elif enc == "deflate":
                data = zlib.decompress(data)
            return data.decode(r.headers.get_content_charset() or "utf-8", "replace")
    except FetchError:
        raise
    except Exception as e:
        raise FetchError("%s: %s" % (url, e))


# =====================================================================
# formula_1
# =====================================================================
"""Formula 1 parser (formula1.com only). Python 3.9 stdlib only."""
import datetime as _f1_dt
import html as _f1_html
import json as _f1_json
import re as _f1_re

try:
    from zoneinfo import ZoneInfo as _F1ZoneInfo
except ImportError:  # pragma: no cover
    _F1ZoneInfo = None


_F1_BASE = "https://www.formula1.com"
# formula1.com session code -> series-table name
_F1_SESSION_NAMES = {"p1": "FP1", "p2": "FP2", "p3": "FP3", "ss": "Sprint Qualifying",
                     "s": "Sprint", "q": "Qualifying", "r": "Race"}
# formula1.com session code -> results page path
_F1_RESULT_PATHS = {"p1": "practice/1", "p2": "practice/2", "p3": "practice/3",
                    "ss": "sprint-qualifying", "s": "sprint-results",
                    "q": "qualifying", "r": "race-result"}
_F1_RESULT_WEEKENDS = 4      # most recent weekends with completed sessions to fetch results for
_F1_NEWS_PAGES = 2
_F1_NEWS_MAX = 10
_F1_HIRING_RE = _f1_re.compile(
    r"\b(signs?|signed|signing|joins?|joined|appoint(s|ed|ment)?|hires?|hired|contract|"
    r"extension|extends?|extended|to remain|remain at|stays? (at|with)|reserve driver|test driver|"
    r"promoted|replaces?|replaced|new deal|confirmed (as|at|for)|seat|line-?up|graduates? to|"
    r"named (as )?(new )?(team principal|ceo|driver))\b", _f1_re.I)


def _f1_flight(page):
    """Join the Next.js app-router flight chunks (self.__next_f.push) into one string."""
    chunks = _f1_re.findall(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', page)
    out = []
    for c in chunks:
        try:
            out.append(_f1_json.loads('"%s"' % c))
        except ValueError:
            pass
    return "".join(out)


def _f1_decode_at(s, start):
    try:
        obj, _ = _f1_json.JSONDecoder().raw_decode(s, start)
        return obj
    except ValueError:
        return None


def _f1_text(fragment):
    fragment = _f1_re.sub(r'<span class="md:hidden">.*?</span>', "", fragment, flags=_f1_re.S)
    t = _f1_html.unescape(_f1_re.sub(r"<[^>]+>", " ", fragment))
    return " ".join(t.split())


def _f1_season_slugs(year):
    """Return (page_text, [race slugs]) for /en/racing/<year>, or None if not published."""
    try:
        page = get("%s/en/racing/%s" % (_F1_BASE, year))
    except FetchError:
        return None
    slugs = []
    for s in _f1_re.findall(r'href="/en/racing/%s/([a-z0-9-]+)"' % year, page):
        if s not in slugs:
            slugs.append(s)
    return slugs or None


def _f1_iso(local, offset, tz):
    """'2026-11-06T12:30:00' (track wall-clock time as the site publishes it) -> ISO with the
    track's UTC offset. The offset comes from the IANA zone the site names; the site's own
    gmtOffset is used only when the zone is missing/unknown. (On provisional 'TBC' 2027
    sessions the site's gmtOffset is sometimes 1 h off its own timezone, e.g. Japan +10:00.)"""
    if not local:
        return None
    if tz and _F1ZoneInfo:
        try:
            d = _f1_dt.datetime.fromisoformat(local[:19]).replace(tzinfo=_F1ZoneInfo(tz))
            return d.isoformat()
        except Exception:
            pass
    if offset and _f1_re.match(r"^[+-]\d\d:\d\d$", offset):
        return local[:19] + offset
    return None


def _f1_minutes(a, b):
    try:
        d = _f1_dt.datetime.fromisoformat(b[:19]) - _f1_dt.datetime.fromisoformat(a[:19])
        m = int(d.total_seconds() // 60)
        return m if m > 0 else None
    except Exception:
        return None


def _f1_num(v, cast):
    try:
        return cast(v) if v not in (None, "") else None
    except (TypeError, ValueError):
        return None


def _f1_parse_weekend(year, slug, unmapped):
    url = "%s/en/racing/%s/%s" % (_F1_BASE, year, slug)
    flight = _f1_flight(get(url))
    i = flight.find('"race":{"meetingSessions"')
    if i < 0:
        i = flight.find('"meetingSessions":[')
        if i < 0:
            return None, None
        race = _f1_decode_at(flight, flight.rfind("{", 0, i))
    else:
        race = _f1_decode_at(flight, flight.find("{", i))
    if not isinstance(race, dict) or race.get("type", "race") != "race":
        return None, None
    tz = race.get("meetingTimezone")
    stats = race.get("trackStats") or {}
    sessions_raw = race.get("meetingSessions") or []
    codes = [s.get("session") for s in sessions_raw]
    sprint = "s" in codes or "ss" in codes
    sessions = []
    for s in sessions_raw:
        code = s.get("session")
        if sprint and code in ("p2", "p3"):
            continue   # ruled out by the series table on sprint weekends
        name = _F1_SESSION_NAMES.get(code)
        if name is None:
            name = s.get("description") or s.get("shortName") or code
            unmapped.append("%s %s: %s" % (year, race.get("meetingName"), name))
        stz = s.get("timezone") or tz
        sessions.append({
            "name": name,
            "championship": None,
            "start": _f1_iso(s.get("startTime"), s.get("gmtOffset"), stz),
            "durationMinutes": _f1_minutes(s.get("startTime"), s.get("endTime")),
            "results": None,
            "sourceUrl": url,
            "_code": code,
            "_state": s.get("state"),
        })
    weekend = {
        "name": race.get("meetingName"),
        "circuit": race.get("circuitShortName") or stats.get("circuitShortName"),
        "country": stats.get("circuitCountry") or race.get("meetingIsoCountryName")
                   or race.get("meetingCountryName"),
        "timeZone": tz or (sessions_raw[0].get("timezone") if sessions_raw else None),
        "raceLength": {"laps": _f1_num(race.get("scheduledLapCount"), int),
                       "distanceKm": _f1_num(race.get("scheduledDistance"), float),
                       "duration": None},
        "sessions": sessions,
    }
    return weekend, race.get("meetingKey")


def _f1_parse_table(page, code):
    i = page.find("<table")
    if i < 0:
        return None
    tab = page[i:page.find("</table>", i)]
    head = [_f1_text(h) for h in _f1_re.findall(r"<th[^>]*>(.*?)</th>", tab, _f1_re.S)]
    idx = {h: n for n, h in enumerate(head)}
    body = tab[tab.find("<tbody"):] if "<tbody" in tab else tab
    rows = []
    for tr in _f1_re.findall(r"<tr[^>]*>(.*?)</tr>", body, _f1_re.S):
        cells = [_f1_text(c) for c in _f1_re.findall(r"<td[^>]*>(.*?)</td>", tr, _f1_re.S)]
        if len(cells) < 4:
            continue

        def col(name):
            n = idx.get(name)
            return cells[n] if n is not None and n < len(cells) and cells[n] != "" else None

        if code in ("q", "ss"):
            tg = col("Q3") or col("Q2") or col("Q1") or col("SQ3") or col("SQ2") or col("SQ1")
        else:
            tg = col("Time / Retired") or col("Time / Gap") or col("Time") or col("Gap")
        pos = col("Pos.") or cells[0]
        rows.append({"pos": int(pos) if pos and pos.isdigit() else pos,
                     "name": col("Driver"), "team": col("Team"),
                     "number": col("No."), "timeOrGap": tg})
    return [{"class": None, "rows": rows}] if rows else None


def _f1_results_slugs(year):
    try:
        page = get("%s/en/results/%s/races" % (_F1_BASE, year))
    except FetchError:
        return {}
    return {k: s for k, s in _f1_re.findall(
        r'href="/en/results/%s/races/(\d+)/([a-z0-9-]+)/' % year, page)}


def _f1_fill_results(year, weekends, now):
    done = []
    for w, key, slug in weekends:
        started = [s for s in w["sessions"] if s["_state"] == "completed"
                   or (s["start"] and _f1_dt.datetime.fromisoformat(s["start"]) <= now)]
        if started and key:
            done.append((w, key, slug, started))
    done = done[-_F1_RESULT_WEEKENDS:]
    if not done:
        return
    rslugs = _f1_results_slugs(year)
    for w, key, slug, started in done:
        rslug = rslugs.get(str(key), slug)
        for s in started:
            path = _F1_RESULT_PATHS.get(s["_code"])
            if not path:
                continue
            url = "%s/en/results/%s/races/%s/%s/%s" % (_F1_BASE, year, key, rslug, path)
            try:
                res = _f1_parse_table(get(url), s["_code"])
            except FetchError:
                continue
            if res:
                s["results"] = res
                s["sourceUrl"] = url


def _f1_lineups():
    url = _F1_BASE + "/en/teams"
    page = get(url)
    out = []
    parts = _f1_re.split(r'(?=<a [^>]*href="/en/teams/[a-z0-9-]+")', page)
    for part in parts:
        m = _f1_re.match(r'<a [^>]*href="(/en/teams/[a-z0-9-]+)"', part)
        if not m:
            continue
        part = part[:part.find("</a>")]
        tm = _f1_re.search(r'<p class="typography-module_display[^"]*"[^>]*>(.*?)</p>', part, _f1_re.S)
        if not tm:
            continue
        drivers = [("%s %s" % (_f1_html.unescape(a).strip(), _f1_html.unescape(b).strip())).strip()
                   for a, b in _f1_re.findall(
                       r'<span class="typography-module_body-xs-regular[^"]*">([^<]*)</span>\s*'
                       r'<span class="typography-module_body-xs-bold[^"]*">([^<]*)</span>', part)]
        team = _f1_text(tm.group(1))
        if team and not any(e["team"] == team for e in out):
            out.append({"class": None, "team": team, "drivers": drivers,
                        "sourceUrl": _F1_BASE + m.group(1)})
    return out


def _f1_news():
    items, seen = [], set()
    for p in range(1, _F1_NEWS_PAGES + 1):
        url = _F1_BASE + "/en/latest" + ("" if p == 1 else "?articleFilters=Articles&page=%d" % p)
        try:
            flight = _f1_flight(get(url))
        except FetchError:
            if p == 1:
                raise
            break
        for m in _f1_re.finditer(r'"items":\[\{"id":"[A-Za-z0-9]+","updatedAt"', flight):
            arr = _f1_decode_at(flight, flight.find("[", m.start())) or []
            for x in arr:
                if not isinstance(x, dict) or x.get("id") in seen:
                    continue
                seen.add(x.get("id"))
                if x.get("articleType") != "News" or not x.get("slug"):
                    continue   # features, interviews, betting, polls are not confirmed news items
                title = (x.get("title") or "").strip()
                items.append({
                    "date": (x.get("updatedAt") or "")[:10] or None,
                    "type": "hiring" if _F1_HIRING_RE.search(title) else "news",
                    "title": title,
                    "sourceUrl": "%s/en/latest/article/%s.%s" % (_F1_BASE, x["slug"], x["id"]),
                    "_ts": x.get("updatedAt") or "",
                })
        if len(items) >= _F1_NEWS_MAX:
            break
    items.sort(key=lambda e: e["_ts"], reverse=True)
    for e in items:
        del e["_ts"]
    return items[:_F1_NEWS_MAX]


def fetch_formula_1(season=None):
    """season: optional override (testing only); default = latest season formula1.com publishes."""
    now = _f1_dt.datetime.now(_f1_dt.timezone.utc)
    if season:
        candidates = [int(season)]
    else:
        candidates = [now.year + 1, now.year, now.year - 1]
    year, slugs = None, None
    for y in candidates:
        slugs = _f1_season_slugs(y)
        if slugs:
            year = y
            break
    if not year:
        raise FetchError("formula1.com: no season page with race weekends could be read")
    unmapped, weekends, label = [], [], str(year)
    for slug in slugs:
        if "testing" in slug:
            continue
        try:
            w, key = _f1_parse_weekend(year, slug, unmapped)
        except FetchError:
            continue
        if w and w["sessions"]:
            weekends.append((w, key, slug))
    if not weekends:
        raise FetchError("formula1.com: no race weekends parsed for %s" % year)
    weekends.sort(key=lambda t: _f1_dt.datetime.fromisoformat(t[0]["sessions"][0]["start"])
                  if t[0]["sessions"][0]["start"] else now)
    _f1_fill_results(year, weekends, now)
    out_weekends = []
    for w, _, _ in weekends:
        for s in w["sessions"]:
            s.pop("_code", None)
            s.pop("_state", None)
        out_weekends.append(w)
    return {"season": label, "weekends": out_weekends, "lineups": _f1_lineups(),
            "news": _f1_news(), "unmapped": unmapped}


# =====================================================================
# f1_academy
# =====================================================================
"""F1 Academy parser (official site f1academy.com only). Python 3.9 stdlib.

Data source: the Next.js `__NEXT_DATA__` JSON embedded in these pages:
  /Racing-Series/Calendar            season, rounds, sessions, start/end times
  /Racing-Series/Results?raceid=N    per-round session results, race laps/km
  /Racing-Series/Teams               teams and drivers (team page links)
  /Latest                            news list
"""
import json
import re
import datetime as _f1a_dt
from zoneinfo import ZoneInfo


_F1A_BASE = "https://www.f1academy.com"

# Circuit -> IANA timezone (geographic fact). The site's own ISO offsets ignore
# daylight saving time (e.g. Silverstone in July as +00:00), but its wall-clock
# times are local (lap "set at" times confirm this), so offsets are recomputed.
_F1A_TZ = {
    "shanghai": "Asia/Shanghai",
    "montreal": "America/Toronto",
    "silverstone": "Europe/London",
    "zandvoort": "Europe/Amsterdam",
    "austin": "America/Chicago",
    "las vegas": "America/Los_Angeles",
    "jeddah": "Asia/Riyadh",
    "miami": "America/New_York",
    "barcelona": "Europe/Madrid",
    "singapore": "Asia/Singapore",
    "lusail": "Asia/Qatar",
    "qatar": "Asia/Qatar",
    "abu dhabi": "Asia/Dubai",
    "yas marina": "Asia/Dubai",
    "budapest": "Europe/Budapest",
    "hungaroring": "Europe/Budapest",
    "monza": "Europe/Rome",
    "imola": "Europe/Rome",
    "spa": "Europe/Brussels",
    "baku": "Asia/Baku",
    "melbourne": "Australia/Melbourne",
    "suzuka": "Asia/Tokyo",
    "bahrain": "Asia/Bahrain",
    "sakhir": "Asia/Bahrain",
    "mexico city": "America/Mexico_City",
    "sao paulo": "America/Sao_Paulo",
    "interlagos": "America/Sao_Paulo",
    "monaco": "Europe/Monaco",
    "red bull ring": "Europe/Vienna",
    "spielberg": "Europe/Vienna",
    "madrid": "Europe/Madrid",
}

_F1A_HIRING_WORDS = ("signs", "signed", "joins", "join ", "selected", "seat", "appointed",
                     "named as", "confirmed as", "wild card entry", "to race with", "to drive for",
                     "graduate", "promoted")


def _f1a_next_data(url):
    text = get(url)
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', text, re.S)
    if not m:
        raise FetchError("%s: no __NEXT_DATA__ found" % url)
    try:
        return json.loads(m.group(1))["props"]["pageProps"], text
    except (ValueError, KeyError) as e:
        raise FetchError("%s: bad __NEXT_DATA__ (%s)" % (url, e))


def _f1a_clean(s):
    if s is None:
        return None
    s = " ".join(str(s).split())
    return s or None


def _f1a_tz(race):
    for key in (race.get("CircuitShortName"), race.get("CircuitName")):
        k = (key or "").strip().lower()
        if k in _F1A_TZ:
            return _F1A_TZ[k]
        for name, tz in _F1A_TZ.items():
            if name in k:
                return tz
    return None


def _f1a_local_iso(value, tz):
    """Keep the site's wall-clock time and attach the track's real UTC offset."""
    if not value:
        return None
    dt = _f1a_dt.datetime.fromisoformat(value)
    if tz:
        dt = dt.replace(tzinfo=None).replace(tzinfo=ZoneInfo(tz))
    return dt.isoformat()


def _f1a_minutes(start, end):
    if not start or not end:
        return None
    try:
        d = _f1a_dt.datetime.fromisoformat(end) - _f1a_dt.datetime.fromisoformat(start)
    except ValueError:
        return None
    m = int(round(d.total_seconds() / 60))
    return m if m > 0 else None


def _f1a_map_names(sessions):
    """Return list of (session, mapped_name or None to drop, unmapped flag)."""
    practices = [s for s in sessions if (s.get("SessionCode") or s.get("SessionType")) == "PRACTICE"
                 or re.match(r"(?i)^\s*(free\s+)?practice", s.get("SessionName") or "")]
    practices.sort(key=lambda s: s.get("SessionStartTime") or "")
    out = []
    for s in sessions:
        raw = _f1a_clean(s.get("SessionName")) or ""
        low = raw.lower()
        if "sprint" in low and "qualif" in low:
            out.append((s, None, False))           # ruled out by the series table
            continue
        if s in practices:
            if len(practices) == 1:
                name = "Free Practice"
            else:
                name = "Free Practice %d" % (practices.index(s) + 1)
            out.append((s, name, False))
            continue
        m = re.match(r"(?i)^qualifying(\s+\d+)?$", raw)
        if m:
            # Montreal/Austin list "Qualifying 1" and "Qualifying 2" (one per race grid);
            # keep the site's numbering so the two sessions stay distinguishable.
            out.append((s, "Qualifying" + (m.group(1) or ""), False))
            continue
        canon = {"reverse grid race": "Reverse Grid Race", "feature race": "Feature Race",
                 "opening race": "Opening Race"}
        if low in canon:
            out.append((s, canon[low], False))
            continue
        out.append((s, raw, True))
    return out


def _f1a_rows(sess):
    rows = []
    is_race = (sess.get("SessionType") or "") == "RESULT"
    for i, r in enumerate(sess.get("Results") or []):
        disp = _f1a_clean(r.get("DisplayFinishPosition"))
        if disp is None and r.get("FinishPosition") is not None:
            disp = str(r["FinishPosition"])
        pos = int(disp) if disp and disp.isdigit() else disp
        time_ = _f1a_clean(r.get("TimeOrFinishReason"))
        gap = _f1a_clean(r.get("Gap"))
        if is_race and i > 0 and gap:
            tog = gap
        else:
            tog = time_
        name = _f1a_clean("%s %s" % (r.get("DriverForename") or "", r.get("DriverSurname") or "")) \
            or _f1a_clean(r.get("DriverDisplayName"))
        num = r.get("CarNumber")
        rows.append({"pos": pos, "name": name, "team": _f1a_clean(r.get("TeamName")),
                     "number": str(num) if num is not None else None, "timeOrGap": tog})
    return rows


def _f1a_weekends(cal):
    weekends, unmapped = [], []
    for race in cal.get("Races") or []:
        tz = _f1a_tz(race)
        res_url = "%s/Racing-Series/Results?raceid=%s" % (_F1A_BASE, race["RaceId"])
        res_by_id, race_len = {}, {"laps": None, "distanceKm": None, "duration": None}
        try:
            rp, _ = _f1a_next_data(res_url)
            pdata = rp.get("pageData") or {}
            for s in pdata.get("SessionResults") or []:
                res_by_id[s.get("SessionId")] = s
            # Race length: the Feature Race (main race) laps / km as published.
            for s in pdata.get("SessionResults") or []:
                if (s.get("SessionName") or "").strip().lower() == "feature race":
                    if s.get("Laps"):
                        race_len["laps"] = int(s["Laps"])
                    if s.get("TotalLengthInKm"):
                        race_len["distanceKm"] = float(s["TotalLengthInKm"])
        except FetchError:
            pass  # schedule still comes from the calendar; results stay None
        sessions = []
        for s, name, is_unmapped in _f1a_map_names(race.get("Sessions") or []):
            if name is None:
                continue
            if is_unmapped and name not in unmapped:
                unmapped.append(name)
            rs = res_by_id.get(s.get("SessionId")) or {}
            results = None
            if s.get("SessionResultsAvailable") and not s.get("HideSessionResult") and rs.get("Results"):
                rows = _f1a_rows(rs)
                if rows:
                    results = [{"class": None, "rows": rows}]
            sessions.append({
                "name": name,
                "championship": None,
                "start": _f1a_local_iso(s.get("SessionStartTime"), tz),
                "durationMinutes": _f1a_minutes(s.get("SessionStartTime"), s.get("SessionEndTime")),
                "results": results,
                "sourceUrl": res_url,
            })
        sessions.sort(key=lambda x: (x["start"] is None, _f1a_dt.datetime.fromisoformat(x["start"]) if x["start"] else 0))
        weekends.append({
            "name": _f1a_clean(race.get("CircuitShortName")) or _f1a_clean(race.get("CircuitName")),
            "circuit": _f1a_clean(race.get("CircuitName")),
            "country": _f1a_clean(race.get("CountryName")),
            "timeZone": tz,
            "raceLength": race_len,
            "sessions": sessions,
        })
    return weekends, unmapped


def _f1a_lineups():
    url = _F1A_BASE + "/Racing-Series/Teams"
    pp, html_text = _f1a_next_data(url)
    links = {}
    for tid, slug in re.findall(r'href="/Racing-Series/Teams/(\d+)/([^"/]+)"', html_text):
        links[int(tid)] = "%s/Racing-Series/Teams/%s/%s" % (_F1A_BASE, tid, slug)
    out = []
    for t in (pp.get("pageData") or {}).get("Teams") or []:
        drivers = [_f1a_clean(d.get("FullName")) for d in t.get("Drivers") or [] if d.get("FullName")]
        out.append({"class": None, "team": _f1a_clean(t.get("TeamFullName")), "drivers": drivers,
                    "sourceUrl": links.get(t.get("TeamId"), url)})
    return out


def _f1a_news(limit=10):
    pp, _ = _f1a_next_data(_F1A_BASE + "/Latest")
    items = (pp.get("pageData") or {}).get("items") or []
    out = []
    for it in items:
        if not it.get("id") or not it.get("slug") or not it.get("title"):
            continue
        date = (it.get("updatedAt") or "")[:10] or None
        title = _f1a_clean(it["title"])
        low = title.lower()
        kind = "hiring" if any(w in low for w in _F1A_HIRING_WORDS) else "news"
        out.append({"date": date, "type": kind, "title": title,
                    "sourceUrl": "%s/Latest/%s/%s" % (_F1A_BASE, it["id"], it["slug"])})
    out.sort(key=lambda x: x["date"] or "", reverse=True)
    return out[:limit]


# ---------------------------------------------------------------------------
# Next season's calendar. f1academy.com announces it in a press release before
# its calendar page switches over, so the dates are read from that article.
# Only rounds whose place and dates the article states are added; nothing else.
# ---------------------------------------------------------------------------

# Place word in the article -> (weekend name, country). Geographic facts only.
_F1A_PLACES = [
    ("las vegas", "Las Vegas", "United States"), ("circuit of the americas", "Austin", "United States"),
    ("austin", "Austin", "United States"), ("miami", "Miami", "United States"),
    ("montreal", "Montreal", "Canada"), ("mexico city", "Mexico City", "Mexico"),
    ("sao paulo", "Sao Paulo", "Brazil"), ("são paulo", "Sao Paulo", "Brazil"),
    ("jeddah", "Jeddah", "Saudi Arabia"), ("shanghai", "Shanghai", "China"),
    ("silverstone", "Silverstone", "United Kingdom"), ("hungaroring", "Budapest", "Hungary"),
    ("budapest", "Budapest", "Hungary"), ("zandvoort", "Zandvoort", "Netherlands"),
    ("barcelona", "Barcelona", "Spain"), ("madrid", "Madrid", "Spain"), ("monza", "Monza", "Italy"),
    ("imola", "Imola", "Italy"), ("spa", "Spa-Francorchamps", "Belgium"), ("singapore", "Singapore", "Singapore"),
    ("lusail", "Lusail", "Qatar"), ("qatar", "Lusail", "Qatar"), ("abu dhabi", "Abu Dhabi", "United Arab Emirates"),
    ("yas marina", "Abu Dhabi", "United Arab Emirates"), ("baku", "Baku", "Azerbaijan"),
    ("melbourne", "Melbourne", "Australia"), ("suzuka", "Suzuka", "Japan"), ("bahrain", "Bahrain", "Bahrain"),
    ("monaco", "Monaco", "Monaco"), ("spielberg", "Spielberg", "Austria"), ("red bull ring", "Spielberg", "Austria"),
]
# Circuit names, used only when the article itself names the circuit.
_F1A_CIRCUITS = ["Circuit Gilles-Villeneuve", "Hungaroring", "Circuit of The Americas", "Las Vegas Strip Circuit",
                 "Jeddah Corniche Circuit", "Shanghai International Circuit", "Silverstone Circuit",
                 "Circuit Zandvoort", "Marina Bay Street Circuit", "Yas Marina Circuit", "Miami International Autodrome",
                 "Lusail International Circuit", "Circuit de Barcelona-Catalunya"]
_F1A_MONTHS = {m: i + 1 for i, m in enumerate(["january", "february", "march", "april", "may", "june", "july",
                                                "august", "september", "october", "november", "december"])}
_F1A_DATES = re.compile(r"from\s+(\d{1,2})(?:\s+([A-Za-z]+))?\s*[-–]\s*(\d{1,2})\s+([A-Za-z]+)")


def _f1a_article_text(url):
    pp, _ = _f1a_next_data(url)
    parts = []
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "richTextBlock" and isinstance(v, str):
                    parts.append(v)
                else:
                    walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(pp)
    return re.sub(r"\s+", " ", re.sub(r"[_*#>]", " ", " ".join(parts)))


def _f1a_announced(news_all, current_season, known_weekends):
    """Weekends of a later season, read from its official calendar announcement."""
    try:
        cur = int(str(current_season)[:4])
    except (TypeError, ValueError):
        return []
    art = None
    for n in news_all:
        m = re.search(r"\b(20\d\d)\b.*\bcalendar\b|\bcalendar\b.*\b(20\d\d)\b", n["title"], re.I)
        if m:
            year = int(m.group(1) or m.group(2))
            if year > cur and (art is None or year > art[0]):
                art = (year, n["sourceUrl"])
    if not art:
        return []
    year, url = art
    text = _f1a_article_text(url)
    known = {}
    for w in known_weekends:
        if w.get("name"):
            known[w["name"].lower()] = w
    out = []
    for m in _F1A_DATES.finditer(text):
        d1, mon1, d2, mon2 = m.group(1), m.group(2), m.group(3), m.group(4)
        if mon2.lower() not in _F1A_MONTHS or (mon1 and mon1.lower() not in _F1A_MONTHS):
            continue
        before = text[max(0, m.start() - 110):m.start()]
        low = before.lower()
        hit = None
        for key, name, country in _F1A_PLACES:
            i = low.rfind(key)
            if i >= 0 and (hit is None or i > hit[0]):
                hit = (i, name, country)
        if not hit:
            continue
        _, name, country = hit
        # The circuit as the article names it, in the text before the dates or later in the same sentence.
        after = text[m.end():m.end() + 160].split(". ")[0]
        circuit = None
        for c in _F1A_CIRCUITS:
            if c.lower() in before.lower() or c.lower() in after.lower():
                circuit = c
        # A venue the site already lists keeps the site's own circuit and country names.
        if name.lower() in known:
            circuit = known[name.lower()].get("circuit") or circuit
            country = known[name.lower()].get("country") or country
        m1 = _F1A_MONTHS[(mon1 or mon2).lower()]
        m2 = _F1A_MONTHS[mon2.lower()]
        try:
            start = _f1a_dt.date(year, m1, int(d1)).isoformat()
            end = _f1a_dt.date(year, m2, int(d2)).isoformat()
        except ValueError:
            continue
        tz = _F1A_TZ.get(name.lower()) or _F1A_TZ.get(name.lower().split("-")[0])
        out.append({
            "name": name, "circuit": circuit, "country": country, "timeZone": tz,
            "raceLength": {"laps": None, "distanceKm": None, "duration": None},
            "sessions": [], "season": str(year), "startDate": start, "endDate": end, "sourceUrl": url,
        })
    out.sort(key=lambda w: w["startDate"])
    return out


def fetch_f1_academy():
    cal_pp, _ = _f1a_next_data(_F1A_BASE + "/Racing-Series/Calendar")
    cal = cal_pp.get("pageData") or {}
    if not cal.get("Races"):
        raise FetchError("f1academy.com calendar has no races")
    m = re.match(r"\s*(\d{4}(?:[-–]\d{2,4})?)", cal.get("SeasonName") or "")
    season = m.group(1) if m else (_f1a_clean(cal.get("SeasonName")) or None)
    weekends, unmapped = _f1a_weekends(cal)
    for w in weekends:
        w["season"] = season
    news_all = _f1a_news(limit=60)
    weekends += _f1a_announced(news_all, season, weekends)
    return {
        "season": season,
        "weekends": weekends,
        "lineups": _f1a_lineups(),
        "news": news_all[:10],
        "unmapped": unmapped,
    }


# =====================================================================
# formula_e
# =====================================================================
"""Formula E parser (fiaformulae.com only). Python 3.9 stdlib.

Data sources (all server-rendered HTML on www.fiaformulae.com; no pulselive API):
- /en/calendar                       JSON-LD season calendar + "next round" spotlight (race start time)
- /en/results-and-standings?season=N&round=KEY[&session=S]   results tables (RSC flight data)
- /en/drivers                        JSON-LD driver list with team (memberOf)
- /en/news                           article cards (title, href, date)
"""
import json
import re
import datetime
from zoneinfo import ZoneInfo


_FE_BASE = "https://www.fiaformulae.com"

# Hand-written geographic lookup: venue locality -> IANA zone (the site gives no zone names).
_FE_TZ = {
    "Mexico City": "America/Mexico_City", "Austin": "America/Chicago", "Miami": "America/New_York",
    "São Paulo": "America/Sao_Paulo", "Sao Paulo": "America/Sao_Paulo", "Sanya": "Asia/Shanghai",
    "Jeddah": "Asia/Riyadh", "Diriyah": "Asia/Riyadh", "Riyadh": "Asia/Riyadh", "Monaco": "Europe/Monaco",
    "Monte Carlo": "Europe/Monaco", "Berlin": "Europe/Berlin", "London": "Europe/London",
    "Zandvoort": "Europe/Amsterdam", "Madrid": "Europe/Madrid", "Shanghai": "Asia/Shanghai",
    "Tokyo": "Asia/Tokyo", "Misano": "Europe/Rome", "Rome": "Europe/Rome", "Portland": "America/Los_Angeles",
    "Jakarta": "Asia/Jakarta", "Hyderabad": "Asia/Kolkata", "Cape Town": "Africa/Johannesburg",
    "Seoul": "Asia/Seoul", "Doha": "Asia/Qatar", "Valencia": "Europe/Madrid", "Paris": "Europe/Paris",
    "New York": "America/New_York", "Brooklyn": "America/New_York", "Marrakesh": "Africa/Casablanca",
    "Santiago": "America/Santiago", "Buenos Aires": "America/Argentina/Buenos_Aires",
    "Hong Kong": "Asia/Hong_Kong", "Zurich": "Europe/Zurich", "Bern": "Europe/Zurich",
    "Puebla": "America/Mexico_City", "Evora": "Europe/Lisbon", "Lisbon": "Europe/Lisbon",
}
# ISO 3166 code (given by the site) -> English short name (geographic fact).
_FE_COUNTRY = {
    "MX": "Mexico", "US": "United States", "BR": "Brazil", "CN": "China", "SA": "Saudi Arabia",
    "MC": "Monaco", "DE": "Germany", "GB": "United Kingdom", "NL": "Netherlands", "ES": "Spain",
    "JP": "Japan", "IT": "Italy", "ID": "Indonesia", "IN": "India", "ZA": "South Africa", "KR": "South Korea",
    "QA": "Qatar", "FR": "France", "MA": "Morocco", "CL": "Chile", "AR": "Argentina", "HK": "Hong Kong",
    "CH": "Switzerland", "PT": "Portugal",
}
_FE_HIRING = re.compile(
    r"\b(sign(s|ed|ing)?|re-sign\w*|join(s|ed|ing)?|line-?up|confirm(s|ed)?|appoint\w*|contract|"
    r"seat|retain\w*|partner(s)? with|promot\w*|replace\w*|announce\w* .*driver|new (team )?principal|"
    r"who.s on the grid)\b", re.I)


# ---------------------------------------------------------------- RSC helpers
def _fe_flight(html_text):
    parts = []
    for m in re.finditer(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', html_text):
        try:
            parts.append(json.loads('"' + m.group(1) + '"'))
        except ValueError:
            pass
    return "".join(parts)


def _fe_rows(flight):
    b = flight.encode("utf-8")
    i, n, res = 0, len(b), {}
    while i < n:
        j = b.find(b":", i)
        if j < 0:
            break
        rid = b[i:j].decode("utf-8", "replace").strip()
        if b[j + 1:j + 2] == b"T":
            k = b.find(b",", j + 2)
            try:
                length = int(b[j + 2:k], 16)
            except ValueError:
                break
            res[rid] = ("T", b[k + 1:k + 1 + length].decode("utf-8", "replace"))
            i = k + 1 + length
            continue
        k = b.find(b"\n", j + 1)
        if k < 0:
            k = n
        p = b[j + 1:k].decode("utf-8", "replace")
        if p[:1] in ("[", "{", '"') or p[:1].isdigit() or p in ("null", "true", "false"):
            try:
                res[rid] = ("J", json.loads(p))
            except ValueError:
                res[rid] = ("X", p)
        else:
            res[rid] = ("X", p)
        i = k + 1
    return res


def _fe_tree(html_text):
    rs = _fe_rows(_fe_flight(html_text))
    cache = {}

    def r(v, depth=0):
        if depth > 300:
            return v
        if isinstance(v, str) and len(v) > 1 and v[0] == "$":
            ref = v[1:]
            if ref.startswith("L"):
                ref = ref[1:]
            if re.fullmatch(r"[0-9a-f]+", ref) and ref in rs:
                kind, val = rs[ref]
                if kind == "T":
                    return val
                if kind == "J":
                    if ref not in cache:
                        cache[ref] = None
                        cache[ref] = r(val, depth + 1)
                    return cache[ref]
            return v
        if isinstance(v, list):
            return [r(x, depth + 1) for x in v]
        if isinstance(v, dict):
            return {k: r(x, depth + 1) for k, x in v.items()}
        return v

    return [r(v) for (kind, v) in rs.values() if kind == "J"]


def _fe_is_el(node):
    return isinstance(node, list) and len(node) == 4 and node[0] == "$" and isinstance(node[1], str)


def _fe_props(node):
    return node[3] if _fe_is_el(node) and isinstance(node[3], dict) else {}


def _fe_els(node):
    """Yield every element (depth first), also descending into any prop holding elements."""
    stack = [node]
    while stack:
        cur = stack.pop()
        if _fe_is_el(cur):
            yield cur
            stack.extend(reversed(list(_fe_props(cur).values())))
        elif isinstance(cur, list):
            stack.extend(reversed(cur))
        elif isinstance(cur, dict):
            stack.extend(reversed(list(cur.values())))


def _fe_texts(node):
    out = []

    def w(x):
        if isinstance(x, bool) or x is None:
            return
        if isinstance(x, (int, float)):
            out.append(x)
        elif isinstance(x, str):
            if not x.startswith("$"):
                out.append(x)
        elif _fe_is_el(x):
            if x[1] == "svg":
                return
            w(_fe_props(x).get("children"))
        elif isinstance(x, list):
            for y in x:
                w(y)

    w(node)
    return out


def _fe_children(el):
    c = _fe_props(el).get("children")
    if isinstance(c, list) and not _fe_is_el(c):
        flat = []
        for x in c:
            if isinstance(x, list) and not _fe_is_el(x):
                flat.extend(x)
            else:
                flat.append(x)
        return flat
    return [c]


# ---------------------------------------------------------------- utilities
def _fe_iso(dt_utc, tzname):
    if dt_utc is None or not tzname:
        return None
    return dt_utc.astimezone(ZoneInfo(tzname)).isoformat()


def _fe_url(href):
    if not href:
        return None
    if href.startswith("http"):
        return href
    if not href.startswith("/en/") and href.startswith("/"):
        href = "/en" + href
    return _FE_BASE + href


def _fe_ld_blocks(html_text):
    out = []
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html_text, re.S):
        try:
            out.append(json.loads(m.group(1)))
        except ValueError:
            pass
    return out


# ---------------------------------------------------------------- calendar
def _fe_calendar():
    url = _FE_BASE + "/en/calendar"
    page = get(url)
    cal = None
    for d in _fe_ld_blocks(page):
        if isinstance(d, dict) and d.get("@type") == "ItemList" and "calendar" in str(d.get("name", "")).lower():
            cal = d
    if not cal:
        raise FetchError("formula-e: calendar JSON-LD not found")
    flight = _fe_flight(page)
    label_m = re.search(r'"children":"(\d{4}(?:[/\u2013-]\d{2,4})?) Season', flight) or \
        re.search(r"(\d{4}(?:[/\u2013-]\d{2,4})?) Season", str(cal.get("name", "")))
    season_label = label_m.group(1) if label_m else None
    num_m = re.search(r'"seasonNum":(\d+)', flight)
    season_num = int(num_m.group(1)) if num_m else None
    keys = re.findall(r'\{"key":"(\d+-[a-z0-9-]+)","upcoming":(true|false)', flight)

    rounds = []
    for idx, it in enumerate(cal.get("itemListElement", [])):
        ev = it.get("item", {})
        name = ev.get("name", "")
        m = re.match(r"R(\d+)\s+(.*)", name)
        rnd = int(m.group(1)) if m else it.get("position")
        loc = ev.get("location", {}) or {}
        addr = loc.get("address", {}) or {}
        rounds.append({
            "round": rnd,
            "name": m.group(2) if m else name,
            "venue": loc.get("name"),
            "locality": addr.get("addressLocality"),
            "countryCode": addr.get("addressCountry"),
            "startDate": ev.get("startDate"),
            "endDate": ev.get("endDate"),
            "key": keys[idx][0] if idx < len(keys) else None,
        })

    spot = None
    sm = re.search(r'Next round \u00b7 Round (\d+)', flight)
    if sm:
        spot = {"round": int(sm.group(1))}
        tm = re.search(r'"target":"(\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?Z)","hasTime":true', flight)
        if tm:
            ts = tm.group(1)[:-1]
            if len(ts) == 16:
                ts += ":00"
            spot["raceUtc"] = datetime.datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S").replace(
                tzinfo=datetime.timezone.utc)
        cm = re.search(r'raceSpotlight__meta[^"]*","children":\[\["\$","p",null,\{"children":"([^"]+)"\}', flight)
        if cm:
            spot["meta"] = cm.group(1)  # e.g. "Autodromo Hermanos Rodriguez · Mexico City, Mexico"
    return url, season_label, season_num, rounds, spot


# ---------------------------------------------------------------- results
def _fe_round_header(tree):
    for el in _fe_els(tree):
        p = _fe_props(el)
        if "sessions" in p and "roundLabel" in p:
            return p
    return {}


def _fe_parse_table(tree):
    rows = []
    body = None
    for el in _fe_els(tree):
        if el[1] == "tbody" and any(str(_fe_props(x).get("data-testid", "")).startswith("results-row-")
                                    for x in _fe_els(el)):
            body = el
            break
    if body is None:
        return rows
    for el in _fe_els(body):
        p = _fe_props(el)
        if el[1] != "tr" or not str(p.get("data-testid", "")).startswith("results-row-"):
            continue
        cells = [c for c in _fe_children(el) if _fe_is_el(c) and c[1] in ("td", "th")]
        if len(cells) < 2:
            continue
        pos_t = _fe_texts(cells[0])
        pos = pos_t[0] if pos_t else None
        if isinstance(pos, str):
            pos = int(pos) if pos.strip().isdigit() else pos.strip()
        name = team = None
        for sub in _fe_els(cells[1]):
            sp = _fe_props(sub)
            if isinstance(sp.get("href"), str) and "/drivers/" in sp.get("href"):
                t = _fe_texts(sp.get("children"))
                name = " ".join(str(x) for x in t).strip() or None
            if "teamLine" in str(sp.get("className", "")):
                t = _fe_texts(sp.get("children"))
                team = t[0] if t else None
        if name is None:
            t = _fe_texts(cells[1])
            name = t[0] if t else None
        if team is None and len(cells) > 2:
            t = _fe_texts(cells[2])
            team = t[0] if t else None
        keyed = {c[2]: _fe_texts(c) for c in cells if isinstance(c[2], str)}
        tog = None
        for k in ("d-time", "m-time"):
            if keyed.get(k):
                tog = str(keyed[k][0])
                break
        rows.append({"pos": pos, "name": name, "team": team, "number": None, "timeOrGap": tog})
    return rows


def _fe_round_results(season_num, round_key):
    """Returns list of (siteKey, siteLabel, rows, url) for every session the site lists for the round."""
    base = "%s/en/results-and-standings?season=%s&round=%s" % (_FE_BASE, season_num, round_key)
    page = get(base)
    tree = _fe_tree(page)
    hdr = _fe_round_header(tree)
    sessions = hdr.get("sessions") or []
    if not isinstance(sessions, list):
        sessions = []
    selected = hdr.get("selectedSession")
    out = []
    for s in sessions:
        key, label = s.get("key"), s.get("label")
        url = base + "&session=" + str(key)
        if key == selected:
            rows = _fe_parse_table(tree)
        else:
            try:
                rows = _fe_parse_table(_fe_tree(get(url)))
            except FetchError:
                rows = []
        out.append((key, label, rows or None, url))
    return out


def _fe_map_session(key, label, double, day_idx):
    """Map the site's session key/label to the series-table name. Returns (name, mapped?)."""
    k = (key or "").lower()
    lab = label or key or ""
    suffix = (" %d" % day_idx) if double else ""
    if "practice" in k or re.match(r"fp\d", lab.lower()):
        m = re.search(r"(\d+)", k) or re.search(r"(\d+)", lab)
        n = int(m.group(1)) if m else 1
        if n in (1, 2):
            return "Free Practice %d" % n, True
        return lab, False
    if "qualif" in k or "qualif" in lab.lower():
        if any(w in k for w in ("group", "duel", "quarter", "semi", "final")) and k != "qualifying":
            return None, True  # part of Qualifying; final classification used instead
        return "Qualifying" + suffix, True
    if "race" in k or "race" in lab.lower():
        return "Race" + suffix, True
    return lab, False


def _fe_session_order(s):
    n = s["name"].lower()
    num = re.search(r"(\d+)", n)
    num = int(num.group(1)) if num else 0
    if "practice" in n or re.match(r"fp\d", n):
        return (0, num)
    if "race" in n:
        return (2, num)
    return (1, num)


# ---------------------------------------------------------------- lineups & news
def _fe_lineups():
    url = _FE_BASE + "/en/drivers"
    page = get(url)
    teams, order = {}, []
    for d in _fe_ld_blocks(page):
        if isinstance(d, dict) and d.get("@type") == "ItemList" and d.get("name") == "Drivers":
            for it in d.get("itemListElement", []):
                p = it.get("item", {})
                team = (p.get("memberOf") or {}).get("name")
                if not team or not p.get("name"):
                    continue
                if team not in teams:
                    teams[team] = []
                    order.append(team)
                teams[team].append(p["name"])
    if not order:
        raise FetchError("formula-e: driver list not found on %s" % url)
    return [{"class": None, "team": t, "drivers": teams[t], "sourceUrl": url} for t in order]


def _fe_news():
    url = _FE_BASE + "/en/news"
    tree = _fe_tree(get(url))
    items, seen = [], set()
    for el in _fe_els(tree):
        p = _fe_props(el)
        if el[1] != "article" or p.get("data-testid") != "article-card":
            continue
        href = title = date = None
        for sub in _fe_els(el):
            sp = _fe_props(sub)
            if sp.get("data-testid") == "article-card__floating-link":
                href, title = sp.get("href"), sp.get("aria-label")
            if isinstance(sp.get("date"), str) and re.match(r"\d{4}-\d\d-\d\d", sp["date"]):
                date = sp["date"]
        if not href or not date or href in seen:
            continue
        seen.add(href)
        try:
            d = datetime.datetime.strptime(date[:19], "%Y-%m-%dT%H:%M:%S").replace(
                tzinfo=datetime.timezone.utc).astimezone(ZoneInfo("Europe/London")).date().isoformat()
        except ValueError:
            d = date[:10]
        items.append({"date": d, "type": "hiring" if title and _FE_HIRING.search(title) else "news",
                      "title": title, "sourceUrl": _fe_url(href)})
    items.sort(key=lambda x: x["date"], reverse=True)
    return items[:10]


# ---------------------------------------------------------------- main
def fetch_formula_e():
    cal_url, season_label, season_num, rounds, spot = _fe_calendar()
    if season_num is None:
        page = get(_FE_BASE + "/en/results-and-standings")
        m = re.search(r'\{"id":"(\d+)","text":"[^"]*","href":"/en/results-and-standings\?season=\d+","useNext":true,"active":true',
                      _fe_flight(page))
        season_num = int(m.group(1)) if m else None
    today = datetime.date.today()
    unmapped = []

    # group rounds into weekends: same event name on consecutive dates = double-header
    weekends_r = []
    for r in sorted(rounds, key=lambda x: x["round"] or 0):
        prev = weekends_r[-1] if weekends_r else None
        if prev and prev[-1]["name"] == r["name"] and prev[-1]["endDate"] and r["startDate"]:
            gap = (datetime.date.fromisoformat(r["startDate"]) - datetime.date.fromisoformat(prev[-1]["endDate"])).days
            if 0 <= gap <= 2:
                prev.append(r)
                continue
        weekends_r.append([r])

    weekends = []
    for grp in weekends_r:
        first = grp[0]
        tz = _FE_TZ.get(first["locality"]) or _FE_TZ.get(first["venue"])
        circuit, country = first["venue"], _FE_COUNTRY.get(first["countryCode"], first["countryCode"])
        double = len(grp) > 1
        sessions = []
        for day_idx, r in enumerate(grp, 1):
            src_round = ("%s/en/results-and-standings?season=%s&round=%s" % (_FE_BASE, season_num, r["key"])
                         if season_num and r["key"] else cal_url)
            race_start = None
            if spot and spot.get("round") == r["round"]:
                race_start = _fe_iso(spot.get("raceUtc"), tz)
                meta = spot.get("meta") or ""
                if " \u00b7 " in meta:
                    circuit = meta.split(" \u00b7 ")[0].strip() or circuit
            race_date = r["endDate"] or r["startDate"]
            site_sessions = []
            if season_num and r["key"] and race_date and datetime.date.fromisoformat(race_date) <= today:
                site_sessions = _fe_round_results(season_num, r["key"])
            race_name = "Race" + ((" %d" % day_idx) if double else "")
            got_race = False
            mapped_sessions = []
            for key, label, rows, url in site_sessions:
                name, ok = _fe_map_session(key, label, double, day_idx)
                if name is None:
                    continue
                if not ok:
                    unmapped.append("%s R%s: %s" % (r["name"], r["round"], label))
                is_race = name == race_name
                got_race = got_race or is_race
                mapped_sessions.append({
                    "name": name, "championship": None,
                    "start": race_start if is_race else None,
                    "date": race_date if is_race else None,
                    "durationMinutes": None,
                    "results": [{"class": None, "rows": rows}] if rows else None,
                    "sourceUrl": url,
                })
            if not got_race:
                mapped_sessions.append({
                    "name": race_name, "championship": None, "start": race_start, "date": race_date,
                    "durationMinutes": None, "results": None,
                    "sourceUrl": src_round if not race_start else cal_url,
                })
            mapped_sessions.sort(key=_fe_session_order)
            sessions.extend(mapped_sessions)
        weekends.append({
            "name": first["name"], "circuit": circuit, "country": country, "timeZone": tz,
            "startDate": first["startDate"], "endDate": grp[-1]["endDate"],
            "rounds": [r["round"] for r in grp],
            "raceLength": {"laps": None, "distanceKm": None, "duration": None},
            "sessions": sessions,
        })

    return {
        "season": season_label,
        "weekends": weekends,
        "lineups": _fe_lineups(),
        "news": _fe_news(),
        "unmapped": unmapped,
    }


# =====================================================================
# motogp
# =====================================================================
"""MotoGP parser (official site www.motogp.com only). Python 3.9 stdlib.

Data sources (all server-rendered HTML on www.motogp.com):
  /en/calendar                -> current season + links to newer published seasons
  /en/calendar/<year>         -> hidden "structured-data-event" divs: one per event with
                                 title, circuit, country, start/end (ISO with track offset), kind GP/TEST
  /en/teams/motogp            -> MotoGP team grid with rider names
  /en/news/motogp             -> MotoGP news listing
  /en/news/rider-market       -> rider-market listing (used to tag news as "hiring")

Session timetables and results are only rendered client-side from api.pulselive.motogp.com /
api.motogp.pulselive.com (Pulselive, a third-party host), so sessions are not available here.
"""
import re
import html as _motogp_html


_MOTOGP_BASE = "https://www.motogp.com"

# Circuit -> IANA timezone (geographic fact; the site only gives a UTC offset).
_MOTOGP_TZ_BY_CIRCUIT = {
    "chang international circuit": "Asia/Bangkok",
    "lusail international circuit": "Asia/Qatar",
    "autódromo internacional de goiânia – ayrton senna": "America/Sao_Paulo",
    "autódromo oscar y juan gálvez": "America/Argentina/Buenos_Aires",
    "termas de río hondo": "America/Argentina/Tucuman",
    "circuit of the americas": "America/Chicago",
    "circuito de jerez - ángel nieto": "Europe/Madrid",
    "le mans": "Europe/Paris",
    "circuit de barcelona-catalunya": "Europe/Madrid",
    "autodromo internazionale del mugello": "Europe/Rome",
    "balaton park": "Europe/Budapest",
    "creditas autodrom brno": "Europe/Prague",
    "autodrom brno": "Europe/Prague",
    "tt circuit assen": "Europe/Amsterdam",
    "sachsenring": "Europe/Berlin",
    "silverstone circuit": "Europe/London",
    "motorland aragón": "Europe/Madrid",
    "misano world circuit marco simoncelli": "Europe/Rome",
    "red bull ring - spielberg": "Europe/Vienna",
    "mobility resort motegi": "Asia/Tokyo",
    "pertamina mandalika international circuit": "Asia/Makassar",
    "phillip island": "Australia/Melbourne",
    "adelaide street circuit": "Australia/Adelaide",
    "petronas sepang international circuit": "Asia/Kuala_Lumpur",
    "autódromo internacional do algarve": "Europe/Lisbon",
    "circuit ricardo tormo": "Europe/Madrid",
}
_MOTOGP_TZ_BY_COUNTRY = {
    "thailand": "Asia/Bangkok", "qatar": "Asia/Qatar", "brazil": "America/Sao_Paulo",
    "argentina": "America/Argentina/Buenos_Aires", "spain": "Europe/Madrid", "france": "Europe/Paris",
    "italy": "Europe/Rome", "hungary": "Europe/Budapest", "czechia": "Europe/Prague",
    "netherlands": "Europe/Amsterdam", "germany": "Europe/Berlin", "united kingdom": "Europe/London",
    "austria": "Europe/Vienna", "japan": "Asia/Tokyo", "indonesia": "Asia/Makassar",
    "malaysia": "Asia/Kuala_Lumpur", "portugal": "Europe/Lisbon",
}

_MOTOGP_SMALL = {"of", "the", "and", "de", "del"}


def _motogp_text(s):
    return re.sub(r"\s+", " ", _motogp_html.unescape(s or "")).strip()


def _motogp_titlecase(s):
    """'GRAND PRIX OF THE UNITED STATES ' -> 'Grand Prix of the United States'."""
    words = _motogp_text(s).split(" ")
    out = []
    for i, w in enumerate(words):
        lw = w.lower()
        if i > 0 and lw in _MOTOGP_SMALL:
            out.append(lw)
        elif any(c.isdigit() for c in w) or not w.isalpha() and len(w) <= 4:
            out.append(w)  # e.g. "0,0", "MICHELIN®"-style tokens are kept as given
        else:
            out.append(w[:1].upper() + w[1:].lower())
    return " ".join(out)


def _motogp_tz(circuit, country):
    tz = _MOTOGP_TZ_BY_CIRCUIT.get((circuit or "").strip().lower())
    if tz:
        return tz
    return _MOTOGP_TZ_BY_COUNTRY.get((country or "").strip().lower())


def _motogp_events(page):
    """Parse the hidden structured-data-event divs of a /en/calendar/<year> page."""
    evs = []
    for block in re.findall(r'<div\s+data-widget="structured-data-event/structured-data-event"(.*?)>', page, re.S):
        a = dict(re.findall(r'data-structured-([a-z-]+)="([^"]*)"', block))
        evs.append({k: _motogp_text(v) for k, v in a.items()})
    return evs


def _motogp_latest_season():
    """Return (year, calendar_url, page_html) for the latest season the site has published."""
    url = _MOTOGP_BASE + "/en/calendar"
    page = get(url)
    m = re.search(r'data-season-year="(\d{4})"', page)
    if not m:
        raise FetchError("motogp: calendar page has no season year")
    current = int(m.group(1))
    newer = sorted({int(y) for y in re.findall(r'["\']/en/calendar/(\d{4})["\']', page) if int(y) > current},
                   reverse=True)
    for y in newer:
        u = "%s/en/calendar/%d" % (_MOTOGP_BASE, y)
        try:
            p = get(u)
        except FetchError:
            continue
        if any(e.get("kind") == "GP" for e in _motogp_events(p)):
            return str(y), u, p
    return str(current), url, page


def _motogp_weekends(season, cal_url, page):
    weekends = []
    for e in _motogp_events(page):
        if e.get("kind") != "GP" or e.get("year") != season:
            continue
        circuit = e.get("location") or None
        country = e.get("country") or None
        weekends.append({
            "name": _motogp_titlecase(e.get("title", "")),
            "circuit": circuit,
            "country": country,
            "timeZone": _motogp_tz(circuit, country),
            "raceLength": {"laps": None, "distanceKm": None, "duration": None},
            # Session timetable is not server-rendered on motogp.com (only via the Pulselive API).
            "sessions": [],
            # Extra (not in the base shape): the official weekend window, so the site can still
            # show dates while sessions are unpublished. Safe to drop if unwanted.
            "weekendStart": e.get("start-date") or None,
            "weekendEnd": e.get("end-date") or None,
            "status": e.get("status") or None,
            "sourceUrl": cal_url,
        })
    weekends.sort(key=lambda w: w["weekendStart"] or "")
    return weekends


def _motogp_lineups():
    url = _MOTOGP_BASE + "/en/teams/motogp"
    page = get(url)
    s = page.find("teams-grid__motogp")
    e = page.find("teams-grid__moto2", s)
    seg = page[s:e] if s >= 0 else ""
    out = []
    for href, team, body in re.findall(
            r'<a class="teams-list__team".*?href="([^"]+)".*?teams-list__info-name">([^<]+)<(.*?)</a>', seg, re.S):
        drivers = [_motogp_text(x) for x in re.findall(r'teams-list__riders-name">([^<]+)<', body)]
        drivers = [d for d in drivers if d]
        if not drivers:
            continue  # e.g. test team listed under "ADDITIONAL" with no riders
        href = href if href.startswith("http") else _MOTOGP_BASE + "/" + href.lstrip("/")
        out.append({"class": None, "team": _motogp_text(team), "drivers": drivers, "sourceUrl": href})
    return out


def _motogp_news_items(page):
    items = []
    for href, title, date in re.findall(
            r'<a class="content-item__link\s*"\s*href="([^"]+)".*?content-item__title">(.*?)</h3>'
            r'.*?datetime="(\d{4}-\d{2}-\d{2})"', page, re.S):
        href = href if href.startswith("http") else _MOTOGP_BASE + href
        items.append((date, _motogp_text(re.sub(r"<[^>]+>", "", title)), href))
    return items


def _motogp_news():
    main = _motogp_news_items(get(_MOTOGP_BASE + "/en/news/motogp"))
    try:
        market = _motogp_news_items(get(_MOTOGP_BASE + "/en/news/rider-market"))
    except FetchError:
        market = []
    hiring = {u for _, _, u in market}
    seen, rows = set(), []
    for date, title, url in main + market:
        if url in seen:
            continue
        seen.add(url)
        rows.append({"date": date, "type": "hiring" if url in hiring else "news",
                     "title": title, "sourceUrl": url})
    rows.sort(key=lambda r: r["date"], reverse=True)
    return rows[:10]


def fetch_motogp():
    season, cal_url, page = _motogp_latest_season()
    weekends = _motogp_weekends(season, cal_url, page)
    if not weekends:
        raise FetchError("motogp: no GP events found on %s" % cal_url)
    for w in weekends:
        w["season"] = season
    # The current season stays listed while a newer one is published (its rounds may still be running).
    cur_url = _MOTOGP_BASE + "/en/calendar"
    if cal_url != cur_url:
        cur_page = get(cur_url)
        m = re.search(r'data-season-year="(\d{4})"', cur_page)
        if m and m.group(1) != season:
            current = _motogp_weekends(m.group(1), cur_url, cur_page)
            for w in current:
                w["season"] = m.group(1)
            weekends = current + weekends
    return {
        "season": season,
        "weekends": weekends,
        "lineups": _motogp_lineups(),
        "news": _motogp_news(),
        "unmapped": [],
    }


# =====================================================================
# wec
# =====================================================================
"""WEC parser (fiawec.com only). Python 3.9 stdlib.

Exposes fetch_wec(season=None). With season=None it uses the season the site
currently names in its navigation ("Season 2027" as of Nov 2026).
"""
import re
import json
import html as _wec_html
import datetime as _wec_dt
from html.parser import HTMLParser as _WecHTMLParser
from zoneinfo import ZoneInfo as _WecZoneInfo


_WEC_BASE = "https://www.fiawec.com"
_WEC_RESULT_WEEKENDS = 3          # fetch results for the latest N weekends that have results

# Geographic facts only: ISO3 country code (as the site gives it) -> country name / IANA zone.
_WEC_COUNTRY = {
    "QAT": "Qatar", "ITA": "Italy", "GBR": "United Kingdom", "BEL": "Belgium",
    "FRA": "France", "BRA": "Brazil", "USA": "United States", "JPN": "Japan",
    "BHR": "Bahrain", "ESP": "Spain", "POR": "Portugal", "PRT": "Portugal",
    "SAU": "Saudi Arabia", "ARG": "Argentina", "MEX": "Mexico", "CHN": "China",
    "DEU": "Germany", "GER": "Germany", "AUT": "Austria", "NLD": "Netherlands",
}
_WEC_TZ = {
    "QAT": "Asia/Qatar", "ITA": "Europe/Rome", "GBR": "Europe/London", "BEL": "Europe/Brussels",
    "FRA": "Europe/Paris", "BRA": "America/Sao_Paulo", "JPN": "Asia/Tokyo", "BHR": "Asia/Bahrain",
    "ESP": "Europe/Madrid", "POR": "Europe/Lisbon", "PRT": "Europe/Lisbon", "SAU": "Asia/Riyadh",
    "ARG": "America/Argentina/Buenos_Aires", "CHN": "Asia/Shanghai", "DEU": "Europe/Berlin",
    "GER": "Europe/Berlin", "AUT": "Europe/Vienna", "NLD": "Europe/Amsterdam",
}
# USA spans zones: decide by the city the site gives.
_WEC_US_CITY_TZ = {"austin": "America/Chicago", "sebring": "America/New_York",
                   "daytona": "America/New_York", "indianapolis": "America/Indiana/Indianapolis",
                   "monterey": "America/Los_Angeles", "las vegas": "America/Los_Angeles"}

_WEC_HIRING_RE = re.compile(
    r"\b(signs?|signed|signing|joins?|joined|hires?|hired|recruits?|recruited|promoted|elevated|"
    r"line-?up|squad|seat|to drive|drive for|replaces?|replacement|moves? to|switch(es)? to|"
    r"confirm(s|ed)? .*(driver|drivers|seat|line-?up))\b", re.I)


class _WecText(_WecHTMLParser):
    def __init__(self):
        super().__init__()
        self.out = []
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "svg"):
            self._skip += 1
        elif tag in ("br",):
            self.out.append("\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "svg") and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if not self._skip and data.strip():
            self.out.append(data.strip())


def _wec_text_tokens(fragment):
    p = _WecText()
    p.feed(fragment)
    return [t for t in p.out if t != "\n"]


def _wec_clean(s):
    return re.sub(r"\s+", " ", _wec_html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def _wec_abs(u):
    u = _wec_html.unescape(u)
    return u if u.startswith("http") else _WEC_BASE + u


def _wec_jsonld(page):
    out = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', page, re.S):
        try:
            out.append(json.loads(m.group(1)))
        except ValueError:
            pass
    return out


def _wec_tz(code, city):
    if code == "USA":
        c = (city or "").lower()
        for k, v in _WEC_US_CITY_TZ.items():
            if k in c:
                return v
        return None
    return _WEC_TZ.get(code)


def _wec_session_name(official):
    """Map the site's session label to the series-table name + class label.
    Returns (name, class_label, mapped)."""
    o = _wec_clean(official)
    parts = [p.strip() for p in o.split(" - ", 1)]
    base, cls = parts[0], (parts[1] if len(parts) > 1 else None)
    if cls:
        cls = "Hypercar" if cls.upper() == "HYPERCAR" else cls
    b = base.lower()
    m = re.match(r"free practice\s*(\d+)$", b)
    if m and m.group(1) in ("1", "2", "3"):
        return "FP%s" % m.group(1), cls, True
    if re.match(r"(qualifying|qualifying practice)$", b):
        return "Qualifying", cls, True
    if re.match(r"hyperpole(\s*\d+)?$", b):
        return "Hyperpole", cls, True
    if b == "race":
        return "Race", cls, True
    return o, cls, False


def _wec_race_length(name):
    rl = {"laps": None, "distanceKm": None, "duration": None}
    m = re.search(r"(\d+)\s*Hours?\b", name, re.I)
    if m:
        rl["duration"] = "%s Hours" % m.group(1)
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*km\b", name, re.I)
    if m:
        rl["distanceKm"] = float(m.group(1).replace(",", "."))
    return rl


def _wec_parse_race_page(url, page):
    # weekend name from the h1 spans
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S)
    name = _wec_clean(h1.group(1)) if h1 else None
    city = code = circuit = None
    ev_start = None
    for d in _wec_jsonld(page):
        if d.get("@type") == "SportsEvent" and "location" in d:
            loc = d.get("location") or {}
            circuit = loc.get("name")
            addr = loc.get("address") or ""
            if "," in addr:
                city, code = [x.strip() for x in addr.rsplit(",", 1)]
            else:
                code = addr.strip() or None
            ev_start = d.get("startDate")
            if not name:
                name = re.sub(r"^WEC\s+|\s+\d{4}$", "", d.get("name") or "") or None
    tzname = _wec_tz(code, city)
    tz = _WecZoneInfo(tzname) if tzname else None

    sessions, unmapped = [], []
    # session blocks: label div, then either a timestamp span or TBC, then optional results link
    blocks = re.split(r'<div class="d-flex flex-column align-items-start gap-1">', page)[1:]
    for b in blocks:
        lab = re.search(r'<div class="fw-bold lh-sm\s*">(.*?)</div>', b, re.S)
        if not lab:
            continue
        official = _wec_clean(lab.group(1))
        ts = re.search(r'data-timestamp="(\d+)"', b)
        start = None
        if ts and tz is not None:
            start = _wec_dt.datetime.fromtimestamp(int(ts.group(1)), tz).isoformat()
        res = re.search(r'href="([^"]*resultats-1\?raceId=(\d+)&amp;sessionId=(\d+))"', b)
        sname, cls, mapped = _wec_session_name(official)
        if not mapped:
            unmapped.append(official)
        sessions.append({
            "name": sname,
            "championship": None,
            "class": cls,                       # extra field: class split of qualifying/hyperpole
            "officialName": official,           # extra field: the site's own label
            "start": start,
            "durationMinutes": None,
            "results": None,
            "sourceUrl": url,
            "_resultsUrl": _wec_abs(res.group(1)) if res else None,
        })
    weekend = {
        "name": name, "circuit": circuit, "country": _WEC_COUNTRY.get(code, code),
        "timeZone": tzname,
        "raceLength": _wec_race_length(name or ""),
        "sessions": sessions,
        "_sortKey": ev_start or "",
    }
    return weekend, unmapped


def _wec_parse_results(page):
    """Parse the results table(s) rendered server-side (only the default class is rendered)."""
    out = []
    for m in re.finditer(
            r'<div class="ff-normal text-uppercase fs-7[^>]*>(.*?)</div>\s*'
            r'.*?<table[^>]*>(.*?)</table>', page, re.S):
        header = _wec_clean(m.group(1))
        cls = re.sub(r"\s*-\s*(Final|Provisional|Official|Unofficial).*$", "", header, flags=re.I).strip()
        if cls.upper() == "HYPERCAR":
            cls = "Hypercar"
        table = m.group(2)
        heads = [_wec_clean(h).lower() for h in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>",
                                                            re.search(r"<thead>(.*?)</thead>", table, re.S).group(1), re.S)]
        body = re.search(r"<tbody>(.*?)</tbody>", table, re.S)
        rows = []
        for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", body.group(1) if body else "", re.S):
            cells = [_wec_clean(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)]
            if len(cells) < len(heads):
                continue
            rec = dict(zip(heads, cells))
            pos = rec.get("pos.", "")
            pos = int(pos) if pos.isdigit() else (pos or None)
            num = (rec.get("n°") or "").lstrip("#") or None
            if "total time" in rec:      # race
                tog = rec.get("total time") if pos == 1 else (rec.get("gap") or None)
                if tog in ("-", ""):
                    tog = rec.get("total time")
            else:                        # practice / qualifying / hyperpole: best lap
                tog = rec.get("best lap") or rec.get("time") or None
            rows.append({"pos": pos, "name": None, "team": rec.get("team") or None,
                         "number": num, "timeOrGap": tog or None})
        if rows:
            out.append({"class": cls or None, "rows": rows})
    return out or None


def _wec_news():
    page = get(_WEC_BASE + "/en/news")
    links, seen = [], set()
    for m in re.finditer(r'<a [^>]*href="(https://www\.fiawec\.com/en/news/[^"/?]+/\d+)"[^>]*>(.*?)</a>', page, re.S):
        u, title = m.group(1), _wec_clean(m.group(2))
        if u in seen or not title:
            continue
        seen.add(u)
        links.append((u, title))
        if len(links) >= 10:
            break
    news = []
    for u, title in links:
        try:
            art = get(u)
        except FetchError:
            continue
        date = None
        for d in _wec_jsonld(art):
            if d.get("@type") == "NewsArticle":
                date = (d.get("datePublished") or "")[:10] or None
                title = d.get("headline") or title
        if not date:
            continue
        news.append({"date": date, "type": "hiring" if _WEC_HIRING_RE.search(title) else "news",
                     "title": title, "sourceUrl": u})
    news.sort(key=lambda n: n["date"], reverse=True)
    return news


def _wec_lineups(season):
    url = _WEC_BASE + "/en/page/grid"
    page = get(url)
    cars = []
    for u in re.findall(r'href="(/en/car/%s/[0-9A-Za-z]+)"' % re.escape(season), page):
        if u not in cars:
            cars.append(u)
    lineups = []
    for u in cars:
        cu = _WEC_BASE + u
        try:
            cp = get(cu)
        except FetchError:
            continue
        toks = _wec_text_tokens(cp)

        def after(label):
            try:
                i = toks.index(label, toks.index("Information") if "Information" in toks else 0)
                return toks[i + 1]
            except (ValueError, IndexError):
                return None
        cls = after("Category")
        if cls and cls.upper() == "HYPERCAR":
            cls = "Hypercar"
        team = after("Full team name")
        number = u.rsplit("/", 1)[-1]          # car number as in the site URL (e.g. 007)
        drivers = []
        dsec = re.search(r"<span>Drivers</span>(.*?)(Back to grid|</section>)", cp, re.S)
        if dsec:
            drivers = [_wec_clean(x) for x in
                       re.findall(r'<div class="py-4">(.*?)<br', dsec.group(1), re.S)]
            drivers = [d for d in drivers if d]
        lineups.append({"class": cls, "team": team, "number": number,
                        "drivers": drivers, "sourceUrl": cu})
    order = {"Hypercar": 0, "LMP2": 1, "LMGT3": 2}
    lineups.sort(key=lambda x: (order.get(x["class"], 9), x["team"] or "",
                                int(re.sub(r"\D", "", x["number"] or "0") or 0)))
    return lineups


def fetch_wec(season=None):
    home = get(_WEC_BASE + "/en/")
    m = re.search(r"Season\s+(\d{4}(?:\s*[-–]\s*\d{2,4})?)", _wec_clean(home))
    site_season = m.group(1).replace(" ", "") if m else None
    if season is None:
        if not site_season:
            raise FetchError("fiawec.com: could not find the current season label")
        season = site_season
        src = home
    else:
        src = get(_WEC_BASE + "/en/season/%s" % season)
    race_urls = []
    for u in re.findall(r'href="((?:https://www\.fiawec\.com)?/en/race/[a-z0-9-]+-%s)"' % re.escape(season), src):
        u = _wec_abs(u)
        if u not in race_urls:
            race_urls.append(u)
    if not race_urls and season == site_season:
        src = get(_WEC_BASE + "/en/season/%s" % season)
        for u in re.findall(r'href="((?:https://www\.fiawec\.com)?/en/race/[a-z0-9-]+-%s)"' % re.escape(season), src):
            u = _wec_abs(u)
            if u not in race_urls:
                race_urls.append(u)
    if not race_urls:
        raise FetchError("fiawec.com: no race pages found for season %s" % season)

    weekends, unmapped = [], []
    for u in race_urls:
        wk, um = _wec_parse_race_page(u, get(u))
        # the season page also links non-championship events (e.g. the Official Prologue test):
        # keep only weekends the site schedules a Race for
        if not any(s["name"] == "Race" for s in wk["sessions"]) and wk["sessions"]:
            continue
        weekends.append(wk)
        unmapped.extend(x for x in um if x not in unmapped)
    weekends.sort(key=lambda w: w["_sortKey"])

    # results: latest N weekends that have result links
    with_res = [w for w in weekends if any(s["_resultsUrl"] for s in w["sessions"])]
    for w in with_res[-_WEC_RESULT_WEEKENDS:]:
        for s in w["sessions"]:
            if s["_resultsUrl"]:
                try:
                    s["results"] = _wec_parse_results(get(s["_resultsUrl"]))
                except FetchError:
                    s["results"] = None
                if s["results"]:
                    s["sourceUrl"] = s["_resultsUrl"]
    for w in weekends:
        w.pop("_sortKey", None)
        for s in w["sessions"]:
            s.pop("_resultsUrl", None)

    try:
        lineups = _wec_lineups(season)
    except FetchError:
        lineups = []
    try:
        news = _wec_news()
    except FetchError:
        news = []
    return {"season": season, "weekends": weekends, "lineups": lineups,
            "news": news, "unmapped": unmapped}


# =====================================================================
# imsa
# =====================================================================
# IMSA parser.
# No imsa.com page can be read by this script: www.imsa.com answers every request with a
# Cloudflare browser check, and results.imsa.com redirects to imsa.results.alkamelcloud.com
# over TLS 1.3 only. The client chose sportscar365.com as the fallback source (README.md).
# sportscar365.com publishes WeatherTech news as an RSS feed, but no schedule, result tables
# or entry lists in a form a script can read, so those stay empty and the page shows the
# PRD's empty wording. Nothing is filled in from memory.
import email.utils as _imsa_email_utils
import xml.etree.ElementTree as _imsa_ET


_IMSA_FEED = "https://sportscar365.com/category/imsa/iwsc/feed/"
_IMSA_HIRING = ("lands", "signs", "joins", "steps up", "return to", "returns to", "set for",
                "confirmed", "confirms", "seat", "drive", "replacement", "switches to", "named")


def fetch_imsa():
    text = get(_IMSA_FEED, accept="application/rss+xml,application/xml;q=0.9,*/*;q=0.8")
    try:
        root = _imsa_ET.fromstring(text.encode("utf-8"))
    except _imsa_ET.ParseError as e:
        raise FetchError("sportscar365.com feed could not be read: %s" % e)
    news = []
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = item.findtext("pubDate")
        # Only WeatherTech articles on sportscar365.com itself (the feed also carries
        # cross-posted items from other series and links to other sites).
        if not link.startswith("https://sportscar365.com/imsa/iwsc/") or not pub:
            continue
        try:
            date = _imsa_email_utils.parsedate_to_datetime(pub).date().isoformat()
        except (TypeError, ValueError):
            continue
        low = title.lower()
        news.append({
            "date": date,
            "type": "hiring" if any(k in low for k in _IMSA_HIRING) else "news",
            "title": title,
            "sourceUrl": link,
        })
    if not news:
        raise FetchError("sportscar365.com feed had no WeatherTech items")
    news.sort(key=lambda n: n["date"], reverse=True)
    return {
        "siteName": "sportscar365.com",
        "season": None,      # sportscar365.com publishes no season schedule a script can read
        "weekends": [],
        "lineups": [],
        "news": news[:10],
        "unmapped": [],
    }


# =====================================================================
# Main: refresh every series, keep hand-written fields, write the file.
# =====================================================================

import os as _os
import sys as _sys
import json as _json
import datetime as _dt

_ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_DATA = _os.path.join(_ROOT, "data", "data.js")
_PREFIX = "window.PP_DATA = "


def _with_current_season(fetch):
    """Latest season the site publishes, plus the current calendar year's season when that is
    an earlier one: its remaining rounds and results stay on the site until it ends."""
    def run():
        latest = fetch()
        try:
            year = _dt.date.today().year
            if latest.get("season") and int(str(latest["season"])[:4]) > year:
                current = fetch(str(year))
                for w in current.get("weekends") or []:
                    w["season"] = current.get("season")
                for w in latest.get("weekends") or []:
                    w["season"] = latest.get("season")
                latest["weekends"] = (current.get("weekends") or []) + (latest.get("weekends") or [])
                if not latest.get("lineups") and current.get("lineups"):
                    latest["lineups"] = current["lineups"]  # next season's entry list not published yet
                latest["unmapped"] = list(dict.fromkeys((current.get("unmapped") or []) + (latest.get("unmapped") or [])))
        except FetchError as e:
            print("  note: the current season could not be read (%s); showing the latest season only" % e)
        return latest
    return run

# id, display name, site name, parser
_SERIES = [
    ("formula-1", "Formula 1", "formula1.com", _with_current_season(fetch_formula_1)),
    ("f1-academy", "F1 Academy", "f1academy.com", fetch_f1_academy),
    ("formula-e", "Formula E", "fiaformulae.com", fetch_formula_e),
    ("motogp", "MotoGP", "motogp.com", fetch_motogp),
    ("wec", "WEC", "fiawec.com", _with_current_season(fetch_wec)),
    ("imsa", "IMSA", "sportscar365.com", fetch_imsa),
]

_DEATH_WORDS = ("died", "death", "fatal", "killed", "passed away", "tragic")
_NEWS_KEEP = 10


def _now_iso():
    return _dt.datetime.now().astimezone().replace(microsecond=0).isoformat()


def _load_old():
    try:
        with open(_DATA, encoding="utf-8") as f:
            text = f.read().strip()
        if text.startswith(_PREFIX) and text.endswith(";"):
            return _json.loads(text[len(_PREFIX):-1])
    except (OSError, ValueError):
        pass
    return None


def _weekend_dates(w):
    """Add startDate / endDate (track-local YYYY-MM-DD) when the parser gave them in another form."""
    if not w.get("startDate"):
        for k in ("weekendStart",):
            if w.get(k):
                w["startDate"] = w[k][:10]
    if not w.get("endDate"):
        for k in ("weekendEnd",):
            if w.get(k):
                w["endDate"] = w[k][:10]
    return w


def _weekend_season(w, season):
    """Every weekend names its season. A series can list two (this season and an announced next one)."""
    if not w.get("season"):
        w["season"] = season
    return w


def _season_now(raw):
    """The season a series page covers: the season of the latest weekend that has started
    (the one under Latest results), otherwise the earliest season listed."""
    today = _dt.date.today().isoformat()
    best, first = None, None
    for w in raw.get("weekends") or []:
        starts = [x.get("start") or x.get("date") for x in (w.get("sessions") or []) if x.get("start") or x.get("date")]
        st = (min(starts) if starts else (w.get("startDate") or w.get("weekendStart") or ""))[:10]
        if not st or not w.get("season"):
            continue
        if first is None or st < first[0]:
            first = (st, str(w["season"]))
        if st <= today and (best is None or st > best[0]):
            best = (st, str(w["season"]))
    return (best or first or (None, raw.get("season")))[1]


def _build_series(sid, name, site, raw, old_series):
    site = raw.get("siteName") or site  # a fallback source names the site the data really came from
    old_captions = {}
    if old_series:
        for n in old_series.get("news") or []:
            if n.get("caption") and n.get("sourceUrl"):
                old_captions[n["sourceUrl"]] = n["caption"]

    news = []
    for n in raw.get("news") or []:
        title = (n.get("title") or "").lower()
        if any(w in title for w in _DEATH_WORDS):
            print("  skipped (death or fatal accident): %s" % n.get("sourceUrl"))
            continue
        news.append({
            "date": n.get("date"),
            "type": "hiring" if n.get("type") == "hiring" else "news",
            "caption": old_captions.get(n.get("sourceUrl")),
            "sourceUrl": n.get("sourceUrl"),
        })
    news.sort(key=lambda x: x.get("date") or "", reverse=True)
    news = news[:_NEWS_KEEP]

    for u in raw.get("unmapped") or []:
        print("  unmapped session name (shown under the site's own name): %s" % u)

    return {
        "id": sid,
        "name": name,
        "siteName": site,
        "season": _season_now(raw),
        "fetchedAt": None,  # set to the finish time below
        "weekends": [_weekend_season(_weekend_dates(w), raw.get("season")) for w in raw.get("weekends") or []],
        "lineups": raw.get("lineups") or [],
        "news": news,
    }


def _summary(s):
    weekends = s.get("weekends") or []
    with_results = sum(1 for w in weekends for x in (w.get("sessions") or []) if x.get("results"))
    return "%-11s season %-8s weekends %3d  sessions with results %3d  line-up entries %3d  news items %3d" % (
        s["name"], s.get("season"), len(weekends), with_results, len(s.get("lineups") or []), len(s.get("news") or []))


def main():
    old = _load_old() or {}
    old_by_id = {s.get("id"): s for s in old.get("series") or []}
    out_series, failed = [], []

    for sid, name, site, fn in _SERIES:
        print("Refreshing %s from %s ..." % (name, site))
        try:
            raw = fn()
            out_series.append(_build_series(sid, name, site, raw, old_by_id.get(sid)))
        except Exception as e:  # keep the old data for this series
            reason = str(e) or e.__class__.__name__
            print("  FAILED: %s could not be refreshed (%s). Keeping its old data." % (name, reason))
            failed.append(name)
            if sid in old_by_id:
                out_series.append(old_by_id[sid])

    if len(failed) == len(_SERIES):
        print("\nEvery series failed, so data/data.js was not changed.")
        return 1

    # One finish time for the whole run: lastUpdated, and fetchedAt of every series refreshed now.
    finished = _now_iso()
    for s in out_series:
        if s.get("fetchedAt") is None:
            s["fetchedAt"] = finished

    data = {
        "schemaVersion": 1,
        "lastUpdated": finished,
        "series": out_series,
        "photos": old.get("photos") or [],
        "teamColours": old.get("teamColours") or [],   # hand-written, like photos
    }
    text = _PREFIX + _json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
    tmp = _DATA + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    _os.replace(tmp, _DATA)

    print("\nSummary")
    for s in out_series:
        print("  " + _summary(s))
    print("  requests made: %d" % len(REQUEST_LOG))
    if failed:
        print("\nNot refreshed: %s. Their pages show the refresh notice." % ", ".join(failed))
        return 1
    print("\nDone. data/data.js was rewritten.")
    return 0


if __name__ == "__main__":
    _sys.exit(main())
