#!/usr/bin/env python3
"""Pace & Publish headline captions, written in Claude Code (no API key, no extra cost).

Used by the /caption-headlines command (.claude/commands/caption-headlines.md):

  python3 scripts/captions.py todo
      Lists every official headline missing our short headline ("caption") or its
      summary, with the article text and the rules. Reads each article from the official site.

  python3 scripts/captions.py apply < captions.json
      Saves them into data/generated/headlines.js. Input is a JSON object
      {"<sourceUrl>": {"caption": "<short headline>", "summary": "<1-2 sentences>"}, ...}.
      Only missing fields are filled; existing text is never overwritten. Items get
      captionBy "Claude Code" and today's date.

Same rules as the optional API step in scripts/refresh.py (its _CAPTION_SYSTEM text).
Python 3 standard library only.
"""
import datetime
import importlib.util
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location("refresh", os.path.join(ROOT, "scripts", "refresh.py"))
refresh = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(refresh)

ARTICLE_CHARS = 6000   # enough of each article to caption it; keeps the listing readable


def load():
    heads = refresh._read_js("headlines", "headlines")
    if not heads:
        sys.exit("data/generated/headlines.js could not be read.")
    return heads


def uncaptioned(heads):
    return [(sid, n) for sid, items in (heads.get("series") or {}).items()
            for n in items if refresh._needs_text(n)]


def todo():
    heads = load()
    items = uncaptioned(heads)
    if not items:
        print("Every headline already has our headline and summary. Nothing to do.")
        return 0
    names = {sid: name for sid, name, _site, _f in refresh._registry()}
    print("CAPTION RULES\n=============\n" + refresh._CAPTION_SYSTEM + "\n")
    print("%d HEADLINE(S) NEED TEXT\n" % len(items))
    for i, (sid, n) in enumerate(items, 1):
        print("=" * 70)
        print("[%d] series: %s | date: %s" % (i, names.get(sid, sid), n.get("date")))
        print("sourceUrl: %s" % n["sourceUrl"])
        if n.get("caption"):
            print("our headline (keep it, write the summary only): %s" % n["caption"])
        else:
            print("needs: headline and summary")
        try:
            text = refresh._article_text(n["sourceUrl"])
        except refresh.FetchError as e:
            text = ""
            print("(article could not be read: %s)" % e)
        print("<article>\n%s\n</article>" % (text[:ARTICLE_CHARS] or "(no text)"))
    print("=" * 70)
    print('\nSave with:  python3 scripts/captions.py apply  and a JSON object '
          '{"<sourceUrl>": {"caption": "...", "summary": "..."}} on stdin.')
    return 0


def apply():
    try:
        captions = json.load(sys.stdin)
    except ValueError as e:
        sys.exit("Input must be a JSON object {\"<sourceUrl>\": \"<caption>\"}: %s" % e)
    if not isinstance(captions, dict):
        sys.exit("Input must be a JSON object {\"<sourceUrl>\": \"<caption>\"}.")
    heads = load()
    today = datetime.date.today().isoformat()
    saved, skipped = 0, []
    by_url = {n.get("sourceUrl"): n for _sid, n in [(s, n) for s, items in heads["series"].items() for n in items]}
    for url, given in captions.items():
        n = by_url.get(url)
        if isinstance(given, str):
            given = {"summary": given}
        given = {k: (given.get(k) or "").strip() for k in ("caption", "summary")} if isinstance(given, dict) else {}
        if n is None:
            skipped.append((url, "not a current headline"))
            continue
        changed = False
        for k, limit in (("caption", 160), ("summary", 400)):
            text = given.get(k, "")
            if n.get(k) or not text or text.upper() == "SKIP":
                continue
            if len(text) > limit or "\n" in text:
                skipped.append((url, "%s must be one line, at most %d characters" % (k, limit)))
                continue
            n[k] = text
            changed = True
        if changed:
            n["captionBy"], n["captionedAt"] = "Claude Code", today
            saved += 1
        else:
            skipped.append((url, "nothing new to save"))
    if saved:
        sched = refresh._read_js("schedule", "schedule") or {}
        refresh._write("headlines", "headlines", heads, sched.get("lastUpdated") or refresh._now_iso())
    print("%d headline(s) updated in data/generated/headlines.js." % saved)
    for url, why in skipped:
        print("  skipped %s (%s)" % (url, why))
    left = len(uncaptioned(heads))
    print("%d headline(s) still missing our headline or summary." % left)
    return 0


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "todo":
        sys.exit(todo())
    if cmd == "apply":
        sys.exit(apply())
    print(__doc__)
    sys.exit(1)
