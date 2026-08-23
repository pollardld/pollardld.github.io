#!/usr/bin/env python3
"""Structural, accessibility, and link checks for the hand-written pages of this site.

WHY this exists: the site has no build step and no framework, so nothing catches a
dangling anchor, a missing alt, a second <h1>, or an aria-labelledby pointing at an id
that was deleted three commits ago. The site had all four of those before the rebuild.
Standard library only — no network, no install.

Run: python3 scripts/check-html.py
"""
import html.parser
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted([ROOT / "index.html"] + list((ROOT / "projects").glob("*.html")))

# Assets referenced from HTML that must exist on disk.
ASSET_ATTRS = {"link": "href", "script": "src", "img": "src", "source": "srcset"}
EXTERNAL = re.compile(r"^(https?:|mailto:|tel:|data:|//)")


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.dup_ids = []
        self.h1 = []
        self.anchors = []          # (href, line)
        self.labelledby = []       # (id, line)
        self.assets = []           # (path, line)
        self.imgs_no_alt = []
        self.title = None
        self.meta = {}
        self._in_title = False
        self._heads = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if "id" in a:
            if a["id"] in self.ids:
                self.dup_ids.append((a["id"], line))
            self.ids.add(a["id"])
        if tag == "h1":
            self.h1.append(line)
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heads.append((int(tag[1]), line))
        if tag == "a" and "href" in a:
            self.anchors.append((a["href"], line))
        if "aria-labelledby" in a:
            for ref in a["aria-labelledby"].split():
                self.labelledby.append((ref, line))
        if tag == "img" and not a.get("alt") and a.get("aria-hidden") != "true":
            self.imgs_no_alt.append(line)
        if tag == "title":
            self._in_title = True
        if tag == "meta" and a.get("name"):
            self.meta[a["name"]] = a.get("content", "")
        if tag == "meta" and a.get("property"):
            self.meta[a["property"]] = a.get("content", "")
        attr = ASSET_ATTRS.get(tag)
        if attr and a.get(attr) and not EXTERNAL.match(a[attr]):
            self.assets.append((a[attr].split("?")[0], line))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title = (self.title or "") + data.strip()


def parse(path):
    p = Page()
    p.feed(path.read_text(encoding="utf-8"))
    return p


def check(path, parsed, all_ids):
    problems = []
    p = parsed[path]
    rel = path.relative_to(ROOT)

    if len(p.h1) != 1:
        problems.append(f"expected exactly one <h1>, found {len(p.h1)} (lines {p.h1 or 'none'})")
    for dup, line in p.dup_ids:
        problems.append(f"line {line}: duplicate id={dup!r}")
    for ref, line in p.labelledby:
        if ref not in p.ids:
            problems.append(f"line {line}: aria-labelledby={ref!r} points at no element on this page")
    for href, line in p.anchors:
        if href.startswith("#") and len(href) > 1 and href[1:] not in p.ids:
            problems.append(f"line {line}: anchor {href} has no target on this page")
        elif not href.startswith("#") and not EXTERNAL.match(href):
            file_part, _, frag = href.partition("#")
            target = (path.parent / file_part).resolve()
            if not target.exists():
                problems.append(f"line {line}: link {href} resolves to a missing file")
            elif frag and target in all_ids and frag not in all_ids[target]:
                problems.append(
                    f"line {line}: link {href} points at #{frag}, which does not exist "
                    f"in {target.relative_to(ROOT)}"
                )
    for asset, line in p.assets:
        if not (path.parent / asset).resolve().exists():
            problems.append(f"line {line}: asset {asset} does not exist on disk")
    for line in p.imgs_no_alt:
        problems.append(f"line {line}: <img> without alt (use alt=\"\" plus aria-hidden for decoration)")
    if not p.title:
        problems.append("missing <title>")
    desc = p.meta.get("description", "")
    if not desc:
        problems.append("missing <meta name=\"description\">")
    elif not 50 <= len(desc) <= 160:
        problems.append(f"meta description is {len(desc)} chars; keep it between 50 and 160")
    for required in ("og:title", "og:description", "og:url", "og:type"):
        if required not in p.meta:
            problems.append(f"missing <meta property=\"{required}\">")
    levels = [lv for lv, _ in p._heads]
    for i in range(1, len(levels)):
        if levels[i] - levels[i - 1] > 1:
            problems.append(
                f"heading level jumps from h{levels[i-1]} to h{levels[i]} "
                f"at line {p._heads[i][1]}"
            )
    return rel, problems


def main():
    if not PAGES:
        print("check-html: no pages found — is this the repo root?", file=sys.stderr)
        return 2
    parsed = {path: parse(path) for path in PAGES}
    all_ids = {path: page.ids for path, page in parsed.items()}
    failed = 0
    for path in PAGES:
        rel, problems = check(path, parsed, all_ids)
        if problems:
            failed += 1
            print(f"FAIL {rel}")
            for problem in problems:
                print(f"    {problem}")
        else:
            print(f"ok   {rel}")
    if failed:
        print(f"\ncheck-html: {failed} of {len(PAGES)} page(s) failed")
        return 1
    print(f"\ncheck-html: {len(PAGES)} page(s) clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())
