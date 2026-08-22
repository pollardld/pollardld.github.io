# Evidence ledger

The rule the whole rebuild turns on: **every claim on the public site must trace to one
of four evidence types** — a live product, public code, an independent source, or an
approved internal artifact. If a sentence cannot cite one of the four, it does not ship.

This file is the source of truth. It lives in the repo at `EVIDENCE-LEDGER.md` (Task 02
puts it there). When a new claim is added to the site, add its row here in the same commit.

Legend — **Type:** L = live product · C = public code · I = independent source · A = internal artifact
**Permission:** public = already published by a third party · needed = requires sign-off before use

---

## Cleared for publication

| Claim as it appears on the site | Type | Source | Permission | Confidence |
|---|---|---|---|---|
| Engineering lead on OceanAdapt | C | `humans.txt` in Ecotrust/oceanadapt — https://raw.githubusercontent.com/Ecotrust/oceanadapt/main/humans.txt | public | High |
| OceanAdapt lets people explore distribution change for more than 650 marine species over roughly four decades | I | NOAA Fisheries feature — https://www.fisheries.noaa.gov/feature-story/oceanadapt-website-tracking-fish-populations-climate-changes | public | High |
| Work originating in OceanAdapt entered the Fourth National Climate Assessment and the USGCRP indicator set | I | U.S. Climate Resilience Toolkit — https://toolkit.climate.gov/tool/oceanadapt | public | High |
| Built OceanAdapt's search, map queries, charts, downloads, future projections, seasonal views, and comparison controls | C | Commits: 3c8014d (projections), eeaf793 (comparison), fac522f (full download) in Ecotrust/oceanadapt | public | High |
| Snow2Flow is a free decision-support tool for forest and stream restoration practitioners supporting salmon recovery in north-central Washington | L | https://s2f.ucsrb.org/ — wording taken from the tool's own page | public | High |
| Built Snow2Flow's scenario workflow: stream selection, treatment areas, map layers, results panels | C | Commits: 9f74305, f77c28a, f712f47 in Ecotrust/ucsrb | public | High |
| Named co-author of LandMapper, a free open-source stewardship-planning application for Oregon and Washington | I | Western SARE information product — https://projects.sare.org/information-product/landmapper/ | public | High |
| The associated Western SARE project received $349,981 | I | https://projects.sare.org/information-product/landmapper/ | public | High |
| LandMapper is used in woodland-owner education | I | Know Your Forest — https://knowyourforest.org/education/maps-and-management-plans/whats-in-a-plan | public | High |
| Built LandMapper's georeferenced PDF output, GIS downloads, state-specific legends, conservation maps, and security-tested shapefile export | C | Commits: a244742, 3a0109e, c40db48 in Ecotrust/landmapper | public | High |
| Merged: WCOA container overlay; MidA production container work | C | https://github.com/Ecotrust/wcoa/pull/37 · https://github.com/Ecotrust/mida-portal/pull/72 | public | High |
| In progress: shared base-platform migration and the larger MidA overlay | C | https://github.com/Ecotrust/madrona-portal/pull/62 · https://github.com/Ecotrust/mida-portal/pull/71 | public | High — **must be labelled in progress** |
| Replaced legacy XML-RPC paths with REST endpoints | C | https://github.com/Ecotrust/mp-map-groups/pull/33 · https://github.com/Ecotrust/mp-drawing/pull/14 | public | High |
| The Oregon Harvest for Schools directory has been online since 2019 and lists 120+ producers ready to sell to schools | L | https://oregonharvestforschools.com/ | public | High |
| Multi-year engineering on the Indigenous Traditional Knowledge Database; project cited in a 2026 CHI paper | C, I | https://github.com/Ecotrust/TEKDB · https://dl.acm.org/doi/10.1145/3772318.3791011 | public | High on code |
| BikeNC presents nine North Carolina bicycle routes covering roughly 3,000 miles | C | https://github.com/pollardld/bikenc | public | Medium |
| Four seasons in the University of North Florida men's soccer program; Atlantic Sun All-Academic honor; three goals in 2006; the only goal in a 1–0 win over High Point; played in UNF's first Division I postseason in 2009 | I | https://unfospreys.com/sports/mens-soccer/roster/david-pollard/6052 · https://unfospreys.com/news/2006/8/26/MSOC_082606aac_476 · https://unfospreys.com/news/2009/11/7/MSOC_1107093139 | public | High |
| A query-based lower bound of 653 authored contributions across five flagship repositories, 2017–2026 | C | Dossier §"Selected proof of engineering contribution" — must be stated as a lower bound, never as a total | public | High as a *lower bound* |

## Held back — do not publish until the row is completed

| Claim | What is missing | Blocks |
|---|---|---|
| 600,000 transportation-tool users (Alta) | Analytics export, project report, or client reference | Home "earlier work", `resume_data.json` |
| 40% participation increase · 30% deployment reduction · 20% downtime reduction | Baseline definition, date range, David's role, measurement source | Anywhere |
| LandMapper's 5,443 tax lots and 2M+ acres | Analytics export from the running application | LandMapper case study |
| Oregon's statewide $20M local-economic figure | Causal evidence tying it to the directory — likely unobtainable; recommend permanent removal | Oregon Harvest case study |
| $3M+ generated by campaigns · $5,000+ annual messaging savings · doubled renewals | Source and role definition | Résumé PDF |
| Bisk front-end framework: university adoption | Source code, docs, screenshots, dates, a colleague reference | "Earlier work" chapter |
| ITKDB community impact, partner names, deployment count | Tribal partner permission and governance context | ITKDB card — **never publish without explicit permission** |
| Tonbridge Angels and Clay County / United Soccer Alliance playing and coaching record | Rosters, match reports, contract, photographs | About section soccer line |
| AI policy / strategy leadership | The policy artifact plus measurable adoption | Any "AI leadership" framing |

## Metadata corrections owed

| Item | Problem | Fix |
|---|---|---|
| `resume_data.json` — Bisk Education | Reads `Jan 2012 - Mar 2024`, which overlaps Alta and Ecotrust and is almost certainly a typo | ⚠ HUMAN INPUT: confirm true end date (likely Mar 2014) |
| Alta Planning + Design end date | Dossier reports at least one conflicting end date in search indexing vs. the site's `Aug 2018` | ⚠ HUMAN INPUT: reconcile site, résumé, and LinkedIn |
| `static/pdf/Profile.pdf` | Still carries claims banned above | ⚠ HUMAN INPUT: regenerate the PDF after the site copy lands |
| Phone number | Appears in data-broker results | ⚠ HUMAN INPUT: keep off the site; file broker removal requests |
| Footer | Reads `© 2025` | Fixed in Task 03 |
