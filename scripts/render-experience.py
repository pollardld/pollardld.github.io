#!/usr/bin/env python3
"""Render resume_data.json into index.html between the experience markers.

Usage:
    python3 scripts/render-experience.py
    python3 scripts/render-experience.py --check
"""

import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
DATA = ROOT / "resume_data.json"

START = "<!-- experience:start -->"
END = "<!-- experience:end -->"
INDENT = " " * 20


def card(entry):
    def esc(key, default=""):
        return html.escape(str(entry.get(key, default)), quote=True)

    lines = [
        '<article class="experience-card reveal">',
        f"    <h3>{esc('role', 'Role')}</h3>",
        f"    <h4>{esc('company')}</h4>",
        f'    <p class="experience-date">{esc("date")}</p>',
        f"    <p>{esc('description')}</p>",
        "</article>",
    ]
    return "\n".join(INDENT + line for line in lines)


def render():
    entries = json.loads(DATA.read_text(encoding="utf-8")).get("experience", [])
    if not entries:
        raise SystemExit(
            "render-experience: resume_data.json has no experience entries"
        )
    body = "\n".join(card(e) for e in entries)
    return f"{START}\n{body}\n{INDENT}{END}"


def main():
    source = INDEX.read_text(encoding="utf-8")
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    if not pattern.search(source):
        raise SystemExit(
            f"render-experience: markers not found in index.html.\n"
            f"Add {START} and {END} inside the experience grid first."
        )
    updated = pattern.sub(lambda _: render(), source)
    if "--check" in sys.argv:
        if updated != source:
            print("render-experience: index.html is out of date with resume_data.json.")
            print("Run: npm run build:experience")
            return 1
        print("render-experience: index.html matches resume_data.json")
        return 0
    INDEX.write_text(updated, encoding="utf-8")
    print(
        f"render-experience: wrote {len(json.loads(DATA.read_text())['experience'])} entries"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
