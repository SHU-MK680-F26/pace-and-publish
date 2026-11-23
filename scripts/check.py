#!/usr/bin/env python3
"""Pace & Publish site check. Run before every commit:   python3 scripts/check.py

Checks that everything the site refers to actually exists:
  - every local file a page or data file points at (images, scripts, styles, video)
  - every photo id (photo:, map:) is in data/photos.js, and every photo has its credit fields
  - every series id used in news, generated data and the guide is in data/series.js
  - every page in the nav (js/layout.js) exists
Guide content (terms, tactics, tracks, races) is also checked in the browser:
open any Learn page and look at the console.
Python 3 standard library only. Exit code 0 = all good, 1 = problems listed.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
problems = []


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def js_json(rel, var):
    """The JSON value assigned to window.PP.<var> in a data file written as JSON."""
    text = read(rel)
    i = text.index("window.PP.%s = " % var) + len("window.PP.%s = " % var)
    return json.loads(text[i:].strip().rstrip(";"))


def problem(where, msg):
    problems.append("%s: %s" % (where, msg))


# ---- series registry ----
registry = read("data/series.js")
series_ids = re.findall(r'\bid: "([a-z0-9-]+)"', registry[registry.index("window.PP.series"):])
GUIDE_KEYS = {"all", "other"}
if len(set(series_ids)) != len(series_ids):
    problem("data/series.js", "duplicate series id")
tokens = read("css/tokens.css")
components = read("css/components.css")
for sid in series_ids:
    if "--series-%s-bg" % sid not in tokens:
        problem("css/tokens.css", 'no tag colors for series "%s" (add --series-%s-bg/-fg/-ring)' % (sid, sid))
    if ".tag--%s" % sid not in components:
        problem("css/components.css", 'no .tag--%s rule' % sid)

# ---- photos ----
photos = js_json("data/photos.js", "photos")
for pid, p in photos.items():
    for f in ("src", "alt", "author", "license", "sourceUrl"):
        if not p.get(f):
            problem("data/photos.js", 'photo "%s" is missing "%s" (every photo needs a full credit)' % (pid, f))
    if p.get("src") and not p.get("remote") and not os.path.exists(os.path.join(ROOT, p["src"])):
        problem("data/photos.js", 'photo "%s": file %s does not exist' % (pid, p["src"]))
for rel in ["data/series.js", "data/tracks.js", "data/news.js"]:
    for kind, pid in re.findall(r'\b(photo|map):\s*"([^"]+)"', read(rel)):
        if pid not in photos:
            problem(rel, '%s "%s" is not in data/photos.js' % (kind, pid))

# ---- news ----
for n in js_json("data/news.js", "news"):
    for sid in n.get("series", []):
        if sid not in series_ids:
            problem("data/news.js", 'story "%s": unknown series "%s"' % (n.get("id"), sid))
    if not (n.get("source") or {}).get("url"):
        problem("data/news.js", 'story "%s" has no source url' % n.get("id"))
    if n.get("graphic") and not os.path.exists(os.path.join(ROOT, n["graphic"])):
        problem("data/news.js", 'story "%s": graphic %s does not exist' % (n.get("id"), n["graphic"]))

# ---- generated data ----
for rel, var in [("data/generated/schedule.js", "schedule"), ("data/generated/lineups.js", "lineups"), ("data/generated/headlines.js", "headlines")]:
    for sid in js_json(rel, var).get("series", {}):
        if sid not in series_ids:
            problem(rel, 'data for "%s", which is not in data/series.js (fine to keep, but it will not show)' % sid)

# ---- guide series keys ----
for rel in ["data/terms.js", "data/tactics.js", "data/tracks.js", "data/races.js"]:
    for arr in re.findall(r"series: \[([^\]]*)\]", read(rel)):
        for sid in re.findall(r'"([^"]+)"', arr):
            if sid not in series_ids and sid not in GUIDE_KEYS and sid not in re.findall(r'key: "([^"]+)"', read("data/series-history.js")):
                problem(rel, 'unknown series "%s"' % sid)

# ---- local files referenced from pages ----
pages = sorted(f for f in os.listdir(ROOT) if f.endswith(".html"))
for page in pages:
    html = read(page)
    for ref in re.findall(r'(?:src|href|data-video)="([^"#?]+)', html):
        if re.match(r"^(https?:|mailto:|data:)", ref):
            continue
        if not os.path.exists(os.path.join(ROOT, ref)):
            problem(page, "links to %s, which does not exist" % ref)

# ---- nav pages ----
for href in re.findall(r'href: "([a-z0-9-]+\.html)"', read("js/layout.js")):
    if not os.path.exists(os.path.join(ROOT, href)):
        problem("js/layout.js", "nav links to %s, which does not exist" % href)

if problems:
    print("Found %d problem(s):" % len(problems))
    for p in problems:
        print("  - " + p)
    sys.exit(1)
print("All checks passed: %d pages, %d series, %d photos." % (len(pages), len(series_ids), len(photos)))
